import type { GuideArticle } from "./articles";
import {
  tumblerClusterCovers,
  tumblerClusterGuides,
} from "./tumbler-guides-cluster";

export const TUMBLER_MAIN_GUIDE_SLUG = "choisir-gourde-isotherme";

/** Anciens slugs encore redirigés vers le guide pilier. */
export const LEGACY_TUMBLER_GUIDE_SLUGS = [
  "premier-achat-gourde",
  "bouchon-paille-etancheite",
  "gourde-au-quotidien",
] as const;

/**
 * Guide pilier + cluster longue traîne (volume, isolation, entretien, gourde vs tumbler).
 */
export const tumblerGuides: GuideArticle[] = [
  {
    slug: TUMBLER_MAIN_GUIDE_SLUG,
    fr: {
      title: "Guide complet : choisir gourde & tumbler isotherme",
      subtitle:
        "Volume, isolation, bouchon, entretien et sélections Amazon — une méthode claire, avec des exemples produits.",
      sections: [
        {
          heading: "1. Partez de l’usage, pas de la marque",
          paragraphs: [
            "Une bonne gourde ou un bon tumbler isotherme répond d’abord à un usage : sport, bureau, école, voiture, randonnée, ou mix quotidien. La marque et la couleur viennent ensuite.",
            "Notez où vous la transportez (sac, porte-gobelet, poche), combien d’heures vous voulez garder le froid ou le chaud, et si vous acceptez une paille / un goulot large. Sans ce cadrage, on achète souvent trop grand, trop complexe, ou trop cher.",
          ],
          bullets: [
            "Sport / salle : 500–750 ml, prise ferme, bouchon sport ou paille",
            "Bureau : 350–700 ml, ouverture simple, peu de bruit",
            "École : 350–500 ml, étanchéité prioritaire",
            "Voiture / journée longue : tumbler 700 ml–1,2 L avec paille",
          ],
        },
        {
          heading: "2. Gourde ou tumbler ?",
          paragraphs: [
            "La gourde (bottle) privilégie le transport fermé : sac, randonnée, sport. Le tumbler / mug isotherme privilégie la boisson à portée de main : bureau, voiture, canapé.",
            "Si vous renversez souvent → gourde fermée. Si vous buvez en continu devant l’écran → tumbler à paille. Beaucoup de gens finissent avec les deux formats (un compact + un XXL bureau).",
          ],
          productSlugs: ["super-sparrow-500", "stanley-quencher-12l"],
        },
        {
          heading: "3. Capacité : le critère le plus sous-estimé",
          paragraphs: [
            "Trop petite = recharges fréquentes. Trop grande = lourdeur dès qu’elle est remplie (1 L d’eau ≈ 1 kg, plus le contenant).",
            "En pratique : 500 ml pour la plupart des journées urbaines ; 700–750 ml si vous détestez les allers-retours à la fontaine ; au-delà de 1 L surtout pour tumbler bureau / voiture (mesurez le porte-gobelet).",
          ],
          bullets: [
            "350–400 ml : café / trajet court",
            "500 ml : défaut raisonnable quotidien",
            "700–750 ml : sport / outdoor",
            "1 L+ : journée sans point d’eau ou tumbler XXL",
          ],
          productSlugs: [
            "owala-smoothsip-355",
            "qwetch-originals-500",
            "qwetch-active-1l",
          ],
        },
        {
          heading: "4. Isolation froid / chaud : attentes réalistes",
          paragraphs: [
            "L’inox double paroi sous vide conserve mieux que le plastique simple. Les chiffres marketing (« 24 h froid / 12 h chaud ») sont des conditions labo : bouchon fermé, peu d’ouvertures, température ambiante stable.",
            "En usage réel, chaque ouverture, un trajet en voiture chaude et un bouchon mal isolé réduisent les performances. Visez une isolation crédible plutôt qu’un record théorique — et un joint / bouchon de qualité.",
          ],
          productSlugs: ["thermos-ultralight-750", "hydro-flask-710"],
        },
        {
          heading: "5. Bouchon, paille, étanchéité",
          paragraphs: [
            "Le bouchon fait autant la qualité perçue que le corps inox. Un joint usé ou mal remis = fuite dans le sac.",
            "Paille : pratique en voiture / bureau, plus de pièces à laver (brosse indispensable). Bouchon sport / goulot : plus simple à entretenir. Testez mentalement votre routine de lavage avant d’acheter un système complexe.",
          ],
          productSlugs: ["owala-freesip-710", "stanley-flip-straw-1l"],
        },
        {
          heading: "6. Budget : bien commencer sans se ruiner",
          paragraphs: [
            "Pour un premier achat, une gourde simple « Expédié et vendu par Amazon » suffit souvent. Vous validez le volume et l’habitude d’entretien avant d’investir dans une marque lifestyle.",
            "Lisez les avis récents sur les fuites et le goût métallique. Les packshots ne prouvent pas l’étanchéité réelle.",
          ],
          productSlugs: ["amazon-basics-isotherme", "otto-koning-500"],
        },
        {
          heading: "7. Best-sellers & formats qui marchent",
          paragraphs: [
            "Les meilleures ventes Amazon mêlent gourdes FlipFlow / FreeSip et tumblers XXL à anse. Ce ne sont pas les seuls bons choix, mais ce sont des formats déjà validés par beaucoup d’avis — à croiser avec votre usage.",
            "Préférez les offres Expédié et vendu par Amazon quand c’est possible : retours plus simples, stock plus stable. Le prix change vite : ouvrez la fiche du jour.",
          ],
          productSlugs: [
            "super-sparrow-500",
            "stanley-quencher-12l",
            "simple-modern-trek-1180",
          ],
        },
        {
          heading: "8. Cas particulier : aromatisation (pas isotherme inox)",
          paragraphs: [
            "Les systèmes type air up aromatisent l’eau par l’odeur du pod : ce n’est pas une gourde inox isotherme. L’intérêt est ludique / sans sucre, pas la tenue chaud-froid.",
            "À ne pas comparer directement à une Qwetch ou une Hydro Flask sur l’isolation.",
          ],
          productSlugs: ["air-up-click-600"],
        },
        {
          heading: "9. Entretien dès l’achat",
          paragraphs: [
            "Si vous ne voulez pas démonter trois joints chaque semaine, choisissez un bouchon simple. Les odeurs viennent surtout des joints, de la paille et des boissons sucrées laissées trop longtemps.",
            "Lave-vaisselle : beaucoup de fabricants le déconseillent pour le corps (ou le bouchon). En cas de doute, lavage main + brosse longue pour paille et goulot.",
          ],
          bullets: [
            "Rincer le jour même après café / thé / jus",
            "Brosse paille + joint une fois par semaine minimum",
            "Sécher ouvert (éviter odeur « fermé humide »)",
          ],
        },
        {
          heading: "10. Checklist avant de commander",
          paragraphs: [
            "Volume adapté, type de bouchon compatible avec votre routine, isolation crédible, entretien acceptable, vendeur fiable. Ensuite seulement : couleur et marque lifestyle.",
            "Comparez deux finalistes dans notre comparateur, puis ouvrez les fiches Amazon du jour pour le prix et le vendeur.",
          ],
          bullets: [
            "Usage principal noté",
            "Volume choisi (ml)",
            "Paille oui / non",
            "Lavage : simple ou multi-pièces",
            "Porte-gobelet mesuré (si voiture)",
            "Vendeur Amazon vérifié",
          ],
          productSlugs: [
            "qwetch-originals-500",
            "owala-freesip-710",
            "stanley-quencher-12l",
            "hydro-flask-710",
            "amazon-basics-isotherme",
            "owala-smoothsip-355",
          ],
        },
      ],
    },
    en: {
      title: "Complete guide: choosing an insulated bottle & tumbler",
      subtitle:
        "Capacity, insulation, lids, care and Amazon picks — one clear method, with product examples.",
      sections: [
        {
          heading: "1. Start from use, not brand",
          paragraphs: [
            "A good insulated bottle or tumbler first matches a use case: sport, desk, school, car, hiking, or daily mix. Brand and color come later.",
            "Note where you carry it (bag, cup holder, pocket), how long you need cold or hot hold, and whether you accept a straw / wide mouth. Without that framing, people often buy too big, too complex, or too expensive.",
          ],
          bullets: [
            "Gym / sport: 500–750 ml, firm grip, sport lid or straw",
            "Desk: 350–700 ml, simple opening, quiet use",
            "School: 350–500 ml, leak-proof first",
            "Car / long day: 700 ml–1.2 L tumbler with straw",
          ],
        },
        {
          heading: "2. Bottle or tumbler?",
          paragraphs: [
            "Bottles favor sealed transport: bag, hike, sport. Tumblers / insulated mugs favor sip-ready drinks: desk, car, sofa.",
            "If you tip things over often → sealed bottle. If you sip continuously on screen → straw tumbler. Many people end up with both (compact + XXL desk).",
          ],
          productSlugs: ["super-sparrow-500", "stanley-quencher-12l"],
        },
        {
          heading: "3. Capacity: the most underestimated criterion",
          paragraphs: [
            "Too small means constant refills. Too large gets heavy once filled (1 L of water ≈ 1 kg, plus the vessel).",
            "In practice: 500 ml covers most urban days; 700–750 ml if you hate fountain trips; above 1 L mostly for desk/car tumblers (measure the cup holder).",
          ],
          bullets: [
            "350–400 ml: coffee / short commute",
            "500 ml: sensible daily default",
            "700–750 ml: sport / outdoor",
            "1 L+: no refill points or XXL tumbler",
          ],
          productSlugs: [
            "owala-smoothsip-355",
            "qwetch-originals-500",
            "qwetch-active-1l",
          ],
        },
        {
          heading: "4. Hot / cold insulation: realistic expectations",
          paragraphs: [
            "Double-wall vacuum stainless beats plain plastic. Marketing claims (“24 h cold / 12 h hot”) are lab conditions: closed lid, few openings, stable ambient temperature.",
            "In real use, every open, a hot car ride, and a poorly insulated lid cut performance. Aim for credible insulation—and a quality seal/lid—not a theoretical record.",
          ],
          productSlugs: ["thermos-ultralight-750", "hydro-flask-710"],
        },
        {
          heading: "5. Lids, straws, leak-proofing",
          paragraphs: [
            "The lid drives perceived quality as much as the steel body. A worn or mis-seated gasket means a wet bag.",
            "Straws are great in car/desk use but add parts to wash (a straw brush is mandatory). Sport lids / mouths are simpler to clean. Mentally check your washing routine before buying a complex system.",
          ],
          productSlugs: ["owala-freesip-710", "stanley-flip-straw-1l"],
        },
        {
          heading: "6. Budget: start well without overspending",
          paragraphs: [
            "For a first buy, a simple “Ships and sold by Amazon” bottle often enough. You validate volume and care habits before paying for lifestyle branding.",
            "Read recent reviews on leaks and metallic taste. Packshots do not prove real-world seal performance.",
          ],
          productSlugs: ["amazon-basics-isotherme", "otto-koning-500"],
        },
        {
          heading: "7. Bestsellers & formats that work",
          paragraphs: [
            "Amazon bestsellers mix FlipFlow / FreeSip bottles and XXL handled tumblers. Not the only good options—but formats already stress-tested by many reviews. Cross-check with your use case.",
            "Prefer Ships and sold by Amazon when possible: simpler returns, steadier stock. Prices move fast—open today’s listing.",
          ],
          productSlugs: [
            "super-sparrow-500",
            "stanley-quencher-12l",
            "simple-modern-trek-1180",
          ],
        },
        {
          heading: "8. Special case: scent flavoring (not steel insulation)",
          paragraphs: [
            "Systems like air up flavor water via pod scent—not a vacuum steel bottle. The point is fun / sugar-free hydration, not hot-cold hold.",
            "Do not compare it directly to a Qwetch or Hydro Flask on insulation.",
          ],
          productSlugs: ["air-up-click-600"],
        },
        {
          heading: "9. Care from day one",
          paragraphs: [
            "If you will not dismantle three gaskets weekly, pick a simple lid. Smells mostly come from seals, straws, and sugary drinks left too long.",
            "Dishwasher: many brands advise against it for the body (or lid). When unsure, hand wash + long brush for straw and mouth.",
          ],
          bullets: [
            "Rinse same day after coffee / tea / juice",
            "Brush straw + gasket at least weekly",
            "Dry open (avoid closed-damp smell)",
          ],
        },
        {
          heading: "10. Checklist before you order",
          paragraphs: [
            "Right volume, lid compatible with your routine, credible insulation, acceptable care, reliable seller. Only then: color and lifestyle brand.",
            "Shortlist two finalists in our comparator, then open today’s Amazon listings for price and seller.",
          ],
          bullets: [
            "Primary use noted",
            "Volume chosen (ml)",
            "Straw yes / no",
            "Cleaning: simple or multi-part",
            "Cup holder measured (if car)",
            "Amazon seller verified",
          ],
          productSlugs: [
            "qwetch-originals-500",
            "owala-freesip-710",
            "stanley-quencher-12l",
            "hydro-flask-710",
            "amazon-basics-isotherme",
            "owala-smoothsip-355",
          ],
        },
      ],
    },
  },
  ...tumblerClusterGuides,
];

export const tumblerGuideCovers: Record<
  string,
  { src: string; credit: string; creditUrl: string }
> = {
  [TUMBLER_MAIN_GUIDE_SLUG]: {
    src: "/images/tumbler/guides/choisir.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  ...tumblerClusterCovers,
};
