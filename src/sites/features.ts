import {
  DEFAULT_SITE_LOCALES,
  type AppLocale,
} from "@/i18n/locales";
import type { SiteConfig } from "./types";

export function siteShowsProducts(site: SiteConfig): boolean {
  return site.features?.products !== false;
}

/** Index /produits : catalogue SKU, ou accessoires Amazon EuroMillions. */
export function siteHasProductIndex(site: SiteConfig): boolean {
  return siteShowsProducts(site) || site.id === "euromillions";
}

/** Locales allowed for this theme (others redirect to default). */
export function siteLocales(site: SiteConfig): AppLocale[] {
  return (site.locales?.length ? site.locales : DEFAULT_SITE_LOCALES) as AppLocale[];
}

export function siteAllowsLocale(site: SiteConfig, locale: string): boolean {
  return siteLocales(site).includes(locale as AppLocale);
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

/** Casino / lottery editorial themes — 18+ & responsible-play strip. */
export function siteNeedsGamblingDisclaimer(site: SiteConfig): boolean {
  return site.id === "casinos-crypto" || site.id === "euromillions";
}

export function siteIsEuroMillions(site: SiteConfig): boolean {
  return site.id === "euromillions";
}

export function siteIsCasinosCrypto(site: SiteConfig): boolean {
  return site.id === "casinos-crypto";
}
