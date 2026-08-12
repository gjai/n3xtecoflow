import type { Metadata } from "next";
import { Outfit, Sora } from "next/font/google";
import { headers } from "next/headers";
import { ecoflowSite } from "@/sites/ecoflow";
import { getSiteByHost } from "@/sites";
import { siteThemeCss } from "@/sites/theme-css";
import { themeInitScript } from "@/components/ThemeProvider";
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

export const metadata: Metadata = {
  title: "404 · EcoFlow Stream",
  robots: { index: false, follow: true },
};

/** Unmatched URLs outside [locale] pages (invalid locale, bare paths, etc.). */
export default async function GlobalNotFound() {
  const h = await headers();
  const site = getSiteByHost(h.get("host")) || ecoflowSite;
  const accept = (h.get("accept-language") || "fr").toLowerCase();
  const isEn = accept.startsWith("en");
  const homeHref = isEn ? "/en" : "/fr";

  const copy = isEn
    ? {
        title: "Page not found",
        body: "This URL doesn’t exist — or the content was moved. Back to the EcoFlow guides and catalog.",
        home: "Back home",
        products: "Products",
        guides: "Guides",
      }
    : {
        title: "Page introuvable",
        body: "Cette adresse n’existe pas — ou le contenu a été déplacé. Retour aux guides et au catalogue EcoFlow.",
        home: "Retour à l’accueil",
        products: "Produits",
        guides: "Guides",
      };

  return (
    <html
      lang={isEn ? "en" : "fr"}
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
        <main className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 py-20 md:px-8">
          <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.28em] text-[var(--accent)]">
            {site.brand.name}
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            404
          </p>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--heading)] md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-[var(--muted)] md:text-lg">
            {copy.body}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={homeHref}
              className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] transition hover:brightness-110"
            >
              {copy.home}
            </a>
            <a
              href={`${homeHref}/produits`}
              className="border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
            >
              {copy.products}
            </a>
            <a
              href={`${homeHref}/guides`}
              className="border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
            >
              {copy.guides}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
