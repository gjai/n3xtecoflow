import { NextResponse } from "next/server";
import { alertPageLocale, confirmAlert } from "@/lib/euromillions/alerts";
import { clientIp, isRateLimited } from "@/lib/http/rate-limit";
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
  const ip = clientIp(request);
  if (isRateLimited(`alert-confirm:${ip}`, { windowMs: 60_000, max: 20 })) {
    return NextResponse.redirect(`${origin}/fr/alerte-email?status=confirm_error`, 302);
  }
  const result = await confirmAlert(token);
  const loc = alertPageLocale(result.locale);
  const dest = `${origin}/${loc}/alerte-email?status=${result.ok ? "confirmed" : "confirm_error"}`;
  return NextResponse.redirect(dest, 302);
}
