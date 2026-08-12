import {
  categories,
  categorySiteId,
  getCategoriesForSite,
  getCategory,
  getLocalizedCategory,
  getLocalizedProduct,
  getProductsByCategory,
  getProductsForSite,
  products,
  type CategoryId,
  type Product,
} from "@/data/products";
import { amazonHrefForProduct } from "@/lib/amazon";
import type { EcoflowCatalogEntry } from "@/lib/ecoflow/types";
import {
  formatCapacityMl,
  parseCapacityMl,
} from "@/lib/product-capacity";
import { resolveDisplayPrice, resolveProductMedia } from "@/lib/product-presentation";
import { sitesById } from "@/sites";
import type { SiteId } from "@/sites/types";

/**
 * EcoFlow = hubs par gamme (RIVER, DELTA…).
 * Catalogue plat = un seul comparateur sur /comparatifs (tumbler + futurs).
 */
export function usesFlatComparison(siteId: SiteId): boolean {
  return usesFlatCatalog(sitesById[siteId] ?? { id: siteId });
}

/** Layout catalogue : flat vs catégories (futurs thèmes). */
export function usesFlatCatalog(site: {
  id: SiteId;
  catalogLayout?: "flat" | "categories";
}): boolean {
  if (site.catalogLayout) return site.catalogLayout === "flat";
  return site.id !== "ecoflow";
}

/** Produits mis en avant sur la home (layout flat). */
export function featuredProductsForHome(
  site: {
    featuredProductSlugs?: string[];
  },
  all: Product[],
  limit = 6,
): Product[] {
  if (site.featuredProductSlugs?.length) {
    const bySlug = new Map(all.map((p) => [p.slug, p]));
    return site.featuredProductSlugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is Product => Boolean(p));
  }
  return all.slice(0, limit);
}

/** Categories that make sense as comparison hubs (≥2 products). Empty when flat. */
export function comparisonHubCategories(siteId?: SiteId) {
  if (siteId && usesFlatComparison(siteId)) return [];
  const pool = siteId ? getCategoriesForSite(siteId) : categories;
  return pool.filter((c) => getProductsByCategory(c.id).length >= 2);
}

/** All products selectable in the flat site comparator. */
export function productsForSiteCompare(siteId: SiteId): Product[] {
  return getProductsForSite(siteId);
}

export function comparisonHubBelongsToSite(
  categoryId: CategoryId,
  siteId: SiteId,
) {
  const cat = getCategory(categoryId);
  return Boolean(cat && categorySiteId(cat) === siteId);
}


export function isComparisonHubSlug(slug: string): boolean {
  return Boolean(getCategory(slug));
}

export type CompareRow = {
  key: string;
  labelFr: string;
  labelEn: string;
  left: string;
  right: string;
};

export type CompareProductView = {
  slug: string;
  name: string;
  href: string;
  amazonHref: string;
  imageSrc: string;
  priceDisplay: string | null;
  priceSource: "amazon" | "ecoflow" | "indicative" | null;
  tagline: string;
  capacityWh?: number;
  outputW?: number;
  /** Volume liquide (ml) — thèmes gourdes / tumblers / futurs hors énergie */
  capacityMl?: number | null;
  capacityLabel?: string | null;
  weightKg?: number;
  /** Batterie (énergie) ou matière / construction (autres thèmes) */
  battery: string;
  specs: { label: string; value: string }[];
};

export function toCompareProductView(
  product: Product,
  locale: string,
  ecoflow: EcoflowCatalogEntry | null | undefined,
  amazonPriceDisplay?: string | null,
): CompareProductView {
  const copy = getLocalizedProduct(product, locale);
  const media = resolveProductMedia(product, ecoflow);
  const display = resolveDisplayPrice(
    amazonPriceDisplay
      ? {
          slug: product.slug,
          asin: product.amazonAsin || null,
          title: null,
          detailUrl: null,
          price: {
            amount: null,
            currency: "EUR",
            display: amazonPriceDisplay,
          },
          availability: null,
          updatedAt: new Date().toISOString(),
          source: "manual",
        }
      : null,
    ecoflow,
    product,
  );
  const capacityMl =
    product.capacityWh != null ? null : parseCapacityMl(product);

  return {
    slug: product.slug,
    name: product.name,
    href: `/produits/${product.category}/${product.slug}`,
    amazonHref: amazonHrefForProduct(product),
    imageSrc: media.src,
    priceDisplay: display?.display || null,
    priceSource: display?.source || null,
    tagline: copy.tagline,
    capacityWh: product.capacityWh,
    outputW: product.outputW,
    capacityMl,
    capacityLabel: formatCapacityMl(capacityMl, locale),
    weightKg: product.weightKg,
    battery: product.battery,
    specs: product.specs,
  };
}

function specOf(
  product: CompareProductView,
  ...needles: string[]
): string | null {
  const found = product.specs.find((s) =>
    needles.some((n) => s.label.toLowerCase().includes(n.toLowerCase())),
  );
  return found?.value || null;
}

/**
 * Lignes de comparaison adaptatives :
 * - énergie (Wh/W) si au moins un produit a capacityWh / outputW
 * - sinon volume ml + isolation + matière (gourdes / futurs thèmes hors énergie)
 */
export function buildCompareRows(
  left: CompareProductView,
  right: CompareProductView,
  locale: string,
): CompareRow[] {
  const isEn = locale === "en";
  const isPower = Boolean(
    left.capacityWh ||
      right.capacityWh ||
      left.outputW ||
      right.outputW,
  );
  const rows: CompareRow[] = [];
  const skipLabels = new Set<string>();

  if (isPower) {
    if (left.capacityWh || right.capacityWh) {
      rows.push({
        key: "capacity-wh",
        labelFr: "Capacité",
        labelEn: "Capacity",
        left: left.capacityWh ? `${left.capacityWh} Wh` : "—",
        right: right.capacityWh ? `${right.capacityWh} Wh` : "—",
      });
      skipLabels.add("capacité");
      skipLabels.add("capacity");
    }
    if (left.outputW || right.outputW) {
      rows.push({
        key: "output",
        labelFr: "Sortie AC",
        labelEn: "AC output",
        left: left.outputW ? `${left.outputW} W` : "—",
        right: right.outputW ? `${right.outputW} W` : "—",
      });
      skipLabels.add("sortie");
      skipLabels.add("output");
    }
    rows.push({
      key: "battery",
      labelFr: "Batterie",
      labelEn: "Battery",
      left: left.battery || "—",
      right: right.battery || "—",
    });
    skipLabels.add("batterie");
    skipLabels.add("battery");
    skipLabels.add("chimie");
  } else {
    const leftCap =
      left.capacityLabel && left.capacityLabel !== "—"
        ? left.capacityLabel
        : specOf(left, "Capacité", "Capacity") || "—";
    const rightCap =
      right.capacityLabel && right.capacityLabel !== "—"
        ? right.capacityLabel
        : specOf(right, "Capacité", "Capacity") || "—";
    rows.push({
      key: "capacity-ml",
      labelFr: "Capacité",
      labelEn: "Capacity",
      left: leftCap,
      right: rightCap,
    });
    skipLabels.add("capacité");
    skipLabels.add("capacity");

    const leftIso = specOf(left, "Isolation", "Insulation");
    const rightIso = specOf(right, "Isolation", "Insulation");
    if (leftIso || rightIso) {
      rows.push({
        key: "insulation",
        labelFr: "Isolation",
        labelEn: "Insulation",
        left: leftIso || "—",
        right: rightIso || "—",
      });
      skipLabels.add("isolation");
      skipLabels.add("insulation");
    }

    rows.push({
      key: "material",
      labelFr: "Matière",
      labelEn: "Material",
      left:
        specOf(left, "Matière", "Material") || left.battery || "—",
      right:
        specOf(right, "Matière", "Material") || right.battery || "—",
    });
    skipLabels.add("matière");
    skipLabels.add("material");
    skipLabels.add("batterie");
  }

  if (left.weightKg != null || right.weightKg != null) {
    rows.push({
      key: "weight",
      labelFr: "Poids",
      labelEn: "Weight",
      left: left.weightKg != null ? `${left.weightKg} kg` : "—",
      right: right.weightKg != null ? `${right.weightKg} kg` : "—",
    });
    skipLabels.add("poids");
    skipLabels.add("weight");
  }

  rows.push({
    key: "price",
    labelFr: "Prix indicatif",
    labelEn: "Indicative price",
    left: left.priceDisplay || (isEn ? "See Amazon" : "Voir Amazon"),
    right: right.priceDisplay || (isEn ? "See Amazon" : "Voir Amazon"),
  });

  const labels = new Set<string>();
  for (const s of [...left.specs, ...right.specs]) labels.add(s.label);
  for (const label of labels) {
    const low = label.toLowerCase();
    if ([...skipLabels].some((x) => low.includes(x))) continue;
    rows.push({
      key: `spec-${label}`,
      labelFr: label,
      labelEn: label,
      left: left.specs.find((s) => s.label === label)?.value || "—",
      right: right.specs.find((s) => s.label === label)?.value || "—",
    });
  }

  return rows;
}

/** Presets for legacy comparison URLs → hub + pair. */
export const LEGACY_COMPARISON_REDIRECTS: Record<
  string,
  { category: CategoryId; left: string; right: string }
> = {
  "river-vs-delta": { category: "delta", left: "river-2", right: "delta-2" },
  "delta-2-vs-delta-3": {
    category: "delta",
    left: "delta-2",
    right: "delta-3-classic",
  },
  "delta-vs-delta-pro": {
    category: "delta-pro",
    left: "delta-2-max",
    right: "delta-pro-3",
  },
  "powerstream-vs-station": {
    category: "stream",
    left: "stream-micro-onduleur",
    right: "delta-2",
  },
  "stream-vs-powerstream": {
    category: "stream",
    left: "stream-ultra-x",
    right: "stream-micro-onduleur",
  },
};

/** Products selectable in a hub (category + useful cross-links). */
export function productsForHub(categoryId: CategoryId): Product[] {
  const base = getProductsByCategory(categoryId);
  if (categoryId === "delta") {
    // allow comparing with RIVER flagship
    const river = products.filter((p) => p.slug === "river-2" || p.slug === "river-3-plus");
    return [...base, ...river.filter((r) => !base.some((b) => b.slug === r.slug))];
  }
  if (categoryId === "stream") {
    const extra = products.filter(
      (p) => p.slug === "powerstream" || p.slug === "delta-2",
    );
    return [...base, ...extra.filter((e) => !base.some((b) => b.slug === e.slug))];
  }
  if (categoryId === "delta-pro") {
    const extra = products.filter((p) => p.slug === "delta-2-max" || p.slug === "delta-3-max");
    return [...base, ...extra.filter((e) => !base.some((b) => b.slug === e.slug))];
  }
  return base;
}

export function hubTitle(categoryId: CategoryId, locale: string) {
  const cat = getCategory(categoryId);
  if (!cat) return locale === "en" ? "Compare" : "Comparer";
  const copy = getLocalizedCategory(cat, locale);
  return locale === "en"
    ? `Compare ${copy.title}`
    : `Comparer — ${copy.title}`;
}
