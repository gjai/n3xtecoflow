import { NextResponse } from "next/server";
import { markCronFail, markCronOk } from "@/lib/cron/status";
import { withLotteryRefreshLock } from "@/lib/euromillions/live";
import { refreshEuroMillionsData } from "@/lib/euromillions/refresh";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const maxDuration = 180;

export async function POST(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const yearsRaw = url.searchParams.get("years");
    const years = yearsRaw
      ? yearsRaw
          .split(",")
          .map((y) => Number(y.trim()))
          .filter((n) => Number.isFinite(n) && n >= 2004)
      : undefined;
    const mode = url.searchParams.get("mode") === "fast" ? "fast" : "full";
    const locked = await withLotteryRefreshLock(
      () => refreshEuroMillionsData({ years, mode }),
      { ignoreThrottle: mode === "full" },
    );
    if (!locked.ok) {
      return NextResponse.json(
        { ok: false, skipped: locked.reason, mode },
        { status: 202 },
      );
    }
    const result = locked.value;
    await markCronOk(
      "euromillions",
      `mode=${result.mode} draws=${result.draws} changed=${result.changed}`,
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    await markCronFail(
      "euromillions",
      err instanceof Error ? err.message : "refresh_failed",
    );
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
