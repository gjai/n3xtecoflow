import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

function mediaDir() {
  return (
    process.env.NEWS_MEDIA_PATH?.trim() ||
    path.join(process.cwd(), "data", "news-images")
  );
}

function extractMeta(html: string, prop: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

export async function fetchOpenGraphImage(
  pageUrl: string,
): Promise<{ url: string; finalUrl: string } | null> {
  try {
    const res = await fetch(pageUrl, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "EcoFlowStreamBot/1.0 (+https://ecoflow-stream.com; editorial thumbnail)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    const finalUrl = res.url || pageUrl;
    const html = await res.text();
    const og =
      extractMeta(html, "og:image") ||
      extractMeta(html, "og:image:url") ||
      extractMeta(html, "twitter:image") ||
      extractMeta(html, "twitter:image:src");
    if (!og) return null;
    const absolute = new URL(og, finalUrl).toString();
    if (!/^https?:\/\//i.test(absolute)) return null;
    return { url: absolute, finalUrl };
  } catch {
    return null;
  }
}

export async function downloadNewsImage(
  imageUrl: string,
  slug: string,
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "EcoFlowStreamBot/1.0 (+https://ecoflow-stream.com; editorial thumbnail)",
        Accept: "image/*,*/*",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const ctype = (res.headers.get("content-type") || "").toLowerCase();
    if (!ctype.includes("image") && !ctype.includes("octet-stream")) {
      // some CDNs omit type — still try if body looks ok
      if (!/\.(jpe?g|png|webp|gif)(\?|$)/i.test(imageUrl)) return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2_000 || buf.length > 8_000_000) return null;

    let ext = "jpg";
    if (ctype.includes("png") || imageUrl.includes(".png")) ext = "png";
    else if (ctype.includes("webp") || imageUrl.includes(".webp")) ext = "webp";
    else if (ctype.includes("gif")) ext = "gif";

    const dir = mediaDir();
    await fs.mkdir(dir, { recursive: true });
    const hash = createHash("sha1").update(slug).digest("hex").slice(0, 8);
    const filename = `${slug.slice(0, 60)}-${hash}.${ext}`;
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, buf);
    return `/api/media/news/${filename}`;
  } catch {
    return null;
  }
}

/** Prefer OG image from source; optional AI image later. */
export async function resolveNewsCover(args: {
  sourceUrl: string;
  sourceName: string;
  slug: string;
}): Promise<{
  imageSrc: string;
  imageCredit: string;
  imageKind: "source" | "fallback";
} | null> {
  const og = await fetchOpenGraphImage(args.sourceUrl);
  if (og) {
    const local = await downloadNewsImage(og.url, args.slug);
    if (local) {
      return {
        imageSrc: local,
        imageCredit: args.sourceName,
        imageKind: "source",
      };
    }
  }
  return null;
}

export function newsImageAbsolutePath(filename: string) {
  // prevent path traversal
  const safe = path.basename(filename);
  return path.join(mediaDir(), safe);
}
