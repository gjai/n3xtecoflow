import type { Metadata } from "next";
import { DEFAULT_SITE_LOCALES, type AppLocale } from "@/i18n/locales";
import { siteLocales } from "@/sites/features";
import { getCurrentSite } from "@/sites/server";

/**
 * Path without locale prefix, e.g. `/produits/river/river-2` or `` for home.
 * `origin` is required — never default to a hard-coded host (multi-thème).
 * Prefer `siteLocaleAlternates()` in App Router pages.
 */
export function localeAlternates(
  locale: string,
  pathWithoutLocale = "",
  origin: string,
  locales: readonly AppLocale[] | string[] = DEFAULT_SITE_LOCALES,
): NonNullable<Metadata["alternates"]> {
  const raw = pathWithoutLocale.trim();
  const path =
    !raw || raw === "/"
      ? ""
      : raw.startsWith("/")
        ? raw.replace(/\/$/, "")
        : `/${raw.replace(/\/$/, "")}`;

  const base = origin.replace(/\/$/, "");
  const self = `${base}/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[code] = `${base}/${code}${path}`;
  }
  languages["x-default"] = languages.fr || languages[locales[0]] || self;

  return {
    canonical: self,
    languages,
  };
}

/** Canonical / hreflang for the current Host (tous thèmes actuels + futurs). */
export async function siteLocaleAlternates(
  locale: string,
  pathWithoutLocale = "",
) {
  const site = await getCurrentSite();
  return localeAlternates(
    locale,
    pathWithoutLocale,
    `https://${site.primaryHost}`,
    siteLocales(site),
  );
}

const SPEC_LABELS_EN: Record<string, string> = {
  Capacité: "Capacity",
  "Sortie AC": "AC output",
  "Sortie CA": "AC output",
  "Sortie CA max": "Max AC output",
  "Entrée solaire": "Solar input",
  Chimie: "Chemistry",
  Cycles: "Cycles",
  Poids: "Weight",
  Expansion: "Expansion",
  Usage: "Use case",
  Type: "Type",
  Puissance: "Power",
  Autonomie: "Runtime",
  Compatibilité: "Compatibility",
  MPPT: "MPPT",
  Isolation: "Insulation",
  Matière: "Material",
  "Points forts": "Highlights",
};

export function localizeSpecs(
  specs: { label: string; value: string }[],
  locale: string,
): { label: string; value: string }[] {
  if (locale !== "en") return specs;
  return specs.map((s) => ({
    ...s,
    label: SPEC_LABELS_EN[s.label] ?? s.label,
  }));
}
