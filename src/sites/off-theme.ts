import { isAppLocale } from "@/i18n/locales";
import { GUIDE_TOPICS, guideSiteId } from "@/lib/guides/types";
import {
  siteShowsComparisons,
  siteShowsProducts,
} from "@/sites/features";
import type { SiteConfig } from "@/sites/types";

const EURO_MILLIONS_PREFIXES = [
  "/tirages",
  "/jeux",
  "/generateur",
  "/prochain-tirage",
  "/my-million",
  "/alerte-email",
  "/simulateur",
  "/stats",
] as const;

function withLocale(locale: string, path: string): string {
  if (!path || path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

function startsWithPath(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * URLs d’un autre thème (même app Next) → 308 vers une page indexable du Host.
 * Évite les 404 + noindex que Search Console remonte (ex. /powerstream sur
 * casinos-crypto.fr).
 */
export function offThemeFallbackPath(
  site: SiteConfig,
  pathname: string,
): string | null {
  const parts = pathname.split("/").filter(Boolean);
  const locale = parts[0] && isAppLocale(parts[0]) ? parts[0] : null;
  const rest = `/${(locale ? parts.slice(1) : parts).join("/")}`.replace(
    /\/$/,
    "",
  ) || "/";
  const loc = locale || siteLocalesFallback(site);

  if (!siteShowsProducts(site) && startsWithPath(rest, "/produits")) {
    return withLocale(loc, "/guides");
  }
  if (
    !siteShowsComparisons(site) &&
    startsWithPath(rest, "/comparatifs")
  ) {
    return withLocale(loc, site.id === "euromillions" ? "/" : "/guides");
  }
  if (site.id !== "ecoflow" && startsWithPath(rest, "/powerstream")) {
    return withLocale(loc, "/");
  }
  if (site.id !== "euromillions") {
    if (EURO_MILLIONS_PREFIXES.some((p) => startsWithPath(rest, p))) {
      return withLocale(loc, "/");
    }
  }

  if (startsWithPath(rest, "/guides")) {
    const slug = rest.slice("/guides".length).replace(/^\//, "").split("/")[0];
    if (slug) {
      const topic = GUIDE_TOPICS.find((t) => t.slug === slug);
      if (topic && guideSiteId(topic) !== site.id) {
        return withLocale(loc, "/guides");
      }
    }
  }

  return null;
}

function siteLocalesFallback(site: SiteConfig): string {
  return site.locales?.[0] || "fr";
}
