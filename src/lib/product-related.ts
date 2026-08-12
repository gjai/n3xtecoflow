import { guides as staticGuides, type GuideArticle } from "@/data/articles";
import type { Product } from "@/data/products";
import { productSiteId } from "@/data/products";
import {
  comparisonHubCategories,
  hubTitle,
  LEGACY_COMPARISON_REDIRECTS,
} from "@/lib/comparisons/hub";
import { GUIDE_TOPICS, guideSiteId } from "@/lib/guides/types";
import type { NewsArticle } from "@/lib/news/types";
import type { SiteId } from "@/sites/types";

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

function scoreGuideTopic(
  topic: (typeof GUIDE_TOPICS)[number],
  tokens: string[],
): number {
  return (
    scoreText(topic.slug, tokens) * 2 +
    scoreText(topic.topicFr, tokens) +
    scoreText(topic.topicEn, tokens) +
    scoreText(topic.angleFr, tokens) +
    scoreText(topic.angleEn, tokens)
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
    guides: [
      "choisir-station",
      "camping-van",
      "dimensionnement-wh",
      "premier-achat",
    ],
    comparisons: ["delta", "river"],
  },
  delta: {
    guides: [
      "choisir-station",
      "backup-maison",
      "dimensionnement-wh",
      "ups-coupures",
      "recharge-rapide",
    ],
    comparisons: ["delta", "delta-pro"],
  },
  "delta-pro": {
    guides: ["backup-maison", "choisir-station", "delta-pro-autonomie"],
    comparisons: ["delta-pro", "delta"],
  },
  stream: {
    guides: ["stream-balcon", "solaire-portable", "premier-achat"],
    comparisons: ["stream"],
  },
  powerstream: {
    guides: ["stream-balcon", "solaire-portable"],
    comparisons: ["stream", "powerstream"],
  },
  solaire: {
    guides: ["solaire-portable", "stream-balcon", "dimensionnement-wh"],
    comparisons: ["solaire", "stream"],
  },
  outdoor: {
    guides: ["camping-van", "choisir-station", "glacier-froid", "wave-clim"],
    comparisons: ["outdoor", "river"],
  },
  ocean: {
    guides: ["backup-maison", "choisir-station", "delta-pro-autonomie"],
    comparisons: ["delta-pro"],
  },
  accessoires: {
    guides: ["choisir-station", "camping-van", "recharge-rapide"],
    comparisons: [],
  },
  gourdes: {
    guides: [
      "choisir-gourde-isotherme",
      "gourde-vs-tumbler",
      "entretien-gourde",
      "isolation-froid-chaud",
      "premier-achat-gourde",
    ],
    comparisons: ["gourdes", "tumblers"],
  },
  tumblers: {
    guides: [
      "gourde-vs-tumbler",
      "choisir-gourde-isotherme",
      "entretien-gourde",
      "isolation-froid-chaud",
    ],
    comparisons: ["tumblers", "gourdes"],
  },
};

function guideTitle(slug: string, locale: string): string {
  const topic = GUIDE_TOPICS.find((t) => t.slug === slug);
  if (topic) return locale === "en" ? topic.topicEn : topic.topicFr;
  const staticG = staticGuides.find((g) => g.slug === slug);
  if (staticG) {
    return locale === "en" ? staticG.en.title : staticG.fr.title;
  }
  return slug;
}

export function getRelatedEditorial(options: {
  product: Product;
  locale: string;
  news: NewsArticle[];
  siteId?: SiteId;
  limit?: { guides?: number; comparisons?: number; news?: number };
}): {
  guides: RelatedLink[];
  comparisons: RelatedLink[];
  news: RelatedLink[];
} {
  const { product, locale, news } = options;
  const siteId = options.siteId || productSiteId(product);
  const tokens = productMatchTokens(product);
  const manual = MANUAL[product.category] || {};
  const guideLimit = options.limit?.guides ?? 3;
  const cmpLimit = options.limit?.comparisons ?? 3;
  const newsLimit = options.limit?.news ?? 3;

  const guideScores = GUIDE_TOPICS.filter((t) => guideSiteId(t) === siteId)
    .map((topic) => {
      let s = scoreGuideTopic(topic, tokens);
      if (manual.guides?.includes(topic.slug)) s += 10;
      const staticG = staticGuides.find((g) => g.slug === topic.slug);
      if (staticG) s += scoreArticle(staticG, tokens, locale) * 0.25;
      return { slug: topic.slug, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, guideLimit);

  const hubs = comparisonHubCategories(siteId);
  const cmpScores = hubs
    .map((cat) => {
      let s = scoreText(cat.id, tokens) * 3 + scoreText(cat.slug, tokens);
      if (cat.id === product.category) s += 12;
      if (manual.comparisons?.includes(cat.id) || manual.comparisons?.includes(cat.slug)) {
        s += 10;
      }
      // Legacy pair that pointed into this hub
      for (const [legacySlug, target] of Object.entries(LEGACY_COMPARISON_REDIRECTS)) {
        if (
          target.category === cat.id &&
          (legacySlug.includes(product.slug.split("-")[0] || "") ||
            scoreText(legacySlug, tokens) > 0)
        ) {
          s += 2;
        }
      }
      return { cat, s };
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
    guides: guideScores.map(({ slug }) => ({
      href: `/guides/${slug}`,
      title: guideTitle(slug, locale),
      kind: "guide" as const,
    })),
    comparisons: cmpScores.map(({ cat }) => ({
      href: `/comparatifs/${cat.slug}`,
      title: hubTitle(cat.id, locale),
      kind: "comparison" as const,
    })),
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
