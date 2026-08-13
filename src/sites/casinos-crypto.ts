import type { SiteConfig } from "./types";

/**
 * Thème « Casinos Crypto » — casinos-crypto.fr
 * Affiliation Stake (principal) + NordVPN (compagnon). Pas Amazon / AdSense.
 */
export const casinosCryptoSite: SiteConfig = {
  id: "casinos-crypto",
  primaryHost: "casinos-crypto.fr",
  hosts: ["casinos-crypto.fr", "www.casinos-crypto.fr"],
  locales: ["fr", "en", "it", "es", "pt", "de"],
  brand: {
    name: "Casinos Crypto",
    taglineFr:
      "Casino en ligne crypto & Stake : guides pour démarrer, accès depuis la France, wallet et VPN — 18+, jeu responsable.",
    taglineEn:
      "Online crypto casino & Stake guides: get started, wallet, VPN — 18+, play responsibly.",
    headlineFr: "Casino en ligne crypto, sans se perdre.",
    headlineEn: "Online crypto casino, without the noise.",
    subheadFr:
      "Comment démarrer sur Stake, préparer un dépôt crypto, et sécuriser sa connexion — avec les limites à connaître (18+).",
    subheadEn:
      "How to start on Stake, prepare a crypto deposit, and secure your connection — with the limits to know (18+).",
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
      "Casino en ligne crypto",
      "Stake casino",
      "Accès Stake France",
      "Cryptomonnaies",
      "Bitcoin",
      "Ethereum",
      "Crypto.com wallet",
      "VPN casino",
      "Jeu responsable",
    ],
    feedUserAgent:
      "CasinosCryptoBot/1.0 (+https://casinos-crypto.fr; editorial)",
    packshotCredit: "Casinos Crypto",
    coverCreditAi: "Casinos Crypto (IA)",
    buyingTipFr:
      "Jouez responsable : budget fixe, 18+, et vérifiez toujours les conditions de l’opérateur.",
    buyingTipEn:
      "Play responsibly: fixed budget, 18+, and always check the operator’s terms.",
    topicLabelFr: "le casino en ligne crypto et Stake",
    topicLabelEn: "online crypto casinos and Stake",
    guideScope:
      "casino en ligne crypto / Stake France / cryptomonnaies / dépôt crypto / Crypto.com / VPN NordVPN / jeu responsable (pas Amazon, pas AdSense)",
    productHintFr:
      "Guides Stake, cryptomonnaies, Crypto.com (wallet) et VPN — 18+.",
    productHintEn:
      "Stake, cryptocurrency, Crypto.com (wallet) and VPN guides — 18+.",
    checklistFr:
      "Budget, 18+, cadre légal perso, dépôt crypto, connexion (VPN), conditions de bonus.",
    checklistEn:
      "Budget, 18+, your legal framework, crypto deposit, VPN connection, bonus terms.",
    newsPerimeter:
      "casino en ligne crypto / Stake.com / cryptomonnaies (BTC ETH) / Crypto.com / NordVPN / accès France",
    newsTitleMustMention:
      "casino crypto, Stake, Bitcoin, Ethereum, cryptomonnaie, Crypto.com ou NordVPN",
    newsBuyingCriteria:
      "accès Stake, bonus casino, marché crypto, wallet Crypto.com, VPN NordVPN, jeu responsable",
    newsDefaultTags: ["casino-en-ligne", "stake", "casino-crypto", "crypto"],
    newsExtraRules: [
      "Interdiction absolue de mentionner Amazon, AdSense, ou tout lien d’achat Amazon",
      "Ne jamais inventer d’URL — les CTA affiliation (Stake / Crypto.com / NordVPN) sont gérés par le site, pas dans le texte",
      "Si prix ou offre : oriente vers les conditions de l’opérateur (Stake / Crypto.com / NordVPN) sans inventer de promo",
      "Rappeler 18+ et jeu responsable quand le sujet touche au casino",
      "Sur une actu cryptomonnaie générale (BTC/ETH/marché), rester factuel et laisser le site mettre en avant Crypto.com en CTA — sans promesse de gains",
      "Quand c’est pertinent, utiliser le vocabulaire de recherche naturel : casino en ligne, casino crypto, Stake France, accès, dépôt crypto — sans promettre de contourner la loi",
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
      String.raw`\bcrypto\s*casino\b|\bcasino\s*crypto\b|\bstake(\.com)?\b|\bcrypto\.com\b|\bcryptocom\b|\bnordvpn\b|\bnord\s*vpn\b|\bcryptocurrenc|\bcryptomonnaie|\bbitcoin\b|\bethereum\b|\bbtc\b|\beth\b|\busdt\b|\bstablecoin\b|\bvpn\b`,
  },
  focusFr:
    "Casino en ligne crypto : Stake, accès depuis la France, wallet Crypto.com et VPN — sans Amazon ni AdSense.",
  focusEn:
    "Online crypto casino: Stake, wallet via Crypto.com, VPN guide — no Amazon, no AdSense.",
};
