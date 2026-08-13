import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function hasCssChunks() {
  try {
    const dir = path.join(process.cwd(), ".next/static/chunks");
    const files = await readdir(dir);
    return files.some((f) => f.endsWith(".css"));
  } catch {
    return false;
  }
}

export async function GET() {
  const css = await hasCssChunks();
  if (!css) {
    return NextResponse.json(
      { ok: false, service: "n3xtecoflow", error: "css_missing" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(
    {
      ok: true,
      service: "n3xtecoflow",
      ts: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
