import { NEWS_FEEDS, MAX_NEW_PER_RUN } from "./types";
import { fetchFeedItems, type RssItem } from "./rss";
import { buildArticleFromRss, refreshArticle } from "./rewrite";
import { resolveNewsCover } from "./images";
import { readNewsStore, writeNewsStore } from "./store";

export type IngestOptions = {
  limit?: number;
  /** Backfill covers for every article missing an image (one-shot). */
  backfillImagesAll?: boolean;
  /** Rewrite existing articles as full pieces from source (one-shot). */
  refreshExisting?: boolean;
  /** Force refresh even if bodies are already long (e.g. fix images/URLs). */
  forceRefresh?: boolean;
  /** Max existing articles to refresh in one run. */
  refreshLimit?: number;
};

export type IngestResult = {
  ok: true;
  fetched: number;
  created: number;
  skipped: number;
  backfilled: number;
  refreshed: number;
  slugs: string[];
  refreshedSlugs: string[];
  aiUsed: boolean;
};

export async function ingestNews(
  options?: IngestOptions,
): Promise<IngestResult> {
  const limit = options?.limit ?? MAX_NEW_PER_RUN;
  const store = await readNewsStore();
  const known = new Set(store.articles.map((a) => a.sourceGuid));

  const collected: RssItem[] = [];
  for (const feed of NEWS_FEEDS) {
    try {
      const items = await fetchFeedItems(feed.url);
      collected.push(...items);
    } catch (err) {
      console.error("feed_error", feed.id, err);
    }
  }

  const byGuid = new Map<string, RssItem>();
  for (const item of collected) {
    if (!byGuid.has(item.guid)) byGuid.set(item.guid, item);
  }
  const candidates = [...byGuid.values()]
    .filter((i) => !known.has(i.guid))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);

  const created = [];
  let aiUsed = false;
  for (const item of candidates) {
    const article = await buildArticleFromRss(item);
    if (article.rewrittenBy === "ai") aiUsed = true;
    created.push(article);
  }

  let refreshed = 0;
  const refreshedSlugs: string[] = [];
  if (options?.refreshExisting) {
    const refreshLimit = options.refreshLimit ?? store.articles.length;
    const feedByGuid = byGuid;
    const needsRefresh = (a: (typeof store.articles)[number]) =>
      options.forceRefresh ||
      (a.fr?.body?.length || 0) < 6 ||
      (a.en?.body?.length || 0) < 6 ||
      a.rewrittenBy === "template" ||
      !a.imageSrc ||
      /googleusercontent|gstatic|google-analytics|googletagmanager|\.js$/i.test(
        a.sourceUrl || "",
      );
    const targets = store.articles
      .map((article, index) => ({ article, index }))
      .filter(({ article }) => needsRefresh(article))
      .slice(0, refreshLimit);
    for (const { article, index } of targets) {
      try {
        const feedItem = feedByGuid.get(article.sourceGuid) || null;
        const next = await refreshArticle(article, feedItem);
        if (next.rewrittenBy === "ai") aiUsed = true;
        store.articles[index] = next;
        refreshed += 1;
        refreshedSlugs.push(next.slug);
      } catch (err) {
        console.error("refresh_failed", article.slug, err);
      }
    }
  }

  let backfilled = 0;
  const backfillCap = options?.backfillImagesAll
    ? store.articles.length + created.length
    : 3;
  for (const article of [...created, ...store.articles]) {
    if (backfilled >= backfillCap) break;
    if (article.imageSrc) continue;
    const cover = await resolveNewsCover({
      sourceUrl: article.sourceUrl,
      sourceName: article.sourceName,
      slug: article.slug,
    });
    if (!cover) continue;
    article.imageSrc = cover.imageSrc;
    article.imageCredit = cover.imageCredit;
    article.imageKind = cover.imageKind;
    backfilled += 1;
  }

  if (created.length || backfilled || refreshed) {
    store.articles = [...created, ...store.articles];
    await writeNewsStore(store);
  }

  return {
    ok: true,
    fetched: collected.length,
    created: created.length,
    skipped: Math.max(0, byGuid.size - created.length),
    backfilled,
    refreshed,
    slugs: created.map((a) => a.slug),
    refreshedSlugs,
    aiUsed,
  };
}
