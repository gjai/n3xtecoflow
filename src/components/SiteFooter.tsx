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
import { nextDrawAffiliateHref, nextDrawAffiliateRel } from "@/lib/fdj-play-links";
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
            rssHref={
              siteShowsNews(site)
                ? locale === "fr"
                  ? "/feed.xml"
                  : `/${locale}/feed.xml`
                : undefined
            }
            rssLabel={t.has("rss") ? t("rss") : "RSS"}
            contactLabel={t("contact")}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {links.map((l) => (
            siteIsEuroMillions(site) && l.href === "/prochain-tirage" ? (
              <a
                key={l.href}
                href={nextDrawAffiliateHref("euromillions")}
                rel={nextDrawAffiliateRel("euromillions")}
                target="_blank"
                className="hover:text-[var(--heading)]"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-[var(--heading)]"
              >
                {l.label}
              </Link>
            )
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

function SocialIcons({
  facebook,
  instagram,
  rssHref,
  rssLabel,
  contactLabel,
}: {
  facebook?: string;
  instagram?: string;
  rssHref?: string;
  rssLabel?: string;
  contactLabel: string;
}) {
  return (
    <div className="mt-4 flex items-center gap-2">
      {facebook ? (
        <SocialIcon href={facebook} label="Facebook" external>
          <path
            fill="currentColor"
            d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"
          />
        </SocialIcon>
      ) : null}
      {instagram ? (
        <SocialIcon href={instagram} label="Instagram" external>
          <path
            fill="currentColor"
            d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"
          />
        </SocialIcon>
      ) : null}
      {rssHref ? (
        <SocialIcon
          href={rssHref}
          label={rssLabel || "RSS"}
          type="application/rss+xml"
        >
          <path
            fill="currentColor"
            d="M6.18 15.64A2.18 2.18 0 0 1 8.36 17.82C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27zm0 5.66A9.9 9.9 0 0 1 13.9 20h-2.83A7.07 7.07 0 0 0 4 12.93z"
          />
        </SocialIcon>
      ) : null}
      <SocialIcon href="/contact" label={contactLabel} internal>
        <path
          fill="currentColor"
          d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4-8 5-8-5V6l8 5 8-5z"
        />
      </SocialIcon>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
  external,
  internal,
  type,
}: {
  href: string;
  label: string;
  children: ReactNode;
  external?: boolean;
  internal?: boolean;
  type?: string;
}) {
  const className =
    "inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--fog)] hover:bg-[var(--line)] hover:text-[var(--heading)]";
  const icon = (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      {children}
    </svg>
  );
  if (internal) {
    return (
      <Link href={href} aria-label={label} title={label} className={className}>
        {icon}
      </Link>
    );
  }
  return (
    <a
      href={href}
      type={type}
      rel={external ? "me noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      aria-label={label}
      title={label}
      className={className}
    >
      {icon}
    </a>
  );
}
