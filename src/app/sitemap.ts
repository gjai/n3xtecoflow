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
import { FDJ_COMPANION_GAMES } from "@/lib/fdj-games/catalog";
import { companionDrawKey } from "@/lib/fdj-games/keys";
import type { FdjGamesStore } from "@/lib/fdj-games/types";
import { getSiteByHost } from "@/sites";
import {
  siteLocales,
  siteShowsComparisons,
  siteShowsNews,
  siteShowsProducts,
} from "@/sites/features";
import type { SiteConfig, SiteId } from "@/sites/types";

/**
 * Always read volume-backed news / tirages (Coolify `/app/data`).
 * Writes also call `revalidateSitemap()` so crawlers see new URLs immediately.
 */
export const dynamic = "force-dynamic";

/** Archives listées : récentes + FR/EN (les autres locales = fallback EN). */
const SITEMAP_EM_DRAW_DATES = 90;
const SITEMAP_EM_COMPANION_PER_GAME = 40;
const SITEMAP_EM_ARCHIVE_LOCALES = new Set(["fr", "en"]);

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

function loadEuroMillionsDates(): { date: string; lastModified: Date }[] {
  const today = new Date().toISOString().slice(0, 10);
  const candidates = [
    process.env.EUROMILLIONS_DATA_PATH?.trim(),
    join(process.cwd(), "data", "euromillions.json"),
  ].filter(Boolean) as string[];
  for (const file of candidates) {
    try {
      const raw = readFileSync(file, "utf8");
      const store = JSON.parse(raw) as {
        draws?: { date?: string }[];
        nextDrawDate?: string | null;
      };
      const dates = new Set<string>();
      for (const d of store.draws || []) {
        if (d.date) dates.add(d.date);
      }
      if (store.nextDrawDate) dates.add(store.nextDrawDate);
      return [...dates]
        .sort((a, b) => b.localeCompare(a))
        .map((date) => ({
          date,
          lastModified: date > today ? new Date() : new Date(date),
        }));
    } catch {
      /* try next */
    }
  }
  return [];
}

function loadCompanionDrawKeys(): { slug: string; key: string; date: string }[] {
  const candidates = [
    process.env.FDJ_GAMES_DATA_PATH?.trim(),
    join(process.cwd(), "data", "fdj-games.json"),
  ].filter(Boolean) as string[];
  for (const file of candidates) {
    try {
      const raw = readFileSync(file, "utf8");
      const store = JSON.parse(raw) as FdjGamesStore;
      const out: { slug: string; key: string; date: string }[] = [];
      for (const game of FDJ_COMPANION_GAMES) {
        for (const draw of store.games[game.id]?.draws || []) {
          out.push({
            slug: game.slug,
            key: companionDrawKey(draw),
            date: draw.date,
          });
        }
      }
      const sorted = out.sort((a, b) => b.date.localeCompare(a.date));
      const counts = new Map<string, number>();
      const kept: typeof out = [];
      for (const item of sorted) {
        const n = counts.get(item.slug) || 0;
        if (n >= SITEMAP_EM_COMPANION_PER_GAME) continue;
        counts.set(item.slug, n + 1);
        kept.push(item);
      }
      return kept;
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
    ...(siteShowsProducts(site) || site.id === "euromillions"
      ? ["/produits"]
      : []),
    ...(site.id === "ecoflow" ? ["/powerstream"] : []),
    ...(site.id === "euromillions"
      ? [
          "/tirages",
          "/generateur",
          "/prochain-tirage",
          "/jeux",
          "/jeux/eurodreams",
          "/jeux/loto",
          "/jeux/crescendo",
          "/jeux/keno",
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

    if (site.id === "euromillions" && SITEMAP_EM_ARCHIVE_LOCALES.has(locale)) {
      for (const { date, lastModified } of loadEuroMillionsDates().slice(
        0,
        SITEMAP_EM_DRAW_DATES,
      )) {
        entries.push({
          url: `${siteUrl}/${locale}/tirages/${date}`,
          lastModified,
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
      for (const item of loadCompanionDrawKeys()) {
        entries.push({
          url: `${siteUrl}/${locale}/jeux/${item.slug}/${item.key}`,
          lastModified: new Date(item.date),
          changeFrequency: "monthly",
          priority: 0.55,
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
 * powerstream.fr 308 → ecoflow-stream.com (domaine abandonné).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host");
  const site = getSiteByHost(host);
  return buildSitemapForSite(site, loadNewsArticles());
}
