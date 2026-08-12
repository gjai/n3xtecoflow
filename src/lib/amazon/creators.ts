import { getAmazonTag } from "@/lib/amazon";

const API_BASE = "https://creatorsapi.amazon/catalog/v1";

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

export type CreatorsConfig = {
  credentialId: string;
  credentialSecret: string;
  /** 3.1 NA · 3.2 EU · 3.3 FE */
  version: string;
  marketplace: string;
  partnerTag: string;
};

export function getCreatorsConfig(): CreatorsConfig | null {
  const credentialId = process.env.AMAZON_CREATORS_CREDENTIAL_ID?.trim();
  const credentialSecret = process.env.AMAZON_CREATORS_CREDENTIAL_SECRET?.trim();
  if (!credentialId || !credentialSecret) return null;

  return {
    credentialId,
    credentialSecret,
    version: process.env.AMAZON_CREATORS_VERSION?.trim() || "3.2",
    marketplace:
      process.env.AMAZON_MARKETPLACE?.trim() || "www.amazon.fr",
    partnerTag: getAmazonTag(),
  };
}

function tokenEndpoint(version: string) {
  if (version.startsWith("3.1")) return "https://api.amazon.com/auth/o2/token";
  if (version.startsWith("3.3")) return "https://api.amazon.co.jp/auth/o2/token";
  return "https://api.amazon.co.uk/auth/o2/token";
}

async function getAccessToken(cfg: CreatorsConfig): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.accessToken;
  }

  const res = await fetch(tokenEndpoint(cfg.version), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: cfg.credentialId,
      client_secret: cfg.credentialSecret,
      scope: "creatorsapi::default",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`creators_token_failed:${res.status}:${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) throw new Error("creators_token_missing");

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in ?? 3600) * 1000,
  };
  return data.access_token;
}

const PRICE_RESOURCES = [
  "itemInfo.title",
  "offersV2.listings.price",
  "offersV2.listings.availability",
  "offersV2.listings.isBuyBoxWinner",
] as const;

export type CreatorsItem = {
  asin?: string;
  detailPageURL?: string;
  itemInfo?: {
    title?: { displayValue?: string };
  };
  offersV2?: {
    listings?: Array<{
      isBuyBoxWinner?: boolean;
      availability?: { message?: string; type?: string };
      price?: {
        money?: {
          amount?: number;
          currency?: string;
          displayAmount?: string;
        };
      };
    }>;
  };
};

async function postCatalog<T>(
  cfg: CreatorsConfig,
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const token = await getAccessToken(cfg);
  const res = await fetch(`${API_BASE}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": cfg.marketplace,
    },
    body: JSON.stringify({
      ...body,
      marketplace: cfg.marketplace,
      partnerTag: cfg.partnerTag,
      partnerType: "Associates",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`creators_${path}_failed:${res.status}:${text.slice(0, 300)}`);
  }

  return (await res.json()) as T;
}

export async function searchItems(
  cfg: CreatorsConfig,
  keywords: string,
): Promise<CreatorsItem[]> {
  const data = await postCatalog<{
    searchResult?: { items?: CreatorsItem[] };
  }>(cfg, "searchItems", {
    keywords,
    itemCount: 1,
    searchIndex: "All",
    resources: [...PRICE_RESOURCES],
  });
  return data.searchResult?.items ?? [];
}

export async function getItems(
  cfg: CreatorsConfig,
  asins: string[],
): Promise<CreatorsItem[]> {
  if (!asins.length) return [];
  const data = await postCatalog<{
    itemsResult?: { items?: CreatorsItem[] };
  }>(cfg, "getItems", {
    itemIds: asins.slice(0, 10),
    itemIdType: "ASIN",
    resources: [...PRICE_RESOURCES],
  });
  return data.itemsResult?.items ?? [];
}

export function pickListing(item: CreatorsItem) {
  const listings = item.offersV2?.listings ?? [];
  return (
    listings.find((l) => l.isBuyBoxWinner) ||
    listings.find((l) => l.price?.money?.displayAmount) ||
    listings[0] ||
    null
  );
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
