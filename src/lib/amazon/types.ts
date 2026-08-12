export type AmazonMoney = {
  amount: number | null;
  currency: string | null;
  display: string | null;
};

export type AmazonOffer = {
  /** Stable product key (catalog slug) */
  slug: string;
  asin: string | null;
  title: string | null;
  detailUrl: string | null;
  price: AmazonMoney;
  availability: string | null;
  updatedAt: string;
  /** Last successful Amazon API fetch */
  source: "creators-api" | "manual";
  error?: string;
};

export type AmazonPriceStore = {
  updatedAt: string;
  marketplace: string;
  offers: Record<string, AmazonOffer>;
};
