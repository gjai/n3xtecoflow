import { NextResponse } from "next/server";
import { alertPageLocale, unsubscribeAlert } from "@/lib/euromillions/alerts";
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
  if (isRateLimited(`alert-unsub:${ip}`, { windowMs: 60_000, max: 20 })) {
    return NextResponse.redirect(`${origin}/fr/alerte-email?status=unsubscribed`, 302);
  }
  const result = await unsubscribeAlert(token);
  const loc = alertPageLocale(result.locale);
  return NextResponse.redirect(
    `${origin}/${loc}/alerte-email?status=unsubscribed`,
    302,
  );
}
