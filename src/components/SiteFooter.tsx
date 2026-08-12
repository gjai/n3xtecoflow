"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  siteShowsComparisons,
  siteShowsNews,
  siteShowsProducts,
  siteUsesEditorialHome,
} from "@/sites/features";
import {
  CASINOS_CRYPTO_STAKE_GUIDE_SLUG,
  CASINOS_CRYPTO_VPN_GUIDE_SLUG,
} from "@/data/casinos-crypto-guides";
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

  const links = siteUsesEditorialHome(site)
    ? [
        { href: "/guides", label: t("guides") },
        {
          href: `/guides/${CASINOS_CRYPTO_STAKE_GUIDE_SLUG}`,
          label: "Stake",
        },
        {
          href: `/guides/${CASINOS_CRYPTO_VPN_GUIDE_SLUG}`,
          label: "VPN",
        },
        { href: "/a-propos", label: t("about") },
        { href: "/mentions-legales", label: t("legal") },
        { href: "/contact", label: t("contact") },
      ]
    : (
        [
          siteShowsProducts(site)
            ? { href: "/produits", label: t("products") }
            : null,
          { href: "/guides", label: t("guides") },
          siteShowsComparisons(site)
            ? { href: "/comparatifs", label: t("comparisons") }
            : null,
          siteShowsNews(site) ? { href: "/actualites", label: t("news") } : null,
          { href: "/a-propos", label: t("about") },
          { href: "/mentions-legales", label: t("legal") },
          { href: "/contact", label: t("contact") },
        ] as const
      ).filter(Boolean) as { href: string; label: string }[];

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
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-[var(--heading)]"
            >
              {l.label}
            </Link>
          ))}
          <CookieSettingsButton label={t("manageCookies")} />
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs text-[var(--muted)] sm:text-left">
            {t("rights", { year })}
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
