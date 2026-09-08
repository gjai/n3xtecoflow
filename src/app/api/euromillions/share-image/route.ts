import { NextResponse } from "next/server";
import {
  SHARE_FEED,
  SHARE_IG_FEED,
  SHARE_STORY,
  companionShareCard,
  euroMillionsShareCard,
} from "@/lib/euromillions/share-card";
import {
  lotteryShareJpeg,
  lotterySharePng,
  newsShareJpeg,
  newsSharePng,
} from "@/lib/euromillions/share-render";
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

function sizeOf(format: string | null) {
  if (format === "story") return SHARE_STORY;
  if (format === "ig" || format === "instagram") return SHARE_IG_FEED;
  return SHARE_FEED;
}

function pngResponse(bytes: Uint8Array) {
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=120, s-maxage=300",
    },
  });
}

function jpegResponse(bytes: Buffer) {
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=120, s-maxage=300",
    },
  });
}

/** PNG/JPEG des cartes tirage et actus — Facebook, Instagram, Open Graph. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const fmt = url.searchParams.get("fmt");
  const jpeg = fmt === "jpg" || fmt === "jpeg";
  const size = sizeOf(format);
  const kind = url.searchParams.get("kind")?.trim();

  if (kind === "news") {
    const slug = url.searchParams.get("slug")?.trim();
    if (!slug) return new NextResponse("not found", { status: 404 });
    const store = await readNewsStore();
    const article = getNewsBySlug(slug, store, "euromillions");
    if (!article?.fr?.title) return new NextResponse("not found", { status: 404 });
    const title = article.fr.title;
    const excerpt = article.fr.excerpt || "";
    if (jpeg) return jpegResponse(await newsShareJpeg(title, excerpt, size));
    return pngResponse(await newsSharePng(title, excerpt, size));
  }

  const game = url.searchParams.get("game")?.trim();
  if (
    game === "loto" ||
    game === "eurodreams" ||
    game === "keno" ||
    game === "crescendo"
  ) {
    const fdj = await readFdjGamesStore();
    const key = url.searchParams.get("key")?.trim();
    const draw = key
      ? getDrawByKey(fdj, game as FdjCompanionGameId, key)
      : getGameLatest(fdj, game as FdjCompanionGameId);
    if (!draw) return new NextResponse("not found", { status: 404 });
    const card = companionShareCard(draw);
    if (jpeg) return jpegResponse(await lotteryShareJpeg(card, size));
    return pngResponse(await lotterySharePng(card, size));
  }

  const date = url.searchParams.get("date")?.trim();
  const store = await readEuroMillionsStore();
  const draw = date ? getDrawByDate(store, date) : getLatestDraw(store);
  if (!isEuroMillionsDrawPublished(draw) || !draw) {
    return new NextResponse("not found", { status: 404 });
  }
  const card = euroMillionsShareCard(draw);
  if (jpeg) return jpegResponse(await lotteryShareJpeg(card, size));
  return pngResponse(await lotterySharePng(card, size));
}
