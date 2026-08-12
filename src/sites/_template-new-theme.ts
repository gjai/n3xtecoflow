/**
 * TEMPLATE — futur thème / marque (ne PAS enregistrer tel quel).
 *
 * Plusieurs domaines peuvent partager UN thème (ex. ecoflow-stream.com + powerstream.fr → ecoflow).
 * Un NOUVEAU thème = nouveau fichier + déclaration complète.
 *
 * Checklist (rappeler à l’utilisateur) :
 * 1. Copier ce fichier → src/sites/<id>.ts
 * 2. Étendre SiteId dans types.ts : "ecoflow" | "<id>"
 * 3. Enregistrer dans index.ts (sites + sitesById)
 * 4. Assets : public/brands/<id>/ (logo, favicon, apple-touch)
 * 5. DNS apex + www → VPS
 * 6. Coolify FQDN sur la MÊME app n3xtecoflow
 * 7. network[] croisé avec les sites sœurs si besoin
 * 8. Catalogue produits (OBLIGATOIRE avant ship — sinon fiches sans photo/prix) :
 *    - chaque produit : `amazonAsin` + `imageSrc` (packshot local ou Amazon) + `indicativePriceEur`
 *    - ne pas compter sur Creators API ni sur un catalogue Shopify (spécifique EcoFlow)
 *    - Creators API = prix live plus tard (≥ 10 ventes / 30 j)
 *
 * Voir .cursor/rules/domaines-declaration.mdc et amazon-creators-api.mdc
 */
import type { SiteConfig } from "./types";

export const templateNewThemeSite = {
  id: "ecoflow", // ← remplacer + ajouter à SiteId
  primaryHost: "exemple-futur.com",
  hosts: ["exemple-futur.com", "www.exemple-futur.com"],
  brand: {
    name: "Exemple Futur",
    taglineFr: "…",
    taglineEn: "…",
    headlineFr: "…",
    headlineEn: "…",
    subheadFr: "…",
    subheadEn: "…",
    footerBlurbFr: "…",
    footerBlurbEn: "…",
    logo: "/brands/exemple/logo.svg",
    logoMark: "/brands/exemple/mark.svg",
    icons: {
      favicon: "/brands/exemple/favicon.svg",
      apple: "/brands/exemple/apple-touch-icon.svg",
    },
  },
  theme: {
    accent: "#3ec6ff",
    accentInk: "#041820",
    accentLight: "#1e8cc8",
    accentInkLight: "#f0f9ff",
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
  heroImage: "/images/hero/station-solaire.jpg",
  featuredCategoryIds: ["stream", "delta"],
  network: [],
  focusFr: "…",
  focusEn: "…",
} satisfies Omit<SiteConfig, "id"> & { id: string };
