import type { SiteConfig } from "./types";
import {
  siteAllowsLocale,
  siteIsCasinosCrypto,
  siteIsEuroMillions,
  siteLocales,
  siteShowsNews,
  siteShowsProducts,
} from "./features";

export type NotFoundCta = {
  href: string;
  /** Clé i18n `notFound.*` */
  labelKey: "home" | "products" | "guides" | "news";
  primary?: boolean;
};

export function siteNotFoundCtas(site: SiteConfig): NotFoundCta[] {
  const ctas: NotFoundCta[] = [
    { href: "/", labelKey: "home", primary: true },
  ];
  if (siteIsEuroMillions(site)) {
    ctas.push({ href: "/tirages", labelKey: "products" });
  } else if (siteShowsProducts(site)) {
    ctas.push({ href: "/produits", labelKey: "products" });
  }
  ctas.push({ href: "/guides", labelKey: "guides" });
  if (siteIsCasinosCrypto(site) && siteShowsNews(site)) {
    ctas.push({ href: "/actualites", labelKey: "news" });
  }
  return ctas;
}

export function siteNotFoundCopy(
  site: SiteConfig,
  isEn: boolean,
): { title: string; body: string } {
  const name = site.brand.name;
  if (siteIsEuroMillions(site)) {
    return {
      title: isEn ? "Page not found" : "Page introuvable",
      body: isEn
        ? "This address does not exist — back to EuroMillions results."
        : "Cette adresse n’existe pas — retour aux résultats EuroMillions.",
    };
  }
  if (siteIsCasinosCrypto(site)) {
    return {
      title: isEn ? "Page not found" : "Page introuvable",
      body: isEn
        ? "This address does not exist — back to the Casinos Crypto guides."
        : "Cette adresse n’existe pas — retour aux guides Casinos Crypto.",
    };
  }
  if (site.id === "tumbler" || site.id === "massage-gun") {
    return {
      title: isEn ? "Page not found" : "Page introuvable",
      body: isEn
        ? `This address does not exist — back to ${name} guides and catalog.`
        : `Cette adresse n’existe pas — retour aux guides et au catalogue ${name}.`,
    };
  }
  return {
    title: isEn ? "Page not found" : "Page introuvable",
    body: isEn
      ? "This address doesn’t exist — or the content was moved. Back to the EcoFlow guides and catalog."
      : "Cette adresse n’existe pas — ou le contenu a été déplacé. Retour aux guides et au catalogue EcoFlow.",
  };
}

export function ctaLabel(
  key: NotFoundCta["labelKey"],
  isEn: boolean,
  t?: (key: string) => string,
): string {
  if (t) {
    try {
      const v = t(key);
      if (v && v !== key) return v;
    } catch {
      /* overlay may omit news */
    }
  }
  const fr: Record<NotFoundCta["labelKey"], string> = {
    home: "Retour à l’accueil",
    products: "Produits",
    guides: "Guides",
    news: "Actualités",
  };
  const en: Record<NotFoundCta["labelKey"], string> = {
    home: "Back to home",
    products: "Products",
    guides: "Guides",
    news: "News",
  };
  return isEn ? en[key] : fr[key];
}

export function localeFromHeaders(
  h: Headers,
  site: SiteConfig,
): string {
  const path =
    h.get("x-pathname") ||
    h.get("next-url") ||
    h.get("x-invoke-path") ||
    "";
  const seg = path.split("/").filter(Boolean)[0];
  if (seg && siteAllowsLocale(site, seg)) return seg;

  const cookie = h.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  if (m?.[1] && siteAllowsLocale(site, m[1])) return m[1];

  const accept = (h.get("accept-language") || "fr").toLowerCase();
  if (accept.startsWith("en") && siteAllowsLocale(site, "en")) return "en";
  return siteLocales(site)[0] || "fr";
}

export function withLocalePrefix(locale: string, href: string): string {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}
