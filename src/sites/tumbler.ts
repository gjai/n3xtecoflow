import type { SiteConfig } from "./types";

/**
 * Thème « La gourde isotherme » — mon-tumbler.fr
 * Domaines : apex + www (www → apex via middleware).
 */
export const tumblerSite: SiteConfig = {
  id: "tumbler",
  primaryHost: "mon-tumbler.fr",
  hosts: ["mon-tumbler.fr", "www.mon-tumbler.fr"],
  brand: {
    name: "La gourde isotherme",
    taglineFr:
      "Guides et sélections indépendantes pour choisir une gourde ou un tumbler isotherme.",
    taglineEn:
      "Independent guides and picks to choose an insulated bottle or tumbler.",
    headlineFr: "La bonne gourde, sans se tromper.",
    headlineEn: "The right bottle, chosen with clarity.",
    subheadFr:
      "Comparatifs, critères (capacité, isolation, paille, entretien) et liens Amazon vers les meilleures ventes — Expédié et vendu par Amazon.",
    subheadEn:
      "Comparisons, buying criteria (capacity, insulation, straw, care) and Amazon links to bestsellers — Ships and sold by Amazon.",
    footerBlurbFr: "Site indépendant — gourdes & tumblers isothermes",
    footerBlurbEn: "Independent site — insulated bottles & tumblers",
    logo: "/brands/tumbler/logo.svg",
    logoMark: "/brands/tumbler/mark.svg",
    icons: {
      favicon: "/brands/tumbler/favicon.svg",
      apple: "/brands/tumbler/apple-touch-icon.svg",
      icon32: "/brands/tumbler/mark.svg",
    },
  },
  theme: {
    accent: "#e07a3d",
    accentInk: "#1a1008",
    accentLight: "#c45e28",
    accentInkLight: "#fff7f0",
    solar: "#2a9d8f",
    dark: {
      bg: "#12100e",
      ink: "#0c0a08",
      surface: "#1c1916",
      fg: "#f3ebe3",
      fog: "#ddd0c4",
      heading: "#ffffff",
      muted: "#a89788",
      line: "rgba(243, 235, 227, 0.14)",
      glow: "rgba(224, 122, 61, 0.22)",
      heroFrom: "#12100e",
      heroMid: "#1f1812",
      heroTo: "#14110e",
    },
    light: {
      bg: "#f7f1ea",
      ink: "#efe6dc",
      surface: "#ffffff",
      fg: "#1f1712",
      fog: "#3d322a",
      heading: "#140f0c",
      muted: "#6b5c50",
      line: "rgba(20, 15, 12, 0.12)",
      glow: "rgba(196, 94, 40, 0.16)",
      heroFrom: "#f0e4d8",
      heroMid: "#e8d5c4",
      heroTo: "#f7f1ea",
    },
  },
  heroImage: "/images/editorial/guides.jpg",
  featuredCategoryIds: ["gourdes", "tumblers"],
  network: [
    {
      siteId: "ecoflow",
      labelFr: "EcoFlow Stream",
      labelEn: "EcoFlow Stream",
    },
  ],
  focusFr: "Top ventes Amazon de gourdes isothermes (vendu par Amazon).",
  focusEn: "Amazon bestsellers for insulated bottles (sold by Amazon).",
};
