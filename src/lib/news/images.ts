import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fetchSourcePage } from "./source";

function mediaDir() {
  return (
    process.env.NEWS_MEDIA_PATH?.trim() ||
    path.join(process.cwd(), "data", "news-images")
  );
}

const UA =
  "EcoFlowStreamBot/1.0 (+https://ecoflow-stream.com; editorial thumbnail)";

export async function downloadNewsImage(
  imageUrl: string,
  slug: string,
): Promise<string | null> {
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
    if (buf.length < 2_000 || buf.length > 8_000_000) return null;

    let ext = "jpg";
    if (ctype.includes("png") || imageUrl.includes(".png")) ext = "png";
    else if (ctype.includes("webp") || imageUrl.includes(".webp")) ext = "webp";
    else if (ctype.includes("gif")) ext = "gif";
    else if (ctype.includes("avif")) ext = "avif";

    const dir = mediaDir();
    await fs.mkdir(dir, { recursive: true });
    const hash = createHash("sha1").update(`${slug}:${imageUrl}`).digest("hex").slice(0, 8);
    const filename = `${slug.slice(0, 50)}-${hash}.${ext}`;
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, buf);
    return `/api/media/news/${filename}`;
  } catch {
    return null;
  }
}

/** Prefer OG / page image from source publisher. */
export async function resolveNewsCover(args: {
  sourceUrl: string;
  sourceName: string;
  slug: string;
  ogImageHint?: string | null;
}): Promise<{
  imageSrc: string;
  imageCredit: string;
  imageKind: "source" | "fallback";
} | null> {
  let imageUrl = args.ogImageHint?.trim() || null;

  if (!imageUrl) {
    const page = await fetchSourcePage(args.sourceUrl);
    imageUrl = page?.ogImage || null;
  }

  if (!imageUrl) return null;

  const local = await downloadNewsImage(imageUrl, args.slug);
  if (!local) return null;

  return {
    imageSrc: local,
    imageCredit: args.sourceName,
    imageKind: "source",
  };
}

export function newsImageAbsolutePath(filename: string) {
  const safe = path.basename(filename);
  return path.join(mediaDir(), safe);
}
