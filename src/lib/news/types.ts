export type NewsLocaleCopy = {
  title: string;
  excerpt: string;
  body: string[];
};

export type NewsArticle = {
  slug: string;
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

export type NewsStore = {
  updatedAt: string;
  articles: NewsArticle[];
};

export const NEWS_FEEDS = [
  {
    id: "gnews-fr",
    // Always require EcoFlow in the query (no bare DELTA/STREAM).
    url: "https://news.google.com/rss/search?q=EcoFlow+(DELTA+OR+RIVER+OR+STREAM+OR+PowerStream+OR+station+OR+solaire+OR+batterie)&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "gnews-en",
    url: "https://news.google.com/rss/search?q=EcoFlow+(DELTA+OR+RIVER+OR+STREAM+OR+PowerStream+OR+%22power+station%22+OR+solar+OR+battery)&hl=en-US&gl=US&ceid=US:en",
  },
] as const;

export const MAX_NEWS_ARTICLES = 60;
export const MAX_NEW_PER_RUN = 4;
