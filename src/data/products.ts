import { tumblerCategories, tumblerProducts } from "./tumbler-products";
import {
  massageGunCategories,
  massageGunProducts,
} from "./massage-gun-products";
import type { SiteId } from "@/sites/types";

export type CategoryId =
  | "river"
  | "delta"
  | "delta-pro"
  | "stream"
  | "powerstream"
  | "ocean"
  | "solaire"
  | "outdoor"
  | "accessoires"
  | "gourdes"
  | "tumblers"
  | "pistolets"
  | "mini";

export type LocaleCopy = {
  tagline: string;
  summary: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  body: string[];
};

export type Product = {
  slug: string;
  category: CategoryId;
  /** Theme that owns this product. Defaults to ecoflow when omitted. */
  siteId?: SiteId;
  name: string;
  capacityWh?: number;
  outputW?: number;
  surgeW?: number;
  solarInputW?: number;
  battery: string;
  cycles?: number;
  weightKg?: number;
  expandable?: boolean;
  upsMs?: number;
  amazonQuery: string;
  /** Optional Amazon FR ASIN — speeds up price refresh via GetItems */
  amazonAsin?: string;
  /** Optional real product photo (Amazon Associates / licensed). Prefer over category stock. */
  imageSrc?: string;
  /**
   * Prix indicatif éditorial (€) tant que Creators API / catalogue boutique sont absents.
   * Toujours affiché avec hint « indicatif » — remplacé dès qu’un prix live existe.
   */
  indicativePriceEur?: number;
  specs: { label: string; value: string }[];
  fr: LocaleCopy;
  en: LocaleCopy;
};

export type CategoryMeta = {
  id: CategoryId;
  slug: string;
  /** Theme that owns this category. Defaults to ecoflow when omitted. */
  siteId?: SiteId;
  fr: { title: string; intro: string };
  en: { title: string; intro: string };
};

export const categories: CategoryMeta[] = [
  {
    id: "river",
    slug: "river",
    siteId: "ecoflow",
    fr: {
      title: "Stations RIVER (portables)",
      intro:
        "Compactes et légères, les RIVER conviennent au camping, aux déplacements et aux petits appareils. Capacité limitée, mais recharge rapide et format sac à dos.",
    },
    en: {
      title: "RIVER stations (portable)",
      intro:
        "Compact and light, RIVER units fit camping, travel, and small devices. Limited capacity, but fast charging and backpack-friendly size.",
    },
  },
  {
    id: "delta",
    slug: "delta",
    siteId: "ecoflow",
    fr: {
      title: "Stations DELTA (polyvalentes)",
      intro:
        "La gamme DELTA cible le backup maison léger, le van et les usages mixtes. Plus de Wh, plus de watts AC, souvent expansible.",
    },
    en: {
      title: "DELTA stations (versatile)",
      intro:
        "DELTA covers light home backup, vanlife, and mixed use. More Wh, stronger AC output, often expandable.",
    },
  },
  {
    id: "delta-pro",
    slug: "delta-pro",
    siteId: "ecoflow",
    fr: {
      title: "DELTA Pro (backup maison)",
      intro:
        "Hautes capacités et sorties élevées pour couvrir frigo, pompe, box, voire panneau maison. Idéal autonomie / coupures prolongées.",
    },
    en: {
      title: "DELTA Pro (home backup)",
      intro:
        "High capacity and high output for fridge, pump, router, or whole-home panels. Built for autonomy and longer outages.",
    },
  },
  {
    id: "stream",
    slug: "stream",
    siteId: "ecoflow",
    fr: {
      title: "Série STREAM (solaire plug-in)",
      intro:
        "Nouvelle gamme FR EcoFlow pour solaire balcon / plug-in avec batterie : STREAM Ultra X, Pro, Max, micro-onduleur et kits solaires.",
    },
    en: {
      title: "STREAM series (plug-in solar)",
      intro:
        "EcoFlow’s plug-in balcony solar line with battery: STREAM Ultra X, Pro, Max, micro-inverter and solar kits.",
    },
  },
  {
    id: "powerstream",
    slug: "powerstream",
    siteId: "ecoflow",
    fr: {
      title: "PowerStream (micro-onduleur)",
      intro:
        "Micro-onduleur historique EcoFlow pour injection domestique et couplage stations. Complémentaire de la série STREAM.",
    },
    en: {
      title: "PowerStream (micro-inverter)",
      intro:
        "EcoFlow’s classic micro-inverter for home injection and station pairing. Complements the STREAM series.",
    },
  },
  {
    id: "ocean",
    slug: "ocean",
    siteId: "ecoflow",
    fr: {
      title: "OCEAN (batterie domestique)",
      intro:
        "Solutions résidentielles tout-en-un haute capacité pour autonomie maison et stockage longue durée.",
    },
    en: {
      title: "OCEAN (home battery)",
      intro:
        "All-in-one residential high-capacity solutions for home autonomy and long-duration storage.",
    },
  },
  {
    id: "solaire",
    slug: "solaire",
    siteId: "ecoflow",
    fr: {
      title: "Panneaux solaires EcoFlow",
      intro:
        "Panneaux portables, bifaciaux et rigides (dont RV) pour recharger stations et kits STREAM/PowerStream.",
    },
    en: {
      title: "EcoFlow solar panels",
      intro:
        "Portable, bifacial and rigid panels (including RV) to recharge stations and STREAM/PowerStream kits.",
    },
  },
  {
    id: "outdoor",
    slug: "outdoor",
    siteId: "ecoflow",
    fr: {
      title: "Outdoor & mobilité",
      intro:
        "GLACIER (frigo), WAVE (clim), power banks et chargeurs alternateur pour vanlife et outdoor.",
    },
    en: {
      title: "Outdoor & mobility",
      intro:
        "GLACIER (fridge), WAVE (AC), power banks and alternator chargers for vanlife and outdoor use.",
    },
  },
  {
    id: "accessoires",
    slug: "accessoires",
    siteId: "ecoflow",
    fr: {
      title: "Batteries & accessoires",
      intro:
        "Batteries extras, Smart Home Panel et accessoires qui étendent autonomie et intégration maison.",
    },
    en: {
      title: "Batteries & accessories",
      intro:
        "Extra batteries, Smart Home Panel and accessories that extend runtime and home integration.",
    },
  },
];

function copy(
  fr: LocaleCopy,
  en: LocaleCopy,
): { fr: LocaleCopy; en: LocaleCopy } {
  return { fr, en };
}

export const products: Product[] = [
  {
    slug: "river-2",
    category: "river",
    name: "EcoFlow RIVER 2",
    capacityWh: 256,
    outputW: 300,
    surgeW: 600,
    solarInputW: 110,
    battery: "LFP",
    cycles: 3000,
    weightKg: 3.5,
    amazonQuery: "EcoFlow RIVER 2",
    amazonAsin: "B0BFQC1CNQ",
    imageSrc: "https://m.media-amazon.com/images/P/B0BFQC1CNQ.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "256 Wh" },
      { label: "Sortie AC", value: "300 W (600 W surge)" },
      { label: "Entrée solaire", value: "110 W max" },
      { label: "Chimie", value: "LFP" },
      { label: "Cycles", value: "≈ 3 000" },
      { label: "Poids", value: "≈ 3,5 kg" },
    ],
    ...copy(
      {
        tagline: "Entrée de gamme ultra portable",
        summary:
          "Petite station LFP pour téléphone, lumière LED, laptop léger et charge USB-C. Idéale en dépannage ou week-end court.",
        bestFor: "Micro-camping, voyage, secours box/téléphone",
        pros: ["Très légère", "LFP durable", "Recharge AC rapide"],
        cons: ["300 W AC limités", "Peu d’autonomie frigo"],
        body: [
          "La RIVER 2 mise sur la compacité. Avec 256 Wh, elle couvre surtout l’électronique et l’éclairage. Le rendement LFP apporte une meilleure durée de vie que les anciennes chimies NMC d’entrée de gamme.",
          "Dimensionnez vos besoins : un laptop 60 W pendant 3 h ≈ 180 Wh utiles. Gardez une marge de 20–30 % pour convertisseur et température.",
          "Côté solaire, 110 W max suffisent pour une recharge partielle en journée sur un panneau pliable. Ce n’est pas une solution backup maison.",
        ],
      },
      {
        tagline: "Ultra-portable entry model",
        summary:
          "Small LFP station for phones, LED lights, light laptops and USB-C charging. Great for short weekends or emergency device power.",
        bestFor: "Micro-camping, travel, router/phone backup",
        pros: ["Very light", "Durable LFP", "Fast AC recharge"],
        cons: ["300 W AC limit", "Not for fridge runtime"],
        body: [
          "RIVER 2 prioritizes compactness. At 256 Wh it mainly covers electronics and lighting. LFP chemistry improves cycle life versus older entry-level NMC packs.",
          "Size your loads: a 60 W laptop for 3 hours ≈ 180 Wh useful. Keep a 20–30% buffer for inverter losses and temperature.",
          "Solar input tops out around 110 W—enough for partial daytime top-ups with a foldable panel, not home backup.",
        ],
      },
    ),
  },
  {
    slug: "river-2-max",
    category: "river",
    name: "EcoFlow RIVER 2 Max",
    capacityWh: 512,
    outputW: 500,
    surgeW: 1000,
    solarInputW: 220,
    battery: "LFP",
    cycles: 3000,
    weightKg: 6.0,
    amazonQuery: "EcoFlow RIVER 2 Max",
    amazonAsin: "B0BFQB86ZL",
    imageSrc: "https://m.media-amazon.com/images/P/B0BFQB86ZL.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "512 Wh" },
      { label: "Sortie AC", value: "500 W (1 000 W surge)" },
      { label: "Entrée solaire", value: "220 W max" },
      { label: "Chimie", value: "LFP" },
      { label: "Poids", value: "≈ 6 kg" },
    ],
    ...copy(
      {
        tagline: "Double capacité, toujours portable",
        summary:
          "512 Wh pour allonger l’autonomie : drone, appareil photo, petite glacière 12 V selon usage.",
        bestFor: "Camping 1–2 jours, créatifs nomades",
        pros: ["Bon rapport poids/Wh", "220 W solaire", "LFP"],
        cons: ["Pas d’expansion batterie", "500 W AC"],
        body: [
          "La RIVER 2 Max double la RIVER 2. Utile dès qu’on cumule laptop + éclairage + charge appareils photo.",
          "Vérifiez la conso réelle de votre glacière : beaucoup de modèles 12 V sont cycliques. En AC, restez sous 500 W continus.",
          "Avec 220 W solaires, une journée ensoleillée peut reconstituer une part significative de la batterie.",
        ],
      },
      {
        tagline: "Double capacity, still portable",
        summary:
          "512 Wh for longer runtime: drones, cameras, and some 12 V coolers depending on duty cycle.",
        bestFor: "1–2 day camping, creators on the road",
        pros: ["Solid Wh/weight", "220 W solar", "LFP"],
        cons: ["No battery expansion", "500 W AC"],
        body: [
          "RIVER 2 Max doubles RIVER 2. Useful when you stack laptop + lights + camera charging.",
          "Check real cooler draw: many 12 V units cycle. On AC, stay under 500 W continuous.",
          "With 220 W solar, a sunny day can restore a meaningful share of the pack.",
        ],
      },
    ),
  },
  {
    slug: "river-2-pro",
    category: "river",
    name: "EcoFlow RIVER 2 Pro",
    capacityWh: 768,
    outputW: 800,
    surgeW: 1600,
    solarInputW: 220,
    battery: "LFP",
    cycles: 3000,
    weightKg: 7.8,
    amazonQuery: "EcoFlow RIVER 2 Pro",
    amazonAsin: "B0BFQD5RMJ",
    imageSrc: "https://m.media-amazon.com/images/P/B0BFQD5RMJ.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "768 Wh" },
      { label: "Sortie AC", value: "800 W (1 600 W surge)" },
      { label: "Entrée solaire", value: "220 W max" },
      { label: "Poids", value: "≈ 7,8 kg" },
    ],
    ...copy(
      {
        tagline: "Le haut de la série RIVER 2",
        summary:
          "768 Wh et 800 W AC : le meilleur compromis RIVER 2 pour multi-appareils sans passer en DELTA.",
        bestFor: "Van léger, stand, weekend chargé",
        pros: ["800 W AC", "Bonne capacité portable", "LFP"],
        cons: ["Plus lourde", "Moins flexible qu’une DELTA expansible"],
        body: [
          "La RIVER 2 Pro est souvent le plafond pertinent de la gamme RIVER 2 avant d’envisager une DELTA.",
          "800 W AC ouvrivent des appareils plus gourmands (petits projecteurs, outils légers) avec une marge de surge.",
          "Si vous visez frigo 230 V + multi-jours, comparez directement avec DELTA 2 / DELTA 3.",
        ],
      },
      {
        tagline: "Top of the RIVER 2 line",
        summary:
          "768 Wh and 800 W AC: the best RIVER 2 compromise for multi-device use before jumping to DELTA.",
        bestFor: "Light vanlife, booths, busy weekends",
        pros: ["800 W AC", "Strong portable capacity", "LFP"],
        cons: ["Heavier", "Less flexible than expandable DELTA"],
        body: [
          "RIVER 2 Pro is often the sensible ceiling of RIVER 2 before considering a DELTA.",
          "800 W AC opens hungrier devices (small projectors, light tools) with surge headroom.",
          "If you need a 230 V fridge for multiple days, compare directly with DELTA 2 / DELTA 3.",
        ],
      },
    ),
  },
  {
    slug: "river-3",
    category: "river",
    name: "EcoFlow RIVER 3",
    capacityWh: 245,
    outputW: 300,
    surgeW: 600,
    solarInputW: 110,
    battery: "LFP",
    cycles: 3000,
    weightKg: 3.5,
    amazonQuery: "EcoFlow RIVER 3",
    amazonAsin: "B0DJY2R42F",
    imageSrc: "https://m.media-amazon.com/images/P/B0DJY2R42F.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "245 Wh" },
      { label: "Sortie AC", value: "300 W" },
      { label: "Chimie", value: "LFP" },
      { label: "UPS / EPS", value: "Oui (selon firmware/région)" },
    ],
    ...copy(
      {
        tagline: "Nouvelle génération compacte",
        summary:
          "Rafraîchissement RIVER : format compact, LFP, usages électroniques et secours box.",
        bestFor: "Nomades, secours minimal",
        pros: ["Compacte", "Génération récente", "LFP"],
        cons: ["Faible Wh", "Sortie AC limitée"],
        body: [
          "La RIVER 3 modernise l’entrée de gamme. Le positionnement reste clair : mobilité avant autonomie.",
          "Utile comme UPS léger pour box/NAS selon configuration régionale et app.",
          "Pour un frigo ou un usage multi-jours, montez en RIVER 3 Plus / Max ou DELTA.",
        ],
      },
      {
        tagline: "Compact next-gen",
        summary:
          "RIVER refresh: compact form, LFP, electronics and light router backup.",
        bestFor: "Travelers, minimal emergency power",
        pros: ["Compact", "Newer generation", "LFP"],
        cons: ["Low Wh", "Limited AC output"],
        body: [
          "RIVER 3 modernizes the entry tier. Positioning stays clear: mobility over runtime.",
          "Useful as a light UPS for router/NAS depending on region and app features.",
          "For fridges or multi-day use, step up to RIVER 3 Plus/Max or DELTA.",
        ],
      },
    ),
  },
  {
    slug: "river-3-plus",
    category: "river",
    name: "EcoFlow RIVER 3 Plus",
    capacityWh: 286,
    outputW: 600,
    surgeW: 1200,
    solarInputW: 220,
    battery: "LFP",
    cycles: 4000,
    weightKg: 4.7,
    expandable: true,
    amazonQuery: "EcoFlow RIVER 3 Plus",
    specs: [
      { label: "Capacité", value: "286 Wh (expansible)" },
      { label: "Sortie AC", value: "600 W" },
      { label: "Cycles LFP", value: "≈ 4 000" },
      { label: "Entrée solaire", value: "jusqu’à ≈ 220 W" },
    ],
    ...copy(
      {
        tagline: "RIVER moderne avec marge de puissance",
        summary:
          "286 Wh de base mais 600 W AC et expansion possible : sweet spot camping / télétravail mobile.",
        bestFor: "Camping, van léger, backup box + laptop",
        pros: ["600 W AC", "LFP 4 000 cycles", "Expansible"],
        cons: ["Wh de base encore modestes", "Prix à comparer à DELTA d’entrée"],
        body: [
          "La RIVER 3 Plus corrige le principal frein des petites RIVER : la puissance AC. 600 W ouvrivent plus d’appareils.",
          "L’expansion batterie change la donne si vous voulez rester dans un format compact tout en gagnant des Wh.",
          "Comparez le prix total (station + extra) avec une DELTA 2/3 avant d’acheter l’écosystème RIVER.",
        ],
      },
      {
        tagline: "Modern RIVER with more AC headroom",
        summary:
          "286 Wh base but 600 W AC and expandability: a camping / mobile work sweet spot.",
        bestFor: "Camping, light van, router + laptop backup",
        pros: ["600 W AC", "LFP ~4,000 cycles", "Expandable"],
        cons: ["Base Wh still modest", "Price vs entry DELTA"],
        body: [
          "RIVER 3 Plus fixes a key RIVER limit: AC power. 600 W opens more devices.",
          "Battery expansion matters if you want a compact footprint with more Wh later.",
          "Compare total cost (station + extra) against an entry DELTA 2/3 before committing.",
        ],
      },
    ),
  },
  {
    slug: "delta-2",
    category: "delta",
    name: "EcoFlow DELTA 2",
    capacityWh: 1024,
    outputW: 1800,
    surgeW: 2700,
    solarInputW: 500,
    battery: "LFP",
    cycles: 3000,
    weightKg: 12,
    expandable: true,
    amazonQuery: "EcoFlow DELTA 2",
    amazonAsin: "B0BBLV8WJH",
    imageSrc: "https://m.media-amazon.com/images/P/B0BBLV8WJH.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "1 024 Wh" },
      { label: "Sortie AC", value: "1 800 W" },
      { label: "Solaire", value: "500 W max" },
      { label: "Expansion", value: "Oui (batteries extras)" },
    ],
    ...copy(
      {
        tagline: "Référence polyvalente 1 kWh",
        summary:
          "1 024 Wh / 1 800 W : le modèle le plus cité pour démarrer un vrai backup et le solaire portable.",
        bestFor: "Maison légère, van, stand, DIY",
        pros: ["Excellent équilibre", "Expansible", "1 800 W AC"],
        cons: ["Plus lourde qu’une RIVER", "Génération avant DELTA 3"],
        body: [
          "La DELTA 2 reste une valeur sûre : assez de Wh pour frigo + box + éclairage sur une coupure courte, assez de watts pour la plupart des appareils domestiques usuels.",
          "L’entrée solaire 500 W accélère la recharge outdoor. Couplez 1–2 panneaux selon exposition.",
          "Si vous achetez neuf, comparez avec DELTA 3 (cycles, UPS, écosystème 2025/2026).",
        ],
      },
      {
        tagline: "Versatile 1 kWh reference",
        summary:
          "1,024 Wh / 1,800 W: the most cited starter for real backup and portable solar.",
        bestFor: "Light home, van, events, DIY",
        pros: ["Great balance", "Expandable", "1,800 W AC"],
        cons: ["Heavier than RIVER", "Pre–DELTA 3 generation"],
        body: [
          "DELTA 2 remains a safe pick: enough Wh for fridge + router + lights on a short outage, enough watts for common household loads.",
          "500 W solar input speeds outdoor recharge. Pair 1–2 panels based on exposure.",
          "If buying new, compare with DELTA 3 (cycles, UPS, newer ecosystem).",
        ],
      },
    ),
  },
  {
    slug: "delta-2-max",
    category: "delta",
    name: "EcoFlow DELTA 2 Max",
    capacityWh: 2048,
    outputW: 2400,
    surgeW: 4800,
    solarInputW: 1000,
    battery: "LFP",
    cycles: 3000,
    weightKg: 23,
    expandable: true,
    amazonQuery: "EcoFlow DELTA 2 Max",
    amazonAsin: "B0C4F83WTX",
    imageSrc: "https://m.media-amazon.com/images/P/B0C4F83WTX.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "2 048 Wh" },
      { label: "Sortie AC", value: "2 400 W" },
      { label: "Solaire", value: "jusqu’à ≈ 1 000 W" },
      { label: "Expansion", value: "Oui" },
    ],
    ...copy(
      {
        tagline: "Autonomie 2 kWh sans passer Pro",
        summary:
          "Double capacité face à DELTA 2, sortie renforcée, solaire plus généreux.",
        bestFor: "Coupures plus longues, chantier léger, van aménagé",
        pros: ["2 kWh", "2 400 W", "Forte entrée solaire"],
        cons: ["Poids ≈ 23 kg", "Encombrement"],
        body: [
          "La DELTA 2 Max est le pont entre portable “fort” et backup sérieux. 2 kWh changent la durée de couverture d’un frigo.",
          "Le solaire ~1 kW permet de reconstituer plus vite en journée claire.",
          "Pour une maison entière ou charges 230 V lourdes simultanées, regardez DELTA Pro / Pro 3.",
        ],
      },
      {
        tagline: "2 kWh runtime without going Pro",
        summary:
          "Double DELTA 2 capacity, stronger output, more solar headroom.",
        bestFor: "Longer outages, light job sites, built-out vans",
        pros: ["2 kWh", "2,400 W", "Strong solar input"],
        cons: ["~23 kg", "Bulk"],
        body: [
          "DELTA 2 Max bridges strong portable power and serious backup. 2 kWh meaningfully extends fridge coverage.",
          "~1 kW solar helps rebuild faster on clear days.",
          "For whole-home or heavy simultaneous 230 V loads, look at DELTA Pro / Pro 3.",
        ],
      },
    ),
  },
  {
    slug: "delta-3-classic",
    category: "delta",
    name: "EcoFlow DELTA 3 Classic",
    capacityWh: 1024,
    outputW: 1800,
    surgeW: 3600,
    battery: "LFP",
    cycles: 4000,
    expandable: true,
    amazonQuery: "EcoFlow DELTA 3 Classic",
    amazonAsin: "B0GMCHYHQR",
    imageSrc: "https://m.media-amazon.com/images/P/B0GMCHYHQR.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "≈ 1 kWh classe" },
      { label: "Sortie AC", value: "≈ 1 800 W" },
      { label: "Cycles", value: "≈ 4 000 LFP" },
    ],
    ...copy(
      {
        tagline: "DELTA 3 d’accès",
        summary:
          "Porte d’entrée de la génération DELTA 3 : UPS rapide, LFP longue durée, écosystème récent.",
        bestFor: "Premier backup maison / télétravail",
        pros: ["Génération récente", "LFP 4k cycles", "Écosystème DELTA 3"],
        cons: ["Moins de Wh que Max/Ultra", "Specs exactes selon bundle"],
        body: [
          "La Classic positionne DELTA 3 pour ceux qui veulent la stack logicielle/UPS récente sans surdimensionner.",
          "Priorisez vos charges critiques (box, frigo, éclairage, PC) et calculez les Wh/jour.",
          "Vérifiez toujours la fiche locale (FR/EU) : bundles et options varient.",
        ],
      },
      {
        tagline: "Entry DELTA 3",
        summary:
          "Gateway into DELTA 3: fast UPS behavior, long-life LFP, newer ecosystem.",
        bestFor: "First home backup / remote work",
        pros: ["Newer generation", "LFP ~4k cycles", "DELTA 3 ecosystem"],
        cons: ["Fewer Wh than Max/Ultra", "Bundle-dependent specs"],
        body: [
          "Classic positions DELTA 3 for buyers who want the newer UPS/software stack without oversizing.",
          "Prioritize critical loads (router, fridge, lights, PC) and estimate Wh/day.",
          "Always check local FR/EU sheets: bundles and options vary.",
        ],
      },
    ),
  },
  {
    slug: "delta-3-plus",
    category: "delta",
    name: "EcoFlow DELTA 3 Plus",
    capacityWh: 1024,
    outputW: 2600,
    battery: "LFP",
    cycles: 4000,
    expandable: true,
    amazonQuery: "EcoFlow DELTA 3 Plus",
    amazonAsin: "B0DFPW2Y2C",
    imageSrc: "https://m.media-amazon.com/images/P/B0DFPW2Y2C.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "≈ 1 024 Wh (expansible)" },
      { label: "Sortie AC", value: "jusqu’à ≈ 2 600 W" },
      { label: "UPS", value: "< 10 ms (selon config)" },
    ],
    ...copy(
      {
        tagline: "DELTA 3 avec plus de punch AC",
        summary:
          "Base ~1 kWh expansible et sortie plus élevée pour charges exigeantes.",
        bestFor: "Maison + outils / multi-prises",
        pros: ["Forte sortie", "Expansible", "UPS rapide"],
        cons: ["Wh de base à augmenter via extras"],
        body: [
          "Le Plus mise sur la puissance plutôt que sur un gros pack intégré. Stratégie : station + batteries extras selon budget.",
          "Idéal si vos pics (four micro, outils, pompe) dépassent une Classic.",
          "Cartographiez démarrage (surge) vs continu (W) avant d’acheter.",
        ],
      },
      {
        tagline: "DELTA 3 with more AC punch",
        summary:
          "~1 kWh expandable base and higher output for demanding loads.",
        bestFor: "Home + tools / multi-outlet use",
        pros: ["Strong output", "Expandable", "Fast UPS"],
        cons: ["Base Wh often needs extras"],
        body: [
          "Plus prioritizes power over a huge built-in pack. Strategy: station + extra batteries by budget.",
          "Ideal if your peaks (microwave, tools, pump) exceed a Classic.",
          "Map surge vs continuous watts before buying.",
        ],
      },
    ),
  },
  {
    slug: "delta-3-max",
    category: "delta",
    name: "EcoFlow DELTA 3 Max",
    capacityWh: 2048,
    outputW: 2400,
    surgeW: 4800,
    battery: "LFP",
    cycles: 4000,
    expandable: true,
    amazonQuery: "EcoFlow DELTA 3 Max",
    specs: [
      { label: "Capacité", value: "2 048 Wh" },
      { label: "Sortie AC", value: "≈ 2 400 W" },
      { label: "Cycles", value: "≈ 4 000" },
    ],
    ...copy(
      {
        tagline: "Hybride maison / portable 2 kWh",
        summary:
          "Autonomie confortable et sortie robuste pour backup et outdoor lourd.",
        bestFor: "Coupures nuit/week-end, chantier, van",
        pros: ["2 kWh", "LFP longue durée", "Hybrid use"],
        cons: ["Poids élevé", "Budget supérieur"],
        body: [
          "La Max est le cœur de gamme DELTA 3 pour beaucoup d’usagers résidentiels.",
          "2 kWh couvrent mieux les cycles frigo + box + PC sur plusieurs heures.",
          "Ajoutez solaire et/ou batterie extra si vous visez multi-jours.",
        ],
      },
      {
        tagline: "2 kWh home/portable hybrid",
        summary:
          "Comfortable runtime and solid output for backup and heavy outdoor use.",
        bestFor: "Overnight/weekend outages, job sites, vans",
        pros: ["2 kWh", "Long-life LFP", "Hybrid use"],
        cons: ["Heavy", "Higher budget"],
        body: [
          "Max is the DELTA 3 sweet spot for many residential users.",
          "2 kWh better covers fridge + router + PC cycles over many hours.",
          "Add solar and/or extra battery for multi-day goals.",
        ],
      },
    ),
  },
  {
    slug: "delta-3-max-plus",
    category: "delta",
    name: "EcoFlow DELTA 3 Max Plus",
    capacityWh: 2048,
    outputW: 3000,
    surgeW: 6000,
    battery: "LFP",
    cycles: 4000,
    expandable: true,
    amazonQuery: "EcoFlow DELTA 3 Max Plus",
    amazonAsin: "B0FXFLZHVD",
    imageSrc: "https://m.media-amazon.com/images/P/B0FXFLZHVD.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "2 048 Wh" },
      { label: "Sortie AC", value: "≈ 3 000 W (6 000 W surge)" },
      { label: "UPS", value: "< 10 ms" },
    ],
    ...copy(
      {
        tagline: "2 kWh + 3 kW pour charges lourdes",
        summary:
          "Même classe de capacité que Max, avec plus de marge sur les pics de puissance.",
        bestFor: "Maison avec appareils gourmands",
        pros: ["3 000 W", "2 kWh", "UPS rapide"],
        cons: ["Prix", "Poids"],
        body: [
          "Le Max Plus cible ceux qui saturent 2,4 kW : plaques, outils, multi-appareils simultanés.",
          "Gardez une lecture séparée capacité (Wh) vs puissance (W).",
          "Pour du whole-home, passez DELTA Pro.",
        ],
      },
      {
        tagline: "2 kWh + 3 kW for heavy loads",
        summary:
          "Same capacity class as Max, with more peak power headroom.",
        bestFor: "Homes with hungrier appliances",
        pros: ["3,000 W", "2 kWh", "Fast UPS"],
        cons: ["Price", "Weight"],
        body: [
          "Max Plus targets users who saturate 2.4 kW: cooktops, tools, simultaneous devices.",
          "Keep capacity (Wh) and power (W) as separate decisions.",
          "For whole-home, move to DELTA Pro.",
        ],
      },
    ),
  },
  {
    slug: "delta-3-ultra-plus",
    category: "delta",
    name: "EcoFlow DELTA 3 Ultra Plus",
    capacityWh: 3072,
    outputW: 3000,
    battery: "LFP",
    cycles: 4000,
    expandable: true,
    amazonQuery: "EcoFlow DELTA 3 Ultra Plus",
    specs: [
      { label: "Capacité", value: "3 072 Wh" },
      { label: "Expansion", value: "vers plusieurs kWh" },
      { label: "Chimie", value: "LFP ≈ 4 000 cycles" },
    ],
    ...copy(
      {
        tagline: "Haut de gamme DELTA 3",
        summary:
          "3 kWh de base expansible : autonomie longue sans basculer immédiatement en Pro Ultra.",
        bestFor: "Backup résidentiel exigeant",
        pros: ["3 kWh+", "Expansible", "Stack récente"],
        cons: ["Investissement élevé", "Transport moins pratique"],
        body: [
          "L’Ultra Plus pousse la logique DELTA 3 vers le résidentiel lourd.",
          "Calculez vos Wh critiques sur 24–48 h avant d’acheter des extras.",
          "Si vous visez panneau maison / multi-circuits, comparez Pro 3 / Pro Ultra.",
        ],
      },
      {
        tagline: "Top DELTA 3 tier",
        summary:
          "3 kWh expandable base: long runtime without jumping straight to Pro Ultra.",
        bestFor: "Demanding residential backup",
        pros: ["3 kWh+", "Expandable", "Newer stack"],
        cons: ["High investment", "Less portable"],
        body: [
          "Ultra Plus pushes DELTA 3 toward heavy residential use.",
          "Estimate critical Wh over 24–48 hours before buying extras.",
          "If you need home panel / multi-circuit coverage, compare Pro 3 / Pro Ultra.",
        ],
      },
    ),
  },
  {
    slug: "delta-pro",
    category: "delta-pro",
    name: "EcoFlow DELTA Pro",
    capacityWh: 3600,
    outputW: 3600,
    surgeW: 7200,
    solarInputW: 1600,
    battery: "NMC",
    weightKg: 45,
    expandable: true,
    amazonQuery: "EcoFlow DELTA Pro",
    specs: [
      { label: "Capacité", value: "3 600 Wh" },
      { label: "Sortie AC", value: "3 600 W" },
      { label: "Solaire", value: "jusqu’à ≈ 1 600 W" },
      { label: "Expansion", value: "Oui (extra batteries)" },
    ],
    ...copy(
      {
        tagline: "Le Pro historique",
        summary:
          "Grande capacité et forte sortie, compatible écosystème backup EcoFlow. Toujours pertinente en occasion/promo.",
        bestFor: "Backup maison, chantier, off-grid léger",
        pros: ["3,6 kWh", "3,6 kW", "Écosystème mature"],
        cons: ["Chimie NMC vs LFP récent", "Très lourde"],
        body: [
          "La DELTA Pro a défini le segment “portable whole-home lite”.",
          "Attention à la chimie et au cycle de vie vs Pro 3 LFP plus récentes.",
          "Avec Smart Home Panel (selon région), l’intégration circuits est plus propre.",
        ],
      },
      {
        tagline: "The classic Pro",
        summary:
          "Large capacity and strong output in EcoFlow’s backup ecosystem. Still relevant on deals/used.",
        bestFor: "Home backup, job sites, light off-grid",
        pros: ["3.6 kWh", "3.6 kW", "Mature ecosystem"],
        cons: ["NMC vs newer LFP", "Very heavy"],
        body: [
          "DELTA Pro defined the “portable whole-home lite” segment.",
          "Watch chemistry/cycle life versus newer LFP Pro 3 units.",
          "With Smart Home Panel (region-dependent), circuit integration is cleaner.",
        ],
      },
    ),
  },
  {
    slug: "delta-pro-3",
    category: "delta-pro",
    name: "EcoFlow DELTA Pro 3",
    capacityWh: 4096,
    outputW: 4000,
    surgeW: 8000,
    battery: "LFP",
    cycles: 4000,
    expandable: true,
    amazonQuery: "EcoFlow DELTA Pro 3",
    amazonAsin: "B0DDKP47PY",
    imageSrc: "https://m.media-amazon.com/images/P/B0DDKP47PY.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Capacité", value: "4 096 Wh" },
      { label: "Sortie AC", value: "≈ 4 000 W" },
      { label: "Chimie", value: "LFP" },
      { label: "Expansion", value: "Oui (multi-batteries)" },
    ],
    ...copy(
      {
        tagline: "Pro moderne LFP 4 kWh",
        summary:
          "Capacité élevée, sortie 4 kW, LFP : candidat #1 backup maison sérieux chez EcoFlow.",
        bestFor: "Maison, multi-appareils, longue autonomie",
        pros: ["4 kWh", "LFP", "Forte expansion"],
        cons: ["Budget", "Installation à anticiper"],
        body: [
          "La Pro 3 combine Wh élevés et chimie LFP pour un usage intensif.",
          "Planifiez circuits prioritaires (frigo, chaudière/pompe, box, éclairage).",
          "Les extras batteries permettent d’allonger sans changer d’onduleur principal.",
        ],
      },
      {
        tagline: "Modern LFP Pro at 4 kWh",
        summary:
          "High capacity, ~4 kW output, LFP: a top EcoFlow pick for serious home backup.",
        bestFor: "Homes, multi-appliance, long runtime",
        pros: ["4 kWh", "LFP", "Strong expansion"],
        cons: ["Budget", "Plan installation"],
        body: [
          "Pro 3 pairs high Wh with LFP for intensive use.",
          "Plan priority circuits (fridge, boiler/pump, router, lighting).",
          "Extra batteries extend runtime without swapping the main inverter unit.",
        ],
      },
    ),
  },
  {
    slug: "delta-pro-ultra",
    category: "delta-pro",
    name: "EcoFlow DELTA Pro Ultra",
    capacityWh: 6000,
    outputW: 7200,
    battery: "LFP",
    expandable: true,
    amazonQuery: "EcoFlow DELTA Pro Ultra",
    specs: [
      { label: "Capacité base", value: "≈ 6 kWh classe" },
      { label: "Sortie", value: "multi-kW (stackable)" },
      { label: "Expansion", value: "très élevée" },
    ],
    ...copy(
      {
        tagline: "Whole-home stackable",
        summary:
          "Architecture modulaire pour couverture maison et montée en capacité importante.",
        bestFor: "Résidentiel avancé / multi-jours",
        pros: ["Modulaire", "Haute puissance", "Scalable"],
        cons: ["Coût total", "Complexité"],
        body: [
          "L’Ultra s’adresse à ceux qui dépassent le “une station dans le salon”.",
          "Budgettez onduleur + batteries + éventuel panneau/smart home.",
          "Faites chiffrer l’installation électrique si vous touchez au tableau.",
        ],
      },
      {
        tagline: "Stackable whole-home",
        summary:
          "Modular architecture for home coverage and large capacity growth.",
        bestFor: "Advanced residential / multi-day",
        pros: ["Modular", "High power", "Scalable"],
        cons: ["Total cost", "Complexity"],
        body: [
          "Ultra is for users beyond “one station in the living room”.",
          "Budget inverter + batteries + optional smart home panel.",
          "Get electrical quotes if you touch the breaker panel.",
        ],
      },
    ),
  },
  {
    slug: "delta-pro-ultra-x",
    category: "delta-pro",
    name: "EcoFlow DELTA Pro Ultra X",
    capacityWh: 12000,
    outputW: 12000,
    battery: "LFP",
    expandable: true,
    amazonQuery: "EcoFlow DELTA Pro Ultra X",
    specs: [
      { label: "Capacité base", value: "classe 12 kWh" },
      { label: "Sortie", value: "classe 12 kW (stackable)" },
      { label: "Usage", value: "Whole-home" },
    ],
    ...copy(
      {
        tagline: "Flagship backup 2026",
        summary:
          "Très haute capacité/puissance pour couverture maison et montée massive en kWh.",
        bestFor: "Maisons exigeantes, autonomie maximale",
        pros: ["Échelle maison", "Stackable", "Haut de gamme"],
        cons: ["Prix premium", "Projet d’installation"],
        body: [
          "L’Ultra X pousse EcoFlow vers le résidentiel “centrale”.",
          "Ce n’est plus un achat impulse : c’est un projet énergie (besoins, tableau, solaire).",
          "Comparez avec solutions fixes (batterie murale) selon votre cas.",
        ],
      },
      {
        tagline: "2026 flagship backup",
        summary:
          "Very high capacity/power for home coverage and massive kWh scaling.",
        bestFor: "Demanding homes, maximum autonomy",
        pros: ["Home-scale", "Stackable", "Flagship"],
        cons: ["Premium price", "Install project"],
        body: [
          "Ultra X pushes EcoFlow toward “home energy hub” territory.",
          "Not an impulse buy: treat it as an energy project (loads, panel, solar).",
          "Compare with fixed wall batteries depending on your case.",
        ],
      },
    ),
  },
  {
    slug: "powerstream",
    category: "powerstream",
    name: "EcoFlow PowerStream",
    battery: "N/A (micro-onduleur)",
    outputW: 800,
    amazonQuery: "EcoFlow PowerStream",
    specs: [
      { label: "Type", value: "Micro-onduleur plug-and-play" },
      { label: "Usage", value: "Autoconsommation / balcon" },
      { label: "Suivi", value: "App EcoFlow + prises smart" },
      { label: "Compatibilité", value: "Stations EcoFlow (câbles dédiés)" },
    ],
    ...copy(
      {
        tagline: "Solaire balcon connecté",
        summary:
          "Injecte l’énergie panneau dans la maison via prise, avec optimisation app. Différent d’une station portable.",
        bestFor: "Autoconsommation simple, locataires, tests solaires",
        pros: ["Installation légère", "App", "Couplage station possible"],
        cons: ["Dépend règles locales", "Pas un backup off-grid pur"],
        body: [
          "PowerStream n’est pas une batterie : c’est un micro-onduleur. Le panneau produit, l’appareil injecte, la maison consomme.",
          "Avec une station EcoFlow compatible, vous pouvez stocker puis restituer selon scénarios (jour/nuit).",
          "Vérifiez copropriété, puissance autorisée et consignes électriques avant achat.",
          "Dimensionnez le panneau (orientation, ombre, saison). Un mauvais emplacement annule le ROI.",
        ],
      },
      {
        tagline: "Connected balcony solar",
        summary:
          "Feeds panel power into the home via outlet with app optimization. Different from a portable station.",
        bestFor: "Simple self-consumption, renters, solar trials",
        pros: ["Light install", "App", "Station pairing"],
        cons: ["Local rules apply", "Not pure off-grid backup"],
        body: [
          "PowerStream is not a battery: it is a micro-inverter. Panel produces, device injects, home consumes.",
          "With a compatible EcoFlow station you can store then release energy across day/night scenarios.",
          "Check condo rules, allowed power, and electrical guidance before buying.",
          "Size the panel for orientation, shade, and season. Bad placement kills ROI.",
        ],
      },
    ),
  },
  {
    slug: "panneau-100w",
    category: "solaire",
    name: "EcoFlow Solar Panel 100W",
    solarInputW: 100,
    battery: "N/A",
    weightKg: 4,
    amazonQuery: "EcoFlow panneau solaire 100W",
    specs: [
      { label: "Puissance", value: "100 W" },
      { label: "Usage", value: "Portable / RIVER" },
      { label: "Format", value: "Pliable (selon modèle)" },
    ],
    ...copy(
      {
        tagline: "Complément RIVER / petite DELTA",
        summary: "Panneau d’appoint pour recharges partielles en mobilité.",
        bestFor: "Randonnée motorisée, secours diurne",
        pros: ["Léger", "Simple"],
        cons: ["Lent sur grosses stations"],
        body: [
          "100 W convient aux petites capacités. Sur DELTA 2+, prévoyez plus de panneaux ou un modèle 220/400 W.",
          "L’angle et l’absence d’ombre comptent autant que les watts marketing.",
        ],
      },
      {
        tagline: "RIVER / small DELTA companion",
        summary: "Support panel for partial top-ups while mobile.",
        bestFor: "Road trips, daytime emergency charging",
        pros: ["Light", "Simple"],
        cons: ["Slow on large stations"],
        body: [
          "100 W fits small capacities. On DELTA 2+, plan more panels or a 220/400 W unit.",
          "Angle and shade matter as much as marketed watts.",
        ],
      },
    ),
  },
  {
    slug: "panneau-220w-bifacial",
    category: "solaire",
    name: "EcoFlow 220W Bifacial Solar Panel",
    solarInputW: 220,
    battery: "N/A",
    amazonQuery: "EcoFlow 220W bifacial",
    specs: [
      { label: "Puissance", value: "220 W" },
      { label: "Type", value: "Bifacial" },
      { label: "Usage", value: "DELTA / PowerStream" },
    ],
    ...copy(
      {
        tagline: "Sweet spot solaire portable",
        summary:
          "220 W bifacial : bon compromis recharge DELTA et kits balcon.",
        bestFor: "DELTA 2/3, PowerStream",
        pros: ["Bifacial", "Polyvalent", "Portable"],
        cons: ["Prix", "Besoin d’orientation"],
        body: [
          "Le bifacial récupère une partie de l’albédo (sol clair). Sur balcon sombre, le gain est moindre.",
          "Souvent le meilleur rapport praticité/puissance pour une station milieu de gamme.",
        ],
      },
      {
        tagline: "Portable solar sweet spot",
        summary:
          "220 W bifacial: a strong recharge compromise for DELTA and balcony kits.",
        bestFor: "DELTA 2/3, PowerStream",
        pros: ["Bifacial", "Versatile", "Portable"],
        cons: ["Price", "Needs aiming"],
        body: [
          "Bifacial recovers some albedo (bright ground). On dark balconies, gains shrink.",
          "Often the best practicality/power ratio for mid-range stations.",
        ],
      },
    ),
  },
  {
    slug: "panneau-400w",
    category: "solaire",
    name: "EcoFlow Solar Panel 400W",
    solarInputW: 400,
    battery: "N/A",
    amazonQuery: "EcoFlow panneau solaire 400W",
    specs: [
      { label: "Puissance", value: "400 W" },
      { label: "Usage", value: "Recharge rapide / fixe léger" },
    ],
    ...copy(
      {
        tagline: "Recharge accélérée",
        summary: "Pour DELTA Max / Pro et installations plus stables.",
        bestFor: "Hautes capacités, sites semi-fixes",
        pros: ["Beaucoup de watts", "Moins de temps de charge"],
        cons: ["Moins “sac à dos”", "Fixation à prévoir"],
        body: [
          "400 W aident vraiment dès 2 kWh+. Surveillez les limites d’entrée de votre station.",
          "Préférez une installation stable (toit, structure) plutôt qu’un usage ultra-nomade.",
        ],
      },
      {
        tagline: "Faster recharge",
        summary: "For DELTA Max/Pro and more stable installs.",
        bestFor: "Higher capacities, semi-fixed sites",
        pros: ["High watts", "Shorter charge times"],
        cons: ["Less backpackable", "Needs mounting"],
        body: [
          "400 W helps a lot from 2 kWh upward. Watch your station’s input limits.",
          "Prefer a stable mount (roof/structure) over ultra-nomadic use.",
        ],
      },
    ),
  },
  {
    slug: "batterie-extra-delta",
    category: "accessoires",
    name: "EcoFlow Smart Extra Battery (DELTA)",
    battery: "LFP/NMC selon modèle",
    expandable: true,
    amazonQuery: "EcoFlow extra battery DELTA",
    specs: [
      { label: "Rôle", value: "Extension de capacité" },
      { label: "Compatibilité", value: "Selon série DELTA / Pro" },
    ],
    ...copy(
      {
        tagline: "Plus de Wh sans changer d’onduleur",
        summary:
          "Batterie additionnelle pour allonger l’autonomie de votre station compatible.",
        bestFor: "Multi-jours, grosses coupures",
        pros: ["Scalable", "Garde la même sortie"],
        cons: ["Coût au Wh", "Poids cumulé"],
        body: [
          "L’extra battery est souvent plus rentable que d’acheter une seconde station complète.",
          "Vérifiez la compatibilité exacte (DELTA 2 Max ≠ Pro 3).",
        ],
      },
      {
        tagline: "More Wh without swapping inverter",
        summary:
          "Add-on battery to extend runtime on a compatible station.",
        bestFor: "Multi-day needs, long outages",
        pros: ["Scalable", "Same output stage"],
        cons: ["Cost per Wh", "Added weight"],
        body: [
          "Extra batteries are often smarter than buying a second full station.",
          "Verify exact compatibility (DELTA 2 Max ≠ Pro 3).",
        ],
      },
    ),
  },
  {
    slug: "smart-home-panel",
    category: "accessoires",
    name: "EcoFlow Smart Home Panel",
    battery: "N/A",
    amazonQuery: "EcoFlow Smart Home Panel",
    specs: [
      { label: "Rôle", value: "Intégration tableau électrique" },
      { label: "Usage", value: "Backup circuits prioritaires" },
    ],
    ...copy(
      {
        tagline: "Pont vers le tableau maison",
        summary:
          "Permet de sélectionner/alimenter des circuits via l’écosystème EcoFlow (selon génération/région).",
        bestFor: "Backup résidentiel structuré",
        pros: ["Plus propre qu’une multiprise", "Pilotage"],
        cons: ["Installation électricien", "Coût"],
        body: [
          "Le panneau intelligent transforme une station Pro en brique de backup plus “maison”.",
          "Faites réaliser l’installation par un professionnel.",
        ],
      },
      {
        tagline: "Bridge to the home panel",
        summary:
          "Helps select/power circuits through EcoFlow’s ecosystem (generation/region dependent).",
        bestFor: "Structured residential backup",
        pros: ["Cleaner than power strips", "Control"],
        cons: ["Electrician install", "Cost"],
        body: [
          "A smart panel turns a Pro station into a more “home-like” backup brick.",
          "Have a professional handle installation.",
        ],
      },
    ),
  },
  {
    slug: "stream-ultra-x",
    category: "stream",
    name: "EcoFlow STREAM Ultra X",
    capacityWh: 3840,
    outputW: 2300,
    solarInputW: 8000,
    battery: "LFP",
    expandable: true,
    amazonQuery: "EcoFlow STREAM Ultra X",
    specs: [
      { label: "Capacité", value: "3,84 kWh" },
      { label: "Sortie CA max", value: "≈ 2 300 W" },
      { label: "MPPT", value: "4 × MPPT (entrée solaire élevée)" },
      { label: "Usage", value: "Kit solaire balcon / plug-in + stockage" },
    ],
    ...copy(
      {
        tagline: "Flagship STREAM plug-in + batterie",
        summary:
          "Système solaire plug-in avec gros stockage (3,84 kWh) et sortie CA élevée pour appareils domestiques gourmands.",
        bestFor: "Autoconsommation maison / balcon ambitieux",
        pros: ["3,84 kWh", "Multi-MPPT", "Sortie CA forte"],
        cons: ["Investissement", "Installation à planifier"],
        body: [
          "STREAM Ultra X représente la montée en gamme du solaire balcon EcoFlow FR : plus qu’un micro-onduleur, c’est un duo production + stockage.",
          "Les 4 MPPT aident à gérer plusieurs orientations de panneaux.",
          "Vérifiez la réglementation locale (puissance injectée, déclaration) avant déploiement.",
        ],
      },
      {
        tagline: "Flagship STREAM plug-in + battery",
        summary:
          "Plug-in solar system with large storage (3.84 kWh) and strong AC output for hungry home loads.",
        bestFor: "Ambitious home/balcony self-consumption",
        pros: ["3.84 kWh", "Multi-MPPT", "Strong AC output"],
        cons: ["Investment", "Plan installation"],
        body: [
          "STREAM Ultra X is EcoFlow’s higher-end balcony solar approach: production plus storage.",
          "Four MPPT inputs help with mixed panel orientations.",
          "Check local injection rules before deploying.",
        ],
      },
    ),
  },
  {
    slug: "stream-pro",
    category: "stream",
    name: "EcoFlow STREAM Pro",
    capacityWh: 1920,
    battery: "LFP",
    expandable: true,
    amazonQuery: "EcoFlow STREAM Pro",
    specs: [
      { label: "Capacité", value: "1,92 kWh (expansible)" },
      { label: "Expansion", value: "jusqu’à ≈ 11,52 kWh" },
      { label: "MPPT", value: "jusqu’à 3 × MPPT" },
      { label: "Compatibilité", value: "Série STREAM" },
    ],
    ...copy(
      {
        tagline: "Stockage STREAM modulable",
        summary:
          "Batterie plug-in modulable pour monter en kWh selon votre toiture/balcon.",
        bestFor: "Évolution progressive du stockage",
        pros: ["Modulaire", "Plug-in", "Écosystème STREAM"],
        cons: ["Besoin de panneaux/onduleur compatibles"],
        body: [
          "STREAM Pro mise sur l’évolutivité : partez petit, ajoutez de la capacité.",
          "Idéal si vous testez le solaire balcon avant d’investir dans Ultra X.",
        ],
      },
      {
        tagline: "Modular STREAM storage",
        summary:
          "Modular plug-in battery to scale kWh with your balcony/roof setup.",
        bestFor: "Progressive storage growth",
        pros: ["Modular", "Plug-in", "STREAM ecosystem"],
        cons: ["Needs compatible panels/inverter"],
        body: [
          "STREAM Pro focuses on scalability: start smaller, add capacity later.",
          "Ideal if you trial balcony solar before Ultra X.",
        ],
      },
    ),
  },
  {
    slug: "stream-max",
    category: "stream",
    name: "EcoFlow STREAM Max",
    capacityWh: 1920,
    solarInputW: 1000,
    battery: "LFP",
    amazonQuery: "EcoFlow STREAM Max",
    specs: [
      { label: "Capacité", value: "1,92 kWh" },
      { label: "Entrée solaire", value: "≈ 1 000 W / 2 MPPT" },
      { label: "Usage", value: "Solaire balcon + stockage" },
    ],
    ...copy(
      {
        tagline: "STREAM équilibré 1,92 kWh",
        summary:
          "Bon point d’entrée stockage STREAM avec entrée solaire généreuse.",
        bestFor: "Autoconsommation résidentielle légère",
        pros: ["1 000 W solaire", "2 MPPT", "Plug-in"],
        cons: ["Moins de kWh qu’Ultra X"],
        body: [
          "STREAM Max cible le rapport simplicité / économies sur facture.",
          "Couplez-le à des panneaux adaptés et surveillez l’ombre saisonnière.",
        ],
      },
      {
        tagline: "Balanced STREAM at 1.92 kWh",
        summary:
          "Solid STREAM storage entry with generous solar input.",
        bestFor: "Light residential self-consumption",
        pros: ["~1,000 W solar", "2 MPPT", "Plug-in"],
        cons: ["Fewer kWh than Ultra X"],
        body: [
          "STREAM Max targets simplicity vs bill savings.",
          "Pair with suitable panels and watch seasonal shade.",
        ],
      },
    ),
  },
  {
    slug: "stream-micro-onduleur",
    category: "stream",
    name: "EcoFlow STREAM Micro-onduleur",
    outputW: 800,
    battery: "N/A",
    amazonQuery: "EcoFlow STREAM micro onduleur",
    amazonAsin: "B0F2FTSZKG",
    imageSrc: "https://m.media-amazon.com/images/P/B0F2FTSZKG.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Type", value: "Micro-onduleur" },
      { label: "Puissance", value: "≈ 800 W" },
      { label: "MPPT", value: "Oui" },
    ],
    ...copy(
      {
        tagline: "Cœur d’injection STREAM",
        summary:
          "Convertit le DC panneau en AC pour injection domestique dans l’écosystème STREAM.",
        bestFor: "Kits solaires balcon plug-and-play",
        pros: ["800 W classe", "MPPT", "Écosystème STREAM"],
        cons: ["Pas de stockage intégré"],
        body: [
          "Le micro-onduleur STREAM remplace/complète l’approche PowerStream sur le marché FR actuel.",
          "Sans batterie, l’énergie est consommée en journée. Ajoutez STREAM Pro/Max/Ultra pour la nuit.",
        ],
      },
      {
        tagline: "STREAM injection core",
        summary:
          "Converts panel DC to AC for home injection in the STREAM ecosystem.",
        bestFor: "Plug-and-play balcony solar kits",
        pros: ["~800 W class", "MPPT", "STREAM ecosystem"],
        cons: ["No built-in storage"],
        body: [
          "STREAM micro-inverter is the current FR balcony path alongside classic PowerStream.",
          "Without a battery, energy is daytime-only. Add STREAM storage for nights.",
        ],
      },
    ),
  },
  {
    slug: "kit-solaire-stream-800",
    category: "stream",
    name: "Kit solaire STREAM 800W",
    solarInputW: 800,
    battery: "N/A",
    amazonQuery: "EcoFlow kit solaire balcon 800W",
    specs: [
      { label: "Entrée solaire", value: "jusqu’à ≈ 800 W" },
      { label: "Usage", value: "Journée / plug-and-play" },
    ],
    ...copy(
      {
        tagline: "Kit balcon journée",
        summary: "Pack plug-and-play pour production diurne sans forcément stocker.",
        bestFor: "Test solaire / économies diurnes",
        pros: ["Simple", "DIY", "Compatible écosystème"],
        cons: ["Peu utile la nuit sans batterie"],
        body: [
          "Les kits 800–1000 W STREAM visent l’installation sans électricien (selon règles locales).",
          "Mesurez votre conso diurne avant d’acheter : le ROI dépend de votre courbe de charge.",
        ],
      },
      {
        tagline: "Daytime balcony kit",
        summary: "Plug-and-play pack for daytime production without mandatory storage.",
        bestFor: "Solar trial / daytime savings",
        pros: ["Simple", "DIY", "Ecosystem compatible"],
        cons: ["Limited at night without battery"],
        body: [
          "STREAM 800–1000 W kits target DIY installs (local rules apply).",
          "Measure daytime consumption first: ROI follows your load curve.",
        ],
      },
    ),
  },
  {
    slug: "ocean-2-plus",
    category: "ocean",
    name: "EcoFlow OCEAN 2 Plus",
    capacityWh: 60000,
    outputW: 12000,
    battery: "LFP (écosystème maison)",
    expandable: true,
    amazonQuery: "EcoFlow OCEAN 2",
    specs: [
      { label: "Capacité", value: "jusqu’à ≈ 60 kWh (config)" },
      { label: "Sortie", value: "classe 12 kW" },
      { label: "Type", value: "Batterie domestique tout-en-un" },
    ],
    ...copy(
      {
        tagline: "Batterie maison nouvelle génération",
        summary:
          "Solution résidentielle haute capacité pour autonomie et secours, au-delà des stations portables.",
        bestFor: "Maison / projet énergie fixe",
        pros: ["Très haute capacité", "Haute puissance", "Résidentiel"],
        cons: ["Projet d’installation", "Budget premium"],
        body: [
          "OCEAN 2 Plus n’est pas une station portable : c’est une brique énergie maison.",
          "Faites chiffrer l’installation et comparez avec DELTA Pro Ultra selon mobilité souhaitée.",
        ],
      },
      {
        tagline: "Next-gen home battery",
        summary:
          "High-capacity residential solution for autonomy and backup beyond portable stations.",
        bestFor: "Home / fixed energy project",
        pros: ["Very high capacity", "High power", "Residential"],
        cons: ["Install project", "Premium budget"],
        body: [
          "OCEAN 2 Plus is not a portable station—it is a home energy brick.",
          "Quote installation and compare with DELTA Pro Ultra depending on mobility needs.",
        ],
      },
    ),
  },
  {
    slug: "glacier-classic",
    category: "outdoor",
    name: "EcoFlow GLACIER Classic",
    battery: "Compatible stations EcoFlow",
    amazonQuery: "EcoFlow GLACIER",
    amazonAsin: "B0F98GYQDH",
    imageSrc: "https://m.media-amazon.com/images/P/B0F98GYQDH.01._SCLZZZZZZZ_SX500_.jpg",
    specs: [
      { label: "Type", value: "Réfrigérateur-congélateur portable" },
      { label: "Autonomie", value: "jusqu’à ≈ 43 h (selon config)" },
      { label: "Zones", value: "Double zone (selon version)" },
    ],
    ...copy(
      {
        tagline: "Froid portable EcoFlow",
        summary:
          "Glacière à compression pour camping/van, conçue pour s’intégrer à l’écosystème EcoFlow.",
        bestFor: "Vanlife, camping, road-trip",
        pros: ["Compression", "Double zone", "Écosystème"],
        cons: ["Conso à dimensionner avec la station"],
        body: [
          "GLACIER est souvent le poste qui dicte la taille de votre station (RIVER vs DELTA).",
          "Mesurez les cycles réels : isolation et température ambiante changent tout.",
        ],
      },
      {
        tagline: "EcoFlow portable cooling",
        summary:
          "Compressor cooler for camping/vans, designed around the EcoFlow ecosystem.",
        bestFor: "Vanlife, camping, road trips",
        pros: ["Compressor", "Dual zone", "Ecosystem"],
        cons: ["Size your station for draw"],
        body: [
          "GLACIER often dictates station size (RIVER vs DELTA).",
          "Measure real cycles: insulation and ambient temperature matter.",
        ],
      },
    ),
  },
  {
    slug: "wave-3",
    category: "outdoor",
    name: "EcoFlow WAVE 3",
    outputW: 1800,
    battery: "Compatible stations EcoFlow",
    amazonQuery: "EcoFlow WAVE 3",
    specs: [
      { label: "Refroidissement", value: "≈ 1,8 kW" },
      { label: "Chauffage", value: "≈ 2 kW" },
      { label: "Type", value: "Climatiseur portable" },
    ],
    ...copy(
      {
        tagline: "Clim portable haute puissance",
        summary:
          "Refroidit/chauffe en mobilité ; nécessite une station DELTA/Pro dimensionnée.",
        bestFor: "Tente, van, pièce temporaire",
        pros: ["Froid + chaud", "Outdoor", "Écosystème"],
        cons: ["Très gourmand en Wh", "Bruit/condensation à gérer"],
        body: [
          "WAVE 3 demande une lecture honnête des Wh : quelques heures peuvent vider 2 kWh.",
          "Couplez à DELTA Max / Pro et du solaire si usage prolongé.",
        ],
      },
      {
        tagline: "High-power portable AC",
        summary:
          "Cools/heats on the move; needs a properly sized DELTA/Pro station.",
        bestFor: "Tent, van, temporary rooms",
        pros: ["Cool + heat", "Outdoor", "Ecosystem"],
        cons: ["Wh hungry", "Noise/condensation"],
        body: [
          "WAVE 3 needs honest Wh planning: a few hours can empty 2 kWh.",
          "Pair with DELTA Max/Pro and solar for longer sessions.",
        ],
      },
    ),
  },
  {
    slug: "rapid-pro",
    category: "outdoor",
    name: "EcoFlow RAPID Pro",
    capacityWh: 72,
    battery: "Li-ion power bank",
    amazonQuery: "EcoFlow RAPID Pro",
    specs: [
      { label: "Capacité", value: "20 000 mAh / ≈ 72 Wh" },
      { label: "USB-C", value: "jusqu’à 100 W" },
      { label: "Charge multi", value: "jusqu’à ≈ 230 W total (selon ports)" },
    ],
    ...copy(
      {
        tagline: "Power bank voyage rapide",
        summary: "Charge rapide multi-appareils pour mobilité quotidienne.",
        bestFor: "Voyage, bureau nomade",
        pros: ["USB-C 100 W", "Compact", "Multi-ports"],
        cons: ["Pas un backup maison"],
        body: [
          "RAPID Pro complète les stations : idéal téléphone/laptop en déplacement léger.",
        ],
      },
      {
        tagline: "Fast travel power bank",
        summary: "Fast multi-device charging for daily mobility.",
        bestFor: "Travel, nomad work",
        pros: ["USB-C 100 W", "Compact", "Multi-port"],
        cons: ["Not home backup"],
        body: [
          "RAPID Pro complements stations: phones/laptops on light travel days.",
        ],
      },
    ),
  },
  {
    slug: "chargeur-alternateur-600",
    category: "outdoor",
    name: "EcoFlow Chargeur d'alternateur 600W",
    outputW: 600,
    battery: "N/A",
    amazonQuery: "EcoFlow chargeur alternateur 600W",
    specs: [
      { label: "Puissance", value: "≈ 600 W" },
      { label: "Usage", value: "Recharge en roulant" },
    ],
    ...copy(
      {
        tagline: "Recharge pendant la route",
        summary:
          "Alimente votre station via l’alternateur pour arriver avec des Wh déjà rechargés.",
        bestFor: "Van / road-trip",
        pros: ["Recharge en roulant", "Complément solaire"],
        cons: ["Installation véhicule", "Dépend de l’alternateur"],
        body: [
          "Utile quand le solaire est insuffisant (forêt, hiver). Vérifiez la compatibilité véhicule/station.",
        ],
      },
      {
        tagline: "Charge while driving",
        summary:
          "Feeds your station from the alternator so you arrive with Wh topped up.",
        bestFor: "Van / road trips",
        pros: ["Drive-time recharge", "Solar complement"],
        cons: ["Vehicle install", "Alternator dependent"],
        body: [
          "Useful when solar is weak (forest, winter). Check vehicle/station compatibility.",
        ],
      },
    ),
  },
  {
    slug: "delta-3-1500",
    category: "delta",
    name: "EcoFlow DELTA 3 1500",
    capacityWh: 1500,
    outputW: 1800,
    surgeW: 2400,
    battery: "LFP",
    cycles: 4000,
    expandable: true,
    amazonQuery: "EcoFlow DELTA 3 1500",
    specs: [
      { label: "Capacité", value: "≈ 1,5 kWh (expansible)" },
      { label: "Sortie AC", value: "1 800 W (X-Boost ≈ 2 400 W)" },
      { label: "Chimie", value: "LFP" },
    ],
    ...copy(
      {
        tagline: "DELTA 3 milieu de gamme 1,5 kWh",
        summary:
          "Entre Classic 1 kWh et Max 2 kWh : bon compromis backup léger + outdoor.",
        bestFor: "Maison légère / van",
        pros: ["1,5 kWh", "Expansible", "X-Boost"],
        cons: ["Moins connu que Max"],
        body: [
          "La DELTA 3 1500 (gamme FR) comble le trou entre 1 et 2 kWh.",
          "Vérifiez bundles solaires (220/400 W) souvent proposés sur fr.ecoflow.com.",
        ],
      },
      {
        tagline: "Mid DELTA 3 at 1.5 kWh",
        summary:
          "Between Classic 1 kWh and Max 2 kWh: solid light backup + outdoor compromise.",
        bestFor: "Light home / van",
        pros: ["1.5 kWh", "Expandable", "X-Boost"],
        cons: ["Less visible than Max"],
        body: [
          "DELTA 3 1500 fills the 1–2 kWh gap on FR catalogs.",
          "Check solar bundles (220/400 W) often listed on EcoFlow FR.",
        ],
      },
    ),
  },
  {
    slug: "river-3-plus-wireless",
    category: "river",
    name: "EcoFlow RIVER 3 Plus Wireless",
    capacityWh: 286,
    outputW: 600,
    battery: "LFP",
    cycles: 4000,
    expandable: true,
    amazonQuery: "EcoFlow RIVER 3 Plus Wireless",
    specs: [
      { label: "Capacité", value: "286 Wh" },
      { label: "Sortie AC", value: "600 W" },
      { label: "Particularité", value: "Édition sans fil / power banks" },
    ],
    ...copy(
      {
        tagline: "RIVER 3 Plus version sans fil",
        summary:
          "Variante avec options de charge sans fil / batteries amovibles selon bundle.",
        bestFor: "Créatifs nomades, camping tech",
        pros: ["600 W", "Modularité", "LFP"],
        cons: ["Prix vs version standard"],
        body: [
          "Utile si vous fractionnez l’énergie (power bank + station).",
          "Comparez le prix total avec DELTA 2 avant d’empiler les accessoires.",
        ],
      },
      {
        tagline: "RIVER 3 Plus wireless edition",
        summary:
          "Variant with wireless/removable battery options depending on bundle.",
        bestFor: "Creators, tech camping",
        pros: ["600 W", "Modularity", "LFP"],
        cons: ["Price vs standard"],
        body: [
          "Useful if you split energy (power bank + station).",
          "Compare total cost with DELTA 2 before stacking accessories.",
        ],
      },
    ),
  },
  {
    slug: "panneau-rvmax-130",
    category: "solaire",
    name: "EcoFlow RVMax 130W (x2)",
    solarInputW: 260,
    battery: "N/A",
    amazonQuery: "EcoFlow RVMax 130W",
    specs: [
      { label: "Puissance", value: "130 W × 2" },
      { label: "Rendement", value: "jusqu’à ≈ 25 %" },
      { label: "Usage", value: "Camping-car / fixe léger" },
      { label: "Protection", value: "IP68" },
    ],
    ...copy(
      {
        tagline: "Solaire rigide camping-car",
        summary: "Panneaux fins adaptés aux toits de van/camping-car.",
        bestFor: "Vanlife / RV",
        pros: ["Fin", "IP68", "Haut rendement"],
        cons: ["Installation toit", "Moins nomade qu’un pliable"],
        body: [
          "Les RVMax ciblent la fixation permanente : moins de prise au vent, meilleur quotidien van.",
        ],
      },
      {
        tagline: "Rigid RV solar",
        summary: "Slim panels suited to van/RV roofs.",
        bestFor: "Vanlife / RV",
        pros: ["Slim", "IP68", "High efficiency"],
        cons: ["Roof install", "Less nomadic than foldable"],
        body: [
          "RVMax targets permanent mounts: less wind load, better daily van use.",
        ],
      },
    ),
  },
];

categories.push(...tumblerCategories);
products.push(...tumblerProducts);
categories.push(...massageGunCategories);
products.push(...massageGunProducts);

export function productSiteId(product: Product): SiteId {
  return product.siteId || "ecoflow";
}

export function categorySiteId(cat: CategoryMeta): SiteId {
  return cat.siteId || "ecoflow";
}

export function getCategoriesForSite(siteId: SiteId) {
  return categories.filter((c) => categorySiteId(c) === siteId);
}

export function getProductsForSite(siteId: SiteId) {
  return products.filter((p) => productSiteId(p) === siteId);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categoryId: CategoryId) {
  return products.filter((p) => p.category === categoryId);
}

export function getProduct(categorySlug: string, productSlug: string) {
  const cat = getCategory(categorySlug);
  if (!cat) return null;
  return products.find((p) => p.category === cat.id && p.slug === productSlug) || null;
}

export function getLocalizedProduct(product: Product, locale: string) {
  return locale === "en" ? product.en : product.fr;
}

export function getLocalizedCategory(cat: CategoryMeta, locale: string) {
  return locale === "en" ? cat.en : cat.fr;
}
