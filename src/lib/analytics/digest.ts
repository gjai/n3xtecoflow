import { products } from "@/data/products";
import { sites } from "@/sites";
import { readAmazonPriceStore } from "@/lib/amazon/price-store";
import { evaluateCronHealth } from "@/lib/cron/status";
import { readNewsStore } from "@/lib/news/store";
import {
  parisDateKey,
  readAnalyticsStore,
  shiftParisDateKey,
  topPaths,
} from "./store";
import type { DayStats } from "./types";

function sumDay(day: DayStats | undefined) {
  let views = 0;
  let contacts = 0;
  if (!day) return { views, contacts };
  for (const host of Object.values(day.hosts)) {
    views += host.views;
    contacts += host.contacts;
  }
  return { views, contacts };
}

function formatDayFr(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

function isPublicHost(host: string) {
  if (!host) return false;
  if (host === "localhost" || host === "127.0.0.1") return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
  return true;
}

function apexOf(host: string) {
  return host.replace(/^www\./i, "").toLowerCase();
}

type DomainRow = {
  apex: string;
  themeId: string;
  themeName: string;
  hosts: string[];
  views: number;
  contacts: number;
  top: { path: string; views: number }[];
};

/**
 * One row per apex domain, pulled from every SiteConfig.hosts
 * (future domains appear automatically once declared).
 * www.* is rolled into the apex. Unknown traffic hosts are appended.
 */
export function buildDomainRows(day: DayStats | undefined): DomainRow[] {
  const byApex = new Map<
    string,
    {
      apex: string;
      themeId: string;
      themeName: string;
      hostSet: Set<string>;
    }
  >();

  for (const site of sites) {
    for (const host of site.hosts) {
      if (!isPublicHost(host)) continue;
      const apex = apexOf(host);
      const row = byApex.get(apex);
      if (row) {
        row.hostSet.add(host);
      } else {
        byApex.set(apex, {
          apex,
          themeId: site.id,
          themeName: site.brand.name,
          hostSet: new Set([host]),
        });
      }
    }
  }

  // Traffic on hosts not yet in config (misconfig / preview) — still report
  for (const host of Object.keys(day?.hosts || {})) {
    if (!isPublicHost(host)) continue;
    const apex = apexOf(host);
    if (byApex.has(apex)) {
      byApex.get(apex)!.hostSet.add(host);
      continue;
    }
    byApex.set(apex, {
      apex,
      themeId: "?",
      themeName: "Non déclaré",
      hostSet: new Set([host]),
    });
  }

  const rows: DomainRow[] = [];
  for (const meta of byApex.values()) {
    let views = 0;
    let contacts = 0;
    const paths: Record<string, number> = {};
    for (const host of meta.hostSet) {
      const stats = day?.hosts[host];
      if (!stats) continue;
      views += stats.views;
      contacts += stats.contacts;
      for (const [p, n] of Object.entries(stats.paths)) {
        paths[p] = (paths[p] || 0) + n;
      }
    }
    rows.push({
      apex: meta.apex,
      themeId: meta.themeId,
      themeName: meta.themeName,
      hosts: [...meta.hostSet].sort(),
      views,
      contacts,
      top: topPaths(paths, 8),
    });
  }

  return rows.sort((a, b) => b.views - a.views || a.apex.localeCompare(b.apex));
}

export async function buildDailyDigest(options?: { dayKey?: string }) {
  const today = parisDateKey();
  const dayKey = options?.dayKey || shiftParisDateKey(today, -1);
  const analytics = await readAnalyticsStore();
  const day = analytics.days[dayKey];
  const news = await readNewsStore();
  const prices = await readAmazonPriceStore();

  const priced = Object.values(prices.offers).filter(
    (o) => o.price.display,
  ).length;

  const domainRows = buildDomainRows(day);
  const totals = sumDay(day);
  const newsLast24h = news.articles.filter((a) => {
    const t = Date.parse(a.ingestedAt || a.publishedAt);
    return Number.isFinite(t) && Date.now() - t < 48 * 3600_000;
  }).length;

  const subjectBase = `[n3xtecoflow] Stats du ${dayKey} — ${totals.views} vues · ${domainRows.length} domaines`;
  const cronHealth = await evaluateCronHealth();
  const subject = cronHealth.ok
    ? subjectBase
    : `[ALERTE CRON] ${subjectBase}`;

  const lines: string[] = [
    `Rapport journalier n3xtecoflow`,
    `Période : ${formatDayFr(dayKey)} (Europe/Paris)`,
    `Généré le : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
    "",
    `=== Trafic global ===`,
    `Vues totales : ${totals.views}`,
    `Contacts formulaires : ${totals.contacts}`,
    `Domaines suivis : ${domainRows.length}`,
    "",
    `=== Trafic par domaine ===`,
  ];

  for (const row of domainRows) {
    lines.push(`--- ${row.apex} ---`);
    lines.push(`Thème : ${row.themeName} (${row.themeId})`);
    lines.push(`Hosts : ${row.hosts.join(", ")}`);
    lines.push(`Vues : ${row.views}`);
    lines.push(`Contacts : ${row.contacts}`);
    if (row.top.length) {
      lines.push(`Top pages :`);
      for (const p of row.top) {
        lines.push(`  ${p.views} · ${p.path}`);
      }
    } else {
      lines.push(`Top pages : (aucune donnée)`);
    }
    lines.push("");
  }

  lines.push(`=== Santé des crons ===`);
  lines.push(cronHealth.ok ? `Statut : OK` : `Statut : ALERTE`);
  for (const row of cronHealth.rows) {
    const age =
      row.hours == null ? "jamais" : `${row.hours.toFixed(1)} h`;
    lines.push(
      `${row.ok ? "OK" : "KO"} · ${row.label} · âge=${age} · dernier OK=${row.lastOkAt || "—"}` +
        (row.note ? ` · ${row.note}` : ""),
    );
  }
  if (cronHealth.alerts.length) {
    lines.push(`Alertes :`);
    for (const a of cronHealth.alerts) lines.push(`  - ${a}`);
  }
  lines.push("");

  lines.push(`=== Contenu & ops ===`);
  lines.push(
    `Articles actu : ${news.articles.length} (maj. ${news.updatedAt || "—"})`,
  );
  lines.push(`Articles ingérés ~48h : ${newsLast24h}`);
  lines.push(
    `Prix Amazon en cache : ${priced}/${products.length} (maj. ${prices.updatedAt || "—"})`,
  );
  lines.push(
    `Domaines déclarés : ${domainRows.map((d) => d.apex).join(", ") || "—"}`,
  );
  lines.push("");
  lines.push(
    `Note : 1 ligne par domaine (www fusionné). Nouveaux hosts dans SiteConfig.hosts → inclus auto. Tracking anonymisé, bots filtrés.`,
  );

  const text = lines.join("\n");

  return {
    dayKey,
    subject,
    text,
    totals,
    domainRows,
    newsCount: news.articles.length,
    pricedCount: priced,
    productCount: products.length,
    cronHealth,
  };
}

export async function sendDigestEmail(digest: {
  subject: string;
  text: string;
}): Promise<{ ok: boolean; error?: string }> {
  const to =
    process.env.STATS_TO_EMAIL?.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    "djgjai@gmail.com";

  const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: "n3xtecoflow stats",
      email: to,
      _subject: digest.subject,
      message: digest.text,
      _template: "box",
      _captcha: "false",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `formsubmit_${res.status}:${body.slice(0, 200)}` };
  }
  return { ok: true };
}
