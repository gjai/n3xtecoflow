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
    name: "Super Sparrow Gourde Isotherme 500 ml",
    battery: "Inox double paroi",
    weightKg: 0.31,
    amazonQuery: "Super Sparrow gourde isotherme 500ml",
    amazonAsin: "B01MY09LEL",
    specs: [
      { label: "Capacité", value: "500 ml" },
      { label: "Isolation", value: "Froid ~24 h / chaud ~12 h" },
      { label: "Matière", value: "Inox 18/8 sans BPA" },
      { label: "Points forts", value: "2 bouchons, étanche" },
    ],
    ...copy(
      {
        tagline: "Best-seller polyvalent",
        summary:
          "Gourde inox très demandée : formats multiples, isolation solide, usage sport / bureau / école.",
        bestFor: "Quotidien & sport",
        pros: ["Excellent rapport qualité/prix", "Étanche", "Formats 350 ml → 1,2 L"],
        cons: ["Finition variable selon couleur", "Paille en option selon lot"],
        body: [
          "Récurrente en tête des ventes Amazon.fr. Vérifiez bien « Expédié et vendu par Amazon » sur la fiche du jour.",
        ],
      },
      {
        tagline: "Versatile bestseller",
        summary:
          "Popular stainless bottle: multiple sizes, solid insulation, sport / office / school use.",
        bestFor: "Daily & sport",
        pros: ["Strong value", "Leak-proof", "Sizes 350 ml → 1.2 L"],
        cons: ["Finish varies by color", "Straw depends on SKU"],
        body: [
          "Frequently tops Amazon.fr charts. Confirm “Ships and sold by Amazon” on the live listing.",
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
    amazonQuery: "Amazon Basics gourde isotherme inox",
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
    amazonQuery: "OTTO KONING gourde isotherme 500 ml",
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
    amazonQuery: "Qwetch Originals gourde isotherme 500ml",
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
    amazonQuery: "Qwetch Active gourde isotherme 1L",
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
    amazonQuery: "THERMOS Ultralight gourde 0.75L",
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
    amazonQuery: "Hydro Flask gourde 710 ml standard mouth",
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
    amazonQuery: "Stanley Quencher H2.0 FlowState 1.2L",
    amazonAsin: "B0FCYS4TBH",
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
    amazonQuery: "Owala FreeSip 710 ml gourde paille",
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
    name: "Stanley Flip Straw 1,06 L",
    battery: "Inox double paroi",
    amazonQuery: "Stanley Flip Straw gourde 1.06L",
    specs: [
      { label: "Capacité", value: "1,06 L" },
      { label: "Isolation", value: "Froid 15 h / glace 3 j" },
      { label: "Matière", value: "Inox + paille rabattable" },
      { label: "Points forts", value: "Paille flip, étanche" },
    ],
    ...copy(
      {
        tagline: "Stanley plus compact que le Quencher",
        summary:
          "Gourde à paille rabattable : moins « mug », plus bouteille, toujours grand volume.",
        bestFor: "Sport & voyage",
        pros: ["Marque Stanley", "Paille pratique", "Bonne isolation"],
        cons: ["Prix premium", "Vérifier vendeur Amazon"],
        body: [
          "Bon compromis si le Quencher 1,2 L est trop large pour votre porte-gobelet.",
        ],
      },
      {
        tagline: "Stanley, less mug-shaped",
        summary:
          "Flip-straw bottle: less mug, more bottle, still large volume.",
        bestFor: "Sport & travel",
        pros: ["Stanley brand", "Handy straw", "Strong insulation"],
        cons: ["Premium price", "Verify Amazon seller"],
        body: [
          "Good compromise if the 1.2 L Quencher is too wide for your cup holder.",
        ],
      },
    ),
  },
];

export const tumblerSiteId: SiteId = "tumbler";
