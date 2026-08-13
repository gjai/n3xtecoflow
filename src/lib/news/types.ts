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
    url: "https://news.google.com/rss/search?q=(Stake.com+OR+Stake)+(casino+OR+crypto+OR+gambling+OR+%22casino+en+ligne%22)+when:30d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "casinos-crypto-gnews-en-stake",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(Stake.com+OR+Stake)+(casino+OR+crypto+OR+gambling)+when:30d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "casinos-crypto-gnews-fr-nordvpn",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(NordVPN+OR+%22Nord+VPN%22)+(VPN+OR+s%C3%A9curit%C3%A9+OR+privacy+OR+casino+OR+crypto)+when:30d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "casinos-crypto-gnews-en-nordvpn",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(NordVPN+OR+%22Nord+VPN%22)+(VPN+OR+security+OR+privacy+OR+casino+OR+crypto)+when:30d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    id: "casinos-crypto-gnews-fr-crypto",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(Bitcoin+OR+Ethereum+OR+cryptomonnaie+OR+cryptocurrency+OR+%22Crypto.com%22)+(march%C3%A9+OR+prix+OR+BTC+OR+ETH+OR+wallet+OR+stablecoin)+when:14d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "casinos-crypto-gnews-en-crypto",
    siteId: "casinos-crypto",
    url: "https://news.google.com/rss/search?q=(Bitcoin+OR+Ethereum+OR+cryptocurrency+OR+%22Crypto.com%22)+(market+OR+price+OR+BTC+OR+ETH+OR+wallet+OR+stablecoin)+when:14d&hl=en-US&gl=US&ceid=US:en",
  },
];

export const MAX_NEWS_ARTICLES = 80;
/**
 * New articles per ingest run when no `siteId` is set.
 * Sized for ~2 picks × number of themes with feeds.
 */
export const MAX_NEW_PER_RUN = 8;
/** Default cap when ingesting a single theme (`?siteId=`). */
export const MAX_NEW_PER_SITE_RUN = 2;
