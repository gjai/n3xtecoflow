import type { SiteId } from "@/sites/types";
import { NEWS_FEEDS, maxNewPerSiteRun, newsSiteId } from "./types";
import { fetchFeedItems, isBlockedLotteryNewsSource, isOnTopicArticle, type RssItem } from "./rss";
import { buildArticleFromRss, refreshArticle } from "./rewrite";
import { isStoredNewsImageJunk, resolveNewsCover } from "./images";
import {
  pruneLowQualityNewsArticles,
  rankNewsCandidates,
} from "./quality";
import { readNewsStore, writeNewsStore } from "./store";
import { revalidateSitemap } from "@/lib/euromillions/live";
import { revalidatePath } from "next/cache";

export type IngestOptions = {
  limit?: number;
  /** Backfill covers for every article missing an image (one-shot). */
  backfillImagesAll?: boolean;
  /** Replace Google News logos / junk thumbs with real or AI covers. */
  fixJunkImages?: boolean;
  /** Rewrite existing articles as full pieces from source (one-shot). */
  refreshExisting?: boolean;
  /** Force refresh even if bodies are already long (e.g. fix images/URLs). */
  forceRefresh?: boolean;
  /** Max existing articles to refresh in one run. */
  refreshLimit?: number;
  /** Skip first N refresh candidates (batching). */
  refreshOffset?: number;
  /** Only ingest feeds for this site (default: all). */
  siteId?: SiteId;
};

export type IngestResult = {
  ok: true;
  fetched: number;
  created: number;
  skipped: number;
  rejected: number;
  purged: number;
  backfilled: number;
  refreshed: number;
  slugs: string[];
  refreshedSlugs: string[];
  purgedSlugs: string[];
  aiUsed: boolean;
};

function articleOnTopic(article: {
  siteId?: SiteId;
  slug?: string;
  sourceName?: string;
  sourceUrl?: string;
  fr?: { title?: string; excerpt?: string };
  en?: { title?: string; excerpt?: string };
}) {
  if (
    newsSiteId(article) === "euromillions" &&
    isBlockedLotteryNewsSource({
      sourceName: article.sourceName,
      sourceUrl: article.sourceUrl,
      title: `${article.fr?.title || ""} ${article.en?.title || ""}`,
    })
  ) {
    return false;
  }
  return isOnTopicArticle(
    {
      titleFr: article.fr?.title,
      titleEn: article.en?.title,
      excerptFr: `${article.fr?.excerpt || ""} ${article.slug || ""}`,
      excerptEn: article.en?.excerpt,
      sourceTitle: article.slug,
    },
    newsSiteId(article),
  );
}

export async function ingestNews(
  options?: IngestOptions,
): Promise<IngestResult> {
  const limit = options?.limit ?? maxNewPerSiteRun(options?.siteId);
  const store = await readNewsStore();
  const known = new Set(store.articles.map((a) => a.sourceGuid));

  type Collected = RssItem & { siteId: SiteId };
  const collected: Collected[] = [];
  const feeds = options?.siteId
    ? NEWS_FEEDS.filter((f) => f.siteId === options.siteId)
    : NEWS_FEEDS;

  for (const feed of feeds) {
    try {
      const items = await fetchFeedItems(feed.url, feed.siteId);
      for (const item of items) {
        collected.push({ ...item, siteId: feed.siteId });
      }
    } catch (err) {
      console.error("feed_error", feed.id, err);
    }
  }

  const byGuid = new Map<string, Collected>();
  for (const item of collected) {
    if (!byGuid.has(item.guid)) byGuid.set(item.guid, item);
  }

  // Balanced intake per theme (anti-promo / anti-doublons / diversité marques).
  // Avoid starving casinos-crypto / tumbler when ecoflow RSS is fresher.
  const bySite = new Map<SiteId, Collected[]>();
  for (const item of byGuid.values()) {
    if (known.has(item.guid)) continue;
    const list = bySite.get(item.siteId) || [];
    list.push(item);
    bySite.set(item.siteId, list);
  }
  const siteIds = [...bySite.keys()];
  const basePerSite =
    siteIds.length > 0
      ? Math.max(1, Math.floor(limit / siteIds.length))
      : limit;
  let bonusSlots = siteIds.length > 0 ? limit - basePerSite * siteIds.length : 0;

  const selected: Collected[] = [];
  const overflow: Collected[] = [];
  for (const siteId of siteIds) {
    const list = bySite.get(siteId) || [];
    const existingTitles = store.articles
      .filter((a) => newsSiteId(a) === siteId)
      .map((a) => a.fr?.title || a.en?.title || "");
    const take = basePerSite + (bonusSlots > 0 ? 1 : 0);
    if (bonusSlots > 0) bonusSlots -= 1;
    const ranked = rankNewsCandidates(
      list.map((item) => ({
        ...item,
        siteId,
        description: item.description,
      })),
      existingTitles,
      Math.max(take + 2, take),
    );
    selected.push(...ranked.slice(0, take));
    overflow.push(...ranked.slice(take));
  }
  if (selected.length < limit && overflow.length) {
    overflow.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    selected.push(...overflow.slice(0, limit - selected.length));
  }

  const created = [];
  let rejected = 0;
  let aiUsed = false;
  for (const item of selected) {
    const article = await buildArticleFromRss(item, { siteId: item.siteId });
    if (!article) {
      rejected += 1;
      continue;
    }
    if (article.rewrittenBy === "ai") aiUsed = true;
    created.push(article);
  }

  let refreshed = 0;
  const refreshedSlugs: string[] = [];
  if (options?.refreshExisting) {
    const refreshLimit = options.refreshLimit ?? store.articles.length;
    const refreshOffset = options.refreshOffset ?? 0;
    const feedByGuid = byGuid;
    const needsRefresh = (a: (typeof store.articles)[number]) =>
      options.forceRefresh ||
      (a.fr?.body?.length || 0) < 6 ||
      (a.en?.body?.length || 0) < 6 ||
      a.rewrittenBy === "template" ||
      !a.imageSrc ||
      // FR encore en anglais (seed RSS EN) → re-traduire
      (Boolean(a.fr?.title) &&
        Boolean(a.en?.title) &&
        a.fr!.title.trim() === a.en!.title.trim()) ||
      /googleusercontent|gstatic|google-analytics|googletagmanager|\.js$/i.test(
        a.sourceUrl || "",
      );
    const targets = store.articles
      .map((article, index) => ({ article, index }))
      .filter(
        ({ article }) =>
          (!options.siteId || newsSiteId(article) === options.siteId) &&
          needsRefresh(article),
      )
      .slice(refreshOffset, refreshOffset + refreshLimit);
    for (const { article, index } of targets) {
      try {
        const feedItem = feedByGuid.get(article.sourceGuid) || null;
        const next = await refreshArticle(article, feedItem);
        if (!articleOnTopic(next)) {
          continue;
        }
        if (next.rewrittenBy === "ai") aiUsed = true;
        store.articles[index] = next;
        refreshed += 1;
        refreshedSlugs.push(next.slug);
      } catch (err) {
        console.error("refresh_failed", article.slug, err);
      }
    }
  }

  const beforePurge = store.articles.length;
  const purgedSlugs = store.articles
    .filter((a) => !articleOnTopic(a))
    .map((a) => a.slug);
  store.articles = store.articles.filter(articleOnTopic);
  const topicPurged = beforePurge - store.articles.length;

  let backfilled = 0;
  const fixAll =
    Boolean(options?.backfillImagesAll) || Boolean(options?.fixJunkImages);
  const forceWrongThemeCovers = Boolean(options?.fixJunkImages);
  const forceSiteCovers =
    Boolean(options?.fixJunkImages) &&
    Boolean(options?.forceRefresh) &&
    Boolean(options?.siteId);
  const backfillCap = fixAll || forceSiteCovers
    ? store.articles.length + created.length
    : 6;
  for (const article of [...created, ...store.articles]) {
    if (options?.siteId && newsSiteId(article) !== options.siteId) continue;
    if (backfilled >= backfillCap) break;
    const junk = await isStoredNewsImageJunk(article.imageSrc);
    const sid = newsSiteId(article);
    const credit = (article.imageCredit || "").toLowerCase();
    const wrongTheme =
      forceWrongThemeCovers &&
      sid !== "ecoflow" &&
      (credit.includes("ecoflow") ||
        (article.imageKind === "ai" && credit.includes("stream")));
    const needsCover =
      !article.imageSrc || junk || wrongTheme || forceSiteCovers;
    if (!needsCover) continue;

    const cover = await resolveNewsCover({
      sourceUrl: article.sourceUrl,
      sourceName: article.sourceName,
      slug: article.slug,
      title: article.fr?.title || article.en?.title,
      excerpt: article.fr?.excerpt || article.en?.excerpt,
      tags: article.tags,
      siteId: sid,
    });
    if (!cover) continue;
    article.imageSrc = cover.imageSrc;
    article.imageCredit = cover.imageCredit;
    article.imageKind = cover.imageKind;
    backfilled += 1;
  }

  store.articles = [...created, ...store.articles];
  const quality = pruneLowQualityNewsArticles(store.articles);
  store.articles = quality.kept;
  purgedSlugs.push(...quality.removedSlugs);
  const purged = topicPurged + quality.removedSlugs.length;

  if (created.length || backfilled || refreshed || purged) {
    await writeNewsStore(store);
    revalidatePath("/[locale]/actualites", "page");
    revalidatePath("/[locale]/actualites/[slug]", "page");
    revalidatePath("/[locale]", "page");
    revalidateSitemap();
  }

  return {
    ok: true,
    fetched: collected.length,
    created: created.length,
    skipped: Math.max(0, byGuid.size - created.length - rejected),
    rejected,
    purged,
    backfilled,
    refreshed,
    slugs: created.map((a) => a.slug),
    refreshedSlugs,
    purgedSlugs,
    aiUsed,
  };
}
