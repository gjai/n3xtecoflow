import { after as runAfter, NextResponse } from "next/server";
import {
  facebookMetaStatus,
  facebookPublishSnapshot,
  notifyFacebookOnPublish,
  notifyJackpotBuys,
  notifyWeeklyNewsShort,
  SOCIAL_DRAW_GAMES,
} from "@/lib/euromillions/facebook";
import { youtubeConfigured } from "@/lib/euromillions/youtube";
import { tiktokConfigured } from "@/lib/euromillions/tiktok";
import { getLatestDraw, readEuroMillionsStore } from "@/lib/euromillions/store";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 600;

/** Statut Meta, `?force=1` dernier tirage, `?newsShort=1` histoire, `?jackpotBuys=1` Ticket gagnant. */
export async function POST(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const notify = url.searchParams.get("notify") === "1";
  const newsShort = url.searchParams.get("newsShort") === "1";
  const jackpotBuys = url.searchParams.get("jackpotBuys") === "1";
  const gameRaw = url.searchParams.get("game")?.trim();
  const games = SOCIAL_DRAW_GAMES.includes(
    gameRaw as (typeof SOCIAL_DRAW_GAMES)[number],
  )
    ? [gameRaw as (typeof SOCIAL_DRAW_GAMES)[number]]
    : undefined;
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  const [meta, snapshot] = await Promise.all([
    facebookMetaStatus(),
    facebookPublishSnapshot(),
  ]);
  if (jackpotBuys) {
    runAfter(async () => {
      try {
        const result = await notifyJackpotBuys({ force });
        console.error(
          "jackpot_buys_done",
          result.skipped?.jackpotBuys,
          "fb",
          result.reels,
          "ig",
          result.instagramReels,
          "yt",
          result.youtubeShorts,
          "tt",
          result.tiktokPosts,
        );
      } catch (err) {
        console.error(
          "jackpot_buys_fail",
          err instanceof Error ? err.message : err,
        );
      }
    });
    return NextResponse.json({
      ok: true,
      accepted: true,
      jackpotBuys: true,
      force,
      youtube: youtubeConfigured(),
      tiktok: tiktokConfigured(),
    });
  }
  if (newsShort) {
    runAfter(async () => {
      try {
        const result = await notifyWeeklyNewsShort({ force });
        console.error(
          "news_short_done",
          result.skipped?.newsShort,
          "fb",
          result.reels,
          "ig",
          result.instagramReels,
          "yt",
          result.youtubeShorts,
          "tt",
          result.tiktokPosts,
        );
      } catch (err) {
        console.error(
          "news_short_fail",
          err instanceof Error ? err.message : err,
        );
      }
    });
    return NextResponse.json({
      ok: true,
      accepted: true,
      newsShort: true,
      force,
      youtube: youtubeConfigured(),
      tiktok: tiktokConfigured(),
    });
  }
  if (!force && !notify) {
    return NextResponse.json({
      ...meta,
      ...snapshot,
      youtube: youtubeConfigured(),
      tiktok: tiktokConfigured(),
      latest: latest?.date || null,
      force: false,
    });
  }
  const result = await notifyFacebookOnPublish(latest, { force, games });
  const afterSnap = await facebookPublishSnapshot();
  return NextResponse.json({
    ...meta,
    ...afterSnap,
    youtube: youtubeConfigured(),
    tiktok: tiktokConfigured(),
    latest: latest?.date || null,
    ...result,
  });
}

export async function GET(request: Request) {
  return POST(request);
}
