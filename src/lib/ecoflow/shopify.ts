const STORE = "https://fr.ecoflow.com";

export type ShopifyProductJson = {
  product: {
    id: number;
    title: string;
    handle: string;
    body_html?: string;
    product_type?: string;
    tags?: string;
    images?: { src: string }[];
    variants?: {
      price: string;
      available: boolean;
      title?: string;
    }[];
  };
};

export async function fetchShopifyProduct(
  handle: string,
): Promise<ShopifyProductJson["product"] | null> {
  const url = `${STORE}/products/${encodeURIComponent(handle)}.json`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "n3xtecoflow-catalog-sync/1.0",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as ShopifyProductJson;
  return data.product ?? null;
}

export function stripHtml(html: string | undefined | null): string {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function shopifyImageSrc(src: string | undefined | null): string | null {
  if (!src) return null;
  try {
    const u = new URL(src);
    u.searchParams.set("width", "800");
    return u.toString();
  } catch {
    return src;
  }
}

export function productUrlForHandle(handle: string): string {
  return `${STORE}/products/${handle}`;
}
