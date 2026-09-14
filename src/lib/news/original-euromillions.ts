import { parisLocalToUtc } from "@/lib/euromillions/datetime";
import {
  buildDrawStory,
  buildWeeklyStory,
  type EditorialStory,
} from "@/lib/euromillions/insights";
import { makeSlug } from "./store";
import type { NewsArticle } from "./types";
import { newsSiteId } from "./types";

export const ORIGINAL_EM_GUID_PREFIX = "original:em:";
export const ORIGINAL_EM_SOURCE_NAME = "EuroMillions Résultats";
const ORIGIN = "https://euromillions-resultats.fr";

export function isOriginalEuroMillionsArticle(article: {
  sourceGuid?: string;
  siteId?: string;
}): boolean {
  return (
    newsSiteId(article) === "euromillions" &&
    (article.sourceGuid || "").startsWith(ORIGINAL_EM_GUID_PREFIX)
  );
}

export function keepOriginalEuroMillionsNews(articles: NewsArticle[]): NewsArticle[] {
  return articles.filter(
    (article) =>
      newsSiteId(article) !== "euromillions" ||
      isOriginalEuroMillionsArticle(article),
  );
}

function storyToArticle(story: EditorialStory): NewsArticle {
  const publishedAt = parisLocalToUtc(story.date, 21, 30).toISOString();
  return {
    slug: makeSlug(story.titleFr, publishedAt, story.guid),
    siteId: "euromillions",
    sourceUrl: `${ORIGIN}/fr${story.sourcePath}`,
    sourceName: ORIGINAL_EM_SOURCE_NAME,
    sourceGuid: story.guid,
    publishedAt,
    ingestedAt: new Date().toISOString(),
    rewrittenBy: "original",
    tags: story.tags,
    fr: {
      title: story.titleFr,
      excerpt: story.excerptFr,
      body: story.bodyFr,
    },
    en: {
      title: story.titleEn,
      excerpt: story.excerptEn,
      body: story.bodyEn,
    },
  };
}

export function buildOriginalEuroMillionsArticles(
  draws: Parameters<typeof buildDrawStory>[0],
  existing: NewsArticle[],
): NewsArticle[] {
  const known = new Set(
    existing
      .filter((a) => newsSiteId(a) === "euromillions")
      .map((a) => a.sourceGuid),
  );
  const out: NewsArticle[] = [];
  const drawStory = buildDrawStory(draws);
  if (drawStory && !known.has(drawStory.guid)) {
    out.push(storyToArticle(drawStory));
    known.add(drawStory.guid);
  }
  const weekly = buildWeeklyStory(draws);
  if (weekly && !known.has(weekly.guid)) {
    out.push(storyToArticle(weekly));
  }
  return out;
}
