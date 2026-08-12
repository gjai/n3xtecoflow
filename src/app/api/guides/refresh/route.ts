import { NextResponse } from "next/server";
import { refreshGuides } from "@/lib/guides/refresh";

export const maxDuration = 300;

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
  const url = new URL(request.url);
  try {
    const result = await refreshGuides({
      limit: url.searchParams.get("limit")
        ? Number(url.searchParams.get("limit"))
        : undefined,
      force: url.searchParams.get("force") === "1",
      imagesOnly: url.searchParams.get("imagesOnly") === "1",
    });
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
