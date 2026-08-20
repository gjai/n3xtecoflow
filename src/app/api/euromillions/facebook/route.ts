import { NextResponse } from "next/server";
import {
  facebookMetaStatus,
  facebookPublishSnapshot,
  notifyFacebookOnPublish,
} from "@/lib/euromillions/facebook";
import { getLatestDraw, readEuroMillionsStore } from "@/lib/euromillions/store";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

/** Statut Meta (Facebook + Instagram), ou `?force=1` pour poster le dernier tirage. */
export async function POST(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const notify = url.searchParams.get("notify") === "1";
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  const [meta, snapshot] = await Promise.all([
    facebookMetaStatus(),
    facebookPublishSnapshot(),
  ]);
  if (!force && !notify) {
    return NextResponse.json({
      ...meta,
      ...snapshot,
      latest: latest?.date || null,
      force: false,
    });
  }
  const result = await notifyFacebookOnPublish(latest, { force });
  const after = await facebookPublishSnapshot();
  return NextResponse.json({
    ...meta,
    ...after,
    latest: latest?.date || null,
    ...result,
  });
}

export async function GET(request: Request) {
  return POST(request);
}
