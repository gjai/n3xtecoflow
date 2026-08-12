import type { CategoryId } from "@/data/products";

export type SiteImage = {
  src: string;
  altFr: string;
  altEn: string;
  credit: string;
  creditUrl: string;
};

/** Lifestyle / contextual photos (Unsplash License). Not official EcoFlow product shots. */
export const heroImage: SiteImage = {
  src: "/images/hero/station-solaire.jpg",
  altFr: "Panneau solaire et station électrique portable sur l’herbe",
  altEn: "Solar panel and portable power station on grass",
  credit: "Unsplash",
  creditUrl: "https://unsplash.com/license",
};

export const categoryImages: Record<CategoryId, SiteImage> = {
  river: {
    src: "/images/categories/river.jpg",
    altFr: "Campement outdoor — usage station portable compacte",
    altEn: "Outdoor camping — compact portable power use case",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  delta: {
    src: "/images/categories/delta.jpg",
    altFr: "Lignes électriques — backup et énergie domestique",
    altEn: "Power lines — home backup energy context",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  "delta-pro": {
    src: "/images/categories/delta-pro.jpg",
    altFr: "Ferme solaire — haute capacité et autonomie",
    altEn: "Solar farm — high capacity and autonomy",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  stream: {
    src: "/images/categories/stream.jpg",
    altFr: "Panneaux solaires — solaire plug-in / balcon",
    altEn: "Solar panels — plug-in / balcony solar",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  powerstream: {
    src: "/images/categories/powerstream.jpg",
    altFr: "Toiture solaire — micro-onduleur et autoconsommation",
    altEn: "Rooftop solar — micro-inverter and self-consumption",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  ocean: {
    src: "/images/categories/ocean.jpg",
    altFr: "Compteur et énergie maison — stockage résidentiel",
    altEn: "Home energy meter — residential storage context",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  solaire: {
    src: "/images/categories/solaire.jpg",
    altFr: "Champ de panneaux solaires",
    altEn: "Solar panel field",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  outdoor: {
    src: "/images/categories/outdoor.jpg",
    altFr: "Vanlife / outdoor — énergie nomade",
    altEn: "Vanlife / outdoor — mobile power",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  accessoires: {
    src: "/images/categories/accessoires.jpg",
    altFr: "Électronique et accessoires de charge",
    altEn: "Electronics and charging accessories",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
};

export const editorialImages = {
  guides: {
    src: "/images/editorial/guides.jpg",
    altFr: "Paysage — guides d’achat énergie",
    altEn: "Landscape — energy buying guides",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  news: {
    src: "/images/editorial/news.jpg",
    altFr: "Infrastructure électrique — actualités énergie",
    altEn: "Electrical infrastructure — energy news",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  camping: {
    src: "/images/editorial/camping.jpg",
    altFr: "Camping en pleine nature",
    altEn: "Camping in nature",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  backup: {
    src: "/images/editorial/backup.jpg",
    altFr: "Intérieur maison — backup électrique",
    altEn: "Home interior — backup power context",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  comparatifs: {
    src: "/images/editorial/comparatifs.jpg",
    altFr: "Bureau — comparaison et décision d’achat",
    altEn: "Desk — comparison and buying decision",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
} as const satisfies Record<string, SiteImage>;

export function getCategoryImage(id: CategoryId): SiteImage {
  return categoryImages[id];
}
