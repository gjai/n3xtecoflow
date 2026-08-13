import { NextResponse } from "next/server";
import { euroMillionsDrawCalendarIcs } from "@/lib/euromillions/calendar";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const dynamic = "force-dynamic";

export async function GET() {
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const ics = euroMillionsDrawCalendarIcs(`https://${site.primaryHost}`);
  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="euromillions-tirages.ics"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
