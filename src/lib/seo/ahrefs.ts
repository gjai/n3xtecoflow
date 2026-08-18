import { sites } from "@/sites";

/**
 * Ahrefs APIv3 public (Domain Rating).
 * La clé est un secret : Coolify `AHREFS_API_KEY`, jamais en dur.
 * Site Explorer (trafic, backlinks) exige un abonnement + une clé avec ces droits.
 * Attribution obligatoire : « Domain Rating by Ahrefs » https://ahrefs.com/
 */
const PUBLIC_DR = "https://api.ahrefs.com/v3/public/domain-rating-free";

export type AhrefsDomainRow = {
  host: string;
  domainRating: number | null;
  error?: string;
};

function apiKey(): string | undefined {
  const key = process.env.AHREFS_API_KEY?.trim();
  return key || undefined;
}

export function ahrefsEnabled(): boolean {
  return Boolean(apiKey()) && process.env.AHREFS_DISABLED !== "1";
}

async function fetchDomainRating(target: string): Promise<AhrefsDomainRow> {
  const key = apiKey();
  if (!key) return { host: target, domainRating: null, error: "no_key" };
  try {
    const url = `${PUBLIC_DR}?target=${encodeURIComponent(target)}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    });
    const body = (await res.json().catch(() => null)) as {
      domain_rating?: { domain_rating?: number };
      error?: string;
    } | null;
    if (!res.ok) {
      return {
        host: target,
        domainRating: null,
        error: `http_${res.status}${body?.error ? `:${body.error}` : ""}`,
      };
    }
    const rating = body?.domain_rating?.domain_rating;
    return {
      host: target,
      domainRating: typeof rating === "number" ? rating : null,
    };
  } catch (err) {
    console.error("ahrefs_error", target, err);
    return {
      host: target,
      domainRating: null,
      error: err instanceof Error ? err.message : "fetch_failed",
    };
  }
}

export async function fetchNetworkDomainRatings(): Promise<AhrefsDomainRow[]> {
  if (!ahrefsEnabled()) return [];
  const hosts = [...new Set(sites.map((s) => s.primaryHost))];
  return Promise.all(hosts.map((host) => fetchDomainRating(host)));
}

export function formatDomainRating(value: number | null): string {
  if (value == null) return "—";
  return value.toFixed(1);
}
