import path from "path";
import { existsSync } from "fs";
import { formatEuroMillionsLongDate, isoWeekKeyFromParisDate } from "./datetime";
import {
  SHARE_FEED,
  formatShareJackpot,
  type ShareCardInput,
  shareLayout,
} from "./share-card";
import {
  CTA_START,
  LOOP_FADE_START,
  TITLE_END,
  ballStart,
  clamp01,
  dropReveal,
  fadeSlide,
  holdFade,
  announceCallout,
  starStart,
  windowT,
} from "./share-motion";
import type { EuroMillionsDraw } from "./types";

const FONT_FAMILY = "Inter";

function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 5-point star, tip up. innerR ~0.45–0.5 keeps digits readable. */
function starPoints(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  spikes = 5,
): string {
  const pts: string[] = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = -Math.PI / 2 + i * step;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(" ");
}

function clip(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export function wrapLines(
  text: string,
  maxChars: number,
  maxLines: number,
): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  let overflow = false;
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length >= maxLines) {
        overflow = true;
        cur = "";
        break;
      }
    } else {
      cur = next;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  else if (cur) overflow = true;
  if (overflow && lines.length) {
    const last = lines[lines.length - 1]!;
    lines[lines.length - 1] = last.endsWith("…")
      ? last
      : `${clip(last, Math.max(4, maxChars - 1))}`;
  }
  return lines.length ? lines : [clip(text, maxChars)];
}

const NEWS_FLUFF =
  /site indépendant|ne vend(ons|ez)? pas|jeu responsable|18\s*\+|simulateur|jeter le reçu|FDJ\.fr si vous|affiliation|tracking|consultez la source|rédigé à partir|synthèse indépendante|revue de presse|selon .{0,80}(l[’']actualité porte sur|the story focuses)|aucune promesse de gain|le jeu reste du hasard|jouez responsable|nous ne vendons|budget fixe|aucun système ne bat|play responsibly|no system beats|vérifiez le texte d[’']origine|jouez sur fdj|rapports? de gains|sont publiés sur la fiche|vérifiez votre grille|en même temps que l[’']euromillions|indépendamment des 5\+2|cagnotte continue de monter|jackpot est reporté/i;

function splitNewsSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

function isNewsFluff(s: string): boolean {
  return NEWS_FLUFF.test(s);
}

function newsFactScore(s: string): number {
  if (isNewsFluff(s)) return -10;
  let n = 0;
  if (/\d/.test(s)) n += 2;
  if (/€|M€|\beuros?\b/i.test(s)) n += 3;
  if (
    /jackpot|gagnant|rang\b|étoiles?|numéros?|million|cagnotte|tirage|My Million|boules?/i.test(
      s,
    )
  ) {
    n += 3;
  }
  if (s.length > 40 && s.length < 280) n += 1;
  return n;
}

function newsFactCovered(hay: string, fact: string): boolean {
  const h = hay.toLowerCase();
  const f = fact.toLowerCase();
  const code = fact.match(/[A-Z]{2}\s+\d{3}\s+\d{4}/);
  if (code && h.includes(code[0].toLowerCase())) return true;
  if (/étoiles/.test(f)) {
    const nums = fact.match(/\b\d{1,2}\b/g) || [];
    if (
      nums.length >= 5 &&
      nums.slice(0, 5).every((n) => h.includes(n)) &&
      /étoile/.test(h)
    ) {
      return true;
    }
  }
  if (/rang 5\+1/.test(f) && /5\+1/.test(h)) return true;
  if (/rang 5\b/.test(f) && /rang 5\b/.test(h)) return true;
  if (/my million/.test(f) && /my million/.test(h)) return true;
  if (/prochain tirage/.test(f) && /prochain tirage/.test(h)) return true;
  if (/non remporté/.test(f) && /non remporté|aucun rang 1/.test(h)) return true;
  const head = f.replace(/[^a-z0-9àâäéèêëïîôùûüçœæ€]+/gi, " ").trim().slice(0, 40);
  return head.length > 20 && h.includes(head);
}

function normalizePrizeRank(rank: string): string {
  return rank.replace(/\s+/g, "");
}

function formatNewsEur(n: number): string {
  const digits = Number.isInteger(n) ? 0 : 2;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(n)
    .replace(/[\u00a0\u202f]/g, " ");
}

function joueursFr(n: number): string {
  return n === 1 ? "1 joueur" : `${n} joueurs`;
}

function jackpotShort(n: number): string {
  return formatShareJackpot(n).replace(/^Jackpot\s+/, "");
}

/** Phrases factuelles d’un tirage (boules, rangs, jackpot, My Million). */
export function newsDrawFacts(
  draw: EuroMillionsDraw,
  next?: { date?: string | null; jackpotEur?: number | null },
): string[] {
  if (draw.numbers.length !== 5 || draw.stars.length !== 2) return [];
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const combo = `${draw.numbers.join(", ")} — étoiles ${draw.stars.join(" et ")}`;
  const out: string[] = [`Tirage du ${date} : ${combo}.`];

  const r1 = draw.prizeTiers?.find((t) => normalizePrizeRank(t.rank) === "5+2");
  const r2 = draw.prizeTiers?.find((t) => normalizePrizeRank(t.rank) === "5+1");
  const r5 = draw.prizeTiers?.find((t) => {
    const r = normalizePrizeRank(t.rank);
    return r === "5" || r === "5+0";
  });
  const r1Eu = r1?.winnersEurope ?? r1?.winners;
  const jackpot =
    typeof draw.jackpotEur === "number" && draw.jackpotEur > 0
      ? jackpotShort(draw.jackpotEur)
      : null;
  const notWon =
    typeof r1Eu === "number" ? r1Eu === 0 : draw.hasWinner === false;
  const won = typeof r1Eu === "number" ? r1Eu > 0 : draw.hasWinner === true;

  if (notWon && jackpot) {
    out.push(`Jackpot de ${jackpot} non remporté.`);
  } else if (won && r1 && typeof r1Eu === "number" && r1Eu > 0) {
    const amt = r1.amountEur > 0 ? ` (${formatNewsEur(r1.amountEur)} chacun)` : "";
    out.push(
      `${r1Eu} gagnant${r1Eu > 1 ? "s" : ""} au rang 1${amt}.`,
    );
  } else if (jackpot) {
    out.push(`Jackpot ${jackpot} mis en jeu.`);
  }

  if (next?.date && next.date > draw.date) {
    const nd = formatEuroMillionsLongDate(next.date, "fr");
    const jp =
      typeof next.jackpotEur === "number" && next.jackpotEur > 0
        ? ` — Jackpot ${jackpotShort(next.jackpotEur)}`
        : "";
    out.push(`Prochain tirage : ${nd}${jp}.`);
  }

  if (r2 && r2.amountEur > 0) {
    const fr = r2.winners;
    if (r2.winnersEurope != null && r2.winnersEurope > 0) {
      const frBit =
        fr === 0
          ? ", aucun en France"
          : `, dont ${joueursFr(fr)} en France`;
      out.push(
        `Rang 5+1 : ${joueursFr(r2.winnersEurope)} en Europe pour ${formatNewsEur(r2.amountEur)} chacun${frBit}.`,
      );
    } else if (fr > 0) {
      out.push(
        `Rang 5+1 : ${joueursFr(fr)} en France pour ${formatNewsEur(r2.amountEur)} chacun.`,
      );
    }
  }

  if (r5 && r5.amountEur > 0) {
    const fr = r5.winners;
    if (r5.winnersEurope != null && r5.winnersEurope > 0) {
      out.push(
        `Rang 5 : ${joueursFr(r5.winnersEurope)} en Europe (${joueursFr(fr)} en France) pour ${formatNewsEur(r5.amountEur)}.`,
      );
    } else if (fr > 0) {
      out.push(
        `Rang 5 : ${joueursFr(fr)} en France pour ${formatNewsEur(r5.amountEur)}.`,
      );
    }
  }

  if (draw.myMillionCode) {
    out.push(`Code My Million : ${draw.myMillionCode}.`);
  }

  return out;
}

/** Faits du dernier tirage publié dans la semaine ISO (ex. `2026-W37`). */
export function newsShareFacts(
  draws: Array<EuroMillionsDraw | null | undefined>,
  weekKey: string,
  next?: { date?: string | null; jackpotEur?: number | null },
): string[] {
  const seen = new Set<string>();
  const inWeek: EuroMillionsDraw[] = [];
  for (const d of draws) {
    if (!d || seen.has(d.date) || d.numbers.length !== 5 || d.stars.length !== 2) {
      continue;
    }
    seen.add(d.date);
    if (isoWeekKeyFromParisDate(d.date) === weekKey) inWeek.push(d);
  }
  inWeek.sort((a, b) => b.date.localeCompare(a.date));
  const draw = inWeek[0];
  if (!draw) return [];
  return newsDrawFacts(draw, next);
}

/**
 * Phrases factuelles seulement (chiffres, €, rangs). Le remplissage 18+ / simulateur saute.
 * `extraFacts` (tirage FDJ) passe devant le corps d’article.
 */
export function newsBodyForShare(
  body?: string[] | null,
  extraFacts?: string[] | null,
): string {
  const fromArticle = (body || [])
    .flatMap((p) => splitNewsSentences(p))
    .filter((s) => newsFactScore(s) >= 4);
  const extras = (extraFacts || [])
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const extraHay = extras.join(" ");
  const articleKept = fromArticle.filter((s) => !newsFactCovered(extraHay, s));
  return [...extras, ...articleKept].slice(0, 6).join(" ");
}

export function newsExcerptForShare(excerpt: string, factsBody: string): string {
  const e = excerpt.replace(/\s+/g, " ").trim();
  if (e.length > 30 && newsFactScore(e) >= 4) return e;
  return splitNewsSentences(factsBody)[0] || e;
}

function stripLeadingExcerpt(body: string, excerpt: string): string {
  const e = excerpt.replace(/\s+/g, " ").trim();
  const b = body.replace(/\s+/g, " ").trim();
  if (!e || !b.startsWith(e)) return b;
  return b.slice(e.length).trim();
}

/** Extrait + corps prêts pour le Short : faits tirage, sans doublon d’accroche. */
export function newsCopyForShare(args: {
  excerpt?: string | null;
  body?: string[] | null;
  extraFacts?: string[] | null;
}): { excerpt: string; body: string } {
  const full = newsBodyForShare(args.body, args.extraFacts);
  const excerpt = newsExcerptForShare(args.excerpt || "", full);
  return { excerpt, body: stripLeadingExcerpt(full, excerpt) };
}

/** Coupe le corps en deux blocs (phrases), pour l’enchaînement 9:16. */
export function newsBodyBeats(body?: string | null): [string, string] {
  const [a, b, c] = newsStoryBeats(body);
  if (!c) return [a, b];
  return [a, [b, c].filter(Boolean).join(" ")];
}

/** Trois scènes d’histoire (corps 1, corps 2, chute). */
export function newsStoryBeats(body?: string | null): [string, string, string] {
  const text = (body || "").replace(/\s+/g, " ").trim();
  if (!text) return ["", "", ""];
  const sentences = text.split(/(?<=[.!?…])\s+/).filter(Boolean);
  if (sentences.length <= 1) {
    const mid = Math.ceil(text.length / 3);
    const a = text.lastIndexOf(" ", mid);
    const b = text.lastIndexOf(" ", mid * 2);
    if (a < 24) return [text, "", ""];
    if (b <= a) return [text.slice(0, a).trim(), text.slice(a).trim(), ""];
    return [
      text.slice(0, a).trim(),
      text.slice(a, b).trim(),
      text.slice(b).trim(),
    ];
  }
  if (sentences.length === 2) return [sentences[0]!, sentences[1]!, ""];
  const n = sentences.length;
  const i = Math.max(1, Math.floor(n / 3));
  const j = Math.max(i + 1, Math.floor((2 * n) / 3));
  return [
    sentences.slice(0, i).join(" "),
    sentences.slice(i, j).join(" "),
    sentences.slice(j).join(" "),
  ];
}

const NEWS_WPS = 3.4;
const NEWS_INTRO_SEC = 0.4;
const NEWS_CTA_SEC = 3.1;
const NEWS_CROSS_SEC = 0.22;
const NEWS_MIN_SEC = 16;
const NEWS_MAX_SEC = 40;

function newsReadSec(text: string, min: number, max: number): number {
  const w = (text || "").trim().split(/\s+/).filter(Boolean).length;
  if (!w) return 0;
  return Math.min(max, Math.max(min, w / NEWS_WPS + 0.12));
}

export type NewsShareTimeline = {
  seconds: number;
  hookStart: number;
  bodyAStart: number;
  hookEnd: number;
  storyStart: number;
  bodyCStart: number;
  storyEnd: number;
  ctaStart: number;
};

/** Durée et fenêtres 0..1 calées sur le volume de texte. */
export function newsShareTimeline(
  excerpt: string,
  body?: string | null,
): NewsShareTimeline {
  const [a, b, c] = newsStoryBeats(body);
  const excerptSec = newsReadSec(excerpt, 1.7, 16);
  const aSec = newsReadSec(a, a ? 1.3 : 0, 16);
  const bSec = newsReadSec(b, b ? 1.5 : 0, 16);
  const cSec = newsReadSec(c, c ? 1.3 : 0, 18);
  const bodyADelay = a ? 0.38 : 0;
  const bodyCDelay = c ? Math.min(1.1, Math.max(0.4, bSec * 0.28)) : 0;
  let hookDur = excerptSec + aSec;
  let storyDur = (bSec + cSec) || 1.6;
  let seconds =
    NEWS_INTRO_SEC + hookDur + NEWS_CROSS_SEC + storyDur + NEWS_CTA_SEC;
  if (seconds > NEWS_MAX_SEC) {
    const scale =
      (NEWS_MAX_SEC - NEWS_INTRO_SEC - NEWS_CROSS_SEC - NEWS_CTA_SEC) /
      (hookDur + storyDur);
    hookDur *= scale;
    storyDur *= scale;
    seconds = NEWS_MAX_SEC;
  } else if (seconds < NEWS_MIN_SEC) {
    const pad = NEWS_MIN_SEC - seconds;
    storyDur += pad;
    seconds = NEWS_MIN_SEC;
  }
  const hookStart = NEWS_INTRO_SEC / seconds;
  const hookEnd = (NEWS_INTRO_SEC + hookDur) / seconds;
  const bodyAStart = (NEWS_INTRO_SEC + bodyADelay) / seconds;
  const storyStart = (NEWS_INTRO_SEC + hookDur - NEWS_CROSS_SEC * 0.4) / seconds;
  const storyEnd = (seconds - NEWS_CTA_SEC) / seconds;
  const bodyCStart =
    (NEWS_INTRO_SEC + hookDur + NEWS_CROSS_SEC * 0.5 + bodyCDelay) / seconds;
  return {
    seconds,
    hookStart,
    bodyAStart: Math.min(bodyAStart, hookEnd - 0.02),
    hookEnd,
    storyStart: Math.min(storyStart, storyEnd - 0.08),
    bodyCStart: Math.min(Math.max(bodyCStart, storyStart + 0.02), storyEnd - 0.04),
    storyEnd,
    ctaStart: storyEnd,
  };
}

function shareFontPath(): string | null {
  const candidates = [
    process.env.SHARE_FONT_PATH?.trim(),
    path.join(process.cwd(), "public/fonts/Inter-Bold.ttf"),
    "/app/public/fonts/Inter-Bold.ttf",
  ].filter((p): p is string => Boolean(p));
  for (const file of candidates) {
    if (existsSync(file)) return file;
  }
  return null;
}

function contrastInk(hex: string): string {
  const n = hex.replace("#", "");
  if (n.length < 6) return "#0b1220";
  const r = Number.parseInt(n.slice(0, 2), 16);
  const g = Number.parseInt(n.slice(2, 4), 16);
  const b = Number.parseInt(n.slice(4, 6), 16);
  const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return L > 0.62 ? "#0b1220" : "#ffffff";
}

type BallCell = { n: number | string; outlined?: boolean };

function wrapBallRows(
  rows: ShareCardInput["rows"],
  ball: number,
  gap: number,
  innerWidth: number,
): BallCell[][] {
  const out: BallCell[][] = [];
  for (const row of rows) {
    let line: BallCell[] = [];
    let x = 0;
    for (const n of row.values) {
      const w = ball + (line.length ? gap : 0);
      if (line.length && x + w > innerWidth) {
        out.push(line);
        line = [{ n, outlined: row.outlined }];
        x = ball;
      } else {
        line.push({ n, outlined: row.outlined });
        x += w;
      }
    }
    if (line.length) out.push(line);
  }
  return out;
}

export function lotteryShareSvg(
  card: ShareCardInput,
  size: { width: number; height: number },
  anim?: { t: number },
): string {
  const layout = shareLayout(size);
  const portrait = layout !== "feed";
  const widest = Math.max(0, ...card.rows.map((r) => r.values.length));
  const crowded = widest >= 12;
  const snug = widest >= 6 && widest < 12;
  const ball = crowded
    ? layout === "story"
      ? 88
      : layout === "ig"
        ? 78
        : 64
    : snug
      ? layout === "story"
        ? 122
        : layout === "ig"
          ? 108
          : 92
    : layout === "story"
      ? 148
      : layout === "ig"
        ? 128
        : 108;
  const pad = layout === "story" ? 72 : layout === "ig" ? 64 : 48;
  const gap = Math.round(ball * 0.16);
  const kickerSize = portrait ? 30 : 24;
  const dateSize = layout === "story" ? 52 : layout === "ig" ? 46 : 42;
  const digitSize = Math.round(ball * 0.46);
  const fillInk = contrastInk(card.accent);
  const safeTop = layout === "story" ? 280 : layout === "ig" ? 72 : pad;
  const safeBottom = layout === "story" ? 260 : layout === "ig" ? 210 : 64;
  const jackpotSize = portrait ? 38 : 30;
  const hasJackpot = Boolean(card.jackpotLabel);
  const headerH =
    kickerSize +
    dateSize +
    (hasJackpot ? jackpotSize + 14 : 0) +
    (portrait ? 40 : 28);
  const lines = wrapBallRows(card.rows, ball, gap, size.width - pad * 2);
  const numbersH =
    lines.length * ball + Math.max(0, lines.length - 1) * (gap + 10);
  const avail = size.height - safeTop - headerH - safeBottom;
  const numbersY =
    safeTop + headerH + Math.max(24, Math.round((avail - numbersH) / 2));

  const t = anim ? Math.max(0, Math.min(1, anim.t)) : 1;
  const live = Boolean(anim);
  const kickerM = fadeSlide(t, -0.05, 0.04, 0);
  const dateM = fadeSlide(t, -0.05, 0.04, 0);
  const ctaM = fadeSlide(t, live ? CTA_START : -0.05, live ? 0.08 : 0.04, live ? 80 : 0);
  const footM = fadeSlide(t, live ? CTA_START + 0.04 : -0.05, 0.06, 0);
  const pulse =
    live && t > CTA_START + 0.04
      ? 1 + 0.025 * Math.sin((t - CTA_START) * Math.PI * 12)
      : 1;
  const loopFade = live ? windowT(t, LOOP_FADE_START, 0.07) : 0;
  const titleOp = live
    ? Math.max(1 - windowT(t, TITLE_END - 0.04, 0.05), loopFade)
    : 0;

  const parts: string[] = [];
  if (live && t >= TITLE_END && loopFade < 0.85) {
    const glowR = 280 + 90 * Math.sin(t * Math.PI * 2);
    parts.push(
      `<circle cx="${size.width / 2}" cy="${numbersY + numbersH / 2}" r="${glowR}" fill="${xml(card.accent)}" opacity="${((0.05 + 0.05 * t) * (1 - loopFade)).toFixed(3)}"/>`,
    );
    for (let i = 0; i < 14; i += 1) {
      const sx = pad + ((i * 137) % (size.width - pad * 2));
      const sy = safeTop + 80 + ((i * 211) % Math.max(400, numbersH + 180));
      const o =
        (0.12 + 0.4 * Math.abs(Math.sin(t * Math.PI * 3 + i * 0.7))) * (1 - loopFade);
      if (t < TITLE_END + 0.02) continue;
      const sr = i % 3 === 0 ? 7 : 4.5;
      parts.push(
        `<polygon points="${starPoints(sx, sy, sr, sr * 0.42)}" fill="${xml(card.accent)}" opacity="${o.toFixed(3)}"/>`,
      );
    }
  }

  const dateY = safeTop + kickerSize + (portrait ? 28 : 22);
  parts.push(
    `<g opacity="${kickerM.opacity.toFixed(3)}" transform="translate(0 ${kickerM.dy.toFixed(1)})">
      <text x="${pad}" y="${safeTop}" fill="${xml(card.accent)}" font-size="${kickerSize}" font-family="${FONT_FAMILY}" font-weight="700">${xml(card.kicker.toUpperCase())}</text>
    </g>`,
  );
  parts.push(
    `<g opacity="${dateM.opacity.toFixed(3)}" transform="translate(0 ${dateM.dy.toFixed(1)})">
      <text x="${pad}" y="${dateY}" fill="#ffffff" font-size="${dateSize}" font-family="${FONT_FAMILY}" font-weight="700">${xml(card.dateLabel)}</text>
      ${
        card.jackpotLabel
          ? `<text x="${pad}" y="${dateY + dateSize + 8}" fill="${xml(card.accent)}" font-size="${jackpotSize}" font-family="${FONT_FAMILY}" font-weight="700">${xml(card.jackpotLabel)}</text>`
          : ""
      }
    </g>`,
  );

  const placed: {
    cell: BallCell;
    cx: number;
    cy: number;
    kind: "ball" | "star";
    index: number;
  }[] = [];
  let y = numbersY;
  let ballI = 0;
  let starI = 0;
  for (const line of lines) {
    const rowW = line.length * ball + (line.length - 1) * gap;
    let x = Math.round((size.width - rowW) / 2);
    for (const cell of line) {
      const cy = y + ball / 2;
      const cx = x + ball / 2;
      if (cell.outlined) {
        placed.push({ cell, cx, cy, kind: "star", index: starI });
        starI += 1;
      } else {
        placed.push({ cell, cx, cy, kind: "ball", index: ballI });
        ballI += 1;
      }
      x += ball + gap;
    }
    y += ball + gap + 10;
  }
  const ballCount = ballI;
  const etoilesAt = starI > 0 ? starStart(0, Math.max(1, ballCount)) : 1;
  let callout: { opacity: number; scale: number; n: string; star: boolean } | null =
    null;
  if (live && titleOp < 0.35 && loopFade < 0.4) {
    for (const p of placed) {
      const start =
        p.kind === "star"
          ? starStart(p.index, ballCount)
          : ballStart(p.index, ballCount);
      const c = announceCallout(t, start);
      if (c.opacity > 0.03 && (!callout || c.opacity > callout.opacity)) {
        callout = {
          opacity: c.opacity,
          scale: c.scale,
          n: String(p.cell.n),
          star: p.kind === "star",
        };
      }
    }
  }
  const numerosLblOp = live
    ? titleOp < 0.2 && t < etoilesAt && (!callout || callout.opacity < 0.35)
      ? windowT(t, TITLE_END, 0.04) * (1 - windowT(t, etoilesAt - 0.03, 0.04))
      : 0
    : 0;
  const etoilesLblOp = live
    ? windowT(t, etoilesAt - 0.02, 0.05) *
      (1 - windowT(t, CTA_START + 0.06, 0.06)) *
      (!callout || callout.opacity < 0.35 ? 1 : 0)
    : 0;
  if (titleOp > 0.02) {
    parts.push(
      `<g opacity="${titleOp.toFixed(3)}">
        <text x="${size.width / 2}" y="${numbersY + Math.max(40, numbersH / 2 - 28)}" fill="#ffffff" font-size="${portrait ? 56 : 40}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">LES NUMÉROS</text>
        <text x="${size.width / 2}" y="${numbersY + Math.max(40, numbersH / 2 - 28) + (portrait ? 52 : 40)}" fill="${xml(card.accent)}" font-size="${portrait ? 32 : 24}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">${xml(`Tirage du ${card.dateLabel}`)}</text>
      </g>`,
    );
  }
  if (numerosLblOp > 0.02) {
    parts.push(
      `<text opacity="${numerosLblOp.toFixed(3)}" x="${size.width / 2}" y="${numbersY - 28}" fill="${xml(card.accent)}" font-size="${portrait ? 28 : 22}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">LES NUMÉROS</text>`,
    );
  }
  if (etoilesLblOp > 0.02) {
    parts.push(
      `<text opacity="${etoilesLblOp.toFixed(3)}" x="${size.width / 2}" y="${numbersY - 28}" fill="${xml(card.accent)}" font-size="${portrait ? 28 : 22}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">${xml(card.bonusLabel || "LES ÉTOILES")}</text>`,
    );
  }

  for (const p of placed) {
    const start =
      p.kind === "star"
        ? starStart(p.index, ballCount)
        : ballStart(p.index, ballCount);
    const rev = live ? dropReveal(t, start) : dropReveal(1, 0);
    const pulseMul = p.kind === "ball" ? pulse : 1;
    const sx = rev.scaleX * pulseMul;
    const sy = rev.scaleY * pulseMul;
    const fill = p.cell.outlined ? "#0b1220" : xml(card.accent);
    const color = p.cell.outlined ? xml(card.accent) : fillInk;
    const flash =
      live && rev.opacity > 0.85 && rev.dy < 12
        ? Math.max(0, 0.35 - rev.dy / 40)
        : 0;
    const hold = 1 - loopFade;
    const ground = 1 - clamp01(rev.dy / 260);
    const shadowOp = rev.opacity * ground * 0.32 * hold;
    if (shadowOp > 0.02) {
      const rx = (p.kind === "star" ? ball * 0.34 : ball * 0.38) * (0.55 + 0.45 * ground);
      parts.push(
        `<ellipse cx="${p.cx}" cy="${p.cy + ball * 0.46}" rx="${rx.toFixed(1)}" ry="${(ball * 0.1).toFixed(1)}" fill="#000000" opacity="${shadowOp.toFixed(3)}"/>`,
      );
    }
    let body: string;
    const chanceBall = p.kind === "star" && card.bonusShape === "ball";
    if (p.kind === "star" && !chanceBall) {
      const outerR = ball / 2 + 10;
      const innerR = outerR * 0.5;
      const starFill = xml(card.accent);
      const starInk = xml(card.accentInk);
      const flashStar =
        flash > 0.02
          ? `<polygon points="${starPoints(p.cx, p.cy, outerR + 14, (outerR + 14) * 0.46)}" fill="${starFill}" opacity="${flash.toFixed(3)}"/>`
          : "";
      body = `${flashStar}<polygon points="${starPoints(p.cx, p.cy, outerR, innerR)}" fill="${starFill}" stroke="#fff6d0" stroke-width="5" stroke-linejoin="round"/>
        <text x="${p.cx}" y="${p.cy}" fill="${starInk}" font-size="${Math.round(digitSize * 0.88)}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle" dominant-baseline="central">${xml(String(p.cell.n))}</text>`;
    } else {
        const ballFill = chanceBall ? xml(card.accent) : fill;
        const ballInk = chanceBall ? xml(card.accentInk) : color;
        body = `${flash > 0.02 ? `<circle cx="${p.cx}" cy="${p.cy}" r="${ball / 2 + 10}" fill="${xml(card.accent)}" opacity="${flash.toFixed(3)}"/>` : ""}
        <circle cx="${p.cx}" cy="${p.cy}" r="${ball / 2 - 2}" fill="${ballFill}" stroke="${xml(card.accent)}" stroke-width="6"/>
        <text x="${p.cx}" y="${p.cy}" fill="${ballInk}" font-size="${digitSize}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle" dominant-baseline="central">${xml(String(p.cell.n))}</text>`;
    }
    parts.push(
      `<g opacity="${(rev.opacity * (1 - loopFade)).toFixed(3)}" transform="translate(${p.cx} ${p.cy + rev.dy}) rotate(${rev.spin.toFixed(1)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(${-p.cx} ${-p.cy})">
        ${body}
      </g>`,
    );
  }

  if (callout) {
    const cy = numbersY - (portrait ? 140 : 56);
    const fs = portrait ? 200 : 110;
    parts.push(
      `<g data-callout="1" opacity="${callout.opacity.toFixed(3)}" transform="translate(${size.width / 2} ${cy}) scale(${callout.scale.toFixed(3)})">
        <text x="0" y="0" fill="#0b1220" font-size="${fs}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle" dominant-baseline="central" stroke="#0b1220" stroke-width="22">${xml(callout.n)}</text>
        <text x="0" y="0" fill="${callout.star ? xml(card.accent) : "#ffffff"}" font-size="${fs}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle" dominant-baseline="central">${xml(callout.n)}</text>
      </g>`,
    );
  }

  if (portrait) {
    const boxH = layout === "story" ? 140 : 120;
    const boxY = size.height - safeBottom - boxH + 24;
    parts.push(
      `<g opacity="${(ctaM.opacity * (1 - loopFade)).toFixed(3)}" transform="translate(0 ${ctaM.dy.toFixed(1)})">
        ${
          card.myMillionLabel
            ? `<text x="${size.width / 2}" y="${boxY - 28}" fill="#ffffff" font-size="${portrait ? 28 : 22}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">${xml(card.myMillionLabel)}</text>`
            : ""
        }
        <rect x="${pad}" y="${boxY}" width="${size.width - pad * 2}" height="${boxH}" rx="28" fill="${xml(card.accent)}"/>
        <text x="${size.width / 2}" y="${boxY + 48}" fill="${fillInk}" font-size="26" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">Vérifier vos gains sur</text>
        <text x="${size.width / 2}" y="${boxY + 92}" fill="${fillInk}" font-size="${layout === "story" ? 34 : 30}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">euromillions-resultats.fr</text>
      </g>`,
      `<text opacity="${(footM.opacity * (1 - loopFade)).toFixed(3)}" x="${size.width / 2}" y="${size.height - 48}" fill="#c5d0e0" font-size="22" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">18+ · jeu responsable · site indépendant</text>`,
    );
  } else {
    const extra = [card.jackpotLabel, card.myMillionLabel].filter(Boolean).join(" · ");
    parts.push(
      `<text opacity="${footM.opacity.toFixed(3)}" x="${size.width / 2}" y="${size.height - 36}" fill="#c5d0e0" font-size="22" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">${xml(
        extra
          ? `${extra} · euromillions-resultats.fr · 18+`
          : "Vérifier vos gains sur euromillions-resultats.fr · 18+",
      )}</text>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
  <rect width="100%" height="100%" fill="#0b1220"/>
  ${parts.join("\n  ")}
</svg>`;
}

export function newsShareSvg(
  title: string,
  excerpt: string,
  size: { width: number; height: number },
  anim?: {
    t?: number;
    overlay?: boolean;
    body?: string;
    mood?: "ironie" | "tension" | "mystere" | "chaleur";
    fond?: "navy" | "gold" | "cold" | "warm";
  },
): string {
  const layout = shareLayout(size);
  const portrait = layout !== "feed";
  const pad = layout === "story" ? 56 : 48;
  const logoS = portrait ? 56 : 40;
  const headerY = layout === "story" ? 64 : 36;
  const top = headerY + logoS + (portrait ? 36 : 24);
  const live = anim?.t !== undefined;
  const overlay = Boolean(anim?.overlay);
  const t = live ? clamp01(anim.t ?? 1) : 1;
  const titleSize = layout === "story" ? 58 : layout === "ig" ? 48 : 42;
  const excerptSize = portrait ? 36 : 26;
  const bodySize = portrait ? 36 : 26;
  const titleLines = wrapLines(title, portrait ? 22 : 34, portrait ? 4 : 3);
  const excerptLines = wrapLines(excerpt, portrait ? 38 : 44, portrait ? 8 : 5);
  const [beatA, beatB, beatC] = newsStoryBeats(anim?.body);
  const wrapBody = (s: string) =>
    wrapLines(s, portrait ? 38 : 44, portrait ? 14 : 6);
  const bodyALines = wrapBody(beatA);
  const bodyBLines = wrapBody(beatB);
  const bodyCLines = wrapBody(beatC);
  const tl = newsShareTimeline(excerpt, anim?.body);
  const fade = live ? Math.min(0.02, 0.22 / tl.seconds) : 0.02;
  const loopFade = live ? windowT(t, LOOP_FADE_START, 1 - LOOP_FADE_START) : 0;
  const kickerM = live ? fadeSlide(t, 0.01, 0.035, 12) : { opacity: 1, dy: 0 };
  const titleHold = live ? holdFade(t, 0.03, tl.ctaStart, fade) : 1;
  const excerptOp = live ? holdFade(t, tl.hookStart, tl.hookEnd, fade) : 1;
  const bodyAOp = live
    ? holdFade(t, tl.bodyAStart, tl.hookEnd, fade)
    : beatA
      ? 1
      : 0;
  const bodyBOp = live ? holdFade(t, tl.storyStart, tl.storyEnd, fade) : 0;
  const bodyCOp = live ? holdFade(t, tl.bodyCStart, tl.storyEnd, fade) : 0;
  const footM = live ? fadeSlide(t, 0.08, 0.05, 0) : { opacity: 1, dy: 0 };
  const ctaM = live ? fadeSlide(t, tl.ctaStart, 0.03, 28) : { opacity: 0, dy: 0 };
  const veil =
    anim?.fond === "gold"
      ? "#1a1408"
      : anim?.fond === "cold"
        ? "#07141c"
        : anim?.fond === "warm"
          ? "#1c100c"
          : "#0b1220";
  const accent =
    anim?.mood === "tension"
      ? "#ff7a59"
      : anim?.mood === "mystere"
        ? "#c4b5fd"
        : anim?.mood === "chaleur"
          ? "#f0b36a"
          : "#f5c542";

  const bg = overlay
    ? `<defs>
        <linearGradient id="newsVeil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${veil}" stop-opacity="0.48"/>
          <stop offset="0.32" stop-color="${veil}" stop-opacity="0.78"/>
          <stop offset="1" stop-color="${veil}" stop-opacity="0.92"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#newsVeil)"/>`
    : `<rect width="100%" height="100%" fill="${veil}"/>`;

  const logoScale = logoS / 32;
  const parts: string[] = [
    `<g opacity="${kickerM.opacity.toFixed(3)}" transform="translate(0 ${kickerM.dy.toFixed(1)})">
      <g transform="translate(${pad} ${headerY}) scale(${logoScale.toFixed(3)})">
        <rect width="32" height="32" rx="7" fill="${accent}"/>
        <circle cx="16" cy="16" r="8" fill="none" stroke="#0b1220" stroke-width="2"/>
        <path d="M16 11.2l1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4L16 11.2z" fill="#0b1220"/>
      </g>
      <text x="${pad + logoS + 16}" y="${headerY + (portrait ? 26 : 18)}" fill="${accent}" font-size="${portrait ? 28 : 20}" font-family="${FONT_FAMILY}" font-weight="700">HISTOIRE</text>
      <text x="${pad + logoS + 16}" y="${headerY + (portrait ? 52 : 36)}" fill="#e8eef8" font-size="${portrait ? 22 : 16}" font-family="${FONT_FAMILY}" font-weight="700">euromillions-resultats.fr</text>
    </g>`,
  ];
  let titleY = top + 36;
  for (let i = 0; i < titleLines.length; i += 1) {
    const line = titleLines[i]!;
    titleY += titleSize + 8;
    const lineM = live
      ? fadeSlide(t, 0.03 + i * 0.018, 0.06, 18)
      : { opacity: 1, dy: 0 };
    const op = Math.min(lineM.opacity, titleHold) * (1 - loopFade * 0.25);
    parts.push(
      `<text opacity="${op.toFixed(3)}" transform="translate(0 ${lineM.dy.toFixed(1)})" x="${pad}" y="${titleY}" fill="#ffffff" font-size="${titleSize}" font-family="${FONT_FAMILY}" font-weight="700">${xml(line)}</text>`,
    );
  }
  const ctaBoxH = layout === "story" ? 200 : 150;
  const ctaBoxY = size.height - (layout === "story" ? 280 : 210);
  const textLimit = portrait ? size.height - 88 : size.height - 48;
  const storyTop = titleY + (portrait ? 36 : 22);
  const stackTableau = (
    blocks: {
      lines: string[];
      opacity: number;
      fontSize: number;
      fill: string;
    }[],
  ) => {
    let y = storyTop;
    let any = false;
    for (const block of blocks) {
      if (!block.lines[0] || block.opacity < 0.03) continue;
      if (any) y += 16;
      any = true;
      for (const line of block.lines) {
        y += block.fontSize + 12;
        if (y > textLimit) break;
        parts.push(
          `<text data-news-block="1" opacity="${block.opacity.toFixed(3)}" x="${pad}" y="${y}" fill="${block.fill}" font-size="${block.fontSize}" font-family="${FONT_FAMILY}" font-weight="700">${xml(line)}</text>`,
        );
      }
    }
  };
  stackTableau([
    { lines: excerptLines, opacity: excerptOp, fontSize: excerptSize, fill: "#e8eef8" },
    { lines: bodyALines, opacity: bodyAOp, fontSize: bodySize, fill: "#f2f6fc" },
  ]);
  stackTableau([
    { lines: bodyBLines, opacity: bodyBOp, fontSize: bodySize, fill: "#f2f6fc" },
    { lines: bodyCLines, opacity: bodyCOp, fontSize: bodySize, fill: "#f2f6fc" },
  ]);
  if (portrait && live && ctaM.opacity > 0.02) {
    parts.push(
      `<g opacity="${(ctaM.opacity * (1 - loopFade)).toFixed(3)}" transform="translate(0 ${ctaM.dy.toFixed(1)})">
        <rect x="${pad}" y="${ctaBoxY}" width="${size.width - pad * 2}" height="${ctaBoxH}" rx="32" fill="${accent}"/>
        <text x="${size.width / 2}" y="${ctaBoxY + 70}" fill="#0b1220" font-size="${layout === "story" ? 48 : 36}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">Abonne-toi</text>
        <text x="${size.width / 2}" y="${ctaBoxY + 128}" fill="#0b1220" font-size="${layout === "story" ? 28 : 22}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">pour d'autres histoires</text>
      </g>`,
    );
  }
  parts.push(
    `<text opacity="${(footM.opacity * (1 - loopFade * 0.4)).toFixed(3)}" x="${pad}" y="${size.height - 48}" fill="#c5d0e0" font-size="${portrait ? 22 : 20}" font-family="${FONT_FAMILY}">18+ · jeu responsable</text>`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
  ${bg}
  ${parts.join("\n  ")}
</svg>`;
}

async function svgToPng(svg: string): Promise<Buffer> {
  const { Resvg } = await import("@resvg/resvg-js");
  const fontFile = shareFontPath();
  const resvg = new Resvg(svg, {
    fitTo: { mode: "original" },
    font: {
      loadSystemFonts: !fontFile,
      defaultFontFamily: FONT_FAMILY,
      ...(fontFile
        ? { fontFiles: [fontFile], defaultFontFamily: FONT_FAMILY }
        : {}),
    },
  });
  return Buffer.from(resvg.render().asPng());
}

export async function rasterShare(
  svg: string,
  format: "png" | "jpeg" = "png",
): Promise<Buffer> {
  const png = await svgToPng(svg);
  if (format === "jpeg") {
    const sharp = (await import("sharp")).default;
    return sharp(png)
      .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
      .toBuffer();
  }
  return png;
}

export async function lotterySharePng(
  card: ShareCardInput,
  size: { width: number; height: number } = SHARE_FEED,
): Promise<Uint8Array> {
  return new Uint8Array(await rasterShare(lotteryShareSvg(card, size), "png"));
}

export async function lotteryShareJpeg(
  card: ShareCardInput,
  size: { width: number; height: number } = SHARE_FEED,
): Promise<Buffer> {
  return rasterShare(lotteryShareSvg(card, size), "jpeg");
}

export async function newsSharePng(
  title: string,
  excerpt: string,
  size: { width: number; height: number } = SHARE_FEED,
): Promise<Uint8Array> {
  return new Uint8Array(
    await rasterShare(newsShareSvg(title, excerpt, size), "png"),
  );
}

export async function newsShareJpeg(
  title: string,
  excerpt: string,
  size: { width: number; height: number } = SHARE_FEED,
): Promise<Buffer> {
  return rasterShare(newsShareSvg(title, excerpt, size), "jpeg");
}
