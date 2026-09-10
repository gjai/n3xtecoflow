import { NextResponse } from "next/server";
import {
  facebookMetaStatus,
  facebookPublishSnapshot,
  notifyFacebookOnPublish,
  notifyWeeklyNewsShort,
  SOCIAL_DRAW_GAMES,
} from "@/lib/euromillions/facebook";
import { youtubeConfigured } from "@/lib/euromillions/youtube";
import { tiktokConfigured } from "@/lib/euromillions/tiktok";
import { getLatestDraw, readEuroMillionsStore } from "@/lib/euromillions/store";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 360;

/** Statut Meta, `?force=1` dernier tirage, `?game=euromillions`, `?newsShort=1` Short histoire horaire. */
export async function POST(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const notify = url.searchParams.get("notify") === "1";
  const newsShort = url.searchParams.get("newsShort") === "1";
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
  if (newsShort) {
    const result = await notifyWeeklyNewsShort({ force });
    const after = await facebookPublishSnapshot();
    return NextResponse.json({
      ...meta,
      ...after,
      youtube: youtubeConfigured(),
      tiktok: tiktokConfigured(),
      latest: latest?.date || null,
      ...result,
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
  const after = await facebookPublishSnapshot();
  return NextResponse.json({
    ...meta,
    ...after,
    youtube: youtubeConfigured(),
    tiktok: tiktokConfigured(),
    latest: latest?.date || null,
    ...result,
  });
}

export async function GET(request: Request) {
  return POST(request);
}
