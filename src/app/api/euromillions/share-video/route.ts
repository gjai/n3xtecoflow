import { NextResponse } from "next/server";
import {
  companionShareCard,
  euroMillionsShareCard,
} from "@/lib/euromillions/share-card";
import { lotteryShareMp4 } from "@/lib/euromillions/share-video";
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
import { clientIp, isRateLimited } from "@/lib/http/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

/** MP4 9:16 animé (Resvg + ffmpeg). Aperçu Reels, pas d’IA. */
export async function GET(request: Request) {
  if (
    isRateLimited(`share-video:${clientIp(request)}`, {
      windowMs: 10 * 60_000,
      max: 16,
    })
  ) {
    return new NextResponse("rate limited", { status: 429 });
  }

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind")?.trim();
  if (kind === "news") {
    const slug = url.searchParams.get("slug")?.trim();
    if (!slug) return new NextResponse("not found", { status: 404 });
    const { readNewsStore } = await import("@/lib/news/store");
    const { newsSiteId } = await import("@/lib/news/types");
    const news = await readNewsStore();
    const article = news.articles.find(
      (a) => a.slug === slug && newsSiteId(a) === "euromillions",
    );
    if (!article?.fr?.title) return new NextResponse("not found", { status: 404 });
    try {
      const { newsShareMp4 } = await import("@/lib/euromillions/share-video");
      const { newsCopyForShare, newsShareFacts } = await import(
        "@/lib/euromillions/share-render"
      );
      const { parisIsoWeekKey } = await import("@/lib/euromillions/datetime");
      const em = await readEuroMillionsStore();
      const weekKey = article.publishedAt
        ? parisIsoWeekKey(new Date(article.publishedAt))
        : parisIsoWeekKey();
      const extraFacts = newsShareFacts([em.latest, ...em.draws], weekKey, {
        date: em.nextDrawDate,
        jackpotEur: em.nextJackpotEur,
      });
      const copy = newsCopyForShare({
        excerpt: article.fr.excerpt,
        body: article.fr.body,
        extraFacts,
      });
      const mp4 = await newsShareMp4(article.fr.title, copy.excerpt, {
        body: copy.body,
        imageSrc: article.imageSrc,
      });
      return new NextResponse(new Uint8Array(mp4), {
        headers: {
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=120, s-maxage=300",
          "Content-Disposition": `inline; filename="actu-${slug}.mp4"`,
        },
      });
    } catch (err) {
      console.error("share_video_news_fail", err);
      return new NextResponse("encode failed", { status: 500 });
    }
  }
  const game = url.searchParams.get("game")?.trim();
  let card;
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
    card = companionShareCard(draw);
  } else {
    const date = url.searchParams.get("date")?.trim();
    const store = await readEuroMillionsStore();
    const draw = date ? getDrawByDate(store, date) : getLatestDraw(store);
    if (!isEuroMillionsDrawPublished(draw) || !draw) {
      return new NextResponse("not found", { status: 404 });
    }
    card = euroMillionsShareCard(draw);
  }

  try {
    const mp4 = await lotteryShareMp4(card);
    return new NextResponse(new Uint8Array(mp4), {
      headers: {
        "Content-Type": "video/mp4",
        "Cache-Control": "public, max-age=120, s-maxage=300",
        "Content-Disposition": `inline; filename="${game === "loto" || game === "eurodreams" ? game : "euromillions"}-reel.mp4"`,
      },
    });
  } catch (err) {
    console.error("share_video_fail", err);
    return new NextResponse("encode failed", { status: 500 });
  }
}
