"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteLogo } from "./SiteLogo";
import { ThemeToggle } from "./ThemeToggle";
import { useSite } from "./SiteProvider";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const site = useSite();
  const locale = useLocale();
  const year = new Date().getFullYear();
  const blurb =
    locale === "en" ? site.brand.footerBlurbEn : site.brand.footerBlurbFr;

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)] text-[var(--fog)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <Link href="/" className="inline-block">
            <SiteLogo variant="footer" />
          </Link>
          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{blurb}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/produits" className="hover:text-[var(--heading)]">
            {t("products")}
          </Link>
          <Link href="/guides" className="hover:text-[var(--heading)]">
            {t("guides")}
          </Link>
          <Link href="/comparatifs" className="hover:text-[var(--heading)]">
            {t("comparisons")}
          </Link>
          <Link href="/actualites" className="hover:text-[var(--heading)]">
            {t("news")}
          </Link>
          <Link href="/a-propos" className="hover:text-[var(--heading)]">
            {t("about")}
          </Link>
          <Link href="/mentions-legales" className="hover:text-[var(--heading)]">
            {t("legal")}
          </Link>
          <Link href="/contact" className="hover:text-[var(--heading)]">
            {t("contact")}
          </Link>
          <CookieSettingsButton label={t("manageCookies")} />
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs text-[var(--muted)] sm:text-left">
            {t("rights", { year }).replace("EcoFlow Stream", site.brand.name)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ThemeToggle locale={locale} />
            <LanguageSwitcher label={tNav("language")} />
          </div>
        </div>
      </div>
    </footer>
  );
}
