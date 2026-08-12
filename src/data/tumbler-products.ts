import type { SiteId } from "@/sites/types";
import type { CategoryMeta, Product } from "./products";

/** Catégories du thème La gourde isotherme. */
export const tumblerCategories: CategoryMeta[] = [
  {
    id: "gourdes",
    slug: "gourdes",
    siteId: "tumbler",
    fr: {
      title: "Gourdes isothermes",
      intro:
        "Bouteilles inox double paroi pour le sport, le bureau et le quotidien. Priorité aux modèles Expédié et vendu par Amazon.",
    },
    en: {
      title: "Insulated bottles",
      intro:
        "Double-wall stainless bottles for sport, office and daily use. Focus on Ships and sold by Amazon listings.",
    },
  },
  {
    id: "tumblers",
    slug: "tumblers",
    siteId: "tumbler",
    fr: {
      title: "Tumblers & mugs isothermes",
      intro:
        "Grands formats avec paille / anse pour la voiture, le bureau et les longues journées.",
    },
    en: {
      title: "Insulated tumblers & mugs",
      intro:
        "Large straw / handle formats for the car, office and long days out.",
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
 * Top ventes gourdes / tumblers — sélection éditoriale best-sellers Amazon.fr.
 * Critère : privilégier « Expédié et vendu par Amazon » (à revalider si l’offre change).
 * ASINs connus quand disponibles ; sinon recherche affiliée.
 */
export const tumblerProducts: Product[] = [
  {
    slug: "super-sparrow-500",
    category: "gourdes",
    siteId: "tumbler",
    name: "Super Sparrow FlipFlow Isotherme 500 ml",
    battery: "Inox double paroi",
    weightKg: 0.31,
    amazonQuery: "Super Sparrow FlipFlow gourde isotherme",
    amazonAsin: "B0CRZ1V1LQ",
    imageSrc: "/images/products/tumbler/super-sparrow-500.jpg",
    indicativePriceEur: 16.2,
    specs: [
      { label: "Capacité", value: "500 ml (aussi 350–1,2 L)" },
      { label: "Isolation", value: "Froid / chaud (double paroi)" },
      { label: "Matière", value: "Inox 18/8 sans BPA" },
      { label: "Points forts", value: "Paille FlipFlow, poignée, lave-vaisselle" },
    ],
    ...copy(
      {
        tagline: "Best-seller avec paille rabattable",
        summary:
          "Gourde inox FlipFlow : poignée + paille pour sport, école et quotidien. Formats multiples sur la fiche Amazon.",
        bestFor: "Quotidien & sport",
        pros: ["Paille + poignée", "Étanche", "Formats 350 ml → 1,2 L"],
        cons: ["Finition variable selon couleur", "Paille à brosser"],
        body: [
          "Lien Affiliates vers l’offre FlipFlow Expédié et vendu par Amazon quand disponible — vérifiez le volume sélectionné.",
        ],
      },
      {
        tagline: "Bestseller with flip straw",
        summary:
          "FlipFlow stainless bottle: handle + straw for sport, school and daily use. Multiple sizes on the Amazon listing.",
        bestFor: "Daily & sport",
        pros: ["Straw + handle", "Leak-proof", "Sizes 350 ml → 1.2 L"],
        cons: ["Finish varies by color", "Straw needs brushing"],
        body: [
          "Affiliate link to the FlipFlow offer Ships and sold by Amazon when available — confirm the selected size.",
        ],
      },
    ),
  },
  {
    slug: "amazon-basics-isotherme",
    category: "gourdes",
    siteId: "tumbler",
    name: "Amazon Basics Gourde Isotherme",
    battery: "Inox double paroi",
    weightKg: 0.35,
    amazonQuery: "Amazon Basics gourde isotherme inox",
    amazonAsin: "B0F2SH7WKL",
    imageSrc: "/images/products/tumbler/amazon-basics-isotherme.jpg",
    indicativePriceEur: 12.09,
    specs: [
      { label: "Capacité", value: "~590 ml" },
      { label: "Isolation", value: "Froid / chaud (double paroi)" },
      { label: "Matière", value: "Inox sans BPA" },
      { label: "Points forts", value: "Marque Amazon, prix bas" },
    ],
    ...copy(
      {
        tagline: "L’entrée de gamme Amazon",
        summary:
          "Option simple et abordable pour tester l’isotherme au quotidien.",
        bestFor: "Budget",
        pros: ["Prix contenu", "Souvent vendu par Amazon", "Sans fioritures"],
        cons: ["Moins de finitions premium", "Peu d’accessoires"],
        body: [
          "Idéale si vous voulez une gourde fiable sans payer la marque lifestyle.",
        ],
      },
      {
        tagline: "Amazon entry option",
        summary: "Simple affordable insulated bottle for daily use.",
        bestFor: "Budget",
        pros: ["Low price", "Often sold by Amazon", "No frills"],
        cons: ["Fewer premium finishes", "Few accessories"],
        body: ["Good first insulated bottle without lifestyle markup."],
      },
    ),
  },
  {
    slug: "otto-koning-500",
    category: "gourdes",
    siteId: "tumbler",
    name: "OTTO KONING Gourde 500 ml",
    battery: "Inox double paroi",
    weightKg: 0.28,
    amazonQuery: "OTTO KONING gourde isotherme 500 ml",
    amazonAsin: "B0BK98QDGP",
    imageSrc: "/images/products/tumbler/otto-koning-500.jpg",
    indicativePriceEur: 12.99,
    specs: [
      { label: "Capacité", value: "500 ml" },
      { label: "Isolation", value: "Froid 24 h / chaud 12 h" },
      { label: "Matière", value: "Inox 18/8" },
      { label: "Points forts", value: "Légère, étanche" },
    ],
    ...copy(
      {
        tagline: "Compacte et légère",
        summary: "Format 500 ml très courant pour bureau, voiture et sport léger.",
        bestFor: "Bureau / trajet",
        pros: ["Légère", "Bon volume d’avis", "Étanche"],
        cons: ["Design basique", "Anse selon version"],
        body: ["Souvent classée dans le top ventes des 500 ml abordables."],
      },
      {
        tagline: "Compact and light",
        summary: "Common 500 ml size for office, commute and light sport.",
        bestFor: "Office / commute",
        pros: ["Light", "Strong review volume", "Leak-proof"],
        cons: ["Basic design", "Handle depends on version"],
        body: ["Often ranks among affordable 500 ml bestsellers."],
      },
    ),
  },
  {
    slug: "qwetch-originals-500",
    category: "gourdes",
    siteId: "tumbler",
    name: "Qwetch Originals 500 ml",
    battery: "Inox double paroi",
    weightKg: 0.36,
    amazonQuery: "Qwetch Originals gourde isotherme 500ml",
    amazonAsin: "B0FR8WMSVQ",
    imageSrc: "/images/products/tumbler/qwetch-originals-500.jpg",
    indicativePriceEur: 27.1,
    specs: [
      { label: "Capacité", value: "500 ml" },
      { label: "Isolation", value: "Froid 24 h / chaud 12 h" },
      { label: "Matière", value: "Inox recyclé (selon série)" },
      { label: "Points forts", value: "Marque FR, compacte" },
    ],
    ...copy(
      {
        tagline: "Marque française fiable",
        summary:
          "Gourde Qwetch très présente en top ventes : compacte, étanche, finitions soignées.",
        bestFor: "Quotidien urbain",
        pros: ["Bonne isolation", "Design sobre", "Écosystème bouchons"],
        cons: ["Prix plus élevé que no-name", "Stock couleurs variable"],
        body: [
          "Choix premium accessible. Vérifiez le vendeur Amazon sur la couleur choisie.",
        ],
      },
      {
        tagline: "Reliable French brand",
        summary:
          "Qwetch bottle often in bestsellers: compact, leak-proof, neat finishes.",
        bestFor: "Urban daily",
        pros: ["Good insulation", "Clean design", "Lid ecosystem"],
        cons: ["Pricier than no-name", "Color stock varies"],
        body: ["Accessible premium pick. Confirm Amazon seller on your color."],
      },
    ),
  },
  {
    slug: "qwetch-active-1l",
    category: "gourdes",
    siteId: "tumbler",
    name: "Qwetch Active 1 L",
    battery: "Inox double paroi",
    weightKg: 0.48,
    amazonQuery: "Qwetch Active gourde isotherme 1L",
    amazonAsin: "B0C6B2Y5CN",
    imageSrc: "/images/products/tumbler/qwetch-active-1l.jpg",
    indicativePriceEur: 29.33,
    specs: [
      { label: "Capacité", value: "1 L" },
      { label: "Isolation", value: "Froid 24 h / chaud 12 h" },
      { label: "Matière", value: "Inox + anse" },
      { label: "Points forts", value: "Grande capacité, poignée" },
    ],
    ...copy(
      {
        tagline: "Grand volume pour la journée",
        summary: "1 litre avec anse : randonnée, bureau, famille.",
        bestFor: "Journée complète",
        pros: ["1 L", "Poignée pratique", "Étanche"],
        cons: ["Plus lourde pleine", "Moins discrète"],
        body: ["Bonne alternative aux tumblers XXL si vous préférez un goulot classique."],
      },
      {
        tagline: "Full-day volume",
        summary: "1 litre with handle: hiking, office, family days.",
        bestFor: "Full day",
        pros: ["1 L", "Handy handle", "Leak-proof"],
        cons: ["Heavier when full", "Less discreet"],
        body: ["Good alternative to XXL tumblers if you prefer a classic mouth."],
      },
    ),
  },
  {
    slug: "thermos-ultralight-750",
    category: "gourdes",
    siteId: "tumbler",
    name: "THERMOS Ultralight 0,75 L",
    battery: "Inox double paroi",
    weightKg: 0.275,
    amazonQuery: "THERMOS Ultralight gourde 0.75L",
    amazonAsin: "B075V4229Z",
    imageSrc: "/images/products/tumbler/thermos-ultralight-750.jpg",
    indicativePriceEur: 37.9,
    specs: [
      { label: "Capacité", value: "750 ml" },
      { label: "Isolation", value: "Chaud 10 h / froid 20 h" },
      { label: "Matière", value: "Inox THERMOS" },
      { label: "Points forts", value: "Marque historique, étanche" },
    ],
    ...copy(
      {
        tagline: "Référence isotherme",
        summary: "THERMOS reste une valeur sûre pour thé / café et eau froide.",
        bestFor: "Boissons chaudes",
        pros: ["Marque établie", "Très étanche", "Bonne tenue thermique"],
        cons: ["Design classique", "Prix moyen/élevé"],
        body: ["Utile si vous alternez café chaud et eau froide dans la même journée."],
      },
      {
        tagline: "Insulation reference",
        summary: "THERMOS remains a safe pick for tea/coffee and cold water.",
        bestFor: "Hot drinks",
        pros: ["Established brand", "Very leak-proof", "Strong thermal hold"],
        cons: ["Classic design", "Mid/high price"],
        body: ["Useful if you switch between hot coffee and cold water the same day."],
      },
    ),
  },
  {
    slug: "hydro-flask-710",
    category: "gourdes",
    siteId: "tumbler",
    name: "Hydro Flask 710 ml (24 oz)",
    battery: "Inox double paroi",
    weightKg: 0.36,
    amazonQuery: "Hydro Flask gourde 710 ml standard mouth",
    amazonAsin: "B0BTFZ31KR",
    imageSrc: "/images/products/tumbler/hydro-flask-710.jpg",
    indicativePriceEur: 29.37,
    specs: [
      { label: "Capacité", value: "710 ml" },
      { label: "Isolation", value: "Tempkeep double paroi" },
      { label: "Matière", value: "Inox powder coat" },
      { label: "Points forts", value: "Finitions, écosystème bouchons" },
    ],
    ...copy(
      {
        tagline: "Premium lifestyle",
        summary: "Gourde premium très demandée : tenue thermique et finitions mates.",
        bestFor: "Usage premium",
        pros: ["Image / finitions", "Bonne isolation", "Accessoires"],
        cons: ["Prix élevé", "Vendeur parfois marketplace — vérifier Amazon"],
        body: [
          "Contrôlez systématiquement « Expédié et vendu par Amazon » : certaines couleurs passent en marketplace.",
        ],
      },
      {
        tagline: "Premium lifestyle",
        summary: "In-demand premium bottle: thermal hold and matte finishes.",
        bestFor: "Premium use",
        pros: ["Finish / brand", "Good insulation", "Accessories"],
        cons: ["High price", "Some colors may be marketplace — verify Amazon"],
        body: [
          "Always confirm “Ships and sold by Amazon”: some colors flip to marketplace.",
        ],
      },
    ),
  },
  {
    slug: "stanley-quencher-12l",
    category: "tumblers",
    siteId: "tumbler",
    name: "Stanley Quencher H2.0 1,2 L",
    battery: "Inox double paroi",
    weightKg: 0.64,
    amazonQuery: "Stanley Quencher H2.0 FlowState 1.2L",
    amazonAsin: "B0DFWW8JZN",
    imageSrc: "/images/products/tumbler/stanley-quencher-12l.jpg",
    indicativePriceEur: 36.9,
    specs: [
      { label: "Capacité", value: "1,2 L" },
      { label: "Isolation", value: "Froid 11 h / glacé 48 h" },
      { label: "Matière", value: "Inox + paille FlowState" },
      { label: "Points forts", value: "Anse, paille, lave-vaisselle" },
    ],
    ...copy(
      {
        tagline: "Le tumbler phénomène",
        summary:
          "Grand format avec paille et anse : voiture, bureau, journée entière.",
        bestFor: "Hydratation XXL",
        pros: ["1,2 L", "Paille + anse", "Très viral / avis nombreux"],
        cons: ["Encombrant", "Pas idéal en sac compact"],
        body: [
          "Référence tumbler. Préférez les offres Expédié et vendu par Amazon.",
        ],
      },
      {
        tagline: "The viral tumbler",
        summary: "Large straw + handle format for car, office and full days.",
        bestFor: "XXL hydration",
        pros: ["1.2 L", "Straw + handle", "Huge review volume"],
        cons: ["Bulky", "Not great in a small bag"],
        body: ["Tumbler reference. Prefer Ships and sold by Amazon offers."],
      },
    ),
  },
  {
    slug: "owala-freesip-710",
    category: "tumblers",
    siteId: "tumbler",
    name: "Owala FreeSip 710 ml",
    battery: "Inox double paroi",
    weightKg: 0.39,
    amazonQuery: "Owala FreeSip 710 ml gourde paille",
    amazonAsin: "B0C59BYVTQ",
    imageSrc: "/images/products/tumbler/owala-freesip-710.jpg",
    indicativePriceEur: 36.99,
    specs: [
      { label: "Capacité", value: "710 ml" },
      { label: "Isolation", value: "Inox isotherme" },
      { label: "Matière", value: "Inox + bec FreeSip" },
      { label: "Points forts", value: "Paille + goulot, sport" },
    ],
    ...copy(
      {
        tagline: "Bec + paille en un",
        summary:
          "Système FreeSip : boire à la paille ou au goulot sans changer de bouchon.",
        bestFor: "Sport / voiture",
        pros: ["Double mode de boisson", "Très bien notée", "Format 710 ml"],
        cons: ["Prix élevé", "Stock couleurs tendu"],
        body: ["Souvent dans le top ventes tumblers / gourdes paille."],
      },
      {
        tagline: "Sip + straw in one",
        summary: "FreeSip lid: straw or spout without swapping lids.",
        bestFor: "Sport / car",
        pros: ["Dual drink modes", "High ratings", "710 ml size"],
        cons: ["High price", "Tight color stock"],
        body: ["Often ranks among straw-bottle / tumbler bestsellers."],
      },
    ),
  },
  {
    slug: "stanley-flip-straw-1l",
    category: "tumblers",
    siteId: "tumbler",
    name: "Stanley IceFlow Flip Straw 0,89 L",
    battery: "Inox double paroi",
    weightKg: 0.45,
    amazonQuery: "Stanley IceFlow Flip Straw 887 ml",
    amazonAsin: "B0DR9NZMYJ",
    imageSrc: "/images/products/tumbler/stanley-flip-straw-1l.jpg",
    indicativePriceEur: 42.5,
    specs: [
      { label: "Capacité", value: "0,89 L (887 ml)" },
      { label: "Isolation", value: "Froid 12 h / glacé 48 h" },
      { label: "Matière", value: "Inox + paille rabattable" },
      { label: "Points forts", value: "Paille flip, étanche" },
    ],
    ...copy(
      {
        tagline: "Stanley IceFlow Flip Straw",
        summary:
          "Gobelet IceFlow à paille rabattable (~0,89 L) : moins « mug Quencher », plus compact pour sport et voiture.",
        bestFor: "Sport & voyage",
        pros: ["Marque Stanley", "Paille flip", "Bonne isolation"],
        cons: ["Prix premium", "Vérifier vendeur Amazon"],
        body: [
          "Bon compromis si le Quencher 1,2 L est trop large pour votre porte-gobelet.",
        ],
      },
      {
        tagline: "Stanley IceFlow Flip Straw",
        summary:
          "IceFlow flip-straw tumbler (~0.89 L): less Quencher-mug, more compact for sport and car.",
        bestFor: "Sport & travel",
        pros: ["Stanley brand", "Flip straw", "Strong insulation"],
        cons: ["Premium price", "Verify Amazon seller"],
        body: [
          "Good compromise if the 1.2 L Quencher is too wide for your cup holder.",
        ],
      },
    ),
  },
  {
    slug: "air-up-click-600",
    category: "gourdes",
    siteId: "tumbler",
    name: "air up Click 600 ml (pack 5 pods)",
    battery: "Tritan (non isotherme inox)",
    weightKg: 0.22,
    amazonQuery: "air up Click Green 600 ml pods",
    amazonAsin: "B0G6755KD6",
    imageSrc: "/images/products/tumbler/air-up-click-600.jpg",
    indicativePriceEur: 49.99,
    specs: [
      { label: "Capacité", value: "600 ml" },
      { label: "Principe", value: "Arôme par odeur (pods)" },
      { label: "Matière", value: "Tritan sans BPA" },
      { label: "Inclus", value: "5 pods (variety pack)" },
    ],
    ...copy(
      {
        tagline: "Eau aromatisée sans sucre",
        summary:
          "Pack de démarrage air up Click : gourde 600 ml + 5 pods. L’eau reste pure ; le goût vient de l’odeur du pod.",
        bestFor: "École / hydratation ludique",
        pros: ["Sans sucre / calories", "Pods inclus", "Lave-vaisselle"],
        cons: ["Pas une gourde inox isotherme", "Coût des pods à long terme"],
        body: [
          "À distinguer des isothermes inox : ici l’intérêt est l’aromatisation, pas la tenue chaud/froid. Vérifiez Expédié et vendu par Amazon.",
        ],
      },
      {
        tagline: "Flavored water without sugar",
        summary:
          "air up Click starter: 600 ml bottle + 5 pods. Water stays pure; flavor comes from the pod scent.",
        bestFor: "School / fun hydration",
        pros: ["Sugar/calorie free", "Pods included", "Dishwasher safe"],
        cons: ["Not a vacuum steel bottle", "Ongoing pod cost"],
        body: [
          "Different job than stainless isothermals: aroma, not hot/cold hold. Prefer Ships and sold by Amazon.",
        ],
      },
    ),
  },
  {
    slug: "owala-smoothsip-355",
    category: "tumblers",
    siteId: "tumbler",
    name: "Owala SmoothSip Slider 355 ml",
    battery: "Inox double paroi",
    weightKg: 0.28,
    amazonQuery: "Owala SmoothSip Slider 355 ml",
    amazonAsin: "B0DF472VMZ",
    imageSrc: "/images/products/tumbler/owala-smoothsip-355.jpg",
    indicativePriceEur: 29.99,
    specs: [
      { label: "Capacité", value: "355 ml" },
      { label: "Isolation", value: "Chaud ~6 h / froid ~24 h" },
      { label: "Matière", value: "Inox + couvercle coulissant" },
      { label: "Points forts", value: "Bec SmoothSip, étanche, café" },
    ],
    ...copy(
      {
        tagline: "Mug café compact Owala",
        summary:
          "Tumbler 355 ml avec bec coulissant SmoothSip : café chaud ou boisson froide, format voyage / bureau.",
        bestFor: "Café & trajets",
        pros: ["Format café", "Couvercle coulissant", "Souvent vendu par Amazon"],
        cons: ["Petit volume", "Lavage main recommandé pour le corps"],
        body: [
          "Complément du FreeSip 710 ml : ici l’angle est mug isotherme compact, pas hydratation XXL.",
        ],
      },
      {
        tagline: "Compact Owala coffee mug",
        summary:
          "355 ml tumbler with SmoothSip slider: hot coffee or cold drinks for commute / desk.",
        bestFor: "Coffee & commute",
        pros: ["Coffee size", "Sliding lid", "Often sold by Amazon"],
        cons: ["Small volume", "Hand-wash body recommended"],
        body: [
          "Pairs with the 710 ml FreeSip: this one is a compact insulated mug, not XXL hydration.",
        ],
      },
    ),
  },
  {
    slug: "simple-modern-trek-1180",
    category: "tumblers",
    siteId: "tumbler",
    name: "Simple Modern Trek 1,18 L",
    battery: "Inox double paroi",
    weightKg: 0.55,
    amazonQuery: "Simple Modern Trek tumbler handle straw 1180ml",
    amazonAsin: "B0BHC1C93P",
    imageSrc: "/images/products/tumbler/simple-modern-trek-1180.jpg",
    indicativePriceEur: 21.0,
    specs: [
      { label: "Capacité", value: "1,18 L" },
      { label: "Isolation", value: "Inox isotherme" },
      { label: "Matière", value: "Inox + paille + anse" },
      { label: "Points forts", value: "Anse, paille, grand volume" },
    ],
    ...copy(
      {
        tagline: "Alternative XXL au Quencher",
        summary:
          "Tumbler Trek avec poignée et paille : hydratation journée entière, bureau et voiture.",
        bestFor: "Hydratation XXL",
        pros: ["~1,2 L", "Anse + paille", "Souvent bien noté"],
        cons: ["Encombrant", "Vérifier porte-gobelet"],
        body: [
          "Concurrent direct des tumblers Stanley/Owala en grand format — confirmez Expédié et vendu par Amazon.",
        ],
      },
      {
        tagline: "XXL Quencher alternative",
        summary:
          "Trek tumbler with handle and straw: all-day hydration for desk and car.",
        bestFor: "XXL hydration",
        pros: ["~1.2 L", "Handle + straw", "Often well rated"],
        cons: ["Bulky", "Check cup holder fit"],
        body: [
          "Direct rival to large Stanley/Owala tumblers — confirm Ships and sold by Amazon.",
        ],
      },
    ),
  },
];

export const tumblerSiteId: SiteId = "tumbler";
