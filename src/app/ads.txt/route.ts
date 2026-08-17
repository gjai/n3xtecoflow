import { NextResponse } from "next/server";
import { getSiteByHost } from "@/sites";
import { siteAllowsAdsense } from "@/sites/features";

const ADS_TXT =
  "google.com, pub-4733644127583822, DIRECT, f08c47fec0942fa0\n";

/** Pas d’ads.txt AdSense sur les thèmes sans pubs (ex. casinos-crypto). */
export function GET(request: Request) {
  const host = request.headers.get("host");
  const site = getSiteByHost(host);
  if (!siteAllowsAdsense(site)) {
    return new NextResponse(null, { status: 404 });
  }
  return new NextResponse(ADS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
