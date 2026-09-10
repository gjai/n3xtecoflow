import path from "path";
import { existsSync } from "fs";
import {
  SHARE_FEED,
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
  announceCallout,
  starStart,
  windowT,
} from "./share-motion";

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
  const words = clip(text, maxChars * maxLines).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length >= maxLines) {
        cur = "";
        break;
      }
    } else {
      cur = next;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines.length ? lines : [clip(text, maxChars)];
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
  const crowded = Math.max(0, ...card.rows.map((r) => r.values.length)) >= 12;
  const ball = crowded
    ? layout === "story"
      ? 88
      : layout === "ig"
        ? 78
        : 64
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
      `<text opacity="${etoilesLblOp.toFixed(3)}" x="${size.width / 2}" y="${numbersY - 28}" fill="${xml(card.accent)}" font-size="${portrait ? 28 : 22}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">LES ÉTOILES</text>`,
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
    if (p.kind === "star") {
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
      body = `${flash > 0.02 ? `<circle cx="${p.cx}" cy="${p.cy}" r="${ball / 2 + 10}" fill="${xml(card.accent)}" opacity="${flash.toFixed(3)}"/>` : ""}
        <circle cx="${p.cx}" cy="${p.cy}" r="${ball / 2 - 2}" fill="${fill}" stroke="${xml(card.accent)}" stroke-width="6"/>
        <text x="${p.cx}" y="${p.cy}" fill="${color}" font-size="${digitSize}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle" dominant-baseline="central">${xml(String(p.cell.n))}</text>`;
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
): string {
  const layout = shareLayout(size);
  const portrait = layout !== "feed";
  const pad = layout === "story" ? 72 : 56;
  const top = layout === "story" ? 280 : 64;
  const titleSize = layout === "story" ? 52 : layout === "ig" ? 44 : 40;
  const excerptSize = portrait ? 28 : 24;
  const titleLines = wrapLines(title, portrait ? 28 : 36, portrait ? 5 : 3);
  const excerptLines = wrapLines(excerpt, portrait ? 34 : 42, portrait ? 4 : 2);

  const parts: string[] = [
    `<text x="${pad}" y="${top}" fill="#f5c542" font-size="${portrait ? 28 : 22}" font-family="${FONT_FAMILY}" font-weight="700">ACTUALITÉ</text>`,
  ];
  let y = top + 56;
  for (const line of titleLines) {
    y += titleSize + 8;
    parts.push(
      `<text x="${pad}" y="${y}" fill="#ffffff" font-size="${titleSize}" font-family="${FONT_FAMILY}" font-weight="700">${xml(line)}</text>`,
    );
  }
  y += 36;
  for (const line of excerptLines) {
    y += excerptSize + 10;
    parts.push(
      `<text x="${pad}" y="${y}" fill="#d5deec" font-size="${excerptSize}" font-family="${FONT_FAMILY}">${xml(line)}</text>`,
    );
  }
  parts.push(
    `<text x="${pad}" y="${size.height - 48}" fill="#c5d0e0" font-size="${portrait ? 22 : 20}" font-family="${FONT_FAMILY}">euromillions-resultats.fr · 18+ · jeu responsable</text>`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
  <rect width="100%" height="100%" fill="#0b1220"/>
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
