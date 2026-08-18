import { getSiteByHost } from "@/sites";
import { siteShowsNews } from "@/sites/features";
import {
  buildNewsRssXml,
  listPublicNews,
  resolveFeedLocale,
  rssFeedResponse,
} from "@/lib/news/public-feed";

export const dynamic = "force-dynamic";

/** Flux RSS du Host courant (défaut FR). `?hl=en` pour la version anglaise. */
export async function GET(request: Request) {
  const site = getSiteByHost(request.headers.get("host"));
  if (!siteShowsNews(site)) {
    return new Response(null, { status: 404 });
  }
  const hl = new URL(request.url).searchParams.get("hl");
  const locale = resolveFeedLocale(site, hl);
  const articles = await listPublicNews(site);
  return rssFeedResponse(buildNewsRssXml({ site, locale, articles }));
}
