import { readFileSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { guides, comparisons } from "@/data/articles";
import { categories, products } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com";

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
  const staticPaths = [
    "",
    "/produits",
    "/powerstream",
    "/guides",
    "/comparatifs",
    "/actualites",
    "/a-propos",
    "/mentions-legales",
    "/contact",
  ];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" || path === "/actualites" ? "daily" : "monthly",
        priority: path === "" ? 1 : path === "/actualites" ? 0.85 : 0.7,
      });
    }

    for (const article of news) {
      entries.push({
        url: `${siteUrl}/${locale}/actualites/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const cat of categories) {
      entries.push({
        url: `${siteUrl}/${locale}/produits/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const product of products) {
      entries.push({
        url: `${siteUrl}/${locale}/produits/${product.category}/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const guide of guides) {
      entries.push({
        url: `${siteUrl}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }

    for (const cmp of comparisons) {
      entries.push({
        url: `${siteUrl}/${locale}/comparatifs/${cmp.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  return entries;
}
