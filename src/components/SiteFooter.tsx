"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LOTTERY_GAMES_NAV, lotteryGameLabel } from "@/lib/fdj-games/nav";
import {
  siteIsCasinosCrypto,
  siteIsEuroMillions,
  siteShowsComparisons,
  siteShowsNews,
  siteShowsProducts,
} from "@/sites/features";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { GamblingDisclaimer } from "./GamblingDisclaimer";
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
  const blurb = t.has("blurb")
    ? t("blurb")
    : locale === "fr"
      ? site.brand.footerBlurbFr
      : site.brand.footerBlurbEn;

  const links = siteIsEuroMillions(site)
    ? [
        ...LOTTERY_GAMES_NAV.map((g) => ({
          href: g.href,
          label: lotteryGameLabel(g, locale),
        })),
        { href: "/prochain-tirage", label: tNav("nextDraw") },
        { href: "/alerte-email", label: tNav("alert") },
        { href: "/jeux", label: tNav("otherGames") },
        { href: "/guides", label: t("guides") },
        { href: "/actualites", label: t("news") },
        { href: "/a-propos", label: t("about") },
        { href: "/mentions-legales", label: t("legal") },
        { href: "/contact", label: t("contact") },
      ]
    : siteIsCasinosCrypto(site)
      ? (
          [
            { href: "/guides", label: t("guides") },
            siteShowsNews(site)
              ? { href: "/actualites", label: t("news") }
              : null,
            { href: "/a-propos", label: t("about") },
            { href: "/mentions-legales", label: t("legal") },
            { href: "/contact", label: t("contact") },
          ] as const
        ).filter(Boolean) as { href: string; label: string }[]
      : (
          [
            siteShowsProducts(site)
              ? { href: "/produits", label: t("products") }
              : null,
            { href: "/guides", label: t("guides") },
            siteShowsComparisons(site)
              ? { href: "/comparatifs", label: t("comparisons") }
              : null,
            siteShowsNews(site)
              ? { href: "/actualites", label: t("news") }
              : null,
            { href: "/a-propos", label: t("about") },
            { href: "/mentions-legales", label: t("legal") },
            { href: "/contact", label: t("contact") },
          ] as const
        ).filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)] text-[var(--fog)]">
      <GamblingDisclaimer />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <Link href="/" className="inline-block">
            <SiteLogo variant="footer" />
          </Link>
          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{blurb}</p>
          <SocialIcons
            facebook={site.socials?.facebook}
            instagram={site.socials?.instagram}
          />
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
          {siteShowsNews(site) ? (
            <a
              href={locale === "fr" ? "/feed.xml" : `/${locale}/feed.xml`}
              type="application/rss+xml"
              className="hover:text-[var(--heading)]"
            >
              {t.has("rss") ? t("rss") : "RSS"}
            </a>
          ) : null}
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

function SocialIcons({
  facebook,
  instagram,
}: {
  facebook?: string;
  instagram?: string;
}) {
  if (!facebook && !instagram) return null;
  return (
    <div className="mt-4 flex items-center gap-2">
      {facebook ? (
        <SocialIcon href={facebook} label="Facebook">
          <path
            fill="currentColor"
            d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"
          />
        </SocialIcon>
      ) : null}
      {instagram ? (
        <SocialIcon href={instagram} label="Instagram">
          <path
            fill="currentColor"
            d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"
          />
        </SocialIcon>
      ) : null}
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      rel="me noopener noreferrer"
      target="_blank"
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--fog)] hover:bg-[var(--line)] hover:text-[var(--heading)]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
