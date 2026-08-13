import { products } from "@/data/products";
import { sites } from "@/sites";
import { readAmazonPriceStore } from "@/lib/amazon/price-store";
import { evaluateCronHealth } from "@/lib/cron/status";
import { readNewsStore } from "@/lib/news/store";

export function parisDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function shiftParisDateKey(key: string, deltaDays: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d + deltaDays, 12, 0, 0);
  return parisDateKey(new Date(utc));
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

function listedDomains(): string[] {
  const set = new Set<string>();
  for (const site of sites) {
    for (const host of site.hosts) {
      if (!host || host === "localhost") continue;
      set.add(host.replace(/^www\./i, "").toLowerCase());
    }
  }
  return [...set].sort();
}

/** Digest ops quotidien (crons, actus, prix) — trafic = Umami. */
export async function buildDailyDigest(options?: { dayKey?: string }) {
  const today = parisDateKey();
  const dayKey = options?.dayKey || shiftParisDateKey(today, -1);
  const news = await readNewsStore();
  const prices = await readAmazonPriceStore();
  const domains = listedDomains();

  const priced = Object.values(prices.offers).filter(
    (o) => o.price.display,
  ).length;

  const newsLast24h = news.articles.filter((a) => {
    const t = Date.parse(a.ingestedAt || a.publishedAt);
    return Number.isFinite(t) && Date.now() - t < 48 * 3600_000;
  }).length;

  const cronHealth = await evaluateCronHealth();
  const subjectBase = `[n3xtecoflow] Ops du ${dayKey} — crons + contenu`;
  const subject = cronHealth.ok
    ? subjectBase
    : `[ALERTE CRON] ${subjectBase}`;

  const lines: string[] = [
    `Rapport ops n3xtecoflow`,
    `Période : ${formatDayFr(dayKey)} (Europe/Paris)`,
    `Généré le : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
    "",
    `=== Trafic ===`,
    `Voir le dashboard Umami (self-host Coolify) — plus de compteur maison.`,
    "",
    `=== Santé des crons ===`,
    cronHealth.ok ? `Statut : OK` : `Statut : ALERTE`,
  ];

  for (const row of cronHealth.rows) {
    const age = row.hours == null ? "jamais" : `${row.hours.toFixed(1)} h`;
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
  lines.push(`Domaines déclarés : ${domains.join(", ") || "—"}`);
  lines.push("");

  return {
    dayKey,
    subject,
    text: lines.join("\n"),
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
      name: "n3xtecoflow ops",
      email: to,
      _subject: digest.subject,
      message: digest.text,
      _template: "box",
      _captcha: "false",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      ok: false,
      error: `formsubmit_${res.status}:${body.slice(0, 200)}`,
    };
  }
  return { ok: true };
}
