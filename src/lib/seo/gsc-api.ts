import { createSign } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SITES_URL = "https://searchconsole.googleapis.com/webmasters/v3/sites";
const INSPECT_URL =
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const SCOPE = "https://www.googleapis.com/auth/webmasters";

const DEFAULT_HOST = "euromillions-resultats.fr";
const PROPERTY_CANDIDATES = [
  `sc-domain:${DEFAULT_HOST}`,
  `https://${DEFAULT_HOST}/`,
  `https://www.${DEFAULT_HOST}/`,
];

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

type TokenCache = { accessToken: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

export type GscAnalyticsRow = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscInspectResult = {
  url: string;
  siteUrl: string;
  verdict?: string;
  coverageState?: string;
  indexingState?: string;
  lastCrawlTime?: string;
  pageFetchState?: string;
  robotsTxtState?: string;
  googleCanonical?: string;
  userCanonical?: string;
  rawError?: string;
};

function b64urlJson(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function loadServiceAccount(): ServiceAccount {
  const b64 = process.env.GSC_SERVICE_ACCOUNT_B64?.trim();
  if (b64) {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as ServiceAccount;
  }
  const inline = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    const raw = inline.replace(/^['"]|['"]$/g, "");
    return JSON.parse(raw) as ServiceAccount;
  }
  const candidates = [
    process.env.GSC_SERVICE_ACCOUNT_PATH?.trim(),
    join(process.cwd(), "secrets", "gsc-sa.json"),
    "/app/data/gsc-sa.json",
  ].filter(Boolean) as string[];
  for (const path of candidates) {
    try {
      const file = readFileSync(/* turbopackIgnore: true */ path, "utf8");
      return JSON.parse(file) as ServiceAccount;
    } catch {
      /* try next */
    }
  }
  throw new Error("gsc_no_credentials");
}

export function gscEnabled(): boolean {
  if (process.env.GSC_API_DISABLED === "1") return false;
  if (process.env.GSC_SERVICE_ACCOUNT_B64?.trim()) return true;
  if (process.env.GSC_SERVICE_ACCOUNT_JSON?.trim()) return true;
  try {
    loadServiceAccount();
    return true;
  } catch {
    return false;
  }
}

async function accessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.expiresAt > now + 60) {
    return tokenCache.accessToken;
  }
  const sa = loadServiceAccount();
  const header = b64urlJson({ alg: "RS256", typ: "JWT" });
  const claim = b64urlJson({
    iss: sa.client_email,
    scope: SCOPE,
    aud: sa.token_uri || TOKEN_URL,
    iat: now,
    exp: now + 3600,
  });
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const jwt = `${unsigned}.${signer.sign(sa.private_key, "base64url")}`;
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });
  const res = await fetch(sa.token_uri || TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new Error(
      `gsc_token ${res.status} ${json.error || ""} ${json.error_description || ""}`.trim(),
    );
  }
  tokenCache = {
    accessToken: json.access_token,
    expiresAt: now + (json.expires_in || 3600),
  };
  return json.access_token;
}

async function gscFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = await accessToken();
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });
}

export async function listGscSites(): Promise<string[]> {
  const res = await gscFetch(SITES_URL);
  const json = (await res.json()) as {
    siteEntry?: { siteUrl?: string }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(`gsc_sites ${res.status} ${json.error?.message || ""}`.trim());
  }
  return (json.siteEntry || []).map((s) => s.siteUrl || "").filter(Boolean);
}

export function pickGscProperty(sites: string[]): string {
  const fromEnv = process.env.GSC_SITE_URL?.trim();
  if (fromEnv) return fromEnv;
  for (const candidate of PROPERTY_CANDIDATES) {
    if (sites.includes(candidate)) return candidate;
  }
  const hostHit = sites.find((s) => s.includes(DEFAULT_HOST));
  if (hostHit) return hostHit;
  throw new Error(
    `gsc_no_property. Sites visibles : ${sites.join(", ") || "(aucun — invite le compte dans GSC)"}`,
  );
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function queryGscSearchAnalytics(options?: {
  siteUrl?: string;
  startDate?: string;
  endDate?: string;
  queryContains?: string;
  rowLimit?: number;
  dimensions?: string[];
}): Promise<{ siteUrl: string; startDate: string; endDate: string; rows: GscAnalyticsRow[] }> {
  const siteUrl = options?.siteUrl || pickGscProperty(await listGscSites());
  const end = options?.endDate || isoDate(new Date(Date.now() - 3 * 86400000));
  const start =
    options?.startDate || isoDate(new Date(Date.now() - 90 * 86400000));
  const dimensions = options?.dimensions ?? ["query", "page"];
  const encoded = encodeURIComponent(siteUrl);
  const res = await gscFetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encoded}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({
        startDate: start,
        endDate: end,
        ...(dimensions.length ? { dimensions } : {}),
        rowLimit: options?.rowLimit ?? 100,
        dimensionFilterGroups: options?.queryContains
          ? [
              {
                filters: [
                  {
                    dimension: "query",
                    operator: "contains",
                    expression: options.queryContains,
                  },
                ],
              },
            ]
          : undefined,
      }),
    },
  );
  const json = (await res.json()) as {
    rows?: {
      keys?: string[];
      clicks?: number;
      impressions?: number;
      ctr?: number;
      position?: number;
    }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(
      `gsc_query ${res.status} ${json.error?.message || ""}`.trim(),
    );
  }
  const qIdx = dimensions.indexOf("query");
  const pIdx = dimensions.indexOf("page");
  const rows = (json.rows || []).map((row) => ({
    query: qIdx >= 0 ? row.keys?.[qIdx] || "" : "",
    page: pIdx >= 0 ? row.keys?.[pIdx] || "" : "",
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
  return { siteUrl, startDate: start, endDate: end, rows };
}

const LEFTOVER_LOCALE = /\/(en|de|es|it|pt|nl)(\/|$)/i;

export type GscDigestSnapshot = {
  enabled: boolean;
  error?: string;
  siteUrl?: string;
  startDate?: string;
  endDate?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: {
    query: string;
    clicks: number;
    impressions: number;
    position: number;
  }[];
  headImpressions: number;
  headClicks: number;
  headPosition: number;
  leftoverImpressions: number;
  leftoverClicks: number;
};

export async function fetchGscDigestSnapshot(): Promise<GscDigestSnapshot> {
  const empty: GscDigestSnapshot = {
    enabled: false,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
    topQueries: [],
    headImpressions: 0,
    headClicks: 0,
    headPosition: 0,
    leftoverImpressions: 0,
    leftoverClicks: 0,
  };
  if (!gscEnabled()) return empty;
  try {
    const sites = await listGscSites();
    const siteUrl = pickGscProperty(sites);
    const endDate = isoDate(new Date(Date.now() - 3 * 86400000));
    const startDate = isoDate(new Date(Date.now() - 31 * 86400000));
    const range = { siteUrl, startDate, endDate };
    const [totals, queries, pages, head] = await Promise.all([
      queryGscSearchAnalytics({ ...range, dimensions: [], rowLimit: 1 }),
      queryGscSearchAnalytics({
        ...range,
        dimensions: ["query"],
        rowLimit: 8,
      }),
      queryGscSearchAnalytics({
        ...range,
        dimensions: ["page"],
        rowLimit: 250,
      }),
      queryGscSearchAnalytics({
        ...range,
        queryContains: "euromillions",
        dimensions: ["query", "page"],
        rowLimit: 250,
      }),
    ]);
    const total = totals.rows[0];
    const headRows = head.rows.filter((r) => isResultsHeadTerm(r.query));
    const headImp = headRows.reduce((n, r) => n + r.impressions, 0);
    const headClk = headRows.reduce((n, r) => n + r.clicks, 0);
    const leftover = pages.rows.filter((r) => LEFTOVER_LOCALE.test(r.page));
    return {
      enabled: true,
      siteUrl,
      startDate,
      endDate,
      clicks: total?.clicks || 0,
      impressions: total?.impressions || 0,
      ctr: total?.ctr || 0,
      position: total?.position || 0,
      topQueries: queries.rows.slice(0, 8).map((r) => ({
        query: r.query,
        clicks: r.clicks,
        impressions: r.impressions,
        position: r.position,
      })),
      headImpressions: headImp,
      headClicks: headClk,
      headPosition: weightedPosition(headRows),
      leftoverImpressions: leftover.reduce((n, r) => n + r.impressions, 0),
      leftoverClicks: leftover.reduce((n, r) => n + r.clicks, 0),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "gsc_digest_fail";
    console.error("gsc_digest_fail", msg);
    return { ...empty, enabled: true, error: msg.slice(0, 180) };
  }
}

function weightedPosition(rows: GscAnalyticsRow[]): number {
  let imp = 0;
  let acc = 0;
  for (const r of rows) {
    imp += r.impressions;
    acc += r.position * r.impressions;
  }
  return imp ? acc / imp : 0;
}

export function formatGscDigestLines(snap: GscDigestSnapshot): string[] {
  const lines = ["=== Google Search Console ==="];
  if (!snap.enabled) {
    lines.push("Compte de service absent — inspection / perfs GSC désactivées.");
    return lines;
  }
  if (snap.error) {
    lines.push(`Erreur : ${snap.error}`);
    return lines;
  }
  lines.push(`Propriété : ${snap.siteUrl || "—"}`);
  lines.push(
    `Période : ${snap.startDate || "—"} → ${snap.endDate || "—"} (délai GSC ~3 j)`,
  );
  lines.push(
    `Clics ${snap.clicks} · impressions ${snap.impressions} · CTR ${(snap.ctr * 100).toFixed(1)} % · pos. moy. ${snap.position.toFixed(1)}`,
  );
  lines.push(
    `Requêtes « résultat(s) euromillions » : ${snap.headImpressions} imp · ${snap.headClicks} clic · pos ${snap.headPosition ? snap.headPosition.toFixed(1) : "—"}`,
  );
  if (snap.leftoverImpressions || snap.leftoverClicks) {
    lines.push(
      `Anciennes URLs /en /es… : ${snap.leftoverImpressions} imp · ${snap.leftoverClicks} clic (308 vers /fr)`,
    );
  }
  if (snap.topQueries.length) {
    lines.push("Top requêtes :");
    for (const q of snap.topQueries) {
      lines.push(
        `  ${q.impressions} imp · ${q.clicks} clic · pos ${q.position.toFixed(1)} · ${q.query}`,
      );
    }
  }
  return lines;
}

export function isResultsHeadTerm(query: string): boolean {
  const q = query.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  return q.includes("euromillions") && q.includes("resultat");
}

export function isNewsLanding(page: string): boolean {
  return /\/actualites(\/|$)/i.test(page);
}

export async function inspectGscUrl(
  inspectionUrl: string,
  siteUrl?: string,
): Promise<GscInspectResult> {
  const property = siteUrl || pickGscProperty(await listGscSites());
  const res = await gscFetch(INSPECT_URL, {
    method: "POST",
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: property,
      languageCode: "fr",
    }),
  });
  const json = (await res.json()) as {
    inspectionResult?: {
      indexStatusResult?: {
        verdict?: string;
        coverageState?: string;
        indexingState?: string;
        lastCrawlTime?: string;
        pageFetchState?: string;
        robotsTxtState?: string;
        googleCanonical?: string;
        userCanonical?: string;
      };
    };
    error?: { message?: string };
  };
  if (!res.ok) {
    return {
      url: inspectionUrl,
      siteUrl: property,
      rawError: `gsc_inspect ${res.status} ${json.error?.message || ""}`.trim(),
    };
  }
  const idx = json.inspectionResult?.indexStatusResult;
  return {
    url: inspectionUrl,
    siteUrl: property,
    verdict: idx?.verdict,
    coverageState: idx?.coverageState,
    indexingState: idx?.indexingState,
    lastCrawlTime: idx?.lastCrawlTime,
    pageFetchState: idx?.pageFetchState,
    robotsTxtState: idx?.robotsTxtState,
    googleCanonical: idx?.googleCanonical,
    userCanonical: idx?.userCanonical,
  };
}

const GSC_ORIGIN = "https://euromillions-resultats.fr";

/**
 * Inspection après publication (diagnostic).
 * Ce n’est pas « Demander une indexation » : Google n’expose ce bouton
 * que dans l’UI, et l’Indexing API est réservée JobPosting / livestream.
 */
export async function inspectEuroMillionsPublish(dates: {
  latest?: string | null;
  nextDrawDate?: string | null;
}): Promise<void> {
  if (!gscEnabled()) return;
  try {
    const property = pickGscProperty(await listGscSites());
    const urls = [`${GSC_ORIGIN}/fr`];
    if (dates.latest) urls.push(`${GSC_ORIGIN}/fr/tirages/${dates.latest}`);
    if (
      dates.nextDrawDate &&
      dates.nextDrawDate !== dates.latest
    ) {
      urls.push(`${GSC_ORIGIN}/fr/tirages/${dates.nextDrawDate}`);
    }
    const results = await Promise.all(
      urls.map((url) => inspectGscUrl(url, property)),
    );
    for (const r of results) {
      console.log(
        "gsc_inspect",
        r.url,
        r.coverageState || r.rawError || r.verdict || "?",
        r.lastCrawlTime || "",
      );
    }
  } catch (err) {
    console.error("gsc_inspect_fail", err);
  }
}
