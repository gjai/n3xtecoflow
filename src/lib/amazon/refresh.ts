import { products, type Product } from "@/data/products";
import {
  getCreatorsConfig,
  getItems,
  pickListing,
  searchItems,
  sleep,
  type CreatorsItem,
} from "./creators";
import {
  readAmazonPriceStore,
  writeAmazonPriceStore,
} from "./price-store";
import type { AmazonOffer, AmazonPriceStore } from "./types";

export type RefreshPricesResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  refreshed: number;
  failed: number;
  total: number;
  marketplace?: string;
  errors: string[];
};

function offerFromItem(
  slug: string,
  item: CreatorsItem | null,
  fallbackUrl: string | null,
): AmazonOffer {
  const listing = item ? pickListing(item) : null;
  const money = listing?.price?.money;
  return {
    slug,
    asin: item?.asin ?? null,
    title: item?.itemInfo?.title?.displayValue ?? null,
    detailUrl: item?.detailPageURL ?? fallbackUrl,
    price: {
      amount: typeof money?.amount === "number" ? money.amount : null,
      currency: money?.currency ?? null,
      display: money?.displayAmount ?? null,
    },
    availability:
      listing?.availability?.message || listing?.availability?.type || null,
    updatedAt: new Date().toISOString(),
    source: "creators-api",
  };
}

function productKey(product: Product) {
  return product.slug;
}

export async function refreshAmazonPrices(options?: {
  /** Limit how many products to refresh (debug) */
  limit?: number;
  /** Prefer SearchItems even when ASIN known */
  forceSearch?: boolean;
}): Promise<RefreshPricesResult> {
  const cfg = getCreatorsConfig();
  if (!cfg) {
    return {
      ok: false,
      skipped: true,
      reason: "missing_creators_credentials",
      refreshed: 0,
      failed: 0,
      total: 0,
      errors: [
        "Set AMAZON_CREATORS_CREDENTIAL_ID + AMAZON_CREATORS_CREDENTIAL_SECRET (Associates Central → Tools → Creators API).",
      ],
    };
  }

  const store = await readAmazonPriceStore();
  const list = products.slice(0, options?.limit ?? products.length);
  const errors: string[] = [];
  let refreshed = 0;
  let failed = 0;

  const needSearch: Product[] = [];
  const needGet: { product: Product; asin: string }[] = [];

  for (const product of list) {
    const existing = store.offers[productKey(product)];
    const asin = product.amazonAsin || existing?.asin || null;
    if (asin && !options?.forceSearch) {
      needGet.push({ product, asin });
    } else {
      needSearch.push(product);
    }
  }

  // Batch GetItems by 10
  for (let i = 0; i < needGet.length; i += 10) {
    const batch = needGet.slice(i, i + 10);
    try {
      const items = await getItems(
        cfg,
        batch.map((b) => b.asin),
      );
      const byAsin = new Map(
        items.filter((it) => it.asin).map((it) => [it.asin!, it]),
      );
      for (const { product, asin } of batch) {
        const item = byAsin.get(asin) ?? null;
        store.offers[productKey(product)] = offerFromItem(
          productKey(product),
          item,
          store.offers[productKey(product)]?.detailUrl ?? null,
        );
        if (item && pickListing(item)?.price?.money?.displayAmount) {
          refreshed += 1;
        } else {
          failed += 1;
          errors.push(`${product.slug}:no_price`);
        }
      }
    } catch (err) {
      failed += batch.length;
      errors.push(
        `getItems:${err instanceof Error ? err.message : String(err)}`,
      );
    }
    await sleep(1100);
  }

  for (const product of needSearch) {
    try {
      const items = await searchItems(cfg, product.amazonQuery);
      const item = items[0] ?? null;
      store.offers[productKey(product)] = offerFromItem(
        productKey(product),
        item,
        null,
      );
      if (item && pickListing(item)?.price?.money?.displayAmount) {
        refreshed += 1;
      } else {
        failed += 1;
        errors.push(`${product.slug}:no_search_price`);
      }
    } catch (err) {
      failed += 1;
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${product.slug}:${msg}`);
      const prev = store.offers[productKey(product)];
      if (prev) {
        store.offers[productKey(product)] = {
          ...prev,
          error: msg,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    await sleep(1100);
  }

  const next: AmazonPriceStore = {
    ...store,
    marketplace: cfg.marketplace,
    updatedAt: new Date().toISOString(),
  };
  await writeAmazonPriceStore(next);

  return {
    ok: refreshed > 0,
    refreshed,
    failed,
    total: list.length,
    marketplace: cfg.marketplace,
    errors: errors.slice(0, 40),
  };
}
