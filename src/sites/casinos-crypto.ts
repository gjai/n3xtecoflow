import type { SiteConfig } from "./types";

/**
 * Thème « Casinos Crypto » — casinos-crypto.fr
 * Affiliation Stake (principal) + NordVPN (compagnon). Pas Amazon / AdSense.
 */
export const casinosCryptoSite: SiteConfig = {
  id: "casinos-crypto",
  primaryHost: "casinos-crypto.fr",
  hosts: ["casinos-crypto.fr", "www.casinos-crypto.fr"],
  brand: {
    name: "Casinos Crypto",
    taglineFr:
      "Guides indépendants sur les casinos crypto : Stake, accès sécurisé et bonnes pratiques.",
    taglineEn:
      "Independent guides to crypto casinos: Stake, secure access and best practices.",
    headlineFr: "Casino crypto, sans se perdre.",
    headlineEn: "Crypto casino, without the noise.",
    subheadFr:
      "Présentation de Stake, comment démarrer, jeu responsable — et le rôle d’un VPN pour une connexion plus sereine.",
    subheadEn:
      "Stake explained, how to get started, responsible play — and why a VPN helps for a calmer connection.",
    footerBlurbFr: "Site indépendant — casinos crypto & accès sécurisé",
    footerBlurbEn: "Independent site — crypto casinos & secure access",
    logo: "/brands/casinos-crypto/logo.svg",
    logoMark: "/brands/casinos-crypto/mark.svg",
    icons: {
      favicon: "/brands/casinos-crypto/favicon.svg",
      apple: "/brands/casinos-crypto/apple-touch-icon.svg",
      icon32: "/brands/casinos-crypto/mark.svg",
    },
  },
  theme: {
    accent: "#00e701",
    accentInk: "#041208",
    accentLight: "#12a34a",
    accentInkLight: "#eafff0",
    solar: "#f5c542",
    dark: {
      bg: "#070a08",
      ink: "#040605",
      surface: "#101612",
      fg: "#e8f5ea",
      fog: "#c5d8c9",
      heading: "#ffffff",
      muted: "#8aa394",
      line: "rgba(232, 245, 234, 0.14)",
      glow: "rgba(0, 231, 1, 0.18)",
      heroFrom: "#070a08",
      heroMid: "#0c1a10",
      heroTo: "#08110c",
    },
    light: {
      bg: "#f3f7f3",
      ink: "#e8efe8",
      surface: "#ffffff",
      fg: "#122018",
      fog: "#2a3b30",
      heading: "#0a1610",
      muted: "#5a7260",
      line: "rgba(10, 22, 16, 0.12)",
      glow: "rgba(18, 163, 74, 0.14)",
      heroFrom: "#e6f4ea",
      heroMid: "#d4ebda",
      heroTo: "#f3f7f3",
    },
  },
  heroImage: "/images/casinos-crypto/hero.svg",
  featuredCategoryIds: [],
  catalogLayout: "flat",
  featuredProductSlugs: [],
  features: {
    products: false,
    comparisons: false,
    news: false,
    editorialHome: true,
  },
  network: [
    {
      siteId: "ecoflow",
      labelFr: "EcoFlow Stream",
      labelEn: "EcoFlow Stream",
    },
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
  ],
  monetization: {
    disableAdsense: true,
    disableAmazon: true,
    offers: [
      {
        id: "stake",
        labelFr: "Ouvrir Stake",
        labelEn: "Open Stake",
        url: "https://stake.com/?c=100STAKE",
        envKey: "STAKE_AFFILIATE_URL",
      },
      {
        id: "nordvpn",
        labelFr: "Essayer NordVPN",
        labelEn: "Try NordVPN",
        url: "https://refer-nordvpn.com/ofnvcsXaEOR",
        envKey: "NORDVPN_AFFILIATE_URL",
      },
    ],
  },
  editorial: {
    amazonQuery: "",
    knowsAbout: [
      "Crypto casinos",
      "Stake",
      "VPN access",
      "Responsible gambling",
    ],
    feedUserAgent:
      "CasinosCryptoBot/1.0 (+https://casinos-crypto.fr; editorial)",
    packshotCredit: "Casinos Crypto",
    coverCreditAi: "Casinos Crypto (IA)",
    buyingTipFr:
      "Jouez responsable : budget fixe, 18+, et vérifiez toujours les conditions de l’opérateur.",
    buyingTipEn:
      "Play responsibly: fixed budget, 18+, and always check the operator’s terms.",
    topicLabelFr: "les casinos crypto",
    topicLabelEn: "crypto casinos",
    guideScope:
      "casinos crypto / Stake / dépôt crypto / VPN / jeu responsable (pas Amazon, pas AdSense)",
    productHintFr:
      "Consultez nos guides Stake et VPN pour démarrer en toute clarté.",
    productHintEn: "Read our Stake and VPN guides to get started clearly.",
    checklistFr:
      "Budget, 18+, moyen de dépôt crypto, connexion sécurisée (VPN), limites personnelles.",
    checklistEn:
      "Budget, 18+, crypto deposit method, secure connection (VPN), personal limits.",
    newsPerimeter: "casinos crypto / Stake / VPN gaming",
    newsTitleMustMention: "casino crypto, Stake ou VPN",
    newsBuyingCriteria: "bonus, dépôt, retraits, VPN, jeu responsable",
    newsDefaultTags: ["casino-crypto", "stake"],
    coverSubject: "crypto casino editorial cover",
    coverContextDefault: "crypto casino, dark premium desk, subtle neon green",
    coverStyle:
      "premium dark editorial photography, shallow depth of field, no logos",
    coverShowOnly:
      "Show abstract crypto/casino atmosphere — dice, chips, or secure laptop — never real brand logos or Amazon products.",
    rssLenientAfterBrand: true,
    preferAiNewsCovers: true,
    allowWeakPackshotDefault: false,
    topicBrandPattern:
      String.raw`\bcasino\b|\bcrypto\s*casino\b|\bstake\b|\bnordvpn\b|\bvpn\b`,
  },
  focusFr:
    "Présentation Stake, démarrage crypto et guide VPN — sans Amazon ni publicité display.",
  focusEn:
    "Stake overview, crypto onboarding and VPN guide — no Amazon, no display ads.",
};
