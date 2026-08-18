import { NextResponse } from "next/server";
import { euroMillionsShareImageResponse } from "@/lib/euromillions/share-card";
import {
  getDrawByDate,
  getLatestDraw,
  isEuroMillionsDrawPublished,
  readEuroMillionsStore,
} from "@/lib/euromillions/store";

export const dynamic = "force-dynamic";

/** PNG 1200×630 des boules — aperçu Facebook / Open Graph. */
export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date")?.trim();
  const store = await readEuroMillionsStore();
  const draw = date ? getDrawByDate(store, date) : getLatestDraw(store);
  if (!isEuroMillionsDrawPublished(draw) || !draw) {
    return new NextResponse("not found", { status: 404 });
  }
  return euroMillionsShareImageResponse(draw);
}
