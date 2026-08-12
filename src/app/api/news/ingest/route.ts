import { NextResponse } from "next/server";
import { ingestNews, type IngestOptions } from "@/lib/news/ingest";
import { markCronFail, markCronOk } from "@/lib/cron/status";

export const maxDuration = 300;

function authorized(request: Request) {
  const secret = process.env.NEWS_CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const query = new URL(request.url).searchParams.get("secret") || "";
  return bearer === secret || query === secret;
}

function parseOptions(request: Request): IngestOptions {
  const url = new URL(request.url);
  const refreshExisting =
    url.searchParams.get("refresh") === "1" ||
    url.searchParams.get("refreshExisting") === "1";
  const forceRefresh = url.searchParams.get("forceRefresh") === "1";
  const backfillImagesAll =
    url.searchParams.get("backfillImages") === "1" ||
    url.searchParams.get("backfillImagesAll") === "1";
  const fixJunkImages =
    url.searchParams.get("fixJunkImages") === "1" ||
    url.searchParams.get("fixImages") === "1";
  const refreshLimitRaw = url.searchParams.get("refreshLimit");
  const refreshOffsetRaw = url.searchParams.get("refreshOffset");
  const limitRaw = url.searchParams.get("limit");
  return {
    refreshExisting,
    forceRefresh,
    backfillImagesAll,
    fixJunkImages,
    refreshLimit: refreshLimitRaw ? Number(refreshLimitRaw) : undefined,
    refreshOffset: refreshOffsetRaw ? Number(refreshOffsetRaw) : undefined,
    limit: limitRaw ? Number(limitRaw) : undefined,
  };
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    let options = parseOptions(request);
    try {
      const body = (await request.json()) as IngestOptions;
      options = { ...options, ...body };
    } catch {
      /* no JSON body */
    }
    const result = await ingestNews(options);
    const ok =
      result &&
      typeof result === "object" &&
      (!("ok" in result) || (result as { ok?: boolean }).ok !== false);
    if (ok) {
      const created =
        result && typeof result === "object" && "created" in result
          ? String((result as { created?: number }).created ?? "?")
          : "?";
      await markCronOk("news", `created=${created}`);
    } else {
      await markCronFail("news", "ingest_ok_false");
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    await markCronFail(
      "news",
      err instanceof Error ? err.message : "ingest_failed",
    );
    return NextResponse.json({ error: "ingest_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
