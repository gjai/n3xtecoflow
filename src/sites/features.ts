import type { SiteConfig } from "./types";

export function siteShowsProducts(site: SiteConfig): boolean {
  return site.features?.products !== false;
}

export function siteShowsComparisons(site: SiteConfig): boolean {
  return site.features?.comparisons !== false;
}

export function siteShowsNews(site: SiteConfig): boolean {
  return site.features?.news !== false;
}

export function siteUsesEditorialHome(site: SiteConfig): boolean {
  return Boolean(site.features?.editorialHome);
}

export function siteAllowsAmazon(site: SiteConfig): boolean {
  return site.monetization?.disableAmazon !== true;
}

export function siteAllowsAdsense(site: SiteConfig): boolean {
  return site.monetization?.disableAdsense !== true;
}
