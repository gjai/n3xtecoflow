import type { Product } from "@/data/products";
import { getCategoryImage } from "@/data/images";
import type { AmazonOffer } from "@/lib/amazon/types";
import type { EcoflowCatalogEntry } from "@/lib/ecoflow/types";

export type ProductMedia = {
  src: string;
  altFr: string;
  altEn: string;
  credit: string;
  creditUrl: string;
  source: "ecoflow" | "amazon-cdn" | "static" | "category";
};

export type DisplayPrice = {
  display: string;
  amount: number | null;
  currency: string | null;
  /** Where the number comes from */
  source: "amazon" | "ecoflow";
  hintFr: string;
  hintEn: string;
  updatedAt?: string;
};

/** Public Amazon packshot CDN (no API). Works when ASIN is known. */
export function amazonPackshotUrl(asin: string, size = 500): string {
  return `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_SX${size}_.jpg`;
}

export function resolveProductMedia(
  product: Product,
  ecoflow: EcoflowCatalogEntry | null | undefined,
): ProductMedia {
  if (ecoflow?.imageSrc) {
    return {
      src: ecoflow.imageSrc,
      altFr: product.name,
      altEn: product.name,
      credit: "EcoFlow",
      creditUrl: ecoflow.productUrl || "https://fr.ecoflow.com",
      source: "ecoflow",
    };
  }

  if (product.imageSrc) {
    return {
      src: product.imageSrc,
      altFr: product.name,
      altEn: product.name,
      credit: "Amazon",
      creditUrl: "#",
      source: "static",
    };
  }

  if (product.amazonAsin) {
    return {
      src: amazonPackshotUrl(product.amazonAsin),
      altFr: product.name,
      altEn: product.name,
      credit: "Amazon",
      creditUrl: "#",
      source: "amazon-cdn",
    };
  }

  const cat = getCategoryImage(product.category);
  return {
    src: cat.src,
    altFr: product.name,
    altEn: product.name,
    credit: cat.credit,
    creditUrl: cat.creditUrl,
    source: "category",
  };
}

/**
 * Prix affiché :
 * 1) Amazon Creators (live) si dispo
 * 2) sinon prix catalogue EcoFlow.fr (indicatif — pas Amazon)
 */
export function resolveDisplayPrice(
  amazon: AmazonOffer | null | undefined,
  ecoflow: EcoflowCatalogEntry | null | undefined,
): DisplayPrice | null {
  if (amazon?.price?.display && amazon.price.amount != null) {
    return {
      display: amazon.price.display,
      amount: amazon.price.amount,
      currency: amazon.price.currency,
      source: "amazon",
      hintFr: `Prix Amazon.fr · maj. ${new Date(amazon.updatedAt).toLocaleString("fr-FR")}`,
      hintEn: `Amazon.fr price · updated ${new Date(amazon.updatedAt).toLocaleString("en-GB")}`,
      updatedAt: amazon.updatedAt,
    };
  }

  if (ecoflow?.priceDisplay && ecoflow.priceAmount != null) {
    return {
      display: ecoflow.priceDisplay,
      amount: ecoflow.priceAmount,
      currency: ecoflow.priceCurrency,
      source: "ecoflow",
      hintFr:
        "Prix catalogue EcoFlow.fr (indicatif — le prix Amazon peut différer)",
      hintEn:
        "EcoFlow.fr catalog price (indicative — Amazon price may differ)",
      updatedAt: ecoflow.updatedAt,
    };
  }

  return null;
}
