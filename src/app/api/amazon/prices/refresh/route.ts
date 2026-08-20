import { NextResponse } from "next/server";
import { refreshAmazonPrices } from "@/lib/amazon/refresh";
import { markCronFail, markCronOk } from "@/lib/cron/status";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const maxDuration = 300;

export async function POST(request: Request) {
  if (
    !cronAuthorized(
      request,
      process.env.AMAZON_CRON_SECRET || process.env.NEWS_CRON_SECRET,
    )
  ) {
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
    if (result.skipped) {
      await markCronOk("amazon", result.reason || "skipped");
    } else if (result.ok) {
      await markCronOk("amazon", `refreshed=${result.refreshed}`);
    } else {
      await markCronFail(
        "amazon",
        result.errors?.join("; ") || "amazon_ok_false",
      );
    }
    return NextResponse.json(result, {
      status: result.skipped ? 503 : result.ok ? 200 : 502,
    });
  } catch (err) {
    console.error(err);
    await markCronFail(
      "amazon",
      err instanceof Error ? err.message : "refresh_failed",
    );
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
