import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { getProductsForSite } from "@/data/products";
import { getEcoflowEntriesMap } from "@/lib/ecoflow/catalog-store";
import { resolveProductMedia } from "@/lib/product-presentation";
import { buildNewsCoverPrompt, getEditorial } from "@/sites/editorial";
import type { SiteId } from "@/sites/types";
import { fetchSourcePage } from "./source";

function mediaDir() {
  return (
    process.env.NEWS_MEDIA_PATH?.trim() ||
    path.join(process.cwd(), "data", "news-images")
  );
}

const UA =
  "Mozilla/5.0 (compatible; EcoFlowStreamBot/1.1; +https://ecoflow-stream.com; editorial thumbnail)";

/** SHA-1 of the known Google News 300×300 logo seen in production. */
const KNOWN_JUNK_SHA1 = new Set([
  "3fe717c540c2a0952f7e56a530505fd1754e5101",
]);

const JUNK_HOST =
  /(?:^|\.)(?:gstatic|googleusercontent|ggpht|google)\.com$/i;

export function isJunkImageUrl(imageUrl: string): boolean {
  try {
    const u = new URL(imageUrl);
    if (JUNK_HOST.test(u.hostname)) return true;
    if (/news\.google\.com/i.test(u.hostname)) return true;
    if (/google.?news|gnews|gn_logo|google_news_logo/i.test(u.href)) return true;
    if (/encrypted-tbn/i.test(u.hostname + u.pathname)) return true;
    if (/\/logo|\/favicon|\/sprite|\/icon[-_/]/i.test(u.pathname)) return true;
    return false;
  } catch {
    return true;
  }
}

function readPngSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  if (buf[0] !== 0x89 || buf[1] !== 0x50) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readJpegSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xd9 || marker === 0xda) break;
    const size = buf.readUInt16BE(i + 2);
    if (size < 2) break;
    // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        height: buf.readUInt16BE(i + 5),
        width: buf.readUInt16BE(i + 7),
      };
    }
    i += 2 + size;
  }
  return null;
}

function readWebpSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 30) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X" && buf.length >= 30) {
    const w = 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16);
    const h = 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16);
    return { width: w, height: h };
  }
  if (chunk === "VP8 " && buf.length >= 30) {
    const w = buf.readUInt16LE(26) & 0x3fff;
    const h = buf.readUInt16LE(28) & 0x3fff;
    return { width: w, height: h };
  }
  return null;
}

export function readImageSize(
  buf: Buffer,
): { width: number; height: number } | null {
  return readPngSize(buf) || readJpegSize(buf) || readWebpSize(buf);
}

/** Reject Google News logos / tiny icons / non-editorial thumbs. */
export function isJunkImageBuffer(buf: Buffer): boolean {
  const sha1 = createHash("sha1").update(buf).digest("hex");
  if (KNOWN_JUNK_SHA1.has(sha1)) return true;

  const size = readImageSize(buf);
  if (!size) {
    // Unknown format — keep only if reasonably large file
    return buf.length < 15_000;
  }

  const { width, height } = size;
  if (width < 320 || height < 200) return true;
  // Square logos / app icons (Google News is 300×300)
  if (width === height && width <= 512) return true;
  // Tiny banners
  if (width * height < 120_000 && Math.min(width, height) < 280) return true;

  // Sample PNG RGBA for Google News logo: mostly black + brand colors
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf.length < 40_000) {
    // Small PNGs that are square-ish → almost always logos
    if (Math.abs(width - height) < 40 && width <= 640) return true;
  }

  return false;
}

export async function isStoredNewsImageJunk(
  imageSrc: string | undefined | null,
): Promise<boolean> {
  if (!imageSrc) return true;
  if (!imageSrc.startsWith("/api/media/news/")) return false;
  const filename = path.basename(imageSrc);
  try {
    const buf = await fs.readFile(newsImageAbsolutePath(filename));
    return isJunkImageBuffer(buf);
  } catch {
    return true;
  }
}

async function saveImageBuffer(
  buf: Buffer,
  slug: string,
  ext: string,
  salt: string,
): Promise<string> {
  const dir = mediaDir();
  await fs.mkdir(dir, { recursive: true });
  const hash = createHash("sha1")
    .update(`${slug}:${salt}:${buf.length}`)
    .digest("hex")
    .slice(0, 8);
  const filename = `${slug.slice(0, 50)}-${hash}.${ext}`;
  await fs.writeFile(path.join(dir, filename), buf);
  return `/api/media/news/${filename}`;
}

export async function downloadNewsImage(
  imageUrl: string,
  slug: string,
): Promise<string | null> {
  if (isJunkImageUrl(imageUrl)) return null;
  try {
    const res = await fetch(imageUrl, {
      redirect: "follow",
      headers: {
        "User-Agent": UA,
        Accept: "image/*,*/*",
        Referer: imageUrl,
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const ctype = (res.headers.get("content-type") || "").toLowerCase();
    if (!ctype.includes("image") && !ctype.includes("octet-stream")) {
      if (!/\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(imageUrl)) return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 4_000 || buf.length > 8_000_000) return null;
    if (isJunkImageBuffer(buf)) return null;

    let ext = "jpg";
    if (ctype.includes("png") || imageUrl.includes(".png")) ext = "png";
    else if (ctype.includes("webp") || imageUrl.includes(".webp")) ext = "webp";
    else if (ctype.includes("gif")) ext = "gif";
    else if (ctype.includes("avif")) ext = "avif";

    return saveImageBuffer(buf, slug, ext, imageUrl);
  } catch {
    return null;
  }
}

function newsAiCoverPrompt(
  siteId: SiteId,
  title: string,
  excerpt?: string,
): string {
  return buildNewsCoverPrompt(siteId, title, excerpt);
}

function newsAiCoverCredit(siteId: SiteId): string {
  return getEditorial(siteId).coverCreditAi;
}

function newsPackshotCredit(siteId: SiteId): string {
  return getEditorial(siteId).packshotCredit;
}

async function generateCoverWithGemini(args: {
  title: string;
  excerpt?: string;
  slug: string;
  siteId?: SiteId;
}): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const model =
    process.env.NEWS_IMAGE_MODEL?.trim() || "gemini-2.5-flash-image";
  const siteId = args.siteId || "ecoflow";
  const prompt = `${newsAiCoverPrompt(siteId, args.title, args.excerpt)}
Unique variation id: ${args.slug.slice(-18)}.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
        signal: AbortSignal.timeout(90_000),
      },
    );
    if (!res.ok) {
      console.error("news_image_ai_failed", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as {
      candidates?: {
        content?: {
          parts?: {
            inlineData?: { mimeType?: string; data?: string };
            inline_data?: { mime_type?: string; data?: string };
          }[];
        };
      }[];
    };
    const parts = json.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      const data = part.inlineData?.data || part.inline_data?.data;
      const mime =
        part.inlineData?.mimeType ||
        part.inline_data?.mime_type ||
        "image/png";
      if (!data) continue;
      const buf = Buffer.from(data, "base64");
      if (buf.length < 4_000) continue;
      // AI covers can be square; only reject known tiny logos via hash/size floors
      const size = readImageSize(buf);
      if (size && (size.width < 512 || size.height < 512)) continue;
      const sha1 = createHash("sha1").update(buf).digest("hex");
      if (KNOWN_JUNK_SHA1.has(sha1)) continue;
      const ext = mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : "png";
      return saveImageBuffer(
        buf,
        args.slug,
        ext,
        `ai:${model}:${args.slug}:${Date.now()}`,
      );
    }
    return null;
  } catch (err) {
    console.error("news_image_ai_error", err);
    return null;
  }
}

/** Copy a local public asset into the news media store. */
async function materializeLocalCover(
  src: string,
  slug: string,
): Promise<string | null> {
  if (!src.startsWith("/images/") && !src.startsWith("/brands/")) return null;
  const abs = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  try {
    const buf = await fs.readFile(abs);
    if (buf.length < 4_000) return null;
    const ext = path.extname(abs).replace(".", "") || "jpg";
    return saveImageBuffer(buf, slug, ext, `local:${src}`);
  } catch {
    return null;
  }
}

async function materializeCoverFromSrc(
  src: string,
  slug: string,
): Promise<string | null> {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return downloadNewsImage(src, slug);
  }
  return materializeLocalCover(src, slug);
}

/** Fallback: packshot produit lié au titre / tags (catalogue du thème uniquement). */
async function resolveProductPackshotCover(args: {
  title: string;
  tags?: string[];
  slug: string;
  siteId?: SiteId;
  /** Minimum score to accept a match (avoids the same default SKU on every article). */
  minScore?: number;
  /** If false, never fall back to catalog[0] / delta-2. */
  allowWeakDefault?: boolean;
}): Promise<string | null> {
  const siteId = args.siteId || "ecoflow";
  const minScore = args.minScore ?? 1;
  const allowWeakDefault = args.allowWeakDefault !== false;
  const hay = `${args.title} ${(args.tags || []).join(" ")}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const catalog = getProductsForSite(siteId);
  const tagNorms = (args.tags || [])
    .map((t) =>
      t
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ""),
    )
    .filter((t) => t.length >= 3);
  const scored = catalog
    .map((p) => {
      const tokens = [
        p.slug,
        p.name,
        p.category,
        ...p.slug.split("-"),
        ...p.name.toLowerCase().split(/\s+/),
      ];
      let score = 0;
      for (const t of tokens) {
        const n = t
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "");
        if (n.length >= 3 && hay.includes(n)) score += n.length >= 5 ? 3 : 1;
      }
      const slugFlat = p.slug.replace(/-/g, "");
      const nameFlat = p.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
      for (const tag of tagNorms) {
        if (slugFlat.includes(tag) || nameFlat.includes(tag)) score += 10;
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const pick =
    best && best.score >= minScore
      ? best.p
      : allowWeakDefault
        ? siteId === "ecoflow"
          ? catalog.find((p) => p.slug === "delta-2") || catalog[0]
          : null
        : null;
  if (!pick) return null;

  const eco = siteId === "ecoflow" ? await getEcoflowEntriesMap() : {};
  const media = resolveProductMedia(pick, eco[pick.slug]);
  if (media.source === "category") return null;

  return materializeCoverFromSrc(media.src, args.slug);
}

export type NewsCoverResult = {
  imageSrc: string;
  imageCredit: string;
  imageKind: "source" | "fallback" | "ai";
};

/** Prefer OG / page image from source publisher; else AI; else product packshot. */
export async function resolveNewsCover(args: {
  sourceUrl: string;
  sourceName: string;
  slug: string;
  title?: string;
  excerpt?: string;
  tags?: string[];
  ogImageHint?: string | null;
  siteId?: SiteId;
}): Promise<NewsCoverResult | null> {
  const siteId = args.siteId || "ecoflow";
  let imageUrl = args.ogImageHint?.trim() || null;
  if (imageUrl && isJunkImageUrl(imageUrl)) imageUrl = null;

  if (!imageUrl) {
    const page = await fetchSourcePage(args.sourceUrl);
    imageUrl = page?.ogImage || null;
    if (imageUrl && isJunkImageUrl(imageUrl)) imageUrl = null;
  }

  if (imageUrl) {
    const local = await downloadNewsImage(imageUrl, args.slug);
    if (local) {
      return {
        imageSrc: local,
        imageCredit: args.sourceName,
        imageKind: "source",
      };
    }
  }

  const title = args.title || args.slug;

  // Thèmes flat : IA d’abord pour des couvertures uniques par article
  // (les packshots Amazon se répétaient via des mots génériques).
  if (getEditorial(siteId).preferAiNewsCovers) {
    const aiFirst = await generateCoverWithGemini({
      title,
      excerpt: args.excerpt,
      slug: args.slug,
      siteId,
    });
    if (aiFirst) {
      return {
        imageSrc: aiFirst,
        imageCredit: newsAiCoverCredit(siteId),
        imageKind: "ai",
      };
    }
  }

  // Marque nette → packshot catalogue du thème
  const packBrand = await resolveProductPackshotCover({
    title,
    tags: args.tags,
    slug: args.slug,
    siteId,
    minScore: 12,
    allowWeakDefault: false,
  });
  if (packBrand) {
    return {
      imageSrc: packBrand,
      imageCredit: newsPackshotCredit(siteId),
      imageKind: "fallback",
    };
  }

  const ai = await generateCoverWithGemini({
    title,
    excerpt: args.excerpt,
    slug: args.slug,
    siteId,
  });
  if (ai) {
    return {
      imageSrc: ai,
      imageCredit: newsAiCoverCredit(siteId),
      imageKind: "ai",
    };
  }

  const pack = await resolveProductPackshotCover({
    title,
    tags: args.tags,
    slug: args.slug,
    siteId,
    minScore: 1,
    allowWeakDefault: getEditorial(siteId).allowWeakPackshotDefault,
  });
  if (pack) {
    return {
      imageSrc: pack,
      imageCredit: newsPackshotCredit(siteId),
      imageKind: "fallback",
    };
  }

  return null;
}

export function newsImageAbsolutePath(filename: string) {
  const safe = path.basename(filename);
  return path.join(mediaDir(), safe);
}
