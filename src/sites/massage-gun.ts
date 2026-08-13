import type { SiteConfig } from "./types";

/**
 * Thème « Le pistolet de massage » — massage-gun.fr
 * Domaines : apex + www (www → apex via middleware).
 */
export const massageGunSite: SiteConfig = {
  id: "massage-gun",
  primaryHost: "massage-gun.fr",
  hosts: ["massage-gun.fr", "www.massage-gun.fr"],
  brand: {
    name: "Le pistolet de massage",
    taglineFr:
      "Guides et sélections indépendantes pour choisir un pistolet de massage musculaire.",
    taglineEn:
      "Independent guides and picks to choose a percussion massage gun.",
    headlineFr: "Le bon pistolet de massage, sans se tromper.",
    headlineEn: "The right massage gun, chosen with clarity.",
    subheadFr:
      "Comparatifs, critères (amplitude, puissance, bruit, embouts, autonomie) et liens Amazon vers les meilleures ventes — Expédié et vendu par Amazon.",
    subheadEn:
      "Comparisons, buying criteria (amplitude, power, noise, heads, battery) and Amazon links to bestsellers — Ships and sold by Amazon.",
    footerBlurbFr: "Site indépendant — pistolets de massage musculaire",
    footerBlurbEn: "Independent site — percussion massage guns",
    logo: "/brands/massage-gun/logo.svg",
    logoMark: "/brands/massage-gun/mark.svg",
    icons: {
      favicon: "/brands/massage-gun/favicon.svg",
      apple: "/brands/massage-gun/apple-touch-icon.svg",
      icon32: "/brands/massage-gun/mark.svg",
    },
  },
  theme: {
    accent: "#3d8bfd",
    accentInk: "#061018",
    accentLight: "#1f6fe0",
    accentInkLight: "#eef5ff",
    solar: "#5eead4",
    dark: {
      bg: "#0a121a",
      ink: "#060c12",
      surface: "#121c28",
      fg: "#e8f0f8",
      fog: "#c9d7e6",
      heading: "#ffffff",
      muted: "#8aa0b5",
      line: "rgba(232, 240, 248, 0.14)",
      glow: "rgba(61, 139, 253, 0.22)",
      heroFrom: "#0a121a",
      heroMid: "#102438",
      heroTo: "#0c1620",
    },
    light: {
      bg: "#f2f6fb",
      ink: "#e8eef5",
      surface: "#ffffff",
      fg: "#102033",
      fog: "#2a3f55",
      heading: "#0a1624",
      muted: "#5a7188",
      line: "rgba(10, 22, 36, 0.12)",
      glow: "rgba(31, 111, 224, 0.16)",
      heroFrom: "#e4effa",
      heroMid: "#d3e4f6",
      heroTo: "#f2f6fb",
    },
  },
  heroImage: "/images/massage-gun/hero.jpg",
  featuredCategoryIds: ["masseurs", "pistolets", "mini"],
  catalogLayout: "flat",
  featuredProductSlugs: [
    "aerlang-massage-gun",
    "brelley-masseur-cervical",
    "brelley-coussin-shiatsu",
    "masseur-cervical-bionique",
    "theragun-elite",
    "renpho-extend",
    "hypervolt-2-pro",
    "bob-brad-t2",
  ],
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
      siteId: "casinos-crypto",
      labelFr: "Casinos Crypto",
      labelEn: "Casinos Crypto",
    },
    {
      siteId: "euromillions",
      labelFr: "EuroMillions Résultats",
      labelEn: "EuroMillions Results",
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
  monetization: {
    adsenseClient: "ca-pub-4733644127583822",
  },
  editorial: {
    amazonQuery: "pistolet de massage",
    knowsAbout: [
      "Massage guns",
      "Percussion therapy",
      "Muscle recovery",
      "Amazon bestsellers",
    ],
    mainGuideSlug: "choisir-pistolet-massage",
    feedUserAgent:
      "LePistoletDeMassageBot/1.0 (+https://massage-gun.fr; editorial aggregator)",
    packshotCredit: "Amazon",
    coverCreditAi: "Le pistolet de massage (IA)",
    buyingTipFr:
      "Pour les lecteurs du pistolet de massage : croisez amplitude, force, bruit, embouts et le prix du jour avant d’acheter.",
    buyingTipEn:
      "For Le pistolet de massage readers: always cross-check amplitude, force, noise, heads, and live pricing before buying.",
    topicLabelFr: "les pistolets de massage",
    topicLabelEn: "massage guns",
    guideScope:
      "pistolets de massage / massage guns / masseurs cervicaux & shiatsu (Theragun, Hypervolt, Renpho, TOLOCO, Brelley, AERLANG, etc.)",
    productHintFr:
      "Parcourez les fiches produits et les hubs comparatifs pour comparer pistolets de massage et masseurs.",
    productHintEn:
      "Browse product sheets and comparison hubs to compare massage guns and massagers.",
    checklistFr:
      "Notez les zones à masser, l’amplitude / force souhaitées, le bruit et le budget avant d’acheter.",
    checklistEn:
      "Note the body areas to massage, desired amplitude / force, noise level, and budget before buying.",
    newsPerimeter:
      "pistolets de massage / massage guns / thérapie par percussion / masseurs cervicaux & shiatsu (Theragun, Hypervolt, Renpho, TOLOCO, Bob and Brad, Brelley, AERLANG, etc.)",
    newsTitleMustMention:
      "pistolet de massage, massage gun, masseur cervical/shiatsu ou une marque du périmètre",
    newsBuyingCriteria: "amplitude, force, bruit, embouts, autonomie",
    newsDefaultTags: ["massage-gun", "theragun"],
    coverSubject: "percussion massage gun / muscle recovery news",
    coverContextDefault:
      "massage gun, percussion therapy, muscle recovery, neck or back massager",
    coverStyle:
      "premium product photography, natural light, sport/wellness setting, shallow depth of field",
    coverShowOnly:
      "Show ONLY a massage gun, mini massage gun, neck massager, or shiatsu cushion — no energy/solar products. Make the composition unique for this article (angle, setting, and props can vary).",
    rssLenientAfterBrand: true,
    preferAiNewsCovers: true,
    allowWeakPackshotDefault: false,
    topicBrandPattern:
      String.raw`\bpistolet\s+de\s+massage\b|\bmassage\s+gun\b|\btheragun\b|\btherabody\b|\bhypervolt\b|\bhyperice\b|\brenpho\b|\btoloco\b|\bbob\s+and\s*brad\b|\bopove\b|\bbrelley\b|\baerlang\b|\bjolt\b|\bpercussion\s+(massage|massager|therapy)\b|\bmasseur\s+(musculaire|cervical|dos|shiatsu)\b|\bcoussin\s+(de\s+)?massage\b|\bneck\s+massager\b|\bshiatsu\s+massager\b`,
  },

  focusFr:
    "Top ventes Amazon : pistolets, masseurs cervicaux et coussins shiatsu (vendu par Amazon quand possible).",
  focusEn:
    "Amazon bestsellers: massage guns, neck massagers and shiatsu cushions (sold by Amazon when possible).",
};
