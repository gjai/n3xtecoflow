import { NextResponse } from "next/server";
import { markCronFail, markCronOk } from "@/lib/cron/status";
import { notifyFacebookOnPublish } from "@/lib/euromillions/facebook";
import { revalidateLotteryPages } from "@/lib/euromillions/live";
import { getLatestDraw, readEuroMillionsStore } from "@/lib/euromillions/store";
import { refreshFdjCompanionGames } from "@/lib/fdj-games/refresh";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const maxDuration = 180;

export async function POST(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await refreshFdjCompanionGames();
    revalidateLotteryPages();
    try {
      const { notifyCompanionAlertsOnPublish } = await import(
        "@/lib/euromillions/alerts"
      );
      await notifyCompanionAlertsOnPublish();
    } catch (err) {
      console.error("companion_alerts_fail", err);
    }
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
