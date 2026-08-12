export function getAmazonTag(): string {
  return process.env.AMAZON_ASSOCIATE_TAG?.trim() || "ecoflown3xt-21";
}

export function buildAmazonSearchUrl(query: string, tag?: string): string {
  const associateTag = tag ?? getAmazonTag();
  const params = new URLSearchParams({
    k: query,
    i: "aps",
  });
  if (associateTag) {
    params.set("tag", associateTag);
    params.set("linkCode", "ll2");
    params.set("language", "fr_FR");
  }
  return `https://www.amazon.fr/s?${params.toString()}`;
}

export function buildAmazonProductUrl(asin: string, tag?: string): string {
  const associateTag = tag ?? getAmazonTag();
  const params = new URLSearchParams({
    language: "fr_FR",
    th: "1",
  });
  if (associateTag) {
    params.set("tag", associateTag);
    params.set("linkCode", "ogi");
  }
  return `https://www.amazon.fr/dp/${asin}?${params.toString()}`;
}

/** Affiliates-friendly product image (Amazon CDN). */
export function amazonProductImageUrl(asin: string, size = 500): string {
  return `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_SX${size}_.jpg`;
}

/** Prefer ASIN deep-link when known; otherwise Amazon search. */
export function amazonHrefForProduct(product: {
  amazonAsin?: string;
  amazonQuery: string;
}): string {
  if (product.amazonAsin) {
    return buildAmazonProductUrl(product.amazonAsin);
  }
  return buildAmazonSearchUrl(product.amazonQuery);
}

export function buildAmazonProductSearchUrl(
  keywords: string,
  options?: { tag?: string },
): string {
  return buildAmazonSearchUrl(keywords, options?.tag);
}

export const AMAZON_QUERIES = {
  powerstream: "EcoFlow PowerStream",
  stream: "EcoFlow STREAM",
  stations: "EcoFlow station électrique portable",
  delta: "EcoFlow DELTA",
  river: "EcoFlow RIVER",
  camping: "EcoFlow camping panneau solaire",
  glacier: "EcoFlow GLACIER",
  wave: "EcoFlow WAVE",
} as const;
