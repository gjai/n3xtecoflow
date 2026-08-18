import { NextResponse } from "next/server";
import { unsubscribeAlert } from "@/lib/euromillions/alerts";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const site = await getCurrentSite();
  const origin = `https://${site.primaryHost}`;
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!siteIsEuroMillions(site)) {
    return NextResponse.redirect(`${origin}/`, 302);
  }
  await unsubscribeAlert(token);
  return NextResponse.redirect(`${origin}/fr/alerte-email?status=unsubscribed`, 302);
}
