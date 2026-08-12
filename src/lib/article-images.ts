import {
  getEditorialImages,
  type SiteImage,
} from "@/data/images";
import { products, type Product } from "@/data/products";
import type { EcoflowCatalogEntry } from "@/lib/ecoflow/types";
import {
  amazonPackshotUrl,
  resolveProductMedia,
} from "@/lib/product-presentation";
import type { SiteId } from "@/sites/types";

/** Produits représentatifs par article (guides / comparatifs). */
export const ARTICLE_PRODUCT_SLUGS: Record<string, string[]> = {
  // Guides
  "choisir-station": ["delta-2", "river-2"],
  "dimensionnement-wh": ["delta-2", "river-2-pro"],
  "solaire-portable": ["panneau-220w-bifacial", "panneau-400w"],
  "backup-maison": ["delta-pro-3", "smart-home-panel"],
  "camping-van": ["river-2-pro", "glacier-classic"],
  "stream-balcon": ["stream-ultra-x", "stream-micro-onduleur"],
  "delta-pro-autonomie": ["delta-pro-3", "delta-pro-ultra"],
  "glacier-froid": ["glacier-classic", "river-2-pro"],
  "wave-clim": ["wave-3", "delta-2"],
  "recharge-rapide": ["delta-3-classic", "river-3-plus"],
  "ups-coupures": ["delta-2", "delta-pro-3"],
  "premier-achat": ["river-2", "delta-2"],
  // Tumbler — guide unique
  "choisir-gourde-isotherme": [
    "super-sparrow-500",
    "stanley-quencher-12l",
    "owala-freesip-710",
  ],
  // Hubs comparatifs (cover)
  river: ["river-2", "river-3-plus"],
  delta: ["delta-2", "delta-3-classic"],
  "delta-pro": ["delta-pro-3", "delta-2-max"],
  stream: ["stream-ultra-x", "stream-micro-onduleur"],
  powerstream: ["powerstream", "stream-micro-onduleur"],
  solaire: ["panneau-220w-bifacial", "panneau-400w"],
  outdoor: ["glacier-classic", "wave-3"],
  ocean: ["ocean-2-plus", "delta-pro-3"],
  // Comparatifs legacy (redirects)
  "river-vs-delta": ["river-2", "delta-2"],
  "delta-2-vs-delta-3": ["delta-2", "delta-3-classic"],
  "delta-vs-delta-pro": ["delta-2-max", "delta-pro-3"],
  "powerstream-vs-station": ["stream-micro-onduleur", "delta-2"],
  "stream-vs-powerstream": ["stream-ultra-x", "stream-micro-onduleur"],
};

export type ArticleCoverImage = SiteImage & {
  productSlug?: string;
};

function findProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function resolveArticleProductImages(
  articleSlug: string,
  ecoflowMap: Record<string, EcoflowCatalogEntry>,
): ArticleCoverImage[] {
  const slugs = ARTICLE_PRODUCT_SLUGS[articleSlug] || [];
  const images: ArticleCoverImage[] = [];

  for (const productSlug of slugs) {
    const product = findProductBySlug(productSlug);
    if (!product) continue;
    const media = resolveProductMedia(product, ecoflowMap[productSlug]);
    // Prefer real packshots over category lifestyle for article cards
    if (media.source === "category") {
      if (product.amazonAsin) {
        images.push({
          src: amazonPackshotUrl(product.amazonAsin),
          altFr: product.name,
          altEn: product.name,
          credit: "Amazon",
          creditUrl: "#",
          productSlug,
        });
        continue;
      }
      continue;
    }
    images.push({
      src: media.src,
      altFr: product.name,
      altEn: product.name,
      credit: media.credit,
      creditUrl: media.creditUrl,
      productSlug,
    });
  }

  return images;
}

/** Image principale (1re) ou fallback éditorial. */
export function resolveArticlePrimaryImage(
  articleSlug: string,
  kind: "guide" | "comparison",
  ecoflowMap: Record<string, EcoflowCatalogEntry>,
  siteId: SiteId = "ecoflow",
): SiteImage {
  const images = resolveArticleProductImages(articleSlug, ecoflowMap);
  if (images[0]) return images[0];
  const editorial = getEditorialImages(siteId);
  return kind === "comparison" ? editorial.comparatifs : editorial.guides;
}
