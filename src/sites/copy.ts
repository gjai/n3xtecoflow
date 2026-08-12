import type { SiteId } from "./types";
import { sitesById } from "./index";

/** Sites with flat catalog + single long buying guide. */
export function isFlatCatalogSite(siteId: SiteId): boolean {
  return siteId !== "ecoflow";
}

export function parseSiteIdParam(
  raw: string | null | undefined,
): SiteId | undefined {
  if (!raw) return undefined;
  return raw in sitesById ? (raw as SiteId) : undefined;
}

export function siteKnowsAbout(siteId: SiteId): string[] {
  if (siteId === "tumbler") {
    return [
      "Insulated bottles",
      "Tumblers",
      "Hydration",
      "Amazon bestsellers",
    ];
  }
  if (siteId === "massage-gun") {
    return [
      "Massage guns",
      "Percussion therapy",
      "Muscle recovery",
      "Amazon bestsellers",
    ];
  }
  return [
    "EcoFlow",
    "Portable power stations",
    "Balcony solar",
    "PowerStream",
  ];
}

export function siteAmazonFallbackQuery(siteId: SiteId): string {
  if (siteId === "tumbler") return "gourde isotherme";
  if (siteId === "massage-gun") return "pistolet de massage";
  return "EcoFlow station électrique";
}

export function siteEditorialName(siteId: SiteId): string {
  return sitesById[siteId]?.brand.name || "EcoFlow Stream";
}
