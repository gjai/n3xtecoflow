import type { Locale } from "./routing";

/** All locales the app can route (global). Per-site allow-lists filter further. */
export const APP_LOCALES = ["fr", "en", "it", "es", "pt", "de"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_SITE_LOCALES: AppLocale[] = ["fr", "en"];

export const CASINO_LOCALES: AppLocale[] = [
  "fr",
  "en",
  "it",
  "es",
  "pt",
  "de",
];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  fr: "Français",
  en: "English",
  it: "Italiano",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
};

export const OG_LOCALE: Record<AppLocale, string> = {
  fr: "fr_FR",
  en: "en_US",
  it: "it_IT",
  es: "es_ES",
  pt: "pt_PT",
  de: "de_DE",
};

export const DATE_LOCALE: Record<AppLocale, string> = {
  fr: "fr-FR",
  en: "en-US",
  it: "it-IT",
  es: "es-ES",
  pt: "pt-PT",
  de: "de-DE",
};

export function isAppLocale(value: string): value is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(value);
}

/** Prefer exact locale → en → fr. */
export function pickLocalized<T>(
  locale: string,
  map: Partial<Record<AppLocale | string, T>> & { fr: T; en?: T },
): T {
  if (map[locale] != null) return map[locale] as T;
  if (locale !== "fr" && map.en != null) return map.en;
  return map.fr;
}

export function toAppLocale(locale: string): AppLocale {
  return isAppLocale(locale) ? locale : "fr";
}

/** UI copy still authored in fr/en only → non-FR locales use English. */
export function usesEnglishFallback(locale: string): boolean {
  return locale !== "fr";
}

export type { Locale };
