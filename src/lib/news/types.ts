import type { SiteId } from "@/sites/types";

export type NewsLocaleCopy = {
  title: string;
  excerpt: string;
  body: string[];
};

export type NewsArticle = {
  slug: string;
  /** Theme that owns this article. Defaults to ecoflow when omitted. */
  siteId?: SiteId;
  sourceUrl: string;
  sourceName: string;
  sourceGuid: string;
  publishedAt: string;
  ingestedAt: string;
  rewrittenBy: "ai" | "template";
  tags: string[];
  /** Local path like /api/media/news/... or static /images/... */
  imageSrc?: string;
  imageCredit?: string;
  imageKind?: "source" | "fallback" | "ai";
  fr: NewsLocaleCopy;
  en: NewsLocaleCopy;
};

export function newsSiteId(
  article: { siteId?: SiteId } | null | undefined,
): SiteId {
  return article?.siteId || "ecoflow";
}

export type NewsStore = {
  updatedAt: string;
  articles: NewsArticle[];
};

export type NewsFeed = {
  id: string;
  url: string;
  siteId: SiteId;
};

export const NEWS_FEEDS: NewsFeed[] = [
  {
    id: "ecoflow-gnews-fr",
    siteId: "ecoflow",
    url: "https://news.google.com/rss/search?q=EcoFlow+(DELTA+OR+RIVER+OR+STREAM+OR+PowerStream+OR+station+OR+solaire+OR+batterie)&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "ecoflow-gnews-en",
    siteId: "ecoflow",
    url: "https://news.google.com/rss/search?q=EcoFlow+(DELTA+OR+RIVER+OR+STREAM+OR+PowerStream+OR+%22power+station%22+OR+solar+OR+battery)&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "tumbler-gnews-fr",
    siteId: "tumbler",
    url: "https://news.google.com/rss/search?q=(%22gourde+isotherme%22+OR+%22tumbler+isotherme%22+OR+%22mug+isotherme%22+OR+%22Hydro+Flask%22+OR+Qwetch+OR+%22Stanley+Quencher%22+OR+Thermos+OR+%22Super+Sparrow%22+OR+Yeti+OR+Owala)+when:14d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "tumbler-gnews-en",
    siteId: "tumbler",
    url: "https://news.google.com/rss/search?q=(%22insulated+bottle%22+OR+%22insulated+tumbler%22+OR+%22Hydro+Flask%22+OR+%22Stanley+Quencher%22+OR+Thermos+OR+%22Super+Sparrow%22+OR+Yeti+OR+Qwetch+OR+Owala)+when:14d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "massage-gun-gnews-fr",
    siteId: "massage-gun",
    url: "https://news.google.com/rss/search?q=(%22pistolet+de+massage%22+OR+%22massage+gun%22+OR+%22masseur+cervical%22+OR+%22masseur+shiatsu%22+OR+%22coussin+de+massage%22+OR+Theragun+OR+Therabody+OR+Hypervolt+OR+Hyperice+OR+Renpho+OR+TOLOCO+OR+Brelley+OR+AERLANG+OR+Jolt+OR+%22Bob+and+Brad%22+OR+%22r%C3%A9cup%C3%A9ration+musculaire%22)+when:45d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "massage-gun-gnews-fr-alt",
    siteId: "massage-gun",
    url: "https://news.google.com/rss/search?q=(Jolt+OR+Hyperice+OR+Renpho+OR+Brelley+OR+%22masseur+cervical%22+OR+%22coussin+shiatsu%22)+(%22pistolet+de+massage%22+OR+massage+OR+r%C3%A9cup%C3%A9ration)+when:45d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "massage-gun-gnews-en",
    siteId: "massage-gun",
    url: "https://news.google.com/rss/search?q=(%22massage+gun%22+OR+%22neck+massager%22+OR+%22shiatsu+massager%22+OR+Theragun+OR+Therabody+OR+Hypervolt+OR+Hyperice+OR+Renpho+OR+TOLOCO+OR+Brelley+OR+Jolt+OR+percussion+massager+OR+%22muscle+recovery%22)+when:45d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "casinos-crypto-gnews-fr-stake",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(Stake.com)+(crypto+OR+casino+OR+USDC+OR+Polygon)+-promo+-coupon+-Drake+-Everton+when:60d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "casinos-crypto-gnews-en-stake",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(Stake.com)+(crypto+OR+casino+OR+USDC+OR+Polygon)+-promo+-coupon+-Drake+-Everton+-sportsbook+when:60d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "casinos-crypto-gnews-fr-nordvpn",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(NordVPN)+(s%C3%A9curit%C3%A9+OR+privacy+OR+extension+OR+malware+OR+faille)+-coupon+-%25+when:45d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "casinos-crypto-gnews-en-nordvpn",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(NordVPN)+(security+OR+privacy+OR+extension+OR+malware+OR+breach)+-coupon+-%25+-deal+when:45d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "casinos-crypto-gnews-fr-crypto",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(Bitcoin+OR+Ethereum+OR+cryptomonnaie+OR+%22Crypto.com%22)+(march%C3%A9+OR+prix+OR+BTC+OR+ETH+OR+ETF)+-presale+-airdrop+when:14d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "casinos-crypto-gnews-en-crypto",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(Bitcoin+OR+Ethereum+OR+cryptocurrency+OR+%22Crypto.com%22)+(market+OR+price+OR+BTC+OR+ETH+OR+ETF+OR+SEC)+-presale+-airdrop+when:14d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "casinos-crypto-gnews-fr-casino",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(%22casino+crypto%22+OR+%22casino+bitcoin%22+OR+%22bitcoin+casino%22+OR+%22crypto+casino%22+OR+Stake.com)+(r%C3%A9gulation+OR+licence+OR+USDT+OR+Bitcoin)+-promo+-coupon+-Drake+-Everton+-sportsbook+when:45d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "casinos-crypto-gnews-en-casino",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(%22crypto+casino%22+OR+%22bitcoin+casino%22+OR+%22crypto+gambling%22+OR+Stake.com)+(regulation+OR+license+OR+USDT+OR+Bitcoin)+-promo+-coupon+-Drake+-Everton+-sportsbook+when:45d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "euromillions-gnews-fr",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(EuroMillions+OR+%22Euro+Millions%22)+(r%C3%A9sultat+OR+tirage+OR+jackpot+OR+gagnant+OR+FDJ)+when:90d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "euromillions-gnews-fr-gagnants",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(EuroMillions+OR+%22Euro+Millions%22)+(gagnant+OR+millionnaire+OR+%22My+Million%22+OR+jackpot)+when:90d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "euromillions-gnews-fr-loto",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(Loto)+(FDJ+OR+%22Fran%C3%A7aise+des+Jeux%22)+(tirage+OR+r%C3%A9sultat+OR+jackpot+OR+gagnant)+when:60d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "euromillions-gnews-fr-eurodreams",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(EuroDreams+OR+%22Euro+Dreams%22)+(tirage+OR+r%C3%A9sultat+OR+gagnant+OR+FDJ)+when:60d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "euromillions-gnews-fr-mymillion",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(%22My+Million%22+OR+MyMillion)+(gagnant+OR+code+OR+tirage+OR+EuroMillions)+when:60d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "euromillions-gnews-fr-fdj",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(FDJ)+(EuroMillions+OR+Loto+OR+EuroDreams+OR+Keno)+(r%C3%A9sultat+OR+tirage+OR+jackpot)+when:45d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "euromillions-gnews-en",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(EuroMillions+OR+%22Euro+Millions%22)+(result+OR+draw+OR+jackpot+OR+winner)+when:90d&hl=en-GB&gl=GB&ceid=GB:en",
  },
  {
    id: "euromillions-gnews-en-ie",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(EuroMillions+OR+%22Euro+Millions%22)+(result+OR+draw+OR+jackpot+OR+winner)+when:90d&hl=en-IE&gl=IE&ceid=IE:en",
  },
  {
    id: "euromillions-gnews-es",
    siteId: "euromillions",
    url: "https://news.google.com/rss/search?q=(Euromillones+OR+EuroMillions)+(resultado+OR+bote+OR+ganador+OR+sorteo)+when:60d&hl=es&gl=ES&ceid=ES:es",
  },
];

export const MAX_NEWS_ARTICLES = 140;
/** Newest articles kept per theme before the global cap. */
export const DEFAULT_MAX_NEWS_PER_SITE = 24;
export const MAX_NEWS_PER_SITE: Partial<Record<SiteId, number>> = {
  euromillions: 36,
  "casinos-crypto": 36,
};
/**
 * New articles per ingest run when no `siteId` is set.
 * Sized for ~2 picks × number of themes with feeds.
 */
export const MAX_NEW_PER_RUN = 8;
/** Default cap when ingesting a single theme (`?siteId=`). */
export const MAX_NEW_PER_SITE_RUN = 2;
export const MAX_NEW_PER_SITE_RUN_BY_ID: Partial<Record<SiteId, number>> = {
  euromillions: 4,
  "casinos-crypto": 4,
};

export function maxNewPerSiteRun(siteId?: SiteId): number {
  if (!siteId) return MAX_NEW_PER_RUN;
  return MAX_NEW_PER_SITE_RUN_BY_ID[siteId] ?? MAX_NEW_PER_SITE_RUN;
}

export function maxNewsPerSite(siteId: SiteId): number {
  return MAX_NEWS_PER_SITE[siteId] ?? DEFAULT_MAX_NEWS_PER_SITE;
}
