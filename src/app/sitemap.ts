import { readFileSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  categorySiteId,
  getCategoriesForSite,
  getProductsForSite,
  productSiteId,
} from "@/data/products";
import { comparisonHubCategories } from "@/lib/comparisons/hub";
import { GUIDE_TOPICS } from "@/lib/guides/types";
import { sites } from "@/sites";

/** Refresh sitemap periodically so ingested news appear without full rebuild. */
export const revalidate = 3600;

function loadNewsSlugs(): { slug: string; publishedAt: string }[] {
  const candidates = [
    process.env.NEWS_DATA_PATH?.trim(),
    join(process.cwd(), "data", "news.json"),
  ].filter(Boolean) as string[];

  for (const file of candidates) {
    try {
      const raw = readFileSync(file, "utf8");
      const store = JSON.parse(raw) as {
        articles?: { slug: string; publishedAt: string }[];
      };
      return store.articles || [];
    } catch {
      /* try next */
    }
  }
  return [];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const news = loadNewsSlugs();

  for (const site of sites) {
    const siteUrl = `https://${site.primaryHost}`;
    const cats = getCategoriesForSite(site.id);
    const prods = getProductsForSite(site.id);
    const staticPaths =
      site.id === "ecoflow"
        ? [
            "",
            "/produits",
            "/powerstream",
            "/guides",
            "/comparatifs",
            "/actualites",
            "/a-propos",
            "/mentions-legales",
            "/contact",
          ]
        : ["", "/produits", "/a-propos", "/mentions-legales", "/contact"];

    for (const locale of routing.locales) {
      for (const path of staticPaths) {
        entries.push({
          url: `${siteUrl}/${locale}${path}`,
          lastModified: new Date(),
          changeFrequency:
            path === "" || path === "/actualites" ? "daily" : "monthly",
          priority: path === "" ? 1 : path === "/actualites" ? 0.85 : 0.7,
        });
      }

      if (site.id === "ecoflow") {
        for (const article of news) {
          entries.push({
            url: `${siteUrl}/${locale}/actualites/${article.slug}`,
            lastModified: new Date(article.publishedAt),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
        for (const guide of GUIDE_TOPICS) {
          entries.push({
            url: `${siteUrl}/${locale}/guides/${guide.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.75,
          });
        }
        for (const hub of comparisonHubCategories()) {
          entries.push({
            url: `${siteUrl}/${locale}/comparatifs/${hub.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.75,
          });
        }
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
  }

  return entries;
}
