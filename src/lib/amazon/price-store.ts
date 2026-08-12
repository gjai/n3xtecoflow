import { promises as fs } from "fs";
import path from "path";
import type { AmazonOffer, AmazonPriceStore } from "./types";

const EMPTY: AmazonPriceStore = {
  updatedAt: new Date(0).toISOString(),
  marketplace: "www.amazon.fr",
  offers: {},
};

function dataPath() {
  return (
    process.env.AMAZON_PRICES_PATH?.trim() ||
    path.join(process.cwd(), "data", "amazon-prices.json")
  );
}

export async function readAmazonPriceStore(): Promise<AmazonPriceStore> {
  const file = dataPath();
  try {
    const raw = await fs.readFile(/*turbopackIgnore: true*/ file, "utf8");
    const parsed = JSON.parse(raw) as AmazonPriceStore;
    if (!parsed?.offers || typeof parsed.offers !== "object") return EMPTY;
    return parsed;
  } catch {
    try {
      const bundled = path.join(process.cwd(), "data", "amazon-prices.json");
      if (bundled !== file) {
        const raw = await fs.readFile(
          /*turbopackIgnore: true*/ bundled,
          "utf8",
        );
        return JSON.parse(raw) as AmazonPriceStore;
      }
    } catch {
      /* empty */
    }
    return { ...EMPTY, offers: {} };
  }
}

export async function writeAmazonPriceStore(
  store: AmazonPriceStore,
): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const next: AmazonPriceStore = {
    ...store,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    /*turbopackIgnore: true*/ file,
    JSON.stringify(next, null, 2) + "\n",
    "utf8",
  );
}

export async function getAmazonOffer(
  slug: string,
): Promise<AmazonOffer | null> {
  const store = await readAmazonPriceStore();
  return store.offers[slug] ?? null;
}

export async function getAmazonOffersMap(): Promise<
  Record<string, AmazonOffer>
> {
  const store = await readAmazonPriceStore();
  return store.offers;
}
