import type { SiteId } from "@/sites/types";

/** Max articles kept per brand cluster in the store (per site). */
export const MAX_NEWS_PER_BRAND = 4;
/** Lottery is one editorial cluster — a cap of 4 emptied the EM news index. */
export const MAX_NEWS_PER_BRAND_BY_SITE: Partial<Record<SiteId, number>> = {
  euromillions: 28,
};
/** Max same-brand picks in one ingest selection. */
export const MAX_BRAND_PER_INGEST = 2;
export const MAX_BRAND_PER_INGEST_BY_SITE: Partial<Record<SiteId, number>> = {
  euromillions: 4,
};

export function maxNewsPerBrand(siteId: SiteId): number {
  return MAX_NEWS_PER_BRAND_BY_SITE[siteId] ?? MAX_NEWS_PER_BRAND;
}

export function maxBrandPerIngest(siteId: SiteId): number {
  return MAX_BRAND_PER_INGEST_BY_SITE[siteId] ?? MAX_BRAND_PER_INGEST;
}

const PROMO_HEAVY =
  /\b(promo(?:tion)?s?|r[ée]duction|%\s*off|deal|deals|coupon|code\s*promo|brad[ée]e?s?|soldes?|flash\s*sale|prix\s*cass[ée]|offre\s*rare|en\s*promo|discount|save\s*\$|save\s*€|academy\s*sports?|presale|airdrop|moonberg)\b/i;

const EDITORIAL_HINT =
  /\b(guide|comparatif|test|avis|review|vs\b|choisir|how\s+to|entretien|buying|meilleure?s?|best\b|nouveaut[ée]|lancement|launch|collection|march[ée]|market|prix|price|ETF|SEC|staking|breach|malware|extension|tokenis)\b/i;

/** Listicles / sports-sponsorship noise for casino-crypto feeds. */
const CASINO_LOW_SIGNAL =
  /\b(best\s+vpn\s+for|coupon|%\s*off|sleeve\s+deal|everton|luton\s+town|drake|sportsbook|machines?\s*[àa]\s*sous)\b/i;

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
  "massage-gun": [
    { id: "theragun", pattern: /\btheragun\b|\btherabody\b/i },
    { id: "hyperice", pattern: /\bhyperice\b|\bhypervolt\b/i },
    { id: "renpho", pattern: /\brenpho\b/i },
    { id: "toloco", pattern: /\btoloco\b/i },
    { id: "bobbrad", pattern: /\bbob\s*(and|&)\s*brad\b/i },
    { id: "opove", pattern: /\bopove\b/i },
    { id: "ekrin", pattern: /\bekrin\b/i },
    { id: "brelley", pattern: /\bbrelley\b/i },
    { id: "aerlang", pattern: /\baerlang\b/i },
    { id: "jolt", pattern: /\bjolt\b/i },
    { id: "shiatsu", pattern: /\bshiatsu\b|\bcervical\b|\bneck\s*massager\b/i },
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
  "casinos-crypto": [
    { id: "stake", pattern: /\bstake(\.com)?\b/i },
    { id: "cryptocom", pattern: /\bcrypto\.com\b|\bcryptocom\b/i },
    { id: "nordvpn", pattern: /\bnordvpn\b|\bnord\s*vpn\b/i },
    {
      id: "casino-crypto",
      pattern: /\bcrypto\s*casino\b|\bcasino\s*crypto\b/i,
    },
    {
      id: "crypto",
      pattern:
        /\bcryptocurrenc|\bcryptomonnaie|\bbitcoin\b|\bethereum\b|\bbtc\b|\beth\b|\busdt\b|\bstablecoin\b/i,
    },
    { id: "vpn", pattern: /\bvpn\b/i },
  ],
  euromillions: [
    { id: "euromillions", pattern: /\beuromillions\b|\beuro\s*millions\b|\beuromillones\b/i },
    { id: "loto", pattern: /\bloto\b/i },
    { id: "eurodreams", pattern: /\beurodreams\b|\beuro\s*dreams\b/i },
    { id: "jackpot", pattern: /\bjackpot\b/i },
    { id: "fdj", pattern: /\bfdjd?\b|\bfran[cç]aise\s+des\s+jeux\b/i },
    { id: "mymillion", pattern: /\bmy\s*million\b/i },
    { id: "tirage", pattern: /\btirage\b|\bdraw\b|\br[ée]sultat|\bsorteo\b/i },
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

const MONTH_NUM: Record<string, string> = {
  janvier: "01",
  january: "01",
  fevrier: "02",
  february: "02",
  mars: "03",
  march: "03",
  avril: "04",
  april: "04",
  mai: "05",
  may: "05",
  juin: "06",
  june: "06",
  juillet: "07",
  july: "07",
  aout: "08",
  august: "08",
  septembre: "09",
  september: "09",
  octobre: "10",
  october: "10",
  novembre: "11",
  november: "11",
  decembre: "12",
  december: "12",
};

/** Collapse “résultats Loto du mercredi 12 août” variants into one key. */
function lotteryResultDupKey(title: string): string | null {
  const raw = title
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  if (
    !/\b(resultats?|tirage|numeros?\s+gagnants?|draw\s+results?|code\s+gagnant)\b/.test(
      raw,
    )
  ) {
    return null;
  }
  let game: string | null = null;
  if (/\beuromillions\b|\beuro\s*millions\b/.test(raw)) game = "em";
  else if (/\beurodreams\b|\beuro\s*dreams\b/.test(raw)) game = "ed";
  else if (/\bmy\s*million\b/.test(raw)) game = "mm";
  else if (/\bloto\b/.test(raw)) game = "loto";
  if (!game) return null;

  const y = raw.match(/\b(20\d{2})\b/)?.[1];
  const dated = raw.match(
    /\b(\d{1,2})\s+(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre|january|february|march|april|may|june|july|august|september|october|november|december)\b/,
  );
  const weekday = raw.match(
    /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/,
  )?.[1];
  const monthWord = raw.match(
    /\b(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre|january|february|march|april|may|june|july|august|september|october|november|december)\b/,
  )?.[1];

  if (dated && y) {
    const month = MONTH_NUM[dated[2]] || dated[2];
    return `em-result:${game}:${y}-${month}-${dated[1].padStart(2, "0")}`;
  }
  if (y && weekday && monthWord) {
    return `em-result:${game}:${y}-${MONTH_NUM[monthWord] || monthWord}-${weekday}`;
  }
  return null;
}

/** Stable near-duplicate key (order-insensitive significant tokens). */
export function newsNearDuplicateKey(title: string, siteId?: SiteId): string {
  if (siteId === "euromillions") {
    const lotto = lotteryResultDupKey(title);
    if (lotto) return lotto;
  }
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
  const siteForKeys = items[0]?.siteId;
  const existingKeys = new Set(
    existingTitles
      .map((t) => newsNearDuplicateKey(t, siteForKeys))
      .filter(Boolean),
  );
  const brandCounts = new Map<string, number>();
  const selectedKeys = new Set<string>();
  const scored: (ScoredNewsCandidate<T> & { publishedMs: number })[] =
    items.map((item) => {
      const brand = primaryNewsBrand(
        `${item.title} ${item.description || ""}`,
        item.siteId,
      );
      const dupKey = newsNearDuplicateKey(item.title, item.siteId);
      const promoHeavy = isPromoHeavyNews(item.title, item.description);
      let qualityScore = 0;
      if (EDITORIAL_HINT.test(item.title)) qualityScore += 3;
      if (promoHeavy) qualityScore -= 4;
      if (
        item.siteId === "casinos-crypto" &&
        CASINO_LOW_SIGNAL.test(`${item.title} ${item.description || ""}`)
      ) {
        qualityScore -= 6;
      }
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
        if (n >= maxBrandPerIngest(item.siteId)) continue;
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
    const sid = (a.siteId || "ecoflow") as SiteId;
    const key = newsNearDuplicateKey(title, sid) || a.slug;
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
    if (!group[0]) continue;
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
    const sid = (group[0].siteId || "ecoflow") as SiteId;
    const cap = maxNewsPerBrand(sid);
    keptBrand.push(...group.slice(0, cap));
    for (const extra of group.slice(cap)) removed.add(extra.slug);
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
