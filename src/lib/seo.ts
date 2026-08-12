import type { Metadata } from "next";
import { getCurrentSite } from "@/sites/server";

/** Path without locale prefix, e.g. `/produits/river/river-2` or `` for home. */
export function localeAlternates(
  locale: string,
  pathWithoutLocale = "",
  origin?: string,
): NonNullable<Metadata["alternates"]> {
  const raw = pathWithoutLocale.trim();
  const path =
    !raw || raw === "/"
      ? ""
      : raw.startsWith("/")
        ? raw.replace(/\/$/, "")
        : `/${raw.replace(/\/$/, "")}`;

  const base =
    (origin || process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com")
      .replace(/\/$/, "");

  const fr = `${base}/fr${path}`;
  const en = `${base}/en${path}`;
  const self = `${base}/${locale}${path}`;

  return {
    canonical: self,
    languages: {
      fr,
      en,
      "x-default": fr,
    },
  };
}

/** Canonical / hreflang for the current Host (multi-thème). */
export async function siteLocaleAlternates(
  locale: string,
  pathWithoutLocale = "",
) {
  const site = await getCurrentSite();
  return localeAlternates(locale, pathWithoutLocale, `https://${site.primaryHost}`);
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
