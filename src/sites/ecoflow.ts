import type { SiteConfig } from "./types";

/**
 * Univers EcoFlow : ecoflow-stream.com + powerstream.fr partagent CE thème.
 * Un futur domaine avec un autre thème = nouveau fichier + SiteId (voir _template-new-theme.ts).
 */
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
    logo: "/brands/ecoflow/logo.svg",
    logoMark: "/brands/ecoflow/mark.svg",
    icons: {
      favicon: "/brands/ecoflow/favicon.svg",
      apple: "/brands/ecoflow/apple-touch-icon.svg",
      icon32: "/brands/ecoflow/mark.svg",
    },
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
  network: [
    {
      siteId: "tumbler",
      labelFr: "La gourde isotherme",
      labelEn: "La gourde isotherme",
    },
    {
      siteId: "massage-gun",
      labelFr: "Le pistolet de massage",
      labelEn: "Le pistolet de massage",
    },
    {
      href: "https://elections2027.com",
      labelFr: "Élections 2027",
      labelEn: "Élections 2027",
    },
    {
      href: "https://marquage-tuyauterie.com",
      labelFr: "Marquage tuyauterie",
      labelEn: "Pipe marking",
    },
  ],
  editorial: {
    amazonQuery: "EcoFlow station électrique",
    knowsAbout: [
      "EcoFlow",
      "Portable power stations",
      "Balcony solar",
      "PowerStream",
    ],
    feedUserAgent:
      "EcoFlowStreamBot/1.0 (+https://ecoflow-stream.com; editorial aggregator)",
    packshotCredit: "EcoFlow",
    coverCreditAi: "EcoFlow Stream (IA)",
    buyingTipFr:
      "Pour les lecteurs EcoFlow Stream : croisez toujours capacité (Wh), puissance (W), compatibilité STREAM / stations et le prix du jour avant d’acheter.",
    buyingTipEn:
      "For EcoFlow Stream readers: always cross-check capacity (Wh), output (W), STREAM / station compatibility, and live pricing before buying.",
    topicLabelFr: "l’écosystème EcoFlow",
    topicLabelEn: "the EcoFlow ecosystem",
    guideScope:
      "EcoFlow / PowerStream / stations DELTA-RIVER / solaire EcoFlow",
    productHintFr:
      "Parcourez les fiches produits et les hubs comparatifs pour comparer les modèles EcoFlow disponibles.",
    productHintEn:
      "Browse product sheets and comparison hubs to compare available EcoFlow models.",
    checklistFr:
      "Notez vos besoins en Wh/W, le mode de recharge (secteur / solaire), et le budget avant d’acheter.",
    checklistEn:
      "Note your Wh/W needs, charging mode (AC / solar), and budget before buying.",
    newsPerimeter:
      "EcoFlow / PowerStream / STREAM / stations DELTA-RIVER / solaire EcoFlow",
    newsTitleMustMention:
      '"EcoFlow" ou "PowerStream" (ou un produit clairement EcoFlow: DELTA, RIVER, STREAM, GLACIER, WAVE, RAPID Pro)',
    newsBuyingCriteria:
      "Wh, W, usage camping/backup/solaire balcon, STREAM/DELTA/PowerStream si pertinent",
    newsDefaultTags: ["ecoflow", "delta"],
    coverSubject: "an energy / EcoFlow news article",
    coverContextDefault: "portable power station, solar energy, battery backup",
    coverStyle:
      "premium product photography, natural light, outdoor or home energy setting, shallow depth of field",
    coverShowOnly:
      "Show EcoFlow-like portable power gear or solar panels if relevant — generic unbranded if unsure.",
    rssLenientAfterBrand: false,
    preferAiNewsCovers: false,
    allowWeakPackshotDefault: true,
    topicBrandPattern:
      String.raw`\becoflow\b|\bpowerstream\b|\bpower\s*stream\b`,
    topicProductPattern:
      String.raw`\bdelta(\s|-)?(2|3|pro|max|ultra)?\b|\briver(\s|-)?(2|3|pro|max|plus)?\b|\bstream(\s|-)?(ultra|pro|max|x)?\b|\bocean\b|\bglacier\b|\bwave(\s|-)?\d?\b|\brapid(\s|-)?pro\b`,
  },

  focusFr:
    "Catalogue large EcoFlow + guides d’achat (camping, backup, solaire balcon).",
  focusEn:
    "Broad EcoFlow catalog + buying guides (camping, backup, balcony solar).",
};
