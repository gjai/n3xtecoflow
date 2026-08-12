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
    url: "https://news.google.com/rss/search?q=EcoFlow%20OR%20%22DELTA%202%22%20OR%20%22STREAM%20Ultra%22&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    id: "gnews-en",
    url: "https://news.google.com/rss/search?q=EcoFlow%20(power%20OR%20solar%20OR%20battery%20OR%20STREAM%20OR%20DELTA)&hl=en-US&gl=US&ceid=US:en",
  },
] as const;

export const MAX_NEWS_ARTICLES = 60;
export const MAX_NEW_PER_RUN = 4;
