import { defineRouting } from "next-intl/routing";
import { APP_LOCALES } from "./locales";

export const routing = defineRouting({
  locales: [...APP_LOCALES],
  defaultLocale: "fr",
  localePrefix: "always",
  // Hreflang = metadata `siteLocaleAlternates` (locales du Host), pas toutes les locales app.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
