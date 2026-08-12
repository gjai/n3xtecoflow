import { products } from "@/data/products";
import { ECOFLOW_HANDLES } from "./handles";
import {
  readEcoflowCatalogStore,
  writeEcoflowCatalogStore,
} from "./catalog-store";
import {
  fetchShopifyProduct,
  formatEur,
  productUrlForHandle,
  shopifyImageSrc,
} from "./shopify";
import type { EcoflowCatalogEntry, EcoflowCatalogStore } from "./types";

export type RefreshEcoflowResult = {
  ok: boolean;
  refreshed: number;
  failed: number;
  total: number;
  source: string;
  errors: string[];
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function refreshEcoflowCatalog(options?: {
  limit?: number;
}): Promise<RefreshEcoflowResult> {
  const store = await readEcoflowCatalogStore();
  const mapped = products.filter((p) => ECOFLOW_HANDLES[p.slug]);
  const list = mapped.slice(0, options?.limit ?? mapped.length);
  const errors: string[] = [];
  let refreshed = 0;
  let failed = 0;
  const entries: Record<string, EcoflowCatalogEntry> = { ...store.entries };
  const now = new Date().toISOString();

  for (const product of list) {
    const handle = ECOFLOW_HANDLES[product.slug];
    try {
      const shop = await fetchShopifyProduct(handle);
      if (!shop) {
        failed += 1;
        errors.push(`${product.slug}: handle_not_found (${handle})`);
        entries[product.slug] = {
          slug: product.slug,
          handle,
          title: null,
          imageSrc: null,
          priceAmount: null,
          priceCurrency: "EUR",
          priceDisplay: null,
          available: null,
          productUrl: productUrlForHandle(handle),
          updatedAt: now,
          error: "handle_not_found",
        };
        continue;
      }

      const variant = shop.variants?.[0];
      const amountRaw = variant?.price ? Number(variant.price) : NaN;
      const amount = Number.isFinite(amountRaw) ? amountRaw : null;
      const imageSrc = shopifyImageSrc(shop.images?.[0]?.src);

      entries[product.slug] = {
        slug: product.slug,
        handle,
        title: shop.title,
        imageSrc,
        priceAmount: amount,
        priceCurrency: "EUR",
        priceDisplay: amount != null ? formatEur(amount) : null,
        available: variant?.available ?? null,
        productUrl: productUrlForHandle(handle),
        updatedAt: now,
      };
      refreshed += 1;
    } catch (err) {
      failed += 1;
      const msg = err instanceof Error ? err.message : "unknown";
      errors.push(`${product.slug}: ${msg}`);
    }
    await sleep(120);
  }

  const next: EcoflowCatalogStore = {
    updatedAt: now,
    source: "https://fr.ecoflow.com",
    entries,
  };
  await writeEcoflowCatalogStore(next);

  return {
    ok: failed === 0,
    refreshed,
    failed,
    total: list.length,
    source: next.source,
    errors,
  };
}
