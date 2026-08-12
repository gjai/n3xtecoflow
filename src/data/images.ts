import type { CategoryId } from "@/data/products";
import type { SiteId } from "@/sites/types";

export type SiteImage = {
  src: string;
  altFr: string;
  altEn: string;
  credit: string;
  creditUrl: string;
};

const UNSplash = {
  credit: "Unsplash",
  creditUrl: "https://unsplash.com/license",
} as const;

/** Lifestyle / contextual photos (Unsplash License). Not official EcoFlow product shots. */
export const heroImage: SiteImage = {
  src: "/images/hero/station-solaire.jpg",
  altFr: "Panneau solaire et station électrique portable sur l’herbe",
  altEn: "Solar panel and portable power station on grass",
  ...UNSplash,
};

export const categoryImages: Record<CategoryId, SiteImage> = {
  river: {
    src: "/images/categories/river.jpg",
    altFr: "Campement outdoor — usage station portable compacte",
    altEn: "Outdoor camping — compact portable power use case",
    ...UNSplash,
  },
  delta: {
    src: "/images/categories/delta.jpg",
    altFr: "Lignes électriques — backup et énergie domestique",
    altEn: "Power lines — home backup energy context",
    ...UNSplash,
  },
  "delta-pro": {
    src: "/images/categories/delta-pro.jpg",
    altFr: "Ferme solaire — haute capacité et autonomie",
    altEn: "Solar farm — high capacity and autonomy",
    ...UNSplash,
  },
  stream: {
    src: "/images/categories/stream.jpg",
    altFr: "Panneaux solaires — solaire plug-in / balcon",
    altEn: "Solar panels — plug-in / balcony solar",
    ...UNSplash,
  },
  powerstream: {
    src: "/images/categories/powerstream.jpg",
    altFr: "Toiture solaire — micro-onduleur et autoconsommation",
    altEn: "Rooftop solar — micro-inverter and self-consumption",
    ...UNSplash,
  },
  ocean: {
    src: "/images/categories/ocean.jpg",
    altFr: "Compteur et énergie maison — stockage résidentiel",
    altEn: "Home energy meter — residential storage context",
    ...UNSplash,
  },
  solaire: {
    src: "/images/categories/solaire.jpg",
    altFr: "Champ de panneaux solaires",
    altEn: "Solar panel field",
    ...UNSplash,
  },
  outdoor: {
    src: "/images/categories/outdoor.jpg",
    altFr: "Vanlife / outdoor — énergie nomade",
    altEn: "Vanlife / outdoor — mobile power",
    ...UNSplash,
  },
  accessoires: {
    src: "/images/categories/accessoires.jpg",
    altFr: "Électronique et accessoires de charge",
    altEn: "Electronics and charging accessories",
    ...UNSplash,
  },
  gourdes: {
    src: "/images/tumbler/gourdes.jpg",
    altFr: "Gourde isotherme — hydratation quotidienne",
    altEn: "Insulated bottle — daily hydration",
    ...UNSplash,
  },
  tumblers: {
    src: "/images/tumbler/tumblers.jpg",
    altFr: "Tumbler isotherme — bureau et trajet",
    altEn: "Insulated tumbler — office and commute",
    ...UNSplash,
  },
  pistolets: {
    src: "/images/massage-gun/pistolets.jpg",
    altFr: "Pistolet de massage — récupération musculaire",
    altEn: "Massage gun — muscle recovery",
    ...UNSplash,
  },
  mini: {
    src: "/images/massage-gun/mini.jpg",
    altFr: "Mini pistolet de massage — voyage et bureau",
    altEn: "Mini massage gun — travel and desk",
    ...UNSplash,
  },
};

export const editorialImages = {
  guides: {
    src: "/images/editorial/guides.jpg",
    altFr: "Paysage — guides d’achat énergie",
    altEn: "Landscape — energy buying guides",
    ...UNSplash,
  },
  news: {
    src: "/images/editorial/news.jpg",
    altFr: "Infrastructure électrique — actualités énergie",
    altEn: "Electrical infrastructure — energy news",
    ...UNSplash,
  },
  camping: {
    src: "/images/editorial/camping.jpg",
    altFr: "Camping en pleine nature",
    altEn: "Camping in nature",
    ...UNSplash,
  },
  backup: {
    src: "/images/editorial/backup.jpg",
    altFr: "Intérieur maison — backup électrique",
    altEn: "Home interior — backup power context",
    ...UNSplash,
  },
  comparatifs: {
    src: "/images/editorial/comparatifs.jpg",
    altFr: "Bureau — comparaison et décision d’achat",
    altEn: "Desk — comparison and buying decision",
    ...UNSplash,
  },
} as const satisfies Record<string, SiteImage>;

const tumblerEditorial = {
  guides: {
    src: "/images/tumbler/guides.jpg",
    altFr: "Sac et hydratation — guides d’achat gourdes",
    altEn: "Bag and hydration — bottle buying guides",
    ...UNSplash,
  },
  news: {
    src: "/images/tumbler/news.jpg",
    altFr: "Bureau — actualités et sélections isothermes",
    altEn: "Desk — insulated drinkware news and picks",
    ...UNSplash,
  },
  camping: {
    src: "/images/tumbler/gourdes.jpg",
    altFr: "Gourde outdoor — usage quotidien",
    altEn: "Outdoor bottle — daily use",
    ...UNSplash,
  },
  backup: {
    src: "/images/tumbler/hero.jpg",
    altFr: "Gourde isotherme — lifestyle",
    altEn: "Insulated bottle — lifestyle",
    ...UNSplash,
  },
  comparatifs: {
    src: "/images/tumbler/comparatifs.jpg",
    altFr: "Boisson — comparaison gourdes et tumblers",
    altEn: "Drinkware — comparing bottles and tumblers",
    ...UNSplash,
  },
} as const satisfies Record<string, SiteImage>;

const massageGunEditorial = {
  guides: {
    src: "/images/massage-gun/guides.jpg",
    altFr: "Récupération — guides pistolets de massage",
    altEn: "Recovery — massage gun buying guides",
    ...UNSplash,
  },
  news: {
    src: "/images/massage-gun/news.jpg",
    altFr: "Bien-être — actualités percussion",
    altEn: "Wellness — percussion massage news",
    ...UNSplash,
  },
  camping: {
    src: "/images/massage-gun/pistolets.jpg",
    altFr: "Sport — usage pistolet de massage",
    altEn: "Sport — massage gun use",
    ...UNSplash,
  },
  backup: {
    src: "/images/massage-gun/hero.jpg",
    altFr: "Récupération musculaire — lifestyle",
    altEn: "Muscle recovery — lifestyle",
    ...UNSplash,
  },
  comparatifs: {
    src: "/images/massage-gun/comparatifs.jpg",
    altFr: "Comparaison de pistolets de massage",
    altEn: "Comparing massage guns",
    ...UNSplash,
  },
} as const satisfies Record<string, SiteImage>;

export function getEditorialImages(siteId: SiteId = "ecoflow") {
  if (siteId === "tumbler") return tumblerEditorial;
  if (siteId === "massage-gun") return massageGunEditorial;
  return editorialImages;
}

export function getHeroImage(siteId: SiteId = "ecoflow"): SiteImage {
  if (siteId === "tumbler") {
    return {
      src: "/images/tumbler/hero.jpg",
      altFr: "Gourde isotherme — hydratation",
      altEn: "Insulated bottle — hydration",
      ...UNSplash,
    };
  }
  if (siteId === "massage-gun") {
    return {
      src: "/images/massage-gun/hero.jpg",
      altFr: "Pistolet de massage — récupération",
      altEn: "Massage gun — recovery",
      ...UNSplash,
    };
  }
  return heroImage;
}

export function getCategoryImage(
  id: CategoryId,
  _siteId?: SiteId,
): SiteImage {
  return categoryImages[id];
}
