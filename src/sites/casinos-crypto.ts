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
    footerBlurbFr:
      "Site indépendant — casinos crypto & accès sécurisé · 18+ · Jeu responsable",
    footerBlurbEn:
      "Independent site — crypto casinos & secure access · 18+ · Play responsibly",
    logo: "/brands/casinos-crypto/logo.svg",
    logoMark: "/brands/casinos-crypto/mark.svg",
    icons: {
      favicon: "/brands/casinos-crypto/favicon.svg",
      apple: "/brands/casinos-crypto/apple-touch-icon.svg",
      icon32: "/brands/casinos-crypto/mark.svg",
    },
  },
  theme: {
    // Palette alignée Stake.com : slate navy + vert néon #00e701
    accent: "#00e701",
    accentInk: "#0f212e",
    accentLight: "#00c701",
    accentInkLight: "#ffffff",
    solar: "#24ee89",
    dark: {
      bg: "#0f212e",
      ink: "#0a1822",
      surface: "#1a2c38",
      fg: "#d5dceb",
      fog: "#b1bad3",
      heading: "#ffffff",
      muted: "#7f90a5",
      line: "rgba(177, 186, 211, 0.16)",
      glow: "rgba(0, 231, 1, 0.22)",
      heroFrom: "#0f212e",
      heroMid: "#1a2c38",
      heroTo: "#213743",
    },
    light: {
      bg: "#eef2f5",
      ink: "#dce3ea",
      surface: "#ffffff",
      fg: "#1a2c38",
      fog: "#2f4553",
      heading: "#0f212e",
      muted: "#557086",
      line: "rgba(15, 33, 46, 0.12)",
      glow: "rgba(0, 231, 1, 0.16)",
      heroFrom: "#d5dde6",
      heroMid: "#c2ced9",
      heroTo: "#eef2f5",
    },
  },
  heroImage: "/images/casinos-crypto/hero.jpg",
  featuredCategoryIds: [],
  catalogLayout: "flat",
  featuredProductSlugs: [],
  features: {
    products: false,
    comparisons: false,
    news: true,
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
    {
      href: "https://elections2027.com",
      labelFr: "Élections 2027",
      labelEn: "Élections 2027",
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
        id: "cryptocom",
        labelFr: "Ouvrir Crypto.com",
        labelEn: "Open Crypto.com",
        url: "https://crypto.com/app/e8yc5gbfd4",
        envKey: "CRYPTOCOM_AFFILIATE_URL",
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
      "Crypto.com",
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
      "casinos crypto / Stake / Crypto.com / dépôt crypto / VPN / jeu responsable (pas Amazon, pas AdSense)",
    productHintFr:
      "Consultez nos guides Stake, Crypto.com et VPN pour démarrer en toute clarté.",
    productHintEn:
      "Read our Stake, Crypto.com and VPN guides to get started clearly.",
    checklistFr:
      "Budget, 18+, moyen de dépôt crypto, connexion sécurisée (VPN), limites personnelles.",
    checklistEn:
      "Budget, 18+, crypto deposit method, secure connection (VPN), personal limits.",
    newsPerimeter:
      "casinos crypto / Stake / Crypto.com (wallet) / NordVPN (accès)",
    newsTitleMustMention: "casino crypto, Stake, Crypto.com ou VPN",
    newsBuyingCriteria:
      "bonus, dépôt crypto, wallet, retraits, VPN, jeu responsable",
    newsDefaultTags: ["casino-crypto", "stake"],
    newsExtraRules: [
      "Interdiction absolue de mentionner Amazon, AdSense, ou tout lien d’achat Amazon",
      "Ne jamais inventer d’URL — les CTA affiliation (Stake / Crypto.com / NordVPN) sont gérés par le site, pas dans le texte",
      "Si prix ou offre : oriente vers les conditions de l’opérateur (Stake / Crypto.com / NordVPN) sans inventer de promo",
      "Rappeler 18+ et jeu responsable quand le sujet touche au casino",
    ],
    coverSubject: "crypto casino editorial cover",
    coverContextDefault:
      "crypto casino, Stake-like slate navy desk (#0f212e), neon green accent (#00e701)",
    coverStyle:
      "premium dark slate editorial photography, neon green accents, shallow depth of field, no logos",
    coverShowOnly:
      "Show abstract crypto/casino atmosphere — dice, chips, or secure laptop — never real brand logos or Amazon products.",
    rssLenientAfterBrand: true,
    preferAiNewsCovers: true,
    allowWeakPackshotDefault: false,
    topicBrandPattern:
      String.raw`\bcrypto\s*casino\b|\bcasino\s*crypto\b|\bstake\b|\bcrypto\.com\b|\bcryptocom\b|\bnordvpn\b|\bvpn\b.*\b(casino|gaming|jeu|stake)\b|\b(casino|gaming|jeu|stake)\b.*\bvpn\b`,
  },
  focusFr:
    "Présentation Stake, Crypto.com pour le wallet, et guide VPN — sans Amazon ni publicité display.",
  focusEn:
    "Stake overview, Crypto.com for wallet setup, and VPN guide — no Amazon, no display ads.",
};
