import {
  DEFAULT_SITE_LOCALES,
  type AppLocale,
} from "@/i18n/locales";
import type { SiteConfig } from "./types";

export function siteShowsProducts(site: SiteConfig): boolean {
  return site.features?.products !== false;
}

/** Index /produits : catalogue SKU des thèmes produits. */
export function siteHasProductIndex(site: SiteConfig): boolean {
  return siteShowsProducts(site);
}

/** Locales allowed for this theme (others redirect to default). */
export function siteLocales(site: SiteConfig): AppLocale[] {
  return (site.locales?.length ? site.locales : DEFAULT_SITE_LOCALES) as AppLocale[];
}

export function siteAllowsLocale(site: SiteConfig, locale: string): boolean {
  return siteLocales(site).includes(locale as AppLocale);
}

/** Locales servies aux visiteurs. */
export function siteIndexesEnglish(site: SiteConfig): boolean {
  return site.features?.indexEnglish !== false;
}

/** Google : quelles locales indexer pour ce thème. */
export function siteIndexesLocale(site: SiteConfig, locale: string): boolean {
  if (!siteAllowsLocale(site, locale)) return false;
  if (!siteIndexesEnglish(site) && locale !== "fr") return false;
  return true;
}

export function siteIndexedLocales(site: SiteConfig): AppLocale[] {
  return siteLocales(site).filter((locale) => siteIndexesLocale(site, locale));
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

/** Cookie consent for ads / affiliate banners (AdSense, Kwanko, etc.). */
export function siteNeedsAdvertisingConsent(site: SiteConfig): boolean {
  return siteAllowsAdsense(site) || siteIsEuroMillions(site);
}

/** Lottery editorial theme — 18+ & responsible-play strip. */
export function siteNeedsGamblingDisclaimer(site: SiteConfig): boolean {
  return site.id === "euromillions";
}

export function siteIsEuroMillions(site: SiteConfig): boolean {
  return site.id === "euromillions";
}
