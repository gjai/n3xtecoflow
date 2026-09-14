import { formatEuroMillionsLongDate } from "@/lib/euromillions/datetime";
import { isEuroMillionsDrawPublished } from "@/lib/euromillions/store";
import type { EuroMillionsDraw } from "@/lib/euromillions/types";

const ORIGIN = "https://euromillions-resultats.fr";

export type EmbedPayload = {
  date: string | null;
  dateLabel: string | null;
  numbers: number[];
  stars: number[];
  myMillionCode: string | null;
  jackpotEur: number | null;
  hasWinner: boolean | null;
  statsUrl: string;
  drawUrl: string;
  homeUrl: string;
  attribution: string;
  html: string;
  snippet: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function embedWidgetHtml(args: {
  dateLabel: string;
  numbers: number[];
  stars: number[];
  myMillionCode?: string | null;
  homeUrl: string;
  drawUrl: string;
}): string {
  const balls = args.numbers
    .map(
      (n) =>
        `<span style="display:inline-flex;width:2rem;height:2rem;align-items:center;justify-content:center;border-radius:999px;background:#0b1220;color:#fff;font:600 13px/1 system-ui,sans-serif">${n}</span>`,
    )
    .join("");
  const stars = args.stars
    .map(
      (n) =>
        `<span style="display:inline-flex;width:2rem;height:2rem;align-items:center;justify-content:center;border-radius:999px;background:#f5c542;color:#0b1220;font:600 13px/1 system-ui,sans-serif">${n}</span>`,
    )
    .join("");
  const mm = args.myMillionCode
    ? `<p style="margin:8px 0 0;font:500 12px/1.4 system-ui,sans-serif;color:#64748b">My Million ${escapeHtml(args.myMillionCode)}</p>`
    : "";
  return `<div style="font-family:system-ui,sans-serif;max-width:22rem;padding:12px 14px;border:1px solid #dbe3ef;background:#fff;color:#142033">
<p style="margin:0 0 8px;font:600 11px/1.3 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#64748b">EuroMillions</p>
<p style="margin:0 0 10px;font:600 15px/1.3 system-ui,sans-serif">${escapeHtml(args.dateLabel)}</p>
<div style="display:flex;flex-wrap:wrap;gap:6px">${balls}${stars}</div>
${mm}
<p style="margin:10px 0 0;font:400 12px/1.4 system-ui,sans-serif"><a href="${escapeHtml(args.drawUrl)}" style="color:#0b1220;font-weight:600">Fiche du tirage</a> · Source : <a href="${escapeHtml(args.homeUrl)}" style="color:#0b1220;font-weight:600">euromillions-resultats.fr</a></p>
</div>`;
}

export function embedSnippet(scriptOrigin = ORIGIN): string {
  return `<div class="em-resultats-embed"></div>
<script async src="${scriptOrigin}/embed.js" data-host="${scriptOrigin}"></script>`;
}

export function buildEmbedPayload(
  draws: EuroMillionsDraw[],
  origin = ORIGIN,
): EmbedPayload {
  const latest =
    [...draws]
      .filter(isEuroMillionsDrawPublished)
      .sort((a, b) => b.date.localeCompare(a.date))[0] || null;
  const homeUrl = `${origin}/fr`;
  const statsUrl = `${origin}/fr/stats`;
  const drawUrl = latest
    ? `${origin}/fr/tirages/${latest.date}`
    : `${origin}/fr/tirages`;
  const dateLabel = latest
    ? formatEuroMillionsLongDate(latest.date, "fr")
    : "Tirage à paraître";
  const html = embedWidgetHtml({
    dateLabel,
    numbers: latest?.numbers || [],
    stars: latest?.stars || [],
    myMillionCode: latest?.myMillionCode,
    homeUrl,
    drawUrl,
  });
  return {
    date: latest?.date || null,
    dateLabel: latest ? dateLabel : null,
    numbers: latest?.numbers || [],
    stars: latest?.stars || [],
    myMillionCode: latest?.myMillionCode || null,
    jackpotEur: latest?.jackpotEur ?? null,
    hasWinner: latest?.hasWinner ?? null,
    statsUrl,
    drawUrl,
    homeUrl,
    attribution: "EuroMillions Résultats — euromillions-resultats.fr",
    html,
    snippet: embedSnippet(origin),
  };
}
