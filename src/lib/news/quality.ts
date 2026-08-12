import type { SiteId } from "@/sites/types";

/** Max articles kept per brand cluster in the store (per site). */
export const MAX_NEWS_PER_BRAND = 2;
/** Max same-brand picks in one ingest selection. */
export const MAX_BRAND_PER_INGEST = 1;

const PROMO_HEAVY =
  /\b(promo(?:tion)?s?|r[ée]duction|%\s*off|deal|deals|coupon|code\s*promo|brad[ée]e?s?|soldes?|flash\s*sale|prix\s*cass[ée]|offre\s*rare|en\s*promo|discount|save\s*\$|save\s*€|academy\s*sports?)\b/i;

const EDITORIAL_HINT =
  /\b(guide|comparatif|test|avis|review|vs\b|choisir|how\s+to|entretien|buying|meilleure?s?|best\b|nouveaut[ée]|lancement|launch|collection)\b/i;

type BrandRule = { id: string; pattern: RegExp };

const BRANDS_BY_SITE: Record<string, BrandRule[]> = {
  tumbler: [
    { id: "owala", pattern: /\bowala\b/i },
    { id: "stanley", pattern: /\bstanley\b/i },
    { id: "hydroflask", pattern: /\bhydro\s*flask\b/i },
    { id: "qwetch", pattern: /\bqwetch\b/i },
    { id: "thermos", pattern: /\bthermos\b/i },
    { id: "sparrow", pattern: /\bsuper\s*sparrow\b|\bsparrow\b/i },
    { id: "yeti", pattern: /\byeti\b/i },
    { id: "simplemodern", pattern: /\bsimple\s*modern\b/i },
    { id: "airup", pattern: /\bair\s*up\b/i },
  ],
  ecoflow: [
    { id: "ecoflow", pattern: /\becoflow\b/i },
    { id: "delta", pattern: /\bdelta\b/i },
    { id: "river", pattern: /\briver\b/i },
    { id: "stream", pattern: /\bstream\b/i },
    { id: "powerstream", pattern: /\bpower\s*stream\b|\bpowerstream\b/i },
    { id: "glacier", pattern: /\bglacier\b/i },
    { id: "wave", pattern: /\bwave\b/i },
  ],
};

function brandRules(siteId: SiteId): BrandRule[] {
  return BRANDS_BY_SITE[siteId] || BRANDS_BY_SITE.ecoflow;
}

export function normalizeNewsTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/s['’]?\s*mores/g, "smores")
    .replace(/gimme\s+s\s*more/g, "smores")
    .replace(/free\s*sip/g, "freesip")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(
      /\b(promo|promotion|reduction|deal|deals|offre|rare|nouveau|nouvelle|new|the|les|des|une|un|la|le|pour|avec|dans|sur|chez|off|save|vs|lance|devient|virale|succes|annonce|amateurs|amoureux|delice|collection)\b/g,
      " ",
    )
    .replace(
      /\b(academy|sports|amazon|walmart|target|bestbuy|carrefour|fnac|cdiscount)\b/g,
      " ",
    )
    .replace(/\b\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Stable near-duplicate key (order-insensitive significant tokens). */
export function newsNearDuplicateKey(title: string): string {
  const tokens = normalizeNewsTitle(title)
    .split(" ")
    .filter((t) => t.length > 3)
    .slice(0, 6)
    .sort();
  return tokens.join("|");
}

export function primaryNewsBrand(
  text: string,
  siteId: SiteId,
): string | null {
  for (const rule of brandRules(siteId)) {
    if (rule.pattern.test(text)) return rule.id;
  }
  return null;
}

export function isPromoHeavyNews(title: string, description = ""): boolean {
  const hay = `${title} ${description}`;
  if (!PROMO_HEAVY.test(hay)) return false;
  // Pure price/deal headline without editorial framing
  if (EDITORIAL_HINT.test(hay)) return false;
  return true;
}

export type NewsQualityInput = {
  title: string;
  description?: string;
  publishedAt?: string;
  siteId: SiteId;
};

export type ScoredNewsCandidate<T extends NewsQualityInput> = T & {
  qualityScore: number;
  brand: string | null;
  dupKey: string;
  promoHeavy: boolean;
};

/**
 * Rank RSS/new candidates: prefer editorial diversity, demote promo spam
 * and near-duplicates (actuel + futurs thèmes).
 */
export function rankNewsCandidates<T extends NewsQualityInput>(
  items: T[],
  existingTitles: string[],
  limit: number,
): ScoredNewsCandidate<T>[] {
  const existingKeys = new Set(
    existingTitles.map((t) => newsNearDuplicateKey(t)).filter(Boolean),
  );
  const brandCounts = new Map<string, number>();
  const selectedKeys = new Set<string>();
  const scored: (ScoredNewsCandidate<T> & { publishedMs: number })[] =
    items.map((item) => {
      const brand = primaryNewsBrand(
        `${item.title} ${item.description || ""}`,
        item.siteId,
      );
      const dupKey = newsNearDuplicateKey(item.title);
      const promoHeavy = isPromoHeavyNews(item.title, item.description);
      let qualityScore = 0;
      if (EDITORIAL_HINT.test(item.title)) qualityScore += 3;
      if (promoHeavy) qualityScore -= 4;
      if (existingKeys.has(dupKey)) qualityScore -= 8;
      const publishedMs = item.publishedAt
        ? new Date(item.publishedAt).getTime()
        : 0;
      return {
        ...item,
        qualityScore,
        brand,
        dupKey,
        promoHeavy,
        publishedMs,
      };
    });

  scored.sort((a, b) => {
    if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
    return b.publishedMs - a.publishedMs;
  });

  const out: ScoredNewsCandidate<T>[] = [];
  const tryPick = (allowPromo: boolean) => {
    for (const item of scored) {
      if (out.length >= limit) break;
      if (!allowPromo && item.promoHeavy) continue;
      if (item.dupKey && selectedKeys.has(item.dupKey)) continue;
      if (item.dupKey && existingKeys.has(item.dupKey) && item.qualityScore < 0) {
        continue;
      }
      if (item.brand) {
        const n = brandCounts.get(item.brand) || 0;
        if (n >= MAX_BRAND_PER_INGEST) continue;
        brandCounts.set(item.brand, n + 1);
      }
      if (item.dupKey) selectedKeys.add(item.dupKey);
      out.push(item);
    }
  };
  tryPick(false);
  if (out.length < limit) tryPick(true);
  return out;
}

type StoreArticleLike = {
  slug: string;
  siteId?: SiteId;
  publishedAt: string;
  fr?: { title?: string; excerpt?: string };
  en?: { title?: string; excerpt?: string };
  tags?: string[];
};

/**
 * Dedupe near-identical titles + cap per brand (keep newest / less promo).
 * Safe for ecoflow, tumbler, and future siteIds.
 */
export function pruneLowQualityNewsArticles<T extends StoreArticleLike>(
  articles: T[],
  siteId?: SiteId,
): { kept: T[]; removedSlugs: string[] } {
  const pool = siteId
    ? articles.filter((a) => (a.siteId || "ecoflow") === siteId)
    : articles;
  const others = siteId
    ? articles.filter((a) => (a.siteId || "ecoflow") !== siteId)
    : [];

  const byDup = new Map<string, T[]>();
  for (const a of pool) {
    const title = a.fr?.title || a.en?.title || a.slug;
    const key = newsNearDuplicateKey(title) || a.slug;
    const list = byDup.get(key) || [];
    list.push(a);
    byDup.set(key, list);
  }

  const afterDup: T[] = [];
  const removed = new Set<string>();
  for (const [, group] of byDup) {
    group.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    afterDup.push(group[0]);
    for (const extra of group.slice(1)) removed.add(extra.slug);
  }

  const byBrand = new Map<string, T[]>();
  const noBrand: T[] = [];
  for (const a of afterDup) {
    const title = `${a.fr?.title || ""} ${a.en?.title || ""}`;
    const sid = (a.siteId || "ecoflow") as SiteId;
    const brand = primaryNewsBrand(title, sid);
    if (!brand) {
      noBrand.push(a);
      continue;
    }
    const list = byBrand.get(`${sid}:${brand}`) || [];
    list.push(a);
    byBrand.set(`${sid}:${brand}`, list);
  }

  const keptBrand: T[] = [];
  for (const [, group] of byBrand) {
    group.sort((a, b) => {
      const aPromo =
        isPromoHeavyNews(a.fr?.title || "", a.fr?.excerpt || "") ||
        (a.tags || []).includes("promo");
      const bPromo =
        isPromoHeavyNews(b.fr?.title || "", b.fr?.excerpt || "") ||
        (b.tags || []).includes("promo");
      if (aPromo !== bPromo) return aPromo ? 1 : -1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
    keptBrand.push(...group.slice(0, MAX_NEWS_PER_BRAND));
    for (const extra of group.slice(MAX_NEWS_PER_BRAND)) removed.add(extra.slug);
  }

  const kept = [...keptBrand, ...noBrand].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    kept: siteId ? [...kept, ...others] : kept,
    removedSlugs: [...removed],
  };
}
