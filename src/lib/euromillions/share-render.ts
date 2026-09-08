import {
  SHARE_FEED,
  type ShareCardInput,
  shareLayout,
} from "./share-card";

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

export function lotteryShareSvg(
  card: ShareCardInput,
  size: { width: number; height: number },
): string {
  const layout = shareLayout(size);
  const portrait = layout !== "feed";
  const crowded = Math.max(0, ...card.rows.map((r) => r.values.length)) >= 12;
  const ball = crowded
    ? layout === "story"
      ? 72
      : layout === "ig"
        ? 64
        : 52
    : layout === "story"
      ? 128
      : layout === "ig"
        ? 112
        : 88;
  const pad = layout === "story" ? 72 : layout === "ig" ? 64 : 52;
  const top = layout === "story" ? 140 : pad;
  const gap = Math.round(ball * 0.14);
  const kickerSize = portrait ? 26 : 20;
  const dateSize = layout === "story" ? 52 : layout === "ig" ? 44 : 42;

  const parts: string[] = [];
  parts.push(
    `<text x="${pad}" y="${top}" fill="${xml(card.accent)}" font-size="${kickerSize}" font-family="sans-serif" font-weight="700" letter-spacing="5">${xml(card.kicker.toUpperCase())}</text>`,
  );
  parts.push(
    `<text x="${pad}" y="${top + kickerSize + (portrait ? 28 : 20)}" fill="#ffffff" font-size="${dateSize}" font-family="sans-serif" font-weight="700">${xml(card.dateLabel)}</text>`,
  );

  let y = top + kickerSize + dateSize + (portrait ? 72 : 52);
  for (const row of card.rows) {
    let x = pad;
    let rowY = y;
    for (const n of row.values) {
      if (x + ball > size.width - pad) {
        x = pad;
        rowY += ball + gap + 8;
      }
      const cy = rowY + ball / 2;
      const cx = x + ball / 2;
      const fill = row.outlined ? "#0b1220" : xml(card.accent);
      const stroke = xml(card.accent);
      const color = row.outlined ? xml(card.accent) : xml(card.accentInk);
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${ball / 2 - 2}" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`,
      );
      parts.push(
        `<text x="${cx}" y="${cy + Math.round(ball * 0.12)}" fill="${color}" font-size="${Math.round(ball * 0.38)}" font-family="sans-serif" font-weight="700" text-anchor="middle">${xml(String(n))}</text>`,
      );
      x += ball + gap;
    }
    y = rowY + ball + 18;
  }

  const footerY = size.height - (portrait ? 160 : 48);
  if (portrait) {
    const boxY = size.height - 220;
    const boxH = layout === "story" ? 120 : 110;
    parts.push(
      `<rect x="${pad}" y="${boxY}" width="${size.width - pad * 2}" height="${boxH}" rx="28" fill="${xml(card.accent)}"/>`,
      `<text x="${size.width / 2}" y="${boxY + 48}" fill="${xml(card.accentInk)}" font-size="24" font-family="sans-serif" font-weight="600" text-anchor="middle">Vérifier vos gains sur</text>`,
      `<text x="${size.width / 2}" y="${boxY + 88}" fill="${xml(card.accentInk)}" font-size="${layout === "story" ? 32 : 28}" font-family="sans-serif" font-weight="700" text-anchor="middle">euromillions-resultats.fr</text>`,
      `<text x="${pad}" y="${size.height - 48}" fill="#8494ad" font-size="20" font-family="sans-serif">18+ · jeu responsable · site indépendant</text>`,
    );
  } else {
    parts.push(
      `<text x="${pad}" y="${footerY}" fill="#8494ad" font-size="20" font-family="sans-serif">Vérifier vos gains sur euromillions-resultats.fr · 18+</text>`,
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
  const pad = layout === "story" ? 72 : 64;
  const top = layout === "story" ? 140 : 52;
  const titleSize = layout === "story" ? 48 : layout === "ig" ? 40 : 38;
  const titleY = top + 40;
  const wrappedTitle = xml(clip(title, portrait ? 140 : 110));
  const wrappedExcerpt = xml(clip(excerpt, portrait ? 220 : 160));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
  <rect width="100%" height="100%" fill="#0b1220"/>
  <text x="${pad}" y="${top}" fill="#f5c542" font-size="${portrait ? 26 : 20}" font-family="sans-serif" font-weight="700" letter-spacing="5">ACTUALITÉ</text>
  <text x="${pad}" y="${titleY + titleSize}" fill="#ffffff" font-size="${titleSize}" font-family="sans-serif" font-weight="700">${wrappedTitle}</text>
  <text x="${pad}" y="${titleY + titleSize + (portrait ? 56 : 44)}" fill="#b8c4d8" font-size="${portrait ? 26 : 22}" font-family="sans-serif">${wrappedExcerpt}</text>
  <text x="${pad}" y="${size.height - 48}" fill="#8494ad" font-size="${portrait ? 22 : 20}" font-family="sans-serif">euromillions-resultats.fr · 18+ · jeu responsable</text>
</svg>`;
}

export async function rasterShare(
  svg: string,
  format: "png" | "jpeg" = "png",
): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const img = sharp(Buffer.from(svg));
  if (format === "jpeg") {
    return img
      .toColorspace("srgb")
      .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
      .toBuffer();
  }
  return img.png().toBuffer();
}

export async function lotterySharePng(
  card: ShareCardInput,
  size = SHARE_FEED,
): Promise<Uint8Array> {
  return new Uint8Array(await rasterShare(lotteryShareSvg(card, size), "png"));
}

export async function lotteryShareJpeg(
  card: ShareCardInput,
  size = SHARE_FEED,
): Promise<Buffer> {
  return rasterShare(lotteryShareSvg(card, size), "jpeg");
}

export async function newsSharePng(
  title: string,
  excerpt: string,
  size = SHARE_FEED,
): Promise<Uint8Array> {
  return new Uint8Array(
    await rasterShare(newsShareSvg(title, excerpt, size), "png"),
  );
}

export async function newsShareJpeg(
  title: string,
  excerpt: string,
  size = SHARE_FEED,
): Promise<Buffer> {
  return rasterShare(newsShareSvg(title, excerpt, size), "jpeg");
}
