import { pickLocalized } from "@/i18n/locales";
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
  if (siteShowsNews(site)) {
    ctas.push({ href: "/actualites", labelKey: "news" });
  }
  return ctas;
}

const EM_COPY = {
  fr: {
    title: "Page introuvable",
    body: "Cette adresse n’existe pas — retour aux résultats EuroMillions.",
  },
  en: {
    title: "Page not found",
    body: "This address does not exist — back to EuroMillions results.",
  },
  it: {
    title: "Pagina non trovata",
    body: "Questo indirizzo non esiste — torna ai risultati EuroMillions.",
  },
  es: {
    title: "Página no encontrada",
    body: "Esta dirección no existe — vuelve a los resultados EuroMillions.",
  },
  pt: {
    title: "Página não encontrada",
    body: "Este endereço não existe — volte aos resultados EuroMillions.",
  },
  de: {
    title: "Seite nicht gefunden",
    body: "Diese Adresse existiert nicht — zurück zu den EuroMillions-Ergebnissen.",
  },
  nl: {
    title: "Pagina niet gevonden",
    body: "Dit adres bestaat niet — terug naar de EuroMillions-uitslagen.",
  },
} as const;

const CTA_COPY = {
  fr: {
    home: "Retour à l’accueil",
    products: "Produits",
    guides: "Guides",
    news: "Actualités",
  },
  en: {
    home: "Back to home",
    products: "Products",
    guides: "Guides",
    news: "News",
  },
  it: {
    home: "Torna alla home",
    products: "Prodotti",
    guides: "Guide",
    news: "Notizie",
  },
  es: {
    home: "Volver al inicio",
    products: "Productos",
    guides: "Guías",
    news: "Noticias",
  },
  pt: {
    home: "Voltar ao início",
    products: "Produtos",
    guides: "Guias",
    news: "Notícias",
  },
  de: {
    home: "Zur Startseite",
    products: "Produkte",
    guides: "Guides",
    news: "News",
  },
  nl: {
    home: "Terug naar home",
    products: "Producten",
    guides: "Gidsen",
    news: "Nieuws",
  },
} as const;

const EM_PRODUCTS_CTA = {
  fr: "Résultats",
  en: "Results",
  it: "Risultati",
  es: "Resultados",
  pt: "Resultados",
  de: "Ergebnisse",
  nl: "Uitslagen",
} as const;

export function siteNotFoundCopy(
  site: SiteConfig,
  locale: string,
): { title: string; body: string } {
  const name = site.brand.name;
  const isEn = locale === "en";
  if (siteIsEuroMillions(site)) {
    return pickLocalized(locale, EM_COPY);
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
  locale: string,
  t?: (key: string) => string,
  site?: SiteConfig,
): string {
  if (t) {
    try {
      const v = t(key);
      if (v && v !== key) return v;
    } catch {
      /* overlay may omit news */
    }
  }
  if (key === "products" && site && siteIsEuroMillions(site)) {
    return pickLocalized(locale, EM_PRODUCTS_CTA);
  }
  return pickLocalized(locale, CTA_COPY)[key];
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
