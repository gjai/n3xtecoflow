import type { Metadata } from "next";
import { Outfit, Sora } from "next/font/google";
import { headers } from "next/headers";
import { NotFoundContent } from "@/components/NotFoundContent";
import { themeInitScript } from "@/components/ThemeProvider";
import { getSiteByHost } from "@/sites";
import {
  ctaLabel,
  localeFromHeaders,
  siteNotFoundCopy,
  siteNotFoundCtas,
  withLocalePrefix,
} from "@/sites/not-found";
import { siteThemeCss } from "@/sites/theme-css";
import "./globals.css";

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

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const site = getSiteByHost(h.get("host"));
  return {
    title: `404 · ${site.brand.name}`,
    robots: { index: false, follow: true },
    icons: {
      icon: [{ url: site.brand.icons.favicon, type: "image/svg+xml" }],
    },
  };
}

/** Unmatched URLs (globalNotFound) — thème d’après le Host, pas EcoFlow. */
export default async function GlobalNotFound() {
  const h = await headers();
  const site = getSiteByHost(h.get("host"));
  const locale = localeFromHeaders(h, site);
  const isEn = locale === "en";
  const copy = siteNotFoundCopy(site, isEn);

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
      </head>
      <body className="min-h-full antialiased">
        <NotFoundContent
          brand={site.brand.name}
          title={copy.title}
          body={copy.body}
          links={siteNotFoundCtas(site).map((cta) => ({
            href: withLocalePrefix(locale, cta.href),
            label: ctaLabel(cta.labelKey, isEn),
            primary: cta.primary,
          }))}
        />
      </body>
    </html>
  );
}
