import type { SiteConfig } from "./types";

export const ecoflowSite: SiteConfig = {
  id: "ecoflow",
  primaryHost: "ecoflow-stream.com",
  hosts: [
    "ecoflow-stream.com",
    "www.ecoflow-stream.com",
    "powerstream.fr",
    "www.powerstream.fr",
    "localhost",
    "127.0.0.1",
  ],
  brand: {
    name: "EcoFlow Stream",
    taglineFr:
      "Guides indépendants sur tout l'écosystème EcoFlow : stations, STREAM, OCEAN, solaire et outdoor",
    taglineEn:
      "Independent guides to the full EcoFlow ecosystem: stations, STREAM, OCEAN, solar and outdoor",
    headlineFr: "Tout l’écosystème EcoFlow, expliqué.",
    headlineEn: "The full EcoFlow ecosystem, explained.",
    subheadFr:
      "Stations RIVER & DELTA, série STREAM, OCEAN, solaire, GLACIER, WAVE : guides, specs et comparatifs indépendants pour choisir sans vous tromper.",
    subheadEn:
      "RIVER & DELTA stations, STREAM series, OCEAN, solar, GLACIER, WAVE: independent guides, specs and comparisons to choose with confidence.",
    footerBlurbFr: "Site indépendant — guides EcoFlow & énergie portable",
    footerBlurbEn: "Independent site — EcoFlow & portable power guides",
  },
  theme: {
    accent: "#c8f04d",
    accentInk: "#102008",
    accentLight: "#5a8f12",
    accentInkLight: "#f7ffe8",
    solar: "#f0a202",
    dark: {
      bg: "#0b1210",
      ink: "#07100d",
      surface: "#121c18",
      fg: "#e8f0eb",
      fog: "#d5e0d9",
      heading: "#ffffff",
      muted: "#8fa397",
      line: "rgba(232, 240, 235, 0.14)",
      glow: "rgba(200, 240, 77, 0.22)",
      heroFrom: "#0b1210",
      heroMid: "#10241c",
      heroTo: "#0a1612",
    },
    light: {
      bg: "#f3f6f2",
      ink: "#e8eee8",
      surface: "#ffffff",
      fg: "#12201a",
      fog: "#2a3b33",
      heading: "#0c1813",
      muted: "#5c7267",
      line: "rgba(12, 24, 19, 0.12)",
      glow: "rgba(90, 143, 18, 0.18)",
      heroFrom: "#e7f0e4",
      heroMid: "#d5e8d6",
      heroTo: "#f3f6f2",
    },
  },
  heroImage: "/images/hero/station-solaire.jpg",
  featuredCategoryIds: ["stream", "delta", "river", "solaire", "powerstream"],
  network: [],
  focusFr:
    "Catalogue large EcoFlow + guides d’achat (camping, backup, solaire balcon).",
  focusEn:
    "Broad EcoFlow catalog + buying guides (camping, backup, balcony solar).",
};
