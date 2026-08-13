import { pickLocalized } from "@/i18n/locales";
import { tumblerGuides } from "./tumbler-guides";
import { massageGunGuides } from "./massage-gun-guides";
import { casinosCryptoGuides } from "./casinos-crypto-guides";
import { euromillionsGuides } from "./euromillions-guides";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Product slugs to show as linked packshot cards under the section */
  productSlugs?: string[];
  /** Inline editorial illustration (casino guides, etc.) */
  imageSrc?: string;
  imageAltFr?: string;
  imageAltEn?: string;
  imageCredit?: string;
};

export type LocalizedGuideCopy = {
  title: string;
  subtitle: string;
  sections: ArticleSection[];
};

export type GuideArticle = {
  slug: string;
  fr: LocalizedGuideCopy;
  en: LocalizedGuideCopy;
  /** Optional — falls back to en then fr via getGuideCopy */
  it?: LocalizedGuideCopy;
  es?: LocalizedGuideCopy;
  pt?: LocalizedGuideCopy;
  de?: LocalizedGuideCopy;
  nl?: LocalizedGuideCopy;
  imageSrc?: string;
  imageCredit?: string;
};

export function getGuideCopy(
  guide: Pick<GuideArticle, "fr" | "en" | "it" | "es" | "pt" | "de" | "nl">,
  locale: string,
): LocalizedGuideCopy {
  return pickLocalized(locale, {
    fr: guide.fr,
    en: guide.en,
    it: guide.it,
    es: guide.es,
    pt: guide.pt,
    de: guide.de,
    nl: guide.nl,
  });
}

const ecoflowGuides: GuideArticle[] = [
  {
    slug: "choisir-station",
    fr: {
      title: "Guide d’achat : choisir une station EcoFlow",
      subtitle:
        "Wh, watts, solaire, expansion : la méthode pour ne pas suracheter.",
      sections: [
        {
          heading: "1. Séparez capacité (Wh) et puissance (W)",
          paragraphs: [
            "Les Wh mesurent l’énergie stockée (combien de temps). Les W mesurent la puissance instantanée (quels appareils démarrent).",
            "Exemple : un frigo 120 W sur 10 h ≈ 1 200 Wh théoriques. Ajoutez 20–30 % de marge (froid, cycles, onduleur).",
            "À l’inverse, un micro-ondes 1 200 W exige une sortie AC suffisante même si vous ne l’utilisez que 5 minutes.",
          ],
        },
        {
          heading: "2. Listez vos charges critiques",
          paragraphs: [
            "Classez en 3 groupes : indispensable (box, frigo, éclairage, téléphone), confort (TV, cafetière), exclus (four, sèche-linge).",
            "Mesurez avec une prise wattmètre si possible. Les plaques constructeur sont souvent optimistes.",
          ],
          bullets: [
            "Box + Wi-Fi : 10–30 W",
            "Frigo A+++ : 50–150 W moyen cyclique",
            "Laptop : 40–90 W",
            "Pompe de chaudière : vérifier sur plaque",
          ],
        },
        {
          heading: "3. Choisissez la famille produit",
          paragraphs: [
            "RIVER : mobilité et petits appareils.",
            "DELTA : polyvalence maison légère / van / DIY.",
            "DELTA Pro : backup sérieux, multi-kWh, intégration maison.",
            "PowerStream : solaire balcon / autoconsommation, pas un remplacement de station.",
          ],
        },
        {
          heading: "4. Solaire et temps de recharge",
          paragraphs: [
            "Regardez l’entrée solaire max de la station et la réalité d’ensoleillement (orientation, saison, ombre).",
            "Une DELTA 2 à 500 W solaires avec un seul panneau 100 W restera lente. Alignez panneau(x) et entrée.",
          ],
        },
        {
          heading: "5. Expansion vs modèle supérieur",
          paragraphs: [
            "Parfois une station + batterie extra coûte moins qu’un saut de gamme, tout en gardant la même sortie.",
            "Vérifiez la compatibilité exacte des extras (câbles, série).",
          ],
        },
        {
          heading: "6. STREAM / PowerStream : cas à part",
          paragraphs: [
            "Ces produits ciblent l’autoconsommation balcon/maison (injection + éventuellement stockage), pas le camping.",
            "Ne les comparez pas à une RIVER sur le critère “Wh nomades” : le job est de réduire la facture, pas de déplacer 2 kWh dans un sac.",
          ],
        },
      ],
    },
    en: {
      title: "Buying guide: choosing an EcoFlow station",
      subtitle: "Wh, watts, solar, expansion: how to avoid overbuying.",
      sections: [
        {
          heading: "1. Split capacity (Wh) and power (W)",
          paragraphs: [
            "Wh is stored energy (how long). W is instantaneous power (what can start).",
            "Example: a 120 W fridge for 10 h ≈ 1,200 Wh theoretical. Add 20–30% margin (cold starts, inverter losses).",
            "A 1,200 W microwave needs enough AC output even if used briefly.",
          ],
        },
        {
          heading: "2. List critical loads",
          paragraphs: [
            "Group into must-have (router, fridge, lights, phone), comfort (TV, kettle), and excluded (oven, dryer).",
            "Measure with a wattmeter when possible—nameplate ratings are often optimistic.",
          ],
          bullets: [
            "Router + Wi-Fi: 10–30 W",
            "Efficient fridge: 50–150 W average cycling",
            "Laptop: 40–90 W",
            "Boiler pump: check the plate",
          ],
        },
        {
          heading: "3. Pick the product family",
          paragraphs: [
            "RIVER: mobility and small devices.",
            "DELTA: light home / van / DIY versatility.",
            "DELTA Pro: serious backup and multi-kWh.",
            "PowerStream / STREAM: balcony solar / self-consumption—not a camping station replacement.",
          ],
        },
        {
          heading: "4. Solar and recharge time",
          paragraphs: [
            "Match panel watts to the station’s solar input and real sun (orientation, season, shade).",
            "A DELTA with 500 W solar input stays slow with a single 100 W panel—align panels to the input.",
          ],
        },
        {
          heading: "5. Expansion vs stepping up a model",
          paragraphs: [
            "Sometimes station + extra battery beats jumping tiers while keeping the same inverter output.",
            "Confirm exact extra-battery compatibility (cables, series).",
          ],
        },
        {
          heading: "6. STREAM / PowerStream: a different job",
          paragraphs: [
            "These target home/balcony self-consumption (grid injection ± storage), not camping.",
            "Do not compare them to a RIVER on “nomadic Wh”—the goal is bill reduction, not carrying 2 kWh in a bag.",
          ],
        },
      ],
    },
  },
  {
    slug: "dimensionnement-wh",
    fr: {
      title: "Dimensionner ses Wh : méthode simple",
      subtitle: "Calculez votre besoin journalier sans tableur compliqué.",
      sections: [
        {
          heading: "Formule de base",
          paragraphs: [
            "Wh/jour ≈ Σ (watts appareil × heures d’usage).",
            "Puis multipliez par 1,25 pour pertes et aléas.",
          ],
        },
        {
          heading: "Scénario backup nuit (exemple)",
          paragraphs: [
            "Box 20 W × 12 h = 240 Wh",
            "Frigo 80 W moyen × 12 h = 960 Wh",
            "Éclairage LED 15 W × 4 h = 60 Wh",
            "Total ≈ 1 260 Wh → avec marge ≈ 1 600 Wh. Une DELTA 2 Max (2 kWh) devient pertinente.",
          ],
        },
        {
          heading: "Scénario camping",
          paragraphs: [
            "Priorisez 12 V quand c’est possible (moins de pertes qu’en AC).",
            "Une RIVER 3 Plus peut suffire pour électronique ; un frigo compression demande souvent DELTA.",
          ],
        },
      ],
    },
    en: {
      title: "Sizing Wh: a simple method",
      subtitle: "Estimate daily needs without a complex spreadsheet.",
      sections: [
        {
          heading: "Base formula",
          paragraphs: [
            "Wh/day ≈ Σ (device watts × hours used), then ×1.25 for losses.",
          ],
        },
        {
          heading: "Overnight backup example",
          paragraphs: [
            "Router 20 W × 12 h = 240 Wh; fridge 80 W avg × 12 h = 960 Wh; lights 15 W × 4 h = 60 Wh → ~1,260 Wh, ~1,600 Wh with margin.",
          ],
        },
        {
          heading: "Camping scenario",
          paragraphs: [
            "Prefer 12 V when possible. RIVER may cover electronics; compressor fridges often need DELTA.",
          ],
        },
      ],
    },
  },
  {
    slug: "solaire-portable",
    fr: {
      title: "Guide solaire portable EcoFlow",
      subtitle: "Panneaux, angles, bifacial et pièges d’ensoleillement.",
      sections: [
        {
          heading: "Watts marketing vs watts réels",
          paragraphs: [
            "Un panneau 220 W ne délivre 220 W que dans des conditions idéales. En pratique, comptez souvent 50–80 % selon saison et orientation.",
          ],
        },
        {
          heading: "Bifacial : quand ça aide",
          paragraphs: [
            "Utile sur sol clair (béton clair, gravier). Moins utile sur balcon sombre ou asphalte.",
          ],
        },
        {
          heading: "Câblage et limites d’entrée",
          paragraphs: [
            "Ne dépassez pas tension/courant acceptés par la station. Lisez la plage MPPT.",
            "PowerStream a sa propre logique (injection maison) distincte de la recharge station.",
          ],
        },
      ],
    },
    en: {
      title: "EcoFlow portable solar guide",
      subtitle: "Panels, angles, bifacial gains, and sun pitfalls.",
      sections: [
        {
          heading: "Marketed watts vs real watts",
          paragraphs: [
            "A 220 W panel only hits 220 W in ideal conditions. Real output is often 50–80%.",
          ],
        },
        {
          heading: "When bifacial helps",
          paragraphs: [
            "Helps on bright ground; less so on dark balconies.",
          ],
        },
        {
          heading: "Wiring and input limits",
          paragraphs: [
            "Respect station MPPT voltage/current ranges. PowerStream injection differs from station recharge.",
          ],
        },
      ],
    },
  },
  {
    slug: "backup-maison",
    fr: {
      title: "Backup maison avec EcoFlow",
      subtitle: "De la multiprise intelligente au Smart Home Panel.",
      sections: [
        {
          heading: "Niveau 1 : station + multiprise",
          paragraphs: [
            "Simple et rapide. Limites : bascule manuelle, pas de circuits dédiés, risque de surcharge.",
          ],
        },
        {
          heading: "Niveau 2 : UPS pour box/NAS",
          paragraphs: [
            "Certaines stations offrent une bascule rapide. Idéal télétravail et alarme.",
          ],
        },
        {
          heading: "Niveau 3 : Pro + panneau",
          paragraphs: [
            "DELTA Pro / Pro 3 + Smart Home Panel pour prioriser des circuits. Installation pro recommandée.",
          ],
        },
        {
          heading: "Sécurité",
          paragraphs: [
            "Ne bricolez pas le tableau sans qualification. Respectez sections de câble, protections et normes locales.",
          ],
        },
      ],
    },
    en: {
      title: "Home backup with EcoFlow",
      subtitle: "From smart power strips to Smart Home Panel.",
      sections: [
        {
          heading: "Level 1: station + power strip",
          paragraphs: [
            "Fast and simple. Limits: manual switchover, no dedicated circuits, overload risk.",
          ],
        },
        {
          heading: "Level 2: UPS for router/NAS",
          paragraphs: [
            "Some stations offer fast switchover—great for remote work.",
          ],
        },
        {
          heading: "Level 3: Pro + panel",
          paragraphs: [
            "DELTA Pro / Pro 3 + Smart Home Panel for prioritized circuits. Use a professional installer.",
          ],
        },
        {
          heading: "Safety",
          paragraphs: [
            "Do not DIY your breaker panel without qualifications.",
          ],
        },
      ],
    },
  },
  {
    slug: "camping-van",
    fr: {
      title: "EcoFlow en camping & van",
      subtitle: "12 V, compression, silence : les vrais critères outdoor.",
      sections: [
        {
          heading: "DC d’abord",
          paragraphs: [
            "Quand un appareil accepte 12 V, préférez DC pour limiter les pertes de conversion AC.",
          ],
        },
        {
          heading: "Frigo : le poste qui tue l’autonomie",
          paragraphs: [
            "Un frigo compression bien isolé peut rester raisonnable ; un modèle mal dimensionné vide une RIVER en quelques heures.",
          ],
        },
        {
          heading: "Recharge en roulant vs solaire",
          paragraphs: [
            "Alternateur/allume-cigare : pratique mais lent et parfois limité. Le solaire reste le meilleur complément diurne.",
          ],
        },
      ],
    },
    en: {
      title: "EcoFlow for camping & vans",
      subtitle: "12 V, compression fridges, silence: outdoor criteria that matter.",
      sections: [
        {
          heading: "DC first",
          paragraphs: [
            "If a device accepts 12 V, prefer DC to reduce AC conversion losses.",
          ],
        },
        {
          heading: "Fridges drain runtime",
          paragraphs: [
            "A good compressor fridge can be reasonable; a poor match empties a RIVER quickly.",
          ],
        },
        {
          heading: "Alternator vs solar",
          paragraphs: [
            "Cigarette-lighter charging is convenient but slow. Solar remains the best daytime top-up.",
          ],
        },
      ],
    },
  },
  {
    slug: "stream-balcon",
    fr: {
      title: "Guide STREAM balcon : Ultra X, Pro, Max",
      subtitle:
        "Choisir un kit plug-in EcoFlow STREAM pour réduire la facture sans chantier lourd.",
      sections: [
        {
          heading: "Ce que STREAM fait (et ne fait pas)",
          paragraphs: [
            "STREAM combine production solaire (panneaux + micro-onduleur) et, selon le modèle, stockage batterie pour consommer plus tard.",
            "Ce n’est pas une station camping : l’objectif est l’autoconsommation maison/balcon, avec contraintes de puissance injectée et règles locales.",
          ],
        },
        {
          heading: "Ultra X vs Pro vs Max",
          paragraphs: [
            "Ultra X : flagship stockage (~3,84 kWh) + multi-MPPT, pour foyers ambitieux.",
            "Pro / Max : entrée plus progressive (~1,92 kWh classe), utiles pour tester puis scaler.",
            "Micro-onduleur seul : pertinent si vous voulez d’abord injecter sans batterie.",
          ],
        },
        {
          heading: "Checklist avant achat",
          paragraphs: [
            "Exposition réelle (ombre, orientation), puissance déclarable (souvent ≤ 800 W injectés en FR sans formalités lourdes — vérifiez Enedis/consuel selon config).",
            "Fixation balcon/toit, longueur de câble, et politique de la copropriété.",
            "Décidez si vous voulez stocker (nuit / heures creuses) ou seulement injecter en journée.",
          ],
          bullets: [
            "Estimer kWh/jour utiles vs facture",
            "Vérifier limites d’injection locales",
            "Prévoir évolution (2ᵉ batterie / panneaux)",
          ],
        },
        {
          heading: "STREAM vs PowerStream",
          paragraphs: [
            "Pour un setup neuf en France, STREAM est la gamme poussée actuellement. PowerStream reste intéressant en occasion ou pour coupler une station DELTA déjà possédée.",
          ],
        },
      ],
    },
    en: {
      title: "STREAM balcony guide: Ultra X, Pro, Max",
      subtitle:
        "Pick an EcoFlow STREAM plug-in kit to cut bills without heavy works.",
      sections: [
        {
          heading: "What STREAM does (and doesn’t)",
          paragraphs: [
            "STREAM combines solar production (panels + micro-inverter) and, depending on model, battery storage for later use.",
            "It is not a camping station: the job is home/balcony self-consumption under local injection rules.",
          ],
        },
        {
          heading: "Ultra X vs Pro vs Max",
          paragraphs: [
            "Ultra X: flagship storage (~3.84 kWh) + multi-MPPT for ambitious homes.",
            "Pro / Max: more gradual entry (~1.92 kWh class) to trial then scale.",
            "Micro-inverter only: useful if you want daytime injection first, without a battery.",
          ],
        },
        {
          heading: "Pre-buy checklist",
          paragraphs: [
            "Real sun (shade, orientation), declarable injection power, balcony/roof mounting, cable runs, and landlord/HOA rules.",
            "Decide whether you need storage (night / off-peak) or daytime injection only.",
          ],
          bullets: [
            "Estimate useful kWh/day vs your bill",
            "Check local injection limits",
            "Plan expansion (2nd battery / panels)",
          ],
        },
        {
          heading: "STREAM vs PowerStream",
          paragraphs: [
            "For a new FR setup, STREAM is the current push. PowerStream still fits used gear or pairing with an existing DELTA station.",
          ],
        },
      ],
    },
  },
];

export const comparisons: GuideArticle[] = [
  {
    slug: "river-vs-delta",
    fr: {
      title: "RIVER vs DELTA : que choisir ?",
      subtitle: "Mobilité pure contre polyvalence et backup.",
      sections: [
        {
          heading: "Choisir RIVER si…",
          paragraphs: [
            "Vous priorisez le poids (< 8 kg), les week-ends courts et l’électronique.",
          ],
          bullets: ["RIVER 2 / 3 : ultra light", "RIVER 3 Plus : meilleur AC portable"],
        },
        {
          heading: "Choisir DELTA si…",
          paragraphs: [
            "Vous avez un frigo 230 V, des outils, ou un backup box+frigo sur plusieurs heures.",
          ],
          bullets: ["DELTA 2 : meilleur point d’entrée historique", "DELTA 3 Max : sweet spot 2 kWh"],
        },
        {
          heading: "Erreur fréquente",
          paragraphs: [
            "Acheter une RIVER “parce que moins cher” puis constater qu’elle ne démarre pas l’appareil principal. Dimensionnez d’abord les W.",
            "Deuxième piège : oublier le pic de démarrage (compresseur, pompe). Une sortie 300 W nominale peut échouer sur un moteur 200 W au démarrage.",
          ],
        },
        {
          heading: "Règle rapide",
          paragraphs: [
            "Si votre charge critique dépasse ~500 W ou 1 kWh/jour, partez DELTA. Sinon une RIVER 2/3 reste souvent le meilleur rapport mobilité/prix.",
          ],
        },
      ],
    },
    en: {
      title: "RIVER vs DELTA: which to pick?",
      subtitle: "Pure mobility versus versatility and backup.",
      sections: [
        {
          heading: "Pick RIVER if…",
          paragraphs: [
            "You prioritize weight (< 8 kg), short weekends, and electronics.",
            "RIVER 2 / 3 excel as ultralight packs; RIVER 3 Plus is the better portable AC option in the line.",
          ],
          bullets: ["RIVER 2 / 3: ultralight", "RIVER 3 Plus: stronger portable AC"],
        },
        {
          heading: "Pick DELTA if…",
          paragraphs: [
            "You run a 230 V fridge, tools, or multi-hour router+fridge backup.",
            "DELTA 2 remains a strong entry; DELTA 3 Max is the practical 2 kWh sweet spot for many homes/vans.",
          ],
          bullets: ["DELTA 2: proven entry", "DELTA 3 Max: ~2 kWh sweet spot"],
        },
        {
          heading: "Common mistake",
          paragraphs: [
            "Buying RIVER for price then discovering it cannot start the main appliance. Size watts first.",
            "Also watch surge/startup: a 300 W continuous outlet can fail on a 200 W motor at startup.",
          ],
        },
        {
          heading: "Quick rule",
          paragraphs: [
            "If your critical load exceeds ~500 W or ~1 kWh/day, start with DELTA. Otherwise RIVER 2/3 is often the best mobility/price trade-off.",
          ],
        },
      ],
    },
  },
  {
    slug: "delta-2-vs-delta-3",
    fr: {
      title: "DELTA 2 vs DELTA 3",
      subtitle: "Faut-il passer à la nouvelle génération ?",
      sections: [
        {
          heading: "Ce que DELTA 3 apporte",
          paragraphs: [
            "Stack plus récente (UPS, cycles LFP annoncés ~4 000, écosystème accessoires).",
          ],
        },
        {
          heading: "Quand garder / prendre DELTA 2",
          paragraphs: [
            "Promo forte, besoin immédiat, usage déjà couvert par 1–2 kWh. La DELTA 2 reste excellente.",
          ],
        },
        {
          heading: "Verdict pratique",
          paragraphs: [
            "Neuf long terme : DELTA 3. Occasion/promo : DELTA 2 Max reste un crack.",
          ],
        },
      ],
    },
    en: {
      title: "DELTA 2 vs DELTA 3",
      subtitle: "Should you move to the newer generation?",
      sections: [
        {
          heading: "What DELTA 3 adds",
          paragraphs: [
            "Newer stack (UPS behavior, ~4,000 LFP cycles claims, accessory ecosystem).",
          ],
        },
        {
          heading: "When DELTA 2 still wins",
          paragraphs: [
            "Strong discount, immediate need, or loads already covered by 1–2 kWh.",
          ],
        },
        {
          heading: "Practical verdict",
          paragraphs: [
            "New long-term: DELTA 3. Deal/used: DELTA 2 Max remains excellent.",
          ],
        },
      ],
    },
  },
  {
    slug: "delta-vs-delta-pro",
    fr: {
      title: "DELTA vs DELTA Pro",
      subtitle: "Polyvalent portable contre backup maison.",
      sections: [
        {
          heading: "DELTA suffit si…",
          paragraphs: [
            "Vous cibler quelques heures à 48 h sur charges prioritaires, avec déplacement fréquent de la station.",
          ],
        },
        {
          heading: "Passer Pro si…",
          paragraphs: [
            "Vous visez multi-kWh, intégration tableau, charges simultanées élevées, ou autonomie multi-jours.",
            "Le Smart Home Panel (ou équivalent) change la nature du système : ce n’est plus une multiprise géante, c’est un vrai secours de circuits.",
          ],
        },
        {
          heading: "Budget & complexité",
          paragraphs: [
            "DELTA Pro implique plus de poids, plus d’espace, et souvent un installateur. Si vous bougez la station chaque week-end, restez DELTA “classique”.",
          ],
        },
      ],
    },
    en: {
      title: "DELTA vs DELTA Pro",
      subtitle: "Portable versatility versus home backup.",
      sections: [
        {
          heading: "DELTA is enough if…",
          paragraphs: [
            "You need hours to ~48 h on priority loads and move the station often.",
            "DELTA 2 / 3 cover most van + light-home scenarios without panel integration.",
          ],
        },
        {
          heading: "Go Pro if…",
          paragraphs: [
            "You need multi-kWh, panel integration, high simultaneous loads, or multi-day autonomy.",
            "A Smart Home Panel turns the system into circuit-level backup—not just a giant power strip.",
          ],
        },
        {
          heading: "Budget & complexity",
          paragraphs: [
            "DELTA Pro means more weight, more space, and often a pro installer. If you move the station every weekend, stay with classic DELTA.",
          ],
        },
      ],
    },
  },
  {
    slug: "powerstream-vs-station",
    fr: {
      title: "PowerStream vs station portable",
      subtitle: "Autoconsommation contre énergie nomade / backup.",
      sections: [
        {
          heading: "PowerStream",
          paragraphs: [
            "Réduit la facture en injectant du solaire dans la maison. Pas conçu comme seule solution de coupure.",
          ],
        },
        {
          heading: "Station",
          paragraphs: [
            "Stocke et restitue où vous voulez, y compris hors prise. Indispensable outdoor et blackout.",
          ],
        },
        {
          heading: "Combo gagnant",
          paragraphs: [
            "PowerStream + station compatible : production le jour, stockage, restitution ciblée.",
          ],
        },
      ],
    },
    en: {
      title: "PowerStream vs portable station",
      subtitle: "Self-consumption versus mobile/backup energy.",
      sections: [
        {
          heading: "PowerStream",
          paragraphs: [
            "Cuts bills by injecting solar into the home. Not a blackout-only solution.",
          ],
        },
        {
          heading: "Station",
          paragraphs: [
            "Stores and outputs power anywhere—including off-grid and outages.",
          ],
        },
        {
          heading: "Best combo",
          paragraphs: [
            "PowerStream + compatible station: daytime production, storage, targeted release.",
          ],
        },
      ],
    },
  },
  {
    slug: "stream-vs-powerstream",
    fr: {
      title: "STREAM vs PowerStream",
      subtitle: "Nouvelle gamme plug-in FR face au micro-onduleur historique.",
      sections: [
        {
          heading: "PowerStream",
          paragraphs: [
            "Micro-onduleur classique EcoFlow, souvent couplé à une station portable pour stocker/restituer.",
          ],
        },
        {
          heading: "Série STREAM",
          paragraphs: [
            "Gamme actuelle mise en avant sur fr.ecoflow.com : micro-onduleur + batteries STREAM (Max/Pro/Ultra X) + kits solaires balcon.",
          ],
        },
        {
          heading: "Comment choisir",
          paragraphs: [
            "Pour un setup balcon neuf en France, partez plutôt STREAM. PowerStream reste pertinent en occasion/compatibilité station existante.",
          ],
        },
      ],
    },
    en: {
      title: "STREAM vs PowerStream",
      subtitle: "New FR plug-in line versus the classic micro-inverter.",
      sections: [
        {
          heading: "PowerStream",
          paragraphs: [
            "Classic EcoFlow micro-inverter, often paired with a portable station for store/release.",
          ],
        },
        {
          heading: "STREAM series",
          paragraphs: [
            "Current line on EcoFlow FR: micro-inverter + STREAM batteries (Max/Pro/Ultra X) + balcony kits.",
          ],
        },
        {
          heading: "How to choose",
          paragraphs: [
            "For a new FR balcony setup, lean STREAM. PowerStream still fits used gear or existing station pairing.",
          ],
        },
      ],
    },
  },
];

export const guides: GuideArticle[] = [
  ...ecoflowGuides,
  ...tumblerGuides,
  ...massageGunGuides,
  ...casinosCryptoGuides,
  ...euromillionsGuides,
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

export function getComparison(slug: string) {
  return comparisons.find((c) => c.slug === slug);
}
