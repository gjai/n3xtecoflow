import { comparisons, guides, type GuideArticle } from "@/data/articles";
import type { Product } from "@/data/products";
import type { NewsArticle } from "@/lib/news/types";

export type RelatedLink = {
  href: string;
  title: string;
  kind: "guide" | "comparison" | "news" | "product";
};

/** Tokens used to match editorial content to a product. */
export function productMatchTokens(product: Product): string[] {
  const raw = [
    product.slug,
    product.name,
    product.amazonQuery,
    product.category,
    ...product.name.split(/\s+/),
    ...product.slug.split("-"),
  ];

  const tokens = new Set<string>();
  for (const r of raw) {
    const t = r
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
    if (t.length >= 3 && t !== "ecoflow" && t !== "the" && t !== "and") {
      tokens.add(t);
    }
  }

  // Family aliases
  if (product.category === "river" || product.slug.includes("river")) {
    tokens.add("river");
  }
  if (product.category === "delta" || product.slug.includes("delta")) {
    tokens.add("delta");
  }
  if (product.category === "delta-pro" || product.slug.includes("pro")) {
    tokens.add("pro");
    tokens.add("deltapro");
  }
  if (product.category === "stream" || product.slug.includes("stream")) {
    tokens.add("stream");
    tokens.add("balcon");
  }
  if (product.category === "powerstream" || product.slug.includes("powerstream")) {
    tokens.add("powerstream");
    tokens.add("stream");
  }
  if (product.category === "solaire" || product.slug.includes("panneau")) {
    tokens.add("solaire");
    tokens.add("solar");
    tokens.add("panneau");
  }
  if (product.category === "outdoor") {
    tokens.add("camping");
    tokens.add("glacier");
    tokens.add("wave");
  }

  return [...tokens];
}

function scoreText(haystack: string, tokens: string[]): number {
  const h = haystack
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (h.includes(t)) score += t.length >= 5 ? 3 : 1;
  }
  return score;
}

function scoreArticle(article: GuideArticle, tokens: string[], locale: string): number {
  const copy = locale === "en" ? article.en : article.fr;
  return (
    scoreText(article.slug, tokens) * 2 +
    scoreText(copy.title, tokens) +
    scoreText(copy.subtitle, tokens)
  );
}

function scoreNews(article: NewsArticle, tokens: string[], locale: string): number {
  const copy = locale === "en" ? article.en : article.fr;
  const tags = (article.tags || []).join(" ");
  return (
    scoreText(article.slug, tokens) * 2 +
    scoreText(copy.title, tokens) +
    scoreText(copy.excerpt, tokens) +
    scoreText(tags, tokens)
  );
}

/** Manual strong links by product family / slug. */
const MANUAL: Record<string, { guides?: string[]; comparisons?: string[] }> = {
  river: {
    guides: ["choisir-station", "camping-van", "dimensionnement-wh"],
    comparisons: ["river-vs-delta"],
  },
  delta: {
    guides: ["choisir-station", "backup-maison", "dimensionnement-wh"],
    comparisons: ["river-vs-delta", "delta-2-vs-delta-3", "delta-vs-delta-pro"],
  },
  "delta-pro": {
    guides: ["backup-maison", "choisir-station"],
    comparisons: ["delta-vs-delta-pro"],
  },
  stream: {
    guides: ["stream-balcon", "solaire-portable"],
    comparisons: ["stream-vs-powerstream", "powerstream-vs-station"],
  },
  powerstream: {
    guides: ["stream-balcon", "solaire-portable"],
    comparisons: ["stream-vs-powerstream", "powerstream-vs-station"],
  },
  solaire: {
    guides: ["solaire-portable", "stream-balcon", "dimensionnement-wh"],
    comparisons: ["powerstream-vs-station"],
  },
  outdoor: {
    guides: ["camping-van", "choisir-station"],
    comparisons: ["river-vs-delta"],
  },
  ocean: {
    guides: ["backup-maison", "choisir-station"],
    comparisons: ["delta-vs-delta-pro"],
  },
  accessoires: {
    guides: ["choisir-station", "camping-van"],
    comparisons: [],
  },
};

export function getRelatedEditorial(options: {
  product: Product;
  locale: string;
  news: NewsArticle[];
  limit?: { guides?: number; comparisons?: number; news?: number };
}): {
  guides: RelatedLink[];
  comparisons: RelatedLink[];
  news: RelatedLink[];
} {
  const { product, locale, news } = options;
  const tokens = productMatchTokens(product);
  const manual = MANUAL[product.category] || {};
  const guideLimit = options.limit?.guides ?? 3;
  const cmpLimit = options.limit?.comparisons ?? 3;
  const newsLimit = options.limit?.news ?? 3;

  const guideScores = guides
    .map((g) => {
      let s = scoreArticle(g, tokens, locale);
      if (manual.guides?.includes(g.slug)) s += 10;
      return { g, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, guideLimit);

  const cmpScores = comparisons
    .map((g) => {
      let s = scoreArticle(g, tokens, locale);
      if (manual.comparisons?.includes(g.slug)) s += 10;
      return { g, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, cmpLimit);

  const newsScores = news
    .map((n) => ({ n, s: scoreNews(n, tokens, locale) }))
    .filter((x) => x.s >= 3)
    .sort((a, b) => b.s - a.s)
    .slice(0, newsLimit);

  return {
    guides: guideScores.map(({ g }) => {
      const copy = locale === "en" ? g.en : g.fr;
      return {
        href: `/guides/${g.slug}`,
        title: copy.title,
        kind: "guide" as const,
      };
    }),
    comparisons: cmpScores.map(({ g }) => {
      const copy = locale === "en" ? g.en : g.fr;
      return {
        href: `/comparatifs/${g.slug}`,
        title: copy.title,
        kind: "comparison" as const,
      };
    }),
    news: newsScores.map(({ n }) => {
      const copy = locale === "en" ? n.en : n.fr;
      return {
        href: `/actualites/${n.slug}`,
        title: copy.title,
        kind: "news" as const,
      };
    }),
  };
}
