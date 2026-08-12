import type { SiteConfig } from "./types";

/** Second brand in the network — same app, different theme & positioning. */
export const powerstreamSite: SiteConfig = {
  id: "powerstream",
  primaryHost: "powerstream.fr",
  hosts: ["powerstream.fr", "www.powerstream.fr"],
  brand: {
    name: "PowerStream",
    taglineFr:
      "Guides indépendants PowerStream & solaire plug-in : micro-onduleur, STREAM, autoconsommation",
    taglineEn:
      "Independent PowerStream & plug-in solar guides: micro-inverter, STREAM, self-consumption",
    headlineFr: "Solaire balcon, sans jargon.",
    headlineEn: "Balcony solar, without the jargon.",
    subheadFr:
      "PowerStream, STREAM Ultra/Pro/Max, panneaux et stations compatibles : on compare pour ton balcon, pas pour un catalogue marketing.",
    subheadEn:
      "PowerStream, STREAM Ultra/Pro/Max, panels and compatible stations: we compare for your balcony — not for a marketing catalog.",
    footerBlurbFr: "Site indépendant — PowerStream & solaire plug-in",
    footerBlurbEn: "Independent site — PowerStream & plug-in solar",
  },
  theme: {
    accent: "#3ec6ff",
    accentInk: "#041820",
    solar: "#ffb020",
    dark: {
      bg: "#071018",
      ink: "#040a12",
      surface: "#0e1a26",
      fg: "#e6eef6",
      fog: "#c9d7e6",
      heading: "#ffffff",
      muted: "#7f95ab",
      line: "rgba(230, 238, 246, 0.14)",
      glow: "rgba(62, 198, 255, 0.22)",
      heroFrom: "#071018",
      heroMid: "#0c2438",
      heroTo: "#08141f",
    },
    light: {
      bg: "#f2f7fb",
      ink: "#e6eef5",
      surface: "#ffffff",
      fg: "#102033",
      fog: "#2a3f55",
      heading: "#0a1624",
      muted: "#5a7188",
      line: "rgba(10, 22, 36, 0.12)",
      glow: "rgba(30, 140, 200, 0.16)",
      heroFrom: "#e4f1fa",
      heroMid: "#d3e8f6",
      heroTo: "#f2f7fb",
    },
  },
  heroImage: "/images/categories/powerstream.jpg",
  featuredCategoryIds: ["powerstream", "stream", "solaire", "delta"],
  network: [
    {
      siteId: "ecoflow",
      labelFr: "EcoFlow Stream — catalogue complet",
      labelEn: "EcoFlow Stream — full catalog",
    },
  ],
  focusFr:
    "Angle solaire plug-in / micro-onduleur (PowerStream + STREAM) avec renvoi vers le catalogue élargi.",
  focusEn:
    "Plug-in solar / micro-inverter angle (PowerStream + STREAM) with links to the broader catalog.",
};
