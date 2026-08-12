import type { ArticleSection } from "@/data/articles";
import type { SiteId } from "@/sites/types";

export type GuideLocaleCopy = {
  title: string;
  subtitle: string;
  sections: ArticleSection[];
};

export type GuideEntry = {
  slug: string;
  /** Theme that owns this guide. Defaults to ecoflow when omitted. */
  siteId?: SiteId;
  fr: GuideLocaleCopy;
  en: GuideLocaleCopy;
  imageSrc?: string;
  imageCredit?: string;
  model?: string;
  updatedAt: string;
};

export type GuidesStore = {
  updatedAt: string;
  entries: Record<string, GuideEntry>;
};

export type GuideTopic = {
  slug: string;
  siteId?: SiteId;
  topicFr: string;
  topicEn: string;
  angleFr: string;
  angleEn: string;
};

export function guideSiteId(
  entry: { siteId?: SiteId } | null | undefined,
): SiteId {
  return entry?.siteId || "ecoflow";
}

export function guidesForSite(topics: GuideTopic[], siteId: SiteId) {
  return topics.filter((t) => guideSiteId(t) === siteId);
}

/** Seed topics for AI generation / enrichment. */
export const GUIDE_TOPICS: GuideTopic[] = [
  {
    slug: "choisir-station",
    topicFr: "Choisir une station électrique EcoFlow",
    topicEn: "Choosing an EcoFlow power station",
    angleFr: "Méthode Wh/W, familles RIVER/DELTA/Pro, erreurs d’achat",
    angleEn: "Wh/W method, RIVER/DELTA/Pro families, buying mistakes",
  },
  {
    slug: "dimensionnement-wh",
    topicFr: "Dimensionner Wh et watts pour son besoin",
    topicEn: "Sizing Wh and watts for your needs",
    angleFr: "Calcul conso, marge, pic de démarrage, exemples concrets",
    angleEn: "Load calc, margin, startup surge, concrete examples",
  },
  {
    slug: "solaire-portable",
    topicFr: "Solaire portable EcoFlow : panneaux et recharge",
    topicEn: "EcoFlow portable solar: panels and charging",
    angleFr: "MPPT, bifacial, puissance adaptée à la station",
    angleEn: "MPPT, bifacial, matching panel wattage to stations",
  },
  {
    slug: "backup-maison",
    topicFr: "Backup maison avec EcoFlow DELTA / Pro",
    topicEn: "Home backup with EcoFlow DELTA / Pro",
    angleFr: "Charges critiques, UPS, Smart Home Panel, autonomie",
    angleEn: "Critical loads, UPS, Smart Home Panel, runtime",
  },
  {
    slug: "camping-van",
    topicFr: "Camping / vanlife : quelle station EcoFlow",
    topicEn: "Camping / vanlife: which EcoFlow station",
    angleFr: "Frigo 12V/230V, poids, solaire toit, GLACIER",
    angleEn: "12V/230V fridge, weight, roof solar, GLACIER",
  },
  {
    slug: "stream-balcon",
    topicFr: "STREAM solaire balcon plug-in en France",
    topicEn: "STREAM plug-in balcony solar in France",
    angleFr: "Kits Ultra X/Pro/Max, micro-onduleur, règles FR",
    angleEn: "Ultra X/Pro/Max kits, micro-inverter, FR rules",
  },
  {
    slug: "delta-pro-autonomie",
    topicFr: "DELTA Pro : autonomie longue et intégration maison",
    topicEn: "DELTA Pro: long runtime and home integration",
    angleFr: "DELTA Pro 3 / Ultra, expansion, panneaux maison",
    angleEn: "DELTA Pro 3 / Ultra, expansion, home panels",
  },
  {
    slug: "glacier-froid",
    topicFr: "EcoFlow GLACIER : frigo portable et autonomie",
    topicEn: "EcoFlow GLACIER: portable fridge and runtime",
    angleFr: "Couplage station, batterie enfichable, usage camping",
    angleEn: "Station pairing, plug-in battery, camping use",
  },
  {
    slug: "wave-clim",
    topicFr: "EcoFlow WAVE : clim portable hors réseau",
    topicEn: "EcoFlow WAVE: off-grid portable AC",
    angleFr: "Puissance, batterie, usage van / tente",
    angleEn: "Power draw, battery, van / tent use",
  },
  {
    slug: "recharge-rapide",
    topicFr: "Recharge rapide EcoFlow : secteur, solaire, voiture",
    topicEn: "EcoFlow fast charging: AC, solar, car",
    angleFr: "Temps de charge, X-Stream, alternateur",
    angleEn: "Charge times, X-Stream, alternator",
  },
  {
    slug: "ups-coupures",
    topicFr: "UPS et coupures : brancher sans interruption",
    topicEn: "UPS and outages: seamless switchover",
    angleFr: "EPS/UPS ms, appareils sensibles, limites",
    angleEn: "EPS/UPS ms, sensitive devices, limits",
  },
  {
    slug: "premier-achat",
    topicFr: "Premier achat EcoFlow : checklist avant de commander",
    topicEn: "First EcoFlow purchase: checklist before ordering",
    angleFr: "Budget, usage, ASIN Amazon, accessoires utiles",
    angleEn: "Budget, use case, Amazon listing, useful accessories",
  },
  // — tumbler / La gourde isotherme —
  {
    slug: "choisir-gourde-isotherme",
    siteId: "tumbler",
    topicFr: "Choisir une gourde isotherme",
    topicEn: "Choosing an insulated water bottle",
    angleFr: "Capacité, isolation, bouchon, entretien, erreurs d’achat",
    angleEn: "Capacity, insulation, lid, care, buying mistakes",
  },
  {
    slug: "gourde-vs-tumbler",
    siteId: "tumbler",
    topicFr: "Gourde vs tumbler : que choisir ?",
    topicEn: "Bottle vs tumbler: which to choose?",
    angleFr: "Usage bureau / sport / voyage, paille, volume, fuite",
    angleEn: "Desk / sport / travel use, straw, volume, leak-proofing",
  },
  {
    slug: "entretien-gourde",
    siteId: "tumbler",
    topicFr: "Entretenir une gourde ou un tumbler inox",
    topicEn: "Caring for a stainless bottle or tumbler",
    angleFr: "Lavage, odeurs, joints, lave-vaisselle, durée de vie",
    angleEn: "Washing, smells, seals, dishwasher, lifespan",
  },
  {
    slug: "isolation-froid-chaud",
    siteId: "tumbler",
    topicFr: "Isolation froid / chaud : ce qui compte vraiment",
    topicEn: "Hot / cold insulation: what really matters",
    angleFr: "Double paroi, vide, tests réalistes, attentes",
    angleEn: "Double wall, vacuum, realistic tests, expectations",
  },
  {
    slug: "premier-achat-gourde",
    siteId: "tumbler",
    topicFr: "Premier achat gourde isotherme : checklist",
    topicEn: "First insulated bottle purchase: checklist",
    angleFr: "Budget, volume, vendeur Amazon, accessoires utiles",
    angleEn: "Budget, volume, Amazon seller, useful accessories",
  },
];
