import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { EuroMillionsDraw } from "@/lib/euromillions/types.ts";
import {
  buildOriginalEuroMillionsArticles,
  isOriginalEuroMillionsArticle,
  keepOriginalEuroMillionsNews,
  ORIGINAL_EM_SOURCE_NAME,
} from "./original-euromillions.ts";
import type { NewsArticle } from "./types.ts";

function draw(date: string, numbers: number[]): EuroMillionsDraw {
  return {
    date,
    numbers,
    stars: [1, 2],
    jackpotEur: 17_000_000,
    hasWinner: false,
    source: "manual",
    fetchedAt: `${date}T20:00:00.000Z`,
  };
}

function manyDraws(): EuroMillionsDraw[] {
  const latest = draw("2026-09-11", [1, 7, 15, 22, 50]);
  latest.hasWinner = true;
  latest.jackpotEur = 111_000_000;
  const rest: EuroMillionsDraw[] = [];
  for (let i = 1; i <= 15; i += 1) {
    rest.push(draw(`2026-08-${String(21 - i).padStart(2, "0")}`, [2, 3, 4, 5, 6]));
  }
  return [latest, ...rest];
}

function rssArticle(slug: string): NewsArticle {
  return {
    slug,
    siteId: "euromillions",
    sourceUrl: "https://news.google.com/foo",
    sourceName: "RTL",
    sourceGuid: "gnews:abc",
    publishedAt: "2026-09-01T10:00:00.000Z",
    ingestedAt: "2026-09-01T10:00:00.000Z",
    rewrittenBy: "ai",
    tags: ["euromillions"],
    fr: { title: "Un gagnant insolite", excerpt: "x", body: ["x"] },
    en: { title: "Odd winner", excerpt: "x", body: ["x"] },
  };
}

describe("original EuroMillions news", () => {
  it("jette les actus RSS et garde les originales", () => {
    const rss = rssArticle("rss-one");
    const kept = keepOriginalEuroMillionsNews([rss]);
    assert.equal(kept.length, 0);
    assert.equal(isOriginalEuroMillionsArticle(rss), false);
  });

  it("crée une analyse de tirage + un point hebdo, une seule fois", () => {
    const first = buildOriginalEuroMillionsArticles(manyDraws(), []);
    assert.ok(first.length >= 1);
    assert.ok(first.every((a) => a.rewrittenBy === "original"));
    assert.ok(first.every((a) => a.sourceName === ORIGINAL_EM_SOURCE_NAME));
    assert.ok(first.every((a) => a.sourceUrl.includes("euromillions-resultats.fr")));
    assert.ok(first.every((a) => a.sourceGuid.startsWith("original:em:")));
    const second = buildOriginalEuroMillionsArticles(manyDraws(), first);
    assert.equal(second.length, 0);
  });
});
