import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { guideImageAbsolutePath } from "@/lib/guides/images";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;
  const abs = guideImageAbsolutePath(file);
  try {
    const data = await fs.readFile(abs);
    const lower = file.toLowerCase();
    const type = lower.endsWith(".png")
      ? "image/png"
      : lower.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";
    return new NextResponse(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
