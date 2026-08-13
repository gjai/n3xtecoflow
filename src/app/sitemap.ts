import type { MetadataRoute } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import { headers } from "next/headers";
import {
  categorySiteId,
  getCategoriesForSite,
  getProductsForSite,
  productSiteId,
} from "@/data/products";
import { comparisonHubCategories } from "@/lib/comparisons/hub";
import { GUIDE_TOPICS, guideSiteId } from "@/lib/guides/types";
import { newsSiteId } from "@/lib/news/types";
import { getSiteByHost } from "@/sites";
import {
  siteLocales,
  siteShowsComparisons,
  siteShowsNews,
  siteShowsProducts,
} from "@/sites/features";
import type { SiteConfig, SiteId } from "@/sites/types";

/** Refresh sitemap periodically so ingested news appear without full rebuild. */
export const revalidate = 3600;

function loadNewsArticles(): {
  slug: string;
  publishedAt: string;
  siteId?: SiteId;
}[] {
  const candidates = [
    process.env.NEWS_DATA_PATH?.trim(),
    join(process.cwd(), "data", "news.json"),
  ].filter(Boolean) as string[];

  for (const file of candidates) {
    try {
      const raw = readFileSync(file, "utf8");
      const store = JSON.parse(raw) as {
        articles?: {
          slug: string;
          publishedAt: string;
          siteId?: SiteId;
        }[];
      };
      return store.articles || [];
    } catch {
      /* try next */
    }
  }
  return [];
}

function loadEuroMillionsDates(): string[] {
  const candidates = [
    process.env.EUROMILLIONS_DATA_PATH?.trim(),
    join(process.cwd(), "data", "euromillions.json"),
  ].filter(Boolean) as string[];
  for (const file of candidates) {
    try {
      const raw = readFileSync(file, "utf8");
      const store = JSON.parse(raw) as { draws?: { date?: string }[] };
      return (store.draws || [])
        .map((d) => d.date)
        .filter((d): d is string => Boolean(d));
    } catch {
      /* try next */
    }
  }
  return [];
}

/** Entries for one theme only (canonical primaryHost). */
export function buildSitemapForSite(
  site: SiteConfig,
  news: { slug: string; publishedAt: string; siteId?: SiteId }[],
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const siteUrl = `https://${site.primaryHost}`;
  const cats = getCategoriesForSite(site.id);
  const prods = getProductsForSite(site.id);
  const staticPaths = [
    "",
    ...(siteShowsProducts(site) ? ["/produits"] : []),
    ...(site.id === "ecoflow" ? ["/powerstream"] : []),
    ...(site.id === "euromillions"
      ? [
          "/tirages",
          "/simulateur",
          "/jeux",
          "/jeux/eurodreams",
          "/jeux/loto",
          "/jeux/crescendo",
          "/jeux/keno",
          "/stats",
          "/my-million",
        ]
      : []),
    "/guides",
    ...(siteShowsComparisons(site) ? ["/comparatifs"] : []),
    ...(siteShowsNews(site) ? ["/actualites"] : []),
    "/a-propos",
    "/mentions-legales",
    "/contact",
  ];

  for (const locale of siteLocales(site)) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency:
          path === "" || path === "/actualites" ? "daily" : "monthly",
        priority: path === "" ? 1 : path === "/actualites" ? 0.85 : 0.7,
      });
    }

    if (siteShowsNews(site)) {
      for (const article of news) {
        if (newsSiteId(article) !== site.id) continue;
        entries.push({
          url: `${siteUrl}/${locale}/actualites/${article.slug}`,
          lastModified: new Date(article.publishedAt),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    for (const guide of GUIDE_TOPICS) {
      if (guideSiteId(guide) !== site.id) continue;
      entries.push({
        url: `${siteUrl}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }

    if (site.id === "euromillions") {
      for (const date of loadEuroMillionsDates().slice(0, 400)) {
        entries.push({
          url: `${siteUrl}/${locale}/tirages/${date}`,
          lastModified: new Date(date),
          changeFrequency: "monthly",
          priority: 0.65,
        });
      }
    }

    for (const hub of comparisonHubCategories(site.id)) {
      entries.push({
        url: `${siteUrl}/${locale}/comparatifs/${hub.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }

    for (const cat of cats) {
      if (categorySiteId(cat) !== site.id) continue;
      entries.push({
        url: `${siteUrl}/${locale}/produits/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const product of prods) {
      if (productSiteId(product) !== site.id) continue;
      entries.push({
        url: `${siteUrl}/${locale}/produits/${product.category}/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}

/**
 * Sitemap du Host courant uniquement (tous thèmes actuels + futurs).
 * powerstream.fr → URLs canoniques ecoflow-stream.com (même thème).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host");
  const site = getSiteByHost(host);
  return buildSitemapForSite(site, loadNewsArticles());
}
