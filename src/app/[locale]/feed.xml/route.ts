import { NextResponse } from "next/server";
import { getSiteByHost } from "@/sites";
import { siteAllowsLocale, siteShowsNews } from "@/sites/features";
import {
  buildNewsRssXml,
  listPublicNews,
  publicFeedPath,
  requestOrigin,
  rssFeedResponse,
} from "@/lib/news/public-feed";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  const site = getSiteByHost(request.headers.get("host"));
  if (!siteShowsNews(site) || !siteAllowsLocale(site, locale)) {
    return new Response(null, { status: 404 });
  }
  const dest = publicFeedPath(locale);
  if (dest !== `/${locale}/feed.xml`) {
    return NextResponse.redirect(new URL(dest, `${requestOrigin(request)}/`), 308);
  }
  const articles = await listPublicNews(site);
  return rssFeedResponse(buildNewsRssXml({ site, locale, articles }));
}
