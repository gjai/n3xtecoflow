import { NextResponse } from "next/server";
import {
  SHARE_FEED,
  SHARE_IG_FEED,
  SHARE_STORY,
  companionShareCard,
  euroMillionsShareCard,
  lotteryShareImageResponse,
  newsShareImageResponse,
} from "@/lib/euromillions/share-card";
import {
  getDrawByDate,
  getLatestDraw,
  isEuroMillionsDrawPublished,
  readEuroMillionsStore,
} from "@/lib/euromillions/store";
import {
  getDrawByKey,
  getGameLatest,
  readFdjGamesStore,
} from "@/lib/fdj-games/store";
import type { FdjCompanionGameId } from "@/lib/fdj-games/types";
import { getNewsBySlug, readNewsStore } from "@/lib/news/store";

export const dynamic = "force-dynamic";

async function asJpeg(image: Response) {
  const sharp = (await import("sharp")).default;
  const jpg = await sharp(Buffer.from(await image.arrayBuffer()))
    .toColorspace("srgb")
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toBuffer();
  return new NextResponse(jpg, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=120, s-maxage=300",
    },
  });
}

function sizeOf(format: string | null) {
  if (format === "story") return SHARE_STORY;
  if (format === "ig" || format === "instagram") return SHARE_IG_FEED;
  return SHARE_FEED;
}

/** PNG/JPEG des cartes tirage et actus — Facebook, Instagram, Open Graph. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const fmt = url.searchParams.get("fmt");
  const size = sizeOf(format);
  const kind = url.searchParams.get("kind")?.trim();
  let image: Response | null = null;

  if (kind === "news") {
    const slug = url.searchParams.get("slug")?.trim();
    if (!slug) return new NextResponse("not found", { status: 404 });
    const store = await readNewsStore();
    const article = getNewsBySlug(slug, store, "euromillions");
    if (!article?.fr?.title) return new NextResponse("not found", { status: 404 });
    image = newsShareImageResponse(
      article.fr.title,
      article.fr.excerpt || "",
      size,
    );
  } else {
    const game = url.searchParams.get("game")?.trim();
    if (game === "loto" || game === "eurodreams") {
      const fdj = await readFdjGamesStore();
      const key = url.searchParams.get("key")?.trim();
      const draw = key
        ? getDrawByKey(fdj, game as FdjCompanionGameId, key)
        : getGameLatest(fdj, game as FdjCompanionGameId);
      if (!draw) return new NextResponse("not found", { status: 404 });
      image = lotteryShareImageResponse(companionShareCard(draw), size);
    } else {
      const date = url.searchParams.get("date")?.trim();
      const store = await readEuroMillionsStore();
      const draw = date ? getDrawByDate(store, date) : getLatestDraw(store);
      if (!isEuroMillionsDrawPublished(draw) || !draw) {
        return new NextResponse("not found", { status: 404 });
      }
      image = lotteryShareImageResponse(euroMillionsShareCard(draw), size);
    }
  }

  if (fmt === "jpg" || fmt === "jpeg") return asJpeg(image);
  return image;
}
