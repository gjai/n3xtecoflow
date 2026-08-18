import { DATE_LOCALE, usesEnglishFallback } from "@/i18n/locales";
import { isBlockedLotteryNewsSource } from "@/lib/news/rss";
import { getNewsArticles, readNewsStore } from "@/lib/news/store";
import type { NewsArticle } from "@/lib/news/types";
import { siteAllowsLocale, siteIsEuroMillions, siteLocales, siteShowsNews } from "@/sites/features";
import type { SiteConfig } from "@/sites/types";

const FEED_LIMIT = 40;

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function publicFeedPath(locale: string): string {
  return locale === "fr" ? "/feed.xml" : `/${locale}/feed.xml`;
}

export function publicFeedUrl(host: string, locale: string): string {
  return `https://${host}${publicFeedPath(locale)}`;
}

export async function listPublicNews(
  site: SiteConfig,
): Promise<NewsArticle[]> {
  if (!siteShowsNews(site)) return [];
  const store = await readNewsStore();
  return getNewsArticles(store, site.id)
    .filter(
      (a) =>
        !siteIsEuroMillions(site) ||
        !isBlockedLotteryNewsSource({
          sourceName: a.sourceName,
          sourceUrl: a.sourceUrl,
          title: `${a.fr?.title || ""} ${a.en?.title || ""}`,
        }),
    )
    .slice(0, FEED_LIMIT);
}

function articleCopy(article: NewsArticle, locale: string) {
  return usesEnglishFallback(locale) ? article.en : article.fr;
}

function absoluteUrl(host: string, src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("//")) return `https:${src}`;
  if (!src.startsWith("/")) return undefined;
  return `https://${host}${src}`;
}

function rfc822(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function channelCopy(site: SiteConfig, locale: string) {
  const en = usesEnglishFallback(locale);
  const title = en
    ? `${site.brand.name} — News`
    : `${site.brand.name} — Actualités`;
  const description = en
    ? site.brand.taglineEn
    : site.brand.taglineFr;
  return { title, description };
}

export function buildNewsRssXml(args: {
  site: SiteConfig;
  locale: string;
  articles: NewsArticle[];
}): string {
  const { site, locale, articles } = args;
  const host = site.primaryHost;
  const origin = `https://${host}`;
  const self = publicFeedUrl(host, locale);
  const home = `${origin}/${locale}/actualites`;
  const { title, description } = channelCopy(site, locale);
  const lang = (DATE_LOCALE[locale as keyof typeof DATE_LOCALE] || "fr-FR")
    .replace("_", "-")
    .toLowerCase();
  const latest = articles[0]?.publishedAt || new Date().toISOString();
  const extra =
    site.id === "casinos-crypto" || site.id === "euromillions"
      ? enSuffix18(locale)
      : "";

  const items = articles
    .map((article) => {
      const copy = articleCopy(article, locale);
      const url = `${origin}/${locale}/actualites/${article.slug}`;
      const desc = [copy.excerpt, extra].filter(Boolean).join(" ");
      const image = absoluteUrl(host, article.imageSrc);
      const enclosure = image
        ? `\n      <enclosure url="${escapeXml(image)}" type="${enclosureType(image)}" />`
        : "";
      return `    <item>
      <title>${escapeXml(copy.title || article.slug)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${rfc822(article.publishedAt)}</pubDate>
      <description>${escapeXml(desc)}</description>${enclosure}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(home)}</link>
    <description>${escapeXml(description)}</description>
    <language>${escapeXml(lang)}</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function enSuffix18(locale: string): string {
  return usesEnglishFallback(locale)
    ? "18+. Play responsibly."
    : "18+ · Jeu responsable.";
}

function enclosureType(url: string): string {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

export function rssFeedResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}

export function resolveFeedLocale(
  site: SiteConfig,
  requested: string | null | undefined,
): string {
  const fallback = siteLocales(site)[0] || "fr";
  const loc = (requested || "").toLowerCase();
  return loc && siteAllowsLocale(site, loc) ? loc : fallback;
}
