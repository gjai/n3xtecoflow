import { NextResponse } from "next/server";
import { refreshEcoflowCatalog } from "@/lib/ecoflow/refresh";
import { refreshEcoflowEditorial } from "@/lib/ecoflow/editorial-refresh";

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
  const limit = limitRaw ? Number(limitRaw) : undefined;
  const withEditorial = url.searchParams.get("editorial") !== "0";
  const forceEditorial = url.searchParams.get("forceEditorial") === "1";

  try {
    const catalog = await refreshEcoflowCatalog({ limit });
    const editorial = withEditorial
      ? await refreshEcoflowEditorial({ limit, force: forceEditorial })
      : { skipped: true as const };
    return NextResponse.json(
      { catalog, editorial },
      { status: catalog.ok ? 200 : 502 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
