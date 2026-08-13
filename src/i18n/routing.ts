import { defineRouting } from "next-intl/routing";
import { APP_LOCALES } from "./locales";

export const routing = defineRouting({
  locales: [...APP_LOCALES],
  defaultLocale: "fr",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
