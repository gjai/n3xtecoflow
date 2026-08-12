import { NEWS_FEEDS, MAX_NEW_PER_RUN } from "./types";
import { fetchFeedItems, type RssItem } from "./rss";
import { buildArticleFromRss } from "./rewrite";
import { readNewsStore, writeNewsStore } from "./store";

export type IngestResult = {
  ok: true;
  fetched: number;
  created: number;
  skipped: number;
  slugs: string[];
  aiUsed: boolean;
};

export async function ingestNews(options?: {
  limit?: number;
}): Promise<IngestResult> {
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

  // Prefer freshest unique guids
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

  if (created.length) {
    store.articles = [...created, ...store.articles];
    await writeNewsStore(store);
  }

  return {
    ok: true,
    fetched: collected.length,
    created: created.length,
    skipped: Math.max(0, byGuid.size - created.length),
    slugs: created.map((a) => a.slug),
    aiUsed,
  };
}
