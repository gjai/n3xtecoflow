import type { GuideArticle } from "./articles";
import {
  massageGunClusterCovers,
  massageGunClusterGuides,
} from "./massage-gun-guides-cluster";

export const MASSAGE_GUN_MAIN_GUIDE_SLUG = "choisir-pistolet-massage";

export const massageGunGuideCovers: Record<
  string,
  { src: string; credit: string; creditUrl: string }
> = {
  [MASSAGE_GUN_MAIN_GUIDE_SLUG]: {
    src: "/images/massage-gun/guides.jpg",
    credit: "Le pistolet de massage (IA)",
    creditUrl: "https://massage-gun.fr",
  },
  ...massageGunClusterCovers,
};

/**
 * Guide pilier + cluster (amplitude, mini vs plein format, nuque/bureau, entretien).
 */
export const massageGunGuides: GuideArticle[] = [
  {
    slug: MASSAGE_GUN_MAIN_GUIDE_SLUG,
    fr: {
      title: "Guide complet : choisir un pistolet de massage",
      subtitle:
        "Amplitude, force, bruit, embouts, autonomie et top ventes Amazon — une méthode claire.",
      sections: [
        {
          heading: "1. Partez de l’usage, pas de la marque",
          paragraphs: [
            "Un pistolet de massage (percussion) sert surtout à détendre les muscles après le sport, le bureau ou un trajet long. Ce n’est pas un substitut médical : en cas de douleur aiguë, consultez un pro.",
            "Notez vos zones (mollets, dos, épaules, nuque), si vous voyagez, et votre budget. Sans ce cadrage, on paie souvent trop cher pour une puissance inutile — ou trop peu pour un usage sportif dense.",
          ],
          bullets: [
            "Sport intensif : amplitude ≥ 12–16 mm, bonne stall force",
            "Bureau / quotidien : mini silencieux ou masseur cervical",
            "Voyage : format compact < 500 g",
            "Budget test : entrée de gamme multi-têtes (TOLOCO / AERLANG / Renpho)",
          ],
        },
        {
          heading: "2. Amplitude & profondeur",
          paragraphs: [
            "L’amplitude (mm) indique jusqu’où la tête avance dans les tissus. 16 mm (Theragun Elite/Pro, certains Hypervolt) vise le tissu profond. 8–10 mm convient au confort quotidien.",
            "La « stall force » (résistance avant arrêt du moteur) compte autant que l’amplitude marketing. Un chiffre élevé sans contrôle = plus de bruit et de fatigue du poignet.",
          ],
          productSlugs: ["theragun-elite", "renpho-extend", "opove-m3-pro"],
        },
        {
          heading: "3. Mini, plein format ou masseur cervical",
          paragraphs: [
            "Le mini (Theragun Mini…) privilégie la portabilité. Le plein format privilégie la profondeur et l’autonomie.",
            "Pour la nuque et les épaules, un masseur cervical / coussin shiatsu (Brelley) est souvent plus confortable qu’un pistolet à percussion.",
          ],
          productSlugs: [
            "theragun-mini",
            "brelley-masseur-cervical",
            "masseur-cervical-bionique",
          ],
        },
        {
          heading: "4. Embouts, chaleur, bruit, batterie",
          paragraphs: [
            "Les embouts (balle, fourche, coussin…) changent la sensation plus que la marque. La chaleur (AERLANG, Brelley) aide sur les tensions chroniques.",
            "Le bruit varie énormément : les moteurs brushless premium sont plus supportables en open-space. Batterie USB-C et/ou amovible = vrai plus pour le voyage.",
          ],
          productSlugs: [
            "aerlang-massage-gun",
            "brelley-coussin-shiatsu",
            "hypervolt-2-pro",
          ],
        },
        {
          heading: "5. Budget : bien commencer",
          paragraphs: [
            "Pour un premier essai, AERLANG / TOLOCO / Renpho / Bob & Brad suffisent souvent avant un Theragun / Hypervolt.",
            "Préférez Expédié et vendu par Amazon quand c’est possible. Les prix bougent vite : ouvrez la fiche du jour.",
          ],
          productSlugs: [
            "aerlang-massage-gun",
            "toloco-massage-gun",
            "renpho-extend",
            "bob-brad-t2",
          ],
        },
        {
          heading: "6. Sélection éditoriale (top ventes)",
          paragraphs: [
            "Nos fiches résument amplitude, force, embouts et cas d’usage. Ce n’est pas un catalogue marchand : c’est un outil de comparaison.",
            "Côté volume Amazon : AERLANG, Brelley (cervical / shiatsu) et masseur bionique. Côté premium : Theragun / Hyperice. Côté rapport Q/P : Renpho, TOLOCO, Bob & Brad, OPOVE.",
          ],
          productSlugs: [
            "aerlang-massage-gun",
            "brelley-masseur-cervical",
            "brelley-coussin-shiatsu",
            "masseur-cervical-bionique",
            "theragun-elite",
            "renpho-active",
          ],
        },
      ],
    },
    en: {
      title: "Complete guide: choosing a massage gun",
      subtitle:
        "Amplitude, force, noise, heads, battery and Amazon bestsellers — a clear method.",
      sections: [
        {
          heading: "1. Start from use case, not brand",
          paragraphs: [
            "A percussion massage gun mainly helps sore muscles after sport, desk work or long travel. It is not medical care: see a professional for acute pain.",
            "Note your target areas (calves, back, shoulders, neck), travel needs and budget. Without that framing, people overspend on unused power — or underspend for dense athletic use.",
          ],
          bullets: [
            "Intense sport: amplitude ≥ 12–16 mm, solid stall force",
            "Desk / daily: quiet mini or neck massager",
            "Travel: compact < 500 g",
            "Budget trial: multi-head entry models (TOLOCO / AERLANG / Renpho)",
          ],
        },
        {
          heading: "2. Amplitude & depth",
          paragraphs: [
            "Amplitude (mm) is how far the head travels into tissue. 16 mm (Theragun Elite/Pro, some Hypervolt) targets deep tissue. 8–10 mm suits daily comfort.",
            "Stall force matters as much as marketed amplitude. High numbers without control often mean more noise and wrist fatigue.",
          ],
          productSlugs: ["theragun-elite", "renpho-extend", "opove-m3-pro"],
        },
        {
          heading: "3. Mini, full-size or neck massager",
          paragraphs: [
            "Minis (Theragun Mini…) prioritize portability. Full-size prioritize depth and battery life.",
            "For neck and shoulders, a cervical / shiatsu massager (Brelley) is often more comfortable than a percussion gun.",
          ],
          productSlugs: [
            "theragun-mini",
            "brelley-masseur-cervical",
            "masseur-cervical-bionique",
          ],
        },
        {
          heading: "4. Heads, heat, noise, battery",
          paragraphs: [
            "Heads (ball, fork, cushion…) change feel more than brand. Heat (AERLANG, Brelley) helps with chronic tension.",
            "Noise varies widely: premium brushless motors are more office-friendly. USB-C and/or swappable batteries help for travel.",
          ],
          productSlugs: [
            "aerlang-massage-gun",
            "brelley-coussin-shiatsu",
            "hypervolt-2-pro",
          ],
        },
        {
          heading: "5. Budget: start smart",
          paragraphs: [
            "For a first try, AERLANG / TOLOCO / Renpho / Bob & Brad is often enough before a Theragun / Hypervolt.",
            "Prefer Ships and sold by Amazon when possible. Prices move fast: open today’s listing.",
          ],
          productSlugs: [
            "aerlang-massage-gun",
            "toloco-massage-gun",
            "renpho-extend",
            "bob-brad-t2",
          ],
        },
        {
          heading: "6. Editorial shortlist (bestsellers)",
          paragraphs: [
            "Our sheets summarize amplitude, force, heads and use cases — a comparison tool, not a merchant catalog.",
            "Amazon volume: AERLANG, Brelley (neck / shiatsu) and bionic neck massager. Premium: Theragun / Hyperice. Value: Renpho, TOLOCO, Bob & Brad, OPOVE.",
          ],
          productSlugs: [
            "aerlang-massage-gun",
            "brelley-masseur-cervical",
            "brelley-coussin-shiatsu",
            "masseur-cervical-bionique",
            "theragun-elite",
            "renpho-active",
          ],
        },
      ],
    },
  },
  ...massageGunClusterGuides,
];
