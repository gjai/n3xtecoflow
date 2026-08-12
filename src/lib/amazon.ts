export function getAmazonTag(): string {
  return process.env.AMAZON_ASSOCIATE_TAG?.trim() || "";
}

export function buildAmazonSearchUrl(query: string, tag?: string): string {
  const associateTag = tag ?? getAmazonTag();
  const params = new URLSearchParams({
    k: query,
  });
  if (associateTag) {
    params.set("tag", associateTag);
  }
  return `https://www.amazon.fr/s?${params.toString()}`;
}

export const AMAZON_QUERIES = {
  powerstream: "EcoFlow PowerStream",
  stations: "EcoFlow station électrique portable",
  camping: "EcoFlow camping panneau solaire",
} as const;
