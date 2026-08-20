import { NextResponse } from "next/server";
import { refreshEcoflowCatalog } from "@/lib/ecoflow/refresh";
import { refreshEcoflowEditorial } from "@/lib/ecoflow/editorial-refresh";
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
  const limit = limitRaw ? Number(limitRaw) : undefined;
  const withEditorial = url.searchParams.get("editorial") !== "0";
  const forceEditorial = url.searchParams.get("forceEditorial") === "1";

  try {
    const catalog = await refreshEcoflowCatalog({ limit });
    const editorial = withEditorial
      ? await refreshEcoflowEditorial({ limit, force: forceEditorial })
      : { skipped: true as const };
    if (catalog.ok) {
      await markCronOk("catalog", "ok");
    } else {
      await markCronFail("catalog", "catalog_ok_false");
    }
    return NextResponse.json(
      { catalog, editorial },
      { status: catalog.ok ? 200 : 502 },
    );
  } catch (err) {
    console.error(err);
    await markCronFail(
      "catalog",
      err instanceof Error ? err.message : "refresh_failed",
    );
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
