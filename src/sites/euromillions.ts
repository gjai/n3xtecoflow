import { EUROMILLIONS_LOCALES } from "@/i18n/locales";
import type { SiteConfig } from "./types";

/**
 * Thème « EuroMillions Résultats » — euromillions-resultats.fr
 * Résultats, archives, stats. Affiliation FDJ (Kwanko). Pas de vente de tickets.
 */
export const euromillionsSite: SiteConfig = {
  id: "euromillions",
  primaryHost: "euromillions-resultats.fr",
  hosts: ["euromillions-resultats.fr", "www.euromillions-resultats.fr"],
  locales: [...EUROMILLIONS_LOCALES],
  brand: {
    name: "EuroMillions Résultats",
    taglineFr:
      "Résultats EuroMillions, archives des tirages, stats et analyses — site indépendant, 18+, jeu responsable.",
    taglineEn:
      "EuroMillions results, draw archives, stats and analysis — independent site, 18+, play responsibly.",
    headlineFr: "Les résultats EuroMillions, clairement.",
    headlineEn: "EuroMillions results, clearly.",
    subheadFr:
      "EuroMillions en avant — plus Loto, EuroDreams, Crescendo et Keno. Sans promesse de gains.",
    subheadEn:
      "EuroMillions first — plus Loto, EuroDreams, Crescendo and Keno. No promise of winnings.",
    footerBlurbFr:
      "Site indépendant — résultats & archives EuroMillions · 18+ · Jeu responsable",
    footerBlurbEn:
      "Independent site — EuroMillions results & archives · 18+ · Play responsibly",
    logo: "/brands/euromillions/logo.svg",
    logoMark: "/brands/euromillions/mark.svg",
    icons: {
      favicon: "/brands/euromillions/favicon.svg",
      apple: "/brands/euromillions/icon-180.png",
      icon32: "/brands/euromillions/mark.svg",
      icon192: "/brands/euromillions/icon-192.png",
      icon512: "/brands/euromillions/icon-512.png",
    },
  },
  theme: {
    // Bleu nuit + or jackpot
    accent: "#f5c542",
    accentInk: "#0b1220",
    accentLight: "#d4a017",
    accentInkLight: "#0b1220",
    solar: "#7dd3fc",
    dark: {
      bg: "#0b1220",
      ink: "#070d18",
      surface: "#141e30",
      fg: "#e8eef8",
      fog: "#b8c4d8",
      heading: "#ffffff",
      muted: "#8494ad",
      line: "rgba(184, 196, 216, 0.16)",
      glow: "rgba(245, 197, 66, 0.22)",
      heroFrom: "#0b1220",
      heroMid: "#152238",
      heroTo: "#1a2740",
    },
    light: {
      bg: "#f4f7fb",
      ink: "#e8eef5",
      surface: "#ffffff",
      fg: "#142033",
      fog: "#334155",
      heading: "#0b1220",
      muted: "#64748b",
      line: "rgba(11, 18, 32, 0.12)",
      glow: "rgba(212, 160, 23, 0.16)",
      heroFrom: "#e8eef8",
      heroMid: "#dce6f4",
      heroTo: "#f4f7fb",
    },
  },
  heroImage: "/brands/euromillions/hero.svg",
  featuredCategoryIds: [],
  catalogLayout: "flat",
  featuredProductSlugs: [],
  features: {
    products: false,
    comparisons: false,
    news: true,
    editorialHome: true,
  },
  network: [],
  socials: {
    facebook: "https://www.facebook.com/euromillionsresultats/",
    instagram: "https://www.instagram.com/euromillionsresultats/",
  },
  monetization: {
    disableAmazon: true,
    disableAdsense: true,
    offers: [
      {
        id: "fdj",
        labelFr: "Jouer sur FDJ.fr",
        labelEn: "Play on FDJ.fr",
        // Remplacer via FDJ_AFFILIATE_URL après inscription Kwanko :
        // https://www.fdj.fr/affiliation
        url: "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million",
        envKey: "FDJ_AFFILIATE_URL",
      },
    ],
  },
  editorial: {
    amazonQuery: "EuroMillions protège tickets carnet",
    knowsAbout: [
      "EuroMillions",
      "Résultats EuroMillions",
      "Tirage EuroMillions",
      "Résultats tirages",
      "Statistiques EuroMillions",
      "Jackpot EuroMillions",
      "EuroDreams",
      "Loto",
      "Crescendo",
      "Keno",
      "Jeu responsable",
    ],
    feedUserAgent:
      "EuroMillionsResultatsBot/1.0 (+https://euromillions-resultats.fr; editorial)",
    packshotCredit: "EuroMillions Résultats",
    coverCreditAi: "EuroMillions Résultats (IA)",
    buyingTipFr:
      "Jouez responsable : budget fixe, 18+, et aucun système ne bat les probabilités.",
    buyingTipEn:
      "Play responsibly: fixed budget, 18+, and no system beats the odds.",
    topicLabelFr: "l’EuroMillions (résultats et tirages)",
    topicLabelEn: "EuroMillions (results and draws)",
    guideScope:
      "EuroMillions / résultats / My Million / archives / stats / probabilités / jeu responsable",
    productHintFr:
      "Guides résultats, My Million, archives et probabilités — 18+.",
    productHintEn:
      "Results, My Million, archives and odds guides — 18+.",
    checklistFr:
      "Budget, 18+, comprendre les rangs, vérifier la grille, code My Million, archives.",
    checklistEn:
      "Budget, 18+, understand prize tiers, check your grid, My Million code, archives.",
    newsPerimeter:
      "EuroMillions / Loto FDJ / EuroDreams / My Million / Keno FDJ / jackpot / tirage / loterie européenne — pas de casinos, paris sportifs ni loteries US",
    newsTitleMustMention:
      "EuroMillions, Euromillones, Loto, EuroDreams, My Million, FDJ, jackpot, tirage ou gagnant",
    newsBuyingCriteria:
      "résultat du tirage, My Million, jackpot, archives, probabilités, jeu responsable",
    newsDefaultTags: [
      "euromillions",
      "tirage",
      "resultats",
      "jackpot",
      "my-million",
      "loto",
      "eurodreams",
    ],
    newsExtraRules: [
      "Pas de promesse de gains",
      "Ne jamais promettre de méthode pour gagner",
      "Rappeler 18+ et jeu responsable",
      "Rester factuel sur les montants de jackpot et codes My Million",
    ],
    coverSubject: "EuroMillions lottery editorial cover",
    coverContextDefault:
      "deep navy lottery desk, gold jackpot accents, abstract balls and stars — no official logos",
    coverStyle:
      "premium dark navy editorial photography, gold accents, shallow depth of field, no logos",
    coverShowOnly:
      "Show abstract lottery atmosphere — numbered balls, stars, charts — never FDJ or EuroMillions official logos.",
    rssLenientAfterBrand: true,
    preferAiNewsCovers: true,
    allowWeakPackshotDefault: false,
    topicBrandPattern:
      String.raw`\beuromillions\b|\beuro\s*millions\b|\beuromillones\b|\bjackpot\b|\btirage\b|\bloterie\b|\bmy\s*million\b|\beurodreams\b|\beuro\s*dreams\b|\bloto\b|\bfdjd?\b|\bsorteo\b`,
  },
  focusFr:
    "Résultats EuroMillions, archives et stats — site indépendant, 18+, jeu responsable.",
  focusEn:
    "EuroMillions results, archives and stats — independent site, 18+, play responsibly.",
};
