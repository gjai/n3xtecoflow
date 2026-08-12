import type { Metadata } from "next";

const CANONICAL_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ecoflow-stream.com";

/** Path without locale prefix, e.g. `/produits/river/river-2` or `` for home. */
export function localeAlternates(
  locale: string,
  pathWithoutLocale = "",
): NonNullable<Metadata["alternates"]> {
  const raw = pathWithoutLocale.trim();
  const path =
    !raw || raw === "/"
      ? ""
      : raw.startsWith("/")
        ? raw.replace(/\/$/, "")
        : `/${raw.replace(/\/$/, "")}`;

  // Absolute URLs on the primary host — avoids duplicate indexing of powerstream.fr
  const fr = `${CANONICAL_ORIGIN}/fr${path}`;
  const en = `${CANONICAL_ORIGIN}/en${path}`;
  const self = `${CANONICAL_ORIGIN}/${locale}${path}`;

  return {
    canonical: self,
    languages: {
      fr,
      en,
      "x-default": fr,
    },
  };
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
