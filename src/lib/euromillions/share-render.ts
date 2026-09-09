import path from "path";
import { existsSync } from "fs";
import {
  SHARE_FEED,
  type ShareCardInput,
  shareLayout,
} from "./share-card";

const FONT_FAMILY = "Inter";

function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  const headerH = kickerSize + dateSize + (portrait ? 40 : 28);
  const lines = wrapBallRows(card.rows, ball, gap, size.width - pad * 2);
  const numbersH =
    lines.length * ball + Math.max(0, lines.length - 1) * (gap + 10);
  const avail = size.height - safeTop - headerH - safeBottom;
  const numbersY =
    safeTop + headerH + Math.max(24, Math.round((avail - numbersH) / 2));

  const parts: string[] = [];
  parts.push(
    `<text x="${pad}" y="${safeTop}" fill="${xml(card.accent)}" font-size="${kickerSize}" font-family="${FONT_FAMILY}" font-weight="700">${xml(card.kicker.toUpperCase())}</text>`,
  );
  parts.push(
    `<text x="${pad}" y="${safeTop + kickerSize + (portrait ? 28 : 22)}" fill="#ffffff" font-size="${dateSize}" font-family="${FONT_FAMILY}" font-weight="700">${xml(card.dateLabel)}</text>`,
  );

  let y = numbersY;
  for (const line of lines) {
    const rowW = line.length * ball + (line.length - 1) * gap;
    let x = Math.round((size.width - rowW) / 2);
    for (const cell of line) {
      const cy = y + ball / 2;
      const cx = x + ball / 2;
      const fill = cell.outlined ? "#0b1220" : xml(card.accent);
      const color = cell.outlined ? xml(card.accent) : fillInk;
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${ball / 2 - 2}" fill="${fill}" stroke="${xml(card.accent)}" stroke-width="6"/>`,
      );
      parts.push(
        `<text x="${cx}" y="${cy}" fill="${color}" font-size="${digitSize}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle" dominant-baseline="central">${xml(String(cell.n))}</text>`,
      );
      x += ball + gap;
    }
    y += ball + gap + 10;
  }

  if (portrait) {
    const boxH = layout === "story" ? 140 : 120;
    const boxY = size.height - safeBottom - boxH + 24;
    parts.push(
      `<rect x="${pad}" y="${boxY}" width="${size.width - pad * 2}" height="${boxH}" rx="28" fill="${xml(card.accent)}"/>`,
      `<text x="${size.width / 2}" y="${boxY + 48}" fill="${fillInk}" font-size="26" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">Vérifier vos gains sur</text>`,
      `<text x="${size.width / 2}" y="${boxY + 92}" fill="${fillInk}" font-size="${layout === "story" ? 34 : 30}" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">euromillions-resultats.fr</text>`,
      `<text x="${size.width / 2}" y="${size.height - 48}" fill="#c5d0e0" font-size="22" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">18+ · jeu responsable · site indépendant</text>`,
    );
  } else {
    parts.push(
      `<text x="${size.width / 2}" y="${size.height - 36}" fill="#c5d0e0" font-size="22" font-family="${FONT_FAMILY}" font-weight="700" text-anchor="middle">Vérifier vos gains sur euromillions-resultats.fr · 18+</text>`,
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
