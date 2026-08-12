import type { GuideArticle } from "./articles";

export const MASSAGE_GUN_MAIN_GUIDE_SLUG = "choisir-pistolet-massage";

/**
 * Un seul guide long « Le pistolet de massage » — avec `productSlugs`
 * pour insérer des packshots cliquables vers les fiches produits.
 */
export const massageGunGuides: GuideArticle[] = [
  {
    slug: MASSAGE_GUN_MAIN_GUIDE_SLUG,
    fr: {
      title: "Guide complet : choisir un pistolet de massage",
      subtitle:
        "Amplitude, force, bruit, embouts, autonomie et sélections Amazon — une méthode claire.",
      sections: [
        {
          heading: "1. Partez de l’usage, pas de la marque",
          paragraphs: [
            "Un pistolet de massage (percussion) sert surtout à détendre les muscles après le sport, le bureau ou un trajet long. Ce n’est pas un substitut médical : en cas de douleur aiguë, consultez un pro.",
            "Notez vos zones (mollets, dos, épaules), si vous voyagez, et votre budget. Sans ce cadrage, on paie souvent trop cher pour une puissance inutile — ou trop peu pour un usage sportif dense.",
          ],
          bullets: [
            "Sport intensif : amplitude ≥ 12–16 mm, bonne stall force",
            "Bureau / quotidien : mini ou milieu de gamme silencieux",
            "Voyage : format compact < 500 g",
            "Budget test : entrée de gamme multi-têtes (TOLOCO / Renpho)",
          ],
        },
        {
          heading: "2. Amplitude & profondeur",
          paragraphs: [
            "L’amplitude (mm) indique jusqu’où la tête avance dans les tissus. 16 mm (Theragun Elite/Pro, certains Hypervolt) vise le tissu profond. 8–10 mm convient au confort quotidien.",
            "La « stall force » (résistance avant arrêt du moteur) compte autant que l’amplitude marketing. Un chiffre élevé sans contrôle = plus de bruit et de fatigue du poignet.",
          ],
          productSlugs: ["theragun-elite", "renpho-extend"],
        },
        {
          heading: "3. Mini vs plein format",
          paragraphs: [
            "Le mini (Theragun Mini, C2…) privilégie la portabilité. Le plein format privilégie la profondeur et l’autonomie.",
            "Beaucoup de gens finissent avec les deux : un compact bureau + un plus puissant à la maison.",
          ],
          productSlugs: ["theragun-mini", "bob-brad-t2"],
        },
        {
          heading: "4. Embouts, bruit, batterie",
          paragraphs: [
            "Les embouts (balle, fourche, coussin, balle…) changent la sensation plus que la marque. Une bonne brosse / housse aide à transporter le kit.",
            "Le bruit varie énormément : les moteurs brushless premium sont plus supportables en open-space. Batterie USB-C et/ou amovible = vrai plus pour le voyage.",
          ],
          productSlugs: [
            "aerlang-massage-gun",
            "brelley-masseur-cervical",
            "hypervolt-2-pro",
          ],
        },
        {
          heading: "5. Budget : bien commencer",
          paragraphs: [
            "Pour un premier essai, un Renpho / TOLOCO / Bob & Brad suffit souvent. Vous validez si la percussion vous convient avant un Theragun / Hypervolt.",
            "Préférez Expédié et vendu par Amazon quand c’est possible. Les prix bougent vite : ouvrez la fiche du jour.",
          ],
          productSlugs: [
            "renpho-extend",
            "toloco-massage-gun",
            "opove-m3-pro",
          ],
        },
        {
          heading: "6. Sélection éditoriale",
          paragraphs: [
            "Nos fiches résument amplitude, force, embouts et cas d’usage. Ce n’est pas un catalogue marchand : c’est un outil de comparaison.",
            "Theragun / Hyperice = premium. Renpho / TOLOCO / Bob & Brad = volume et rapport qualité-prix.",
          ],
          productSlugs: [
            "theragun-elite",
            "theragun-pro",
            "hypervolt-2-pro",
            "renpho-active",
          ],
        },
      ],
    },
    en: {
      title: "Complete guide: choosing a massage gun",
      subtitle:
        "Amplitude, force, noise, heads, battery and Amazon picks — a clear method.",
      sections: [
        {
          heading: "1. Start from use case, not brand",
          paragraphs: [
            "A percussion massage gun mainly helps sore muscles after sport, desk work or long travel. It is not medical care: see a professional for acute pain.",
            "Note your target areas, travel needs and budget. Without that framing, people overspend on unused power — or underspend for dense athletic use.",
          ],
          bullets: [
            "Intense sport: amplitude ≥ 12–16 mm, solid stall force",
            "Desk / daily: quiet mini or mid-range",
            "Travel: compact < 500 g",
            "Budget trial: multi-head entry models (TOLOCO / Renpho)",
          ],
        },
        {
          heading: "2. Amplitude & depth",
          paragraphs: [
            "Amplitude (mm) is how far the head travels into tissue. 16 mm (Theragun Elite/Pro, some Hypervolt) targets deep tissue. 8–10 mm suits daily comfort.",
            "Stall force matters as much as marketed amplitude. High numbers without control often mean more noise and wrist fatigue.",
          ],
          productSlugs: ["theragun-elite", "renpho-extend"],
        },
        {
          heading: "3. Mini vs full-size",
          paragraphs: [
            "Minis (Theragun Mini, C2…) prioritize portability. Full-size prioritize depth and battery life.",
            "Many people end up with both: a desk compact + a stronger home unit.",
          ],
          productSlugs: ["theragun-mini", "bob-brad-t2"],
        },
        {
          heading: "4. Heads, noise, battery",
          paragraphs: [
            "Heads (ball, fork, cushion, bullet…) change feel more than brand. A good case helps carry the kit.",
            "Noise varies widely: premium brushless motors are more office-friendly. USB-C and/or swappable batteries help for travel.",
          ],
          productSlugs: [
            "aerlang-massage-gun",
            "brelley-masseur-cervical",
            "hypervolt-2-pro",
          ],
        },
        {
          heading: "5. Budget: start smart",
          paragraphs: [
            "For a first try, Renpho / TOLOCO / Bob & Brad is often enough before a Theragun / Hypervolt.",
            "Prefer Ships and sold by Amazon when possible. Prices move fast: open today’s listing.",
          ],
          productSlugs: [
            "renpho-extend",
            "toloco-massage-gun",
            "opove-m3-pro",
          ],
        },
        {
          heading: "6. Editorial shortlist",
          paragraphs: [
            "Our sheets summarize amplitude, force, heads and use cases — a comparison tool, not a merchant catalog.",
            "Theragun / Hyperice = premium. Renpho / TOLOCO / Bob & Brad = volume and value.",
          ],
          productSlugs: [
            "theragun-elite",
            "theragun-pro",
            "hypervolt-2-pro",
            "renpho-active",
          ],
        },
      ],
    },
  },
];
