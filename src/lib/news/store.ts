import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { SiteId } from "@/sites/types";
import { pricesToEuroText } from "@/lib/money";
import type { NewsArticle, NewsLocaleCopy, NewsStore } from "./types";
import { MAX_NEWS_ARTICLES, maxNewsPerSite, newsSiteId } from "./types";

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

function sanitizeLocaleCopy(copy: NewsLocaleCopy): NewsLocaleCopy {
  return {
    title: pricesToEuroText(copy.title || ""),
    excerpt: pricesToEuroText(copy.excerpt || ""),
    body: (copy.body || []).map((p) => pricesToEuroText(p)),
  };
}

function sanitizeArticle(article: NewsArticle): NewsArticle {
  return {
    ...article,
    fr: sanitizeLocaleCopy(article.fr),
    en: sanitizeLocaleCopy(article.en),
  };
}

export async function readNewsStore(): Promise<NewsStore> {
  const file = dataPath();
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as NewsStore;
    if (!parsed?.articles || !Array.isArray(parsed.articles)) return SEED;
    return {
      ...parsed,
      articles: parsed.articles.map(sanitizeArticle),
    };
  } catch {
    // Fallback to bundled seed next to source (build-time copy)
    try {
      const bundled = path.join(process.cwd(), "data", "news.json");
      if (bundled !== file) {
        const raw = await fs.readFile(bundled, "utf8");
        const parsed = JSON.parse(raw) as NewsStore;
        return {
          ...parsed,
          articles: (parsed.articles || []).map(sanitizeArticle),
        };
      }
    } catch {
      /* empty */
    }
    return { ...SEED, articles: [] };
  }
}

function capArticlesPerSite(articles: NewsArticle[]): NewsArticle[] {
  const bySite = new Map<SiteId, NewsArticle[]>();
  for (const article of articles) {
    const sid = newsSiteId(article);
    const list = bySite.get(sid) || [];
    list.push(article);
    bySite.set(sid, list);
  }
  const out: NewsArticle[] = [];
  for (const [sid, list] of bySite) {
    list.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    out.push(...list.slice(0, maxNewsPerSite(sid)));
  }
  out.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return out.slice(0, MAX_NEWS_ARTICLES);
}

export async function writeNewsStore(store: NewsStore): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const next: NewsStore = {
    updatedAt: new Date().toISOString(),
    articles: capArticlesPerSite(store.articles.map(sanitizeArticle)),
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
