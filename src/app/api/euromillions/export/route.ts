import { NextResponse } from "next/server";
import { euroMillionsDrawsToCsv } from "@/lib/euromillions/csv";
import { readEuroMillionsStore } from "@/lib/euromillions/store";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const dynamic = "force-dynamic";

export async function GET() {
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const store = await readEuroMillionsStore();
  const csv = euroMillionsDrawsToCsv(store.draws);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="euromillions-archives.csv"',
      "Cache-Control": "public, max-age=300",
    },
  });
}
