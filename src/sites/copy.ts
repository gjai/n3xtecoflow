import type { SiteId } from "./types";
import { getSiteById, sitesById } from "./index";

export function parseSiteIdParam(
  raw: string | null | undefined,
): SiteId | undefined {
  if (!raw) return undefined;
  return raw in sitesById ? (raw as SiteId) : undefined;
}

export function siteKnowsAbout(siteId: SiteId): string[] {
  return getSiteById(siteId).editorial.knowsAbout;
}

export function siteAmazonFallbackQuery(siteId: SiteId): string {
  return getSiteById(siteId).editorial.amazonQuery;
}

export function siteEditorialName(siteId: SiteId): string {
  return getSiteById(siteId).brand.name;
}

export function siteMainGuideSlug(siteId: SiteId): string | undefined {
  return getSiteById(siteId).editorial.mainGuideSlug;
}
