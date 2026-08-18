import { NextResponse } from "next/server";
import {
  facebookMetaStatus,
  notifyFacebookOnPublish,
} from "@/lib/euromillions/facebook";
import { getLatestDraw, readEuroMillionsStore } from "@/lib/euromillions/store";

export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret = process.env.NEWS_CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const query = new URL(request.url).searchParams.get("secret") || "";
  return bearer === secret || query === secret;
}

/** Statut Meta (Facebook + Instagram), ou `?force=1` pour poster le dernier tirage. */
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const notify = url.searchParams.get("notify") === "1";
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  const meta = await facebookMetaStatus();
  if (!force && !notify) {
    return NextResponse.json({
      ...meta,
      latest: latest?.date || null,
      force: false,
    });
  }
  const result = await notifyFacebookOnPublish(latest, { force });
  return NextResponse.json({
    ...meta,
    latest: latest?.date || null,
    ...result,
  });
}

export async function GET(request: Request) {
  return POST(request);
}
