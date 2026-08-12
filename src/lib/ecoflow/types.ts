export type EcoflowCatalogEntry = {
  slug: string;
  handle: string;
  title: string | null;
  imageSrc: string | null;
  priceAmount: number | null;
  priceCurrency: "EUR";
  priceDisplay: string | null;
  available: boolean | null;
  productUrl: string | null;
  updatedAt: string;
  error?: string;
};

export type EcoflowCatalogStore = {
  updatedAt: string;
  source: string;
  entries: Record<string, EcoflowCatalogEntry>;
};
