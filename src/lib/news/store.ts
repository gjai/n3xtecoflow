import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { SiteId } from "@/sites/types";
import type { NewsArticle, NewsStore } from "./types";
import { MAX_NEWS_ARTICLES, newsSiteId } from "./types";


const SEED: NewsStore = {
  updatedAt: new Date().toISOString(),
  articles: [],
};

function dataPath() {
  return (
    process.env.NEWS_DATA_PATH?.trim() ||
    path.join(process.cwd(), "data", "news.json")
  );
}

export async function readNewsStore(): Promise<NewsStore> {
  const file = dataPath();
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as NewsStore;
    if (!parsed?.articles || !Array.isArray(parsed.articles)) return SEED;
    return parsed;
  } catch {
    // Fallback to bundled seed next to source (build-time copy)
    try {
      const bundled = path.join(process.cwd(), "data", "news.json");
      if (bundled !== file) {
        const raw = await fs.readFile(bundled, "utf8");
        return JSON.parse(raw) as NewsStore;
      }
    } catch {
      /* empty */
    }
    return { ...SEED, articles: [] };
  }
}

export async function writeNewsStore(store: NewsStore): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const next: NewsStore = {
    updatedAt: new Date().toISOString(),
    articles: store.articles.slice(0, MAX_NEWS_ARTICLES),
  };
  await fs.writeFile(file, JSON.stringify(next, null, 2) + "\n", "utf8");
}

export function getNewsArticles(
  store?: NewsStore,
  siteId?: SiteId,
): NewsArticle[] {
  const all = (store?.articles || []).slice().sort((a, b) => {
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
  if (!siteId) return all;
  return all.filter((a) => newsSiteId(a) === siteId);
}

export function getNewsBySlug(
  slug: string,
  store?: NewsStore,
  siteId?: SiteId,
): NewsArticle | undefined {
  return getNewsArticles(store, siteId).find((a) => a.slug === slug);
}


export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function makeSlug(title: string, publishedAt: string, guid: string) {
  const day = publishedAt.slice(0, 10);
  const base = slugify(title) || "actu-ecoflow";
  const short = createHash("sha1").update(guid).digest("hex").slice(0, 6);
  return `${day}-${base}-${short}`;
}

export function hashGuid(guid: string) {
  return createHash("sha1").update(guid).digest("hex");
}
