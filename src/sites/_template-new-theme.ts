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
 * 6. Coolify FQDN sur la MÊME app n3xtecoflow (+ SSL)
 * 7. network[] croisé avec les sites sœurs si besoin
 * 8. Catalogue produits (OBLIGATOIRE avant ship — sinon fiches sans photo/prix) :
 *    - chaque produit : `amazonAsin` + `imageSrc` (packshot local) + `indicativePriceEur`
 *    - `weightKg` recommandé (tri / comparateur)
 *    - ne pas compter sur Creators API ni catalogue Shopify EcoFlow
 * 9. Layout : `catalogLayout: "flat"` (+ `featuredProductSlugs`) sauf gammes type EcoFlow
 * 10. SEO : toujours `siteLocaleAlternates` (jamais d’origin hard-codé)
 * 11. Comparateur : lignes auto (Wh/W si énergie, sinon ml / isolation / matière)
 * 12. i18n : `messages/sites/<id>/{fr,en}.json` (loader générique — neutraliser fuites EcoFlow)
 * 13. Profil `editorial` OBLIGATOIRE (amazonQuery, prompts, covers, mainGuideSlug si flat)
 * 14. Actus : `NEWS_FEEDS` + regex marque dans `rss.ts` / `quality.ts` (anti-promo / anti-doublons)
 * 15. Sitemap / robots : Host-aware auto si site déclaré (pas d’URLs d’autres thèmes)
 * 16. AdSense : autoriser le nouveau domaine + `monetization.adsenseClient` si besoin
 * 17. Creators API = prix live plus tard (≥ 10 ventes / 30 j)
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
  featuredCategoryIds: [],
  catalogLayout: "flat" as const,
  featuredProductSlugs: [] as string[],
  network: [],
  editorial: {
    amazonQuery: "…",
    knowsAbout: ["…"],
    mainGuideSlug: "choisir-…",
    feedUserAgent: "ExempleBot/1.0 (+https://exemple-futur.com; editorial aggregator)",
    packshotCredit: "Amazon",
    coverCreditAi: "Exemple Futur (IA)",
    buyingTipFr: "…",
    buyingTipEn: "…",
    topicLabelFr: "…",
    topicLabelEn: "…",
    guideScope: "…",
    productHintFr: "…",
    productHintEn: "…",
    checklistFr: "…",
    checklistEn: "…",
    newsPerimeter: "…",
    newsTitleMustMention: "…",
    newsBuyingCriteria: "…",
    newsDefaultTags: ["…"],
    coverSubject: "…",
    coverContextDefault: "…",
    coverStyle:
      "premium product photography, natural light, shallow depth of field",
    coverShowOnly: "Show ONLY products from this vertical — never mix themes.",
    rssLenientAfterBrand: true,
    preferAiNewsCovers: true,
    allowWeakPackshotDefault: false,
    topicBrandPattern: String.raw`\bexemple\b|\bmarque\b`,
  },

  focusFr: "…",
  focusEn: "…",
} satisfies Omit<SiteConfig, "id"> & { id: string };
