import { NextResponse } from "next/server";
import { refreshAmazonPrices } from "@/lib/amazon/refresh";

export const maxDuration = 300;

function authorized(request: Request) {
  const secret =
    process.env.AMAZON_CRON_SECRET?.trim() ||
    process.env.NEWS_CRON_SECRET?.trim();
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
  const limitRaw = url.searchParams.get("limit");
  const forceSearch = url.searchParams.get("forceSearch") === "1";

  try {
    const result = await refreshAmazonPrices({
      limit: limitRaw ? Number(limitRaw) : undefined,
      forceSearch,
    });
    return NextResponse.json(result, {
      status: result.skipped ? 503 : result.ok ? 200 : 502,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
