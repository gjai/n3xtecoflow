import type { CategoryMeta, Product } from "./products";

/** Catégories du thème Le pistolet de massage. */
export const massageGunCategories: CategoryMeta[] = [
  {
    id: "pistolets",
    slug: "pistolets",
    siteId: "massage-gun",
    fr: {
      title: "Pistolets de massage",
      intro:
        "Modèles plein format pour la récupération sportive et le quotidien. Priorité aux offres Expédié et vendu par Amazon.",
    },
    en: {
      title: "Massage guns",
      intro:
        "Full-size models for sports recovery and daily use. Focus on Ships and sold by Amazon listings.",
    },
  },
  {
    id: "mini",
    slug: "mini",
    siteId: "massage-gun",
    fr: {
      title: "Mini & voyage",
      intro:
        "Formats compacts pour le bureau, le voyage et les zones délicates (cou, mollets).",
    },
    en: {
      title: "Mini & travel",
      intro:
        "Compact formats for desk, travel and delicate areas (neck, calves).",
    },
  },
];

function copy(
  fr: Product["fr"],
  en: Product["en"],
): { fr: Product["fr"]; en: Product["en"] } {
  return { fr, en };
}

/**
 * Sélection éditoriale pistolets de massage — ASINs Amazon.fr.
 * Prix indicatifs à revalider périodiquement (Creators API plus tard).
 */
export const massageGunProducts: Product[] = [
  {
    slug: "theragun-elite",
    category: "pistolets",
    siteId: "massage-gun",
    name: "Theragun Elite (Gen 5)",
    battery: "Li-ion USB-C",
    weightKg: 1.0,
    amazonQuery: "Theragun Elite Gen 5",
    amazonAsin: "B0C4M8BZXV",
    imageSrc: "/images/products/massage-gun/theragun-elite.jpg",
    indicativePriceEur: 349,
    specs: [
      { label: "Amplitude", value: "16 mm" },
      { label: "Force", value: "Jusqu’à ~18 kg (stall)" },
      { label: "Vitesses", value: "Réglables + routines app" },
      { label: "Embouts", value: "5 (dont coin)" },
      { label: "Autonomie", value: "~2 h (selon usage)" },
    ],
    ...copy(
      {
        tagline: "Référence premium Therabody",
        summary:
          "Amplitude 16 mm, poignée triangulaire, Bluetooth et routines app. Cible récupération sportive et tissus profonds.",
        bestFor: "Sportifs exigeants",
        pros: ["Amplitude 16 mm", "Ergonomie multi-prises", "App Therabody"],
        cons: ["Prix élevé", "Batterie non amovible"],
        body: [
          "Lien Affiliates vers l’offre Elite Gen 5 — vérifiez stock et vendeur Expédié et vendu par Amazon.",
        ],
      },
      {
        tagline: "Premium Therabody reference",
        summary:
          "16 mm amplitude, triangular grip, Bluetooth and app routines. Aimed at sports recovery and deep tissue.",
        bestFor: "Demanding athletes",
        pros: ["16 mm amplitude", "Multi-grip ergonomics", "Therabody app"],
        cons: ["High price", "Sealed battery"],
        body: [
          "Affiliate link to the Elite Gen 5 listing — confirm stock and Ships and sold by Amazon.",
        ],
      },
    ),
  },
  {
    slug: "theragun-pro",
    category: "pistolets",
    siteId: "massage-gun",
    name: "Theragun Pro (Gen 5)",
    battery: "Li-ion (amovible selon config)",
    weightKg: 1.25,
    amazonQuery: "Theragun Pro Gen 5",
    amazonAsin: "B0BMJ626WK",
    imageSrc: "/images/products/massage-gun/theragun-pro.jpg",
    indicativePriceEur: 499,
    specs: [
      { label: "Amplitude", value: "16 mm" },
      { label: "Force", value: "Haut de gamme Pro" },
      { label: "Vitesses", value: "Routines OLED / app" },
      { label: "Embouts", value: "Kit Pro complet" },
      { label: "Autonomie", value: "Longue (usage intensif)" },
    ],
    ...copy(
      {
        tagline: "Haut de gamme pour usage intensif",
        summary:
          "Version Pro Therabody : puissance, silence relatif et routines guidées pour kiné / athlètes.",
        bestFor: "Pro / intensif",
        pros: ["Puissance Pro", "Routines guidées", "Finition premium"],
        cons: ["Budget max", "Encombrement"],
        body: [
          "Vérifiez la génération (Gen 5) et le contenu de la boîte sur la fiche Amazon du jour.",
        ],
      },
      {
        tagline: "Top-tier for heavy use",
        summary:
          "Therabody Pro: power, quieter motor and guided routines for PT / athletes.",
        bestFor: "Pro / heavy use",
        pros: ["Pro power", "Guided routines", "Premium build"],
        cons: ["Max budget", "Bulkier"],
        body: [
          "Confirm generation (Gen 5) and box contents on today’s Amazon listing.",
        ],
      },
    ),
  },
  {
    slug: "theragun-mini",
    category: "mini",
    siteId: "massage-gun",
    name: "Theragun Mini (Gen 3)",
    battery: "Li-ion",
    weightKg: 0.45,
    amazonQuery: "Theragun Mini 3",
    amazonAsin: "B0DX2HDRJS",
    imageSrc: "/images/products/massage-gun/theragun-mini.jpg",
    indicativePriceEur: 189,
    specs: [
      { label: "Amplitude", value: "Compact Theragun" },
      { label: "Force", value: "Quotidien / voyage" },
      { label: "Vitesses", value: "3 niveaux" },
      { label: "Embouts", value: "Kit mini" },
      { label: "Autonomie", value: "Usage ponctuel journée" },
    ],
    ...copy(
      {
        tagline: "Le compact Therabody",
        summary:
          "Léger (~450 g), discret, idéal bureau / voyage. Moins profond qu’un Elite/Pro.",
        bestFor: "Voyage & bureau",
        pros: ["Très portable", "Marque Theragun", "Usage discret"],
        cons: ["Moins puissant", "Moins d’embouts"],
        body: [
          "Bon premier Theragun si vous priorisez la taille. Prix observé autour de 189 € — à confirmer sur Amazon.fr.",
        ],
      },
      {
        tagline: "The compact Therabody",
        summary:
          "Light (~450 g), discreet, ideal for desk / travel. Less depth than Elite/Pro.",
        bestFor: "Travel & desk",
        pros: ["Very portable", "Theragun brand", "Quiet everyday use"],
        cons: ["Less powerful", "Fewer heads"],
        body: [
          "Good first Theragun if size matters. Price seen around €189 — confirm on Amazon.fr.",
        ],
      },
    ),
  },
  {
    slug: "theragun-relief",
    category: "mini",
    siteId: "massage-gun",
    name: "Theragun Relief",
    battery: "Li-ion",
    weightKg: 0.55,
    amazonQuery: "Theragun Relief pistolet massage",
    imageSrc: "/images/products/massage-gun/theragun-relief.jpg",
    indicativePriceEur: 149,
    specs: [
      { label: "Amplitude", value: "Entrée de gamme Therabody" },
      { label: "Force", value: "Confort quotidien" },
      { label: "Vitesses", value: "Simplifiées" },
      { label: "Embouts", value: "Essentiels" },
      { label: "Autonomie", value: "Usage maison" },
    ],
    ...copy(
      {
        tagline: "Therabody accessible",
        summary:
          "Positionnement confort / entrée de gamme Therabody. Vérifiez l’ASIN et le titre exact sur Amazon (gamme évolutive).",
        bestFor: "Premier Theragun",
        pros: ["Écosystème Therabody", "Plus abordable", "Simple"],
        cons: ["Moins de punch", "Gamme souvent renommée"],
        body: [
          "Les références Relief / Prime évoluent : ouvrez la fiche Amazon du jour avant d’acheter.",
        ],
      },
      {
        tagline: "Accessible Therabody",
        summary:
          "Comfort / entry Therabody positioning. Confirm exact ASIN and title on Amazon (lineup changes).",
        bestFor: "First Theragun",
        pros: ["Therabody ecosystem", "More affordable", "Simple"],
        cons: ["Less punch", "SKUs rename often"],
        body: [
          "Relief / Prime references evolve: open today’s Amazon listing before buying.",
        ],
      },
    ),
  },
  {
    slug: "hypervolt-2-pro",
    category: "pistolets",
    siteId: "massage-gun",
    name: "Hyperice Hypervolt 2 Pro",
    battery: "Li-ion amovible",
    weightKg: 1.18,
    amazonQuery: "Hyperice Hypervolt 2 Pro",
    amazonAsin: "B09JB64T9Z",
    imageSrc: "/images/products/massage-gun/hypervolt-2-pro.jpg",
    indicativePriceEur: 349,
    specs: [
      { label: "Amplitude", value: "Percussion Hypervolt" },
      { label: "Force", value: "Moteur 90 W" },
      { label: "Vitesses", value: "5 niveaux" },
      { label: "Embouts", value: "5 têtes" },
      { label: "Autonomie", value: "Jusqu’à ~3 h" },
    ],
    ...copy(
      {
        tagline: "Concurrent direct Theragun",
        summary:
          "Design cylindrique, batterie amovible, capteur de pression. Très présent chez les athlètes / kinés.",
        bestFor: "Athlètes / kiné",
        pros: ["Batterie amovible", "5 vitesses", "Marque Hyperice"],
        cons: ["Prix premium", "Plus lourd qu’un mini"],
        body: [
          "ASIN international B09JB64T9Z — vérifiez disponibilité FR et vendeur Amazon.",
        ],
      },
      {
        tagline: "Direct Theragun rival",
        summary:
          "Cylindrical design, swappable battery, pressure sensor. Popular with athletes / PTs.",
        bestFor: "Athletes / PT",
        pros: ["Swappable battery", "5 speeds", "Hyperice brand"],
        cons: ["Premium price", "Heavier than minis"],
        body: [
          "International ASIN B09JB64T9Z — confirm FR availability and Amazon seller.",
        ],
      },
    ),
  },
  {
    slug: "renpho-extend",
    category: "pistolets",
    siteId: "massage-gun",
    name: "RENPHO Extend",
    battery: "Li-ion USB-C",
    weightKg: 0.7,
    amazonQuery: "RENPHO Extend pistolet massage",
    amazonAsin: "B0BJPV92Q7",
    imageSrc: "/images/products/massage-gun/renpho-extend.jpg",
    indicativePriceEur: 69.99,
    specs: [
      { label: "Amplitude", value: "8 mm" },
      { label: "Force", value: "Jusqu’à ~13,6 kg" },
      { label: "Vitesses", value: "4 niveaux" },
      { label: "Embouts", value: "4 + poignée extension" },
      { label: "Autonomie", value: "4–5 h annoncées" },
    ],
    ...copy(
      {
        tagline: "Best-seller rapport qualité/prix",
        summary:
          "Poignée d’extension pour le dos, USB-C, 4 têtes. Idéal premier pistolet sans budget Theragun.",
        bestFor: "Budget malin",
        pros: ["Poignée extension", "Prix accessible", "USB-C"],
        cons: ["Amplitude 8 mm", "Finition moins premium"],
        body: [
          "Très bon candidat « Expédié et vendu par Amazon » à surveiller pour le prix du jour.",
        ],
      },
      {
        tagline: "Bestselling value pick",
        summary:
          "Extension handle for the back, USB-C, 4 heads. Ideal first gun without Theragun budget.",
        bestFor: "Smart budget",
        pros: ["Extension handle", "Accessible price", "USB-C"],
        cons: ["8 mm amplitude", "Less premium finish"],
        body: [
          "Strong Ships and sold by Amazon candidate — check today’s price.",
        ],
      },
    ),
  },
  {
    slug: "renpho-active",
    category: "pistolets",
    siteId: "massage-gun",
    name: "RENPHO Active",
    battery: "Li-ion USB-C",
    weightKg: 0.75,
    amazonQuery: "RENPHO Active pistolet de massage",
    amazonAsin: "B085NTR26K",
    imageSrc: "/images/products/massage-gun/renpho-active.jpg",
    indicativePriceEur: 79.99,
    specs: [
      { label: "Amplitude", value: "~10 mm (série Active)" },
      { label: "Force", value: "Usage sport / quotidien" },
      { label: "Vitesses", value: "Multi-niveaux" },
      { label: "Embouts", value: "Kit multi-têtes" },
      { label: "Autonomie", value: "Plusieurs heures" },
    ],
    ...copy(
      {
        tagline: "Alternative Renpho polyvalente",
        summary:
          "Gamme Active Renpho : bon volume de ventes Amazon, specs à vérifier sur la fiche (versions Thermacool / Active+).",
        bestFor: "Quotidien sport",
        pros: ["Marque Renpho", "Beaucoup d’avis", "Prix contenu"],
        cons: ["Versions multiples", "Bruit variable"],
        body: [
          "ASIN B085NTR26K — confirmez le modèle exact (Active / Thermacool) avant achat.",
        ],
      },
      {
        tagline: "Versatile Renpho alternative",
        summary:
          "Renpho Active line: high Amazon volume; confirm specs on the listing (Thermacool / Active+ variants).",
        bestFor: "Daily sport",
        pros: ["Renpho brand", "Many reviews", "Contained price"],
        cons: ["Many variants", "Noise varies"],
        body: [
          "ASIN B085NTR26K — confirm exact model (Active / Thermacool) before buying.",
        ],
      },
    ),
  },
  {
    slug: "toloco-massage-gun",
    category: "pistolets",
    siteId: "massage-gun",
    name: "TOLOCO Massage Gun",
    battery: "Li-ion USB-C",
    weightKg: 0.85,
    amazonQuery: "TOLOCO pistolet de massage 10 têtes",
    amazonAsin: "B08DFP3S9H",
    imageSrc: "/images/products/massage-gun/toloco-massage-gun.jpg",
    indicativePriceEur: 39.99,
    specs: [
      { label: "Amplitude", value: "~10–12 mm (selon version)" },
      { label: "Force", value: "Entrée de gamme" },
      { label: "Vitesses", value: "Jusqu’à 7–10 niveaux" },
      { label: "Embouts", value: "Jusqu’à 10 têtes" },
      { label: "Autonomie", value: "4–6 h annoncées" },
    ],
    ...copy(
      {
        tagline: "Volume Amazon / premier prix",
        summary:
          "Souvent n°1 des ventes US ; en FR cherchez « TOLOCO 10 têtes ». Excellent pour tester la percussion sans budget.",
        bestFor: "Premier prix",
        pros: ["Très abordable", "Beaucoup d’embouts", "USB-C"],
        cons: ["Finition basique", "Bruyant / profondeur limitée"],
        body: [
          "ASIN indicatif — les packs TOLOCO changent souvent ; validez titre et vendeur Amazon.fr.",
        ],
      },
      {
        tagline: "Amazon volume / entry price",
        summary:
          "Often a top US seller; on FR search “TOLOCO 10 heads”. Great to try percussion on a budget.",
        bestFor: "Entry price",
        pros: ["Very affordable", "Many heads", "USB-C"],
        cons: ["Basic finish", "Noisy / limited depth"],
        body: [
          "Indicative ASIN — TOLOCO packs change often; confirm title and Amazon.fr seller.",
        ],
      },
    ),
  },
  {
    slug: "bob-brad-t2",
    category: "pistolets",
    siteId: "massage-gun",
    name: "Bob and Brad T2",
    battery: "4000 mAh USB-C",
    weightKg: 0.72,
    amazonQuery: "Bob and Brad T2 massage gun",
    amazonAsin: "B09BB51M19",
    imageSrc: "/images/products/massage-gun/bob-brad-t2.jpg",
    indicativePriceEur: 79.99,
    specs: [
      { label: "Amplitude", value: "~10 mm" },
      { label: "Force", value: "Milieu de gamme" },
      { label: "Vitesses", value: "Multi-niveaux" },
      { label: "Embouts", value: "5 têtes" },
      { label: "Autonomie", value: "Grosse batterie 4000 mAh" },
    ],
    ...copy(
      {
        tagline: "Conçu avec des kinés YouTube",
        summary:
          "T2 : bon équilibre silence / autonomie / prix. Popularisé par Bob & Brad (kinés US).",
        bestFor: "Maison & sport loisir",
        pros: ["Autonomie", "Bon rapport Q/P", "Protocoles kiné"],
        cons: ["Moins « pro » qu’un Theragun", "Dispo FR variable"],
        body: [
          "ASIN UK/EU B09BB51M19 — vérifiez la fiche FR et la livraison Amazon.",
        ],
      },
      {
        tagline: "Designed with PT YouTubers",
        summary:
          "T2: solid quiet / battery / price balance. Popularized by Bob & Brad (US PTs).",
        bestFor: "Home & recreational sport",
        pros: ["Battery life", "Value", "PT protocols"],
        cons: ["Less “pro” than Theragun", "FR stock varies"],
        body: [
          "UK/EU ASIN B09BB51M19 — confirm FR listing and Amazon shipping.",
        ],
      },
    ),
  },
  {
    slug: "bob-brad-c2",
    category: "mini",
    siteId: "massage-gun",
    name: "Bob and Brad C2",
    battery: "2500 mAh USB-C",
    weightKg: 0.66,
    amazonQuery: "Bob and Brad C2 massage gun",
    imageSrc: "/images/products/massage-gun/bob-brad-c2.jpg",
    indicativePriceEur: 69.99,
    specs: [
      { label: "Amplitude", value: "~10 mm" },
      { label: "Force", value: "Compact" },
      { label: "Vitesses", value: "Multi-niveaux" },
      { label: "Embouts", value: "5 têtes" },
      { label: "Autonomie", value: "Plus légère que T2" },
    ],
    ...copy(
      {
        tagline: "Version plus compacte du T2",
        summary:
          "Plus léger / un peu plus silencieux que le T2, batterie plus petite. Cherchez « C2 » sur Amazon.fr.",
        bestFor: "Compact quotidien",
        pros: ["Plus compact", "Souvent plus silencieux", "Prix contenu"],
        cons: ["Moins d’autonomie", "ASIN parfois partagé"],
        body: [
          "Les listings C2/T2 se ressemblent : lisez le titre et les specs batterie avant d’acheter.",
        ],
      },
      {
        tagline: "More compact T2 sibling",
        summary:
          "Lighter / often quieter than T2, smaller battery. Search “C2” on Amazon.fr.",
        bestFor: "Compact daily",
        pros: ["More compact", "Often quieter", "Contained price"],
        cons: ["Less battery", "ASINs sometimes shared"],
        body: [
          "C2/T2 listings look alike: read title and battery specs before buying.",
        ],
      },
    ),
  },
  {
    slug: "opove-m3-pro",
    category: "pistolets",
    siteId: "massage-gun",
    name: "OPOVE M3 Pro",
    battery: "Li-ion",
    weightKg: 0.9,
    amazonQuery: "OPOVE M3 Pro pistolet massage",
    amazonAsin: "B07ZWK2YSF",
    imageSrc: "/images/products/massage-gun/opove-m3-pro.jpg",
    indicativePriceEur: 99.99,
    specs: [
      { label: "Amplitude", value: "~12–14 mm (annonce)" },
      { label: "Force", value: "Milieu / sport" },
      { label: "Vitesses", value: "Multi-niveaux" },
      { label: "Embouts", value: "Kit multi-têtes" },
      { label: "Autonomie", value: "Usage sport" },
    ],
    ...copy(
      {
        tagline: "Milieu de gamme sport",
        summary:
          "Souvent cité dans les comparatifs « meilleur rapport profondeur / prix ». Vérifiez dispo FR.",
        bestFor: "Sport régulier",
        pros: ["Bonne profondeur annoncée", "Prix médian", "Avis volume"],
        cons: ["Marque moins connue", "Stock FR à confirmer"],
        body: [
          "ASIN B07ZWK2YSF — ouvrez la fiche Amazon.fr pour le prix et le vendeur du jour.",
        ],
      },
      {
        tagline: "Mid-range sports pick",
        summary:
          "Often cited in “depth / price” roundups. Confirm FR availability.",
        bestFor: "Regular sport",
        pros: ["Claimed depth", "Mid price", "Review volume"],
        cons: ["Lesser-known brand", "Confirm FR stock"],
        body: [
          "ASIN B07ZWK2YSF — open Amazon.fr for today’s price and seller.",
        ],
      },
    ),
  },
];
