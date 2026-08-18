import { NextResponse } from "next/server";
import {
  facebookConfigured,
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

/** Statut, ou `?force=1` pour poster le dernier tirage tout de suite. */
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const force = new URL(request.url).searchParams.get("force") === "1";
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  if (!force) {
    return NextResponse.json({
      configured: facebookConfigured(),
      latest: latest?.date || null,
      force: false,
    });
  }
  const result = await notifyFacebookOnPublish(latest, { force: true });
  return NextResponse.json({
    configured: facebookConfigured(),
    latest: latest?.date || null,
    ...result,
  });
}

export async function GET(request: Request) {
  return POST(request);
}
