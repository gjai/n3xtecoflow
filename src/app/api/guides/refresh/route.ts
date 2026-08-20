import { NextResponse } from "next/server";
import { refreshGuides } from "@/lib/guides/refresh";
import { markCronFail, markCronOk } from "@/lib/cron/status";
import { parseSiteIdParam } from "@/sites/copy";
import { cronAuthorized } from "@/lib/http/cron-auth";

export const maxDuration = 300;

export async function POST(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  try {
    const siteId = parseSiteIdParam(url.searchParams.get("siteId"));
    const result = await refreshGuides({
      limit: url.searchParams.get("limit")
        ? Number(url.searchParams.get("limit"))
        : undefined,
      force: url.searchParams.get("force") === "1",
      imagesOnly: url.searchParams.get("imagesOnly") === "1",
      siteId,
    });
    if (result.ok) {
      await markCronOk(
        "guides",
        `refreshed=${result.refreshed};images=${result.images}`,
      );
    } else {
      await markCronFail(
        "guides",
        result.errors?.join("; ") || "guides_ok_false",
      );
    }
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    console.error(err);
    await markCronFail(
      "guides",
      err instanceof Error ? err.message : "refresh_failed",
    );
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
