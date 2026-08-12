import { NextResponse } from "next/server";
import {
  normalizeHost,
  normalizePath,
  recordPageview,
} from "@/lib/analytics/store";

export const runtime = "nodejs";

const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|wget|curl|python-requests|httpclient|monitoring|uptime|healthcheck/i;

type Body = {
  path?: string;
  host?: string;
};

async function readBody(request: Request): Promise<Body> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as Body;
  }
  const text = await request.text();
  if (!text) return {};
  return JSON.parse(text) as Body;
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") || "";
  if (BOT_RE.test(ua)) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  let body: Body = {};
  try {
    body = await readBody(request);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const host = normalizeHost(
    body.host ||
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host"),
  );
  const path = normalizePath(body.path);
  if (path.startsWith("/api/")) {
    return NextResponse.json({ ok: true, skipped: "api" });
  }

  await recordPageview({ host, path });
  return NextResponse.json({ ok: true });
}
