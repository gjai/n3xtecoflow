import { NextResponse } from "next/server";
import { markCronFail, markCronOk } from "@/lib/cron/status";
import { refreshEuroMillionsData } from "@/lib/euromillions/refresh";

export const maxDuration = 120;

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
    const url = new URL(request.url);
    const yearsRaw = url.searchParams.get("years");
    const years = yearsRaw
      ? yearsRaw
          .split(",")
          .map((y) => Number(y.trim()))
          .filter((n) => Number.isFinite(n) && n >= 2004)
      : undefined;
    const result = await refreshEuroMillionsData({ years });
    await markCronOk("euromillions", `draws=${result.draws}`);
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
