import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { guides, comparisons } from "@/data/articles";
import { categories, products } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const staticPaths = [
    "",
    "/produits",
    "/powerstream",
    "/guides",
    "/comparatifs",
    "/a-propos",
    "/mentions-legales",
    "/confidentialite",
    "/cookies",
    "/affiliation",
    "/contact",
  ];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
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
