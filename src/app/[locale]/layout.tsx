import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Outfit, Sora } from "next/font/google";
import {
  OG_LOCALE,
  pickLocalized,
  toAppLocale,
  usesEnglishFallback,
} from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { AdSenseScript } from "@/components/AdSenseScript";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { ConsentProvider } from "@/components/ConsentProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { NetworkLinks } from "@/components/NetworkLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteProvider } from "@/components/SiteProvider";
import {
  ThemeProvider,
  themeInitScript,
} from "@/components/ThemeProvider";
import { getCurrentSite } from "@/sites/server";
import {
  siteAllowsAdsense,
  siteAllowsAmazon,
  siteAllowsLocale,
} from "@/sites/features";
import { siteThemeCss } from "@/sites/theme-css";
import "../globals.css";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const site = await getCurrentSite();
  const allowAds = siteAllowsAdsense(site);
  const adsenseClient = allowAds
    ? site.monetization?.adsenseClient?.trim() ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
      "ca-pub-4733644127583822"
    : "";
  const title = site.brand.name;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const description =
    tMeta("tagline") ||
    (usesEnglishFallback(locale)
      ? site.brand.taglineEn
      : site.brand.taglineFr);
  const { icons } = site.brand;
  const ogImage = site.heroImage || icons.apple || icons.favicon;
  const ogIsHero = Boolean(site.heroImage);

  return {
    title: {
      default: title,
      template: `%s · ${title}`,
    },
    description,
    metadataBase: new URL(`https://${site.primaryHost}`),
    icons: {
      icon: [{ url: icons.favicon, type: "image/svg+xml" }],
      shortcut: icons.icon32 || icons.favicon,
      apple: icons.apple || icons.favicon,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    ...(adsenseClient
      ? { other: { "google-adsense-account": adsenseClient } }
      : {}),
    openGraph: {
      title,
      description,
      locale: OG_LOCALE[toAppLocale(locale)],
      type: "website",
      siteName: title,
      url: `https://${site.primaryHost}`,
      images: [
        {
          url: ogImage,
          width: ogIsHero ? 1200 : 180,
          height: ogIsHero ? 630 : 180,
        },
      ],
    },
    twitter: {
      card: ogIsHero ? "summary_large_image" : "summary",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const site = await getCurrentSite();
  if (!siteAllowsLocale(site, locale)) {
    notFound();
  }
  const allowAds = siteAllowsAdsense(site);
  const adsenseClient = allowAds
    ? site.monetization?.adsenseClient?.trim() ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
      "ca-pub-4733644127583822"
    : "";
  const disclaimer = siteAllowsAmazon(site)
    ? pickLocalized(locale, {
        fr: "Site éditorial indépendant. Contient des liens d'affiliation Amazon.",
        en: "Independent editorial site. Contains Amazon affiliate links.",
      })
    : pickLocalized(locale, {
        fr: "18+. Jeu responsable. Risque de perte. Liens d'affiliation Stake, Crypto.com, NordVPN. Aide : Joueurs Info Service 09 74 75 13 13 / joueurs-info-service.fr.",
        en: "18+. Play responsibly. Risk of loss. Affiliate links: Stake, Crypto.com, NordVPN. France help: Joueurs Info Service 09 74 75 13 13 / joueurs-info-service.fr.",
      });

  return (
    <html
      lang={locale}
      data-site={site.id}
      className={`${display.variable} ${body.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <style
          id="site-theme"
          dangerouslySetInnerHTML={{ __html: siteThemeCss(site) }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* AdSense loader only when inventaire/slots are enabled — meta account stays for verification */}
        {allowAds &&
        adsenseClient &&
        process.env.NEXT_PUBLIC_ADSENSE_SLOTS === "1" ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="min-h-full antialiased">
        <NextIntlClientProvider messages={messages}>
          <SiteProvider site={site}>
            <ThemeProvider>
              <ConsentProvider>
                <AdSenseScript />
                <AnalyticsBeacon />
                <div className="flex min-h-full flex-col">
                  <SiteHeader />
                  <main className="flex-1">{children}</main>
                  <NetworkLinks />
                  <SiteFooter />
                </div>
                <CookieBanner />
                <p className="sr-only">{disclaimer}</p>
              </ConsentProvider>
            </ThemeProvider>
          </SiteProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
