import { NextResponse } from "next/server";
import { markCronFail, markCronOk } from "@/lib/cron/status";
import { notifyFacebookOnPublish } from "@/lib/euromillions/facebook";
import { revalidateLotteryPages } from "@/lib/euromillions/live";
import { getLatestDraw, readEuroMillionsStore } from "@/lib/euromillions/store";
import { refreshFdjCompanionGames } from "@/lib/fdj-games/refresh";

export const maxDuration = 180;

function authorized(request: Request) {
  const secret = process.env.NEWS_CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const query = new URL(request.url).searchParams.get("secret") || "";
  return bearer === secret || query === secret;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await refreshFdjCompanionGames();
    revalidateLotteryPages();
    let facebook: Awaited<ReturnType<typeof notifyFacebookOnPublish>> | undefined;
    try {
      const em = await readEuroMillionsStore();
      facebook = await notifyFacebookOnPublish(getLatestDraw(em));
    } catch (err) {
      console.error("facebook_notify_fail", err);
    }
    await markCronOk(
      "fdj-games",
      Object.entries(result.games)
        .map(([id, n]) => `${id}=${n}`)
        .join(","),
    );
    return NextResponse.json({ ...result, facebook });
  } catch (err) {
    console.error(err);
    await markCronFail(
      "fdj-games",
      err instanceof Error ? err.message : "refresh_failed",
    );
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
