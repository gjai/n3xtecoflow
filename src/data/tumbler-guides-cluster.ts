import type { GuideArticle } from "./articles";

const CREDIT = "La gourde isotherme";
const CREDIT_URL = "https://mon-tumbler.fr";

const cover = (src: string) => ({
  src,
  credit: CREDIT,
  creditUrl: CREDIT_URL,
});

export const tumblerClusterCovers: Record<
  string,
  { src: string; credit: string; creditUrl: string }
> = {
  "gourde-vs-tumbler": cover("/images/tumbler/comparatifs.jpg"),
  "volume-capacite-gourde": cover("/images/tumbler/gourdes.jpg"),
  "entretien-gourde": cover("/images/tumbler/guides.jpg"),
  "isolation-froid-chaud": cover("/images/tumbler/hero.jpg"),
};

export const tumblerClusterGuides: GuideArticle[] = [
  {
    slug: "gourde-vs-tumbler",
    fr: {
      title: "Gourde ou tumbler isotherme : lequel choisir ?",
      subtitle:
        "Transport fermé vs boisson à portée de main — usages, fuites, lavage et exemples produits.",
      sections: [
        {
          heading: "1. Deux formats, deux gestes",
          paragraphs: [
            "La gourde (bottle) se ferme pour le sac, le vélo, la randonnée. Le tumbler / mug isotherme reste ouvert ou à paille : bureau, voiture, canapé. Le critère n’est pas la marque, c’est le geste de boire.",
            "Si vous renversez souvent ou rangez la bouteille à l’horizontale → gourde. Si vous sirotez toute la journée devant un écran → tumbler. Beaucoup de foyers finissent avec les deux : un compact étanche + un grand format bureau.",
          ],
          bullets: [
            "Gourde : étanchéité, goulot, bouchon sport",
            "Tumbler : paille, ouverture large, porte-gobelet",
            "Les deux : inox double paroi, joint à surveiller",
          ],
        },
        {
          heading: "2. Quand la gourde gagne",
          paragraphs: [
            "Sport, train, randonnée, école : vous avez besoin d’un contenant qui ne fuit pas dans le sac. Un bouchon sport ou un goulot visé est plus simple qu’une paille à plusieurs pièces.",
            "Les 500 ml restent le défaut urbain. Au-delà, le poids (1 L d’eau ≈ 1 kg) se sent vite à l’épaule. Pour un premier achat « sac », visez étanchéité réelle plutôt qu’un volume record.",
          ],
          productSlugs: ["super-sparrow-500", "qwetch-originals-500", "hydro-flask-710"],
        },
        {
          heading: "3. Quand le tumbler gagne",
          paragraphs: [
            "Bureau, télétravail, trajet voiture : vous voulez boire sans dévisser. La paille et le goulot large rendent le café / l’eau glacée plus fluides — au prix d’un lavage plus long.",
            "Mesurez le porte-gobelet avant un XXL type Stanley Quencher. Un tumbler trop large reste à la maison. Un format 700 ml–1 L couvre déjà la plupart des journées sédentaires.",
          ],
          productSlugs: ["stanley-quencher-12l", "owala-freesip-710", "stanley-flip-straw-1l"],
        },
        {
          heading: "4. Étanchéité, bruit, lavage",
          paragraphs: [
            "Un tumbler à paille a plus de pièces (paille, joint, clapet). Oublier le séchage = odeur. Une gourde à bouchon simple se lave plus vite, mais un joint mal remis fuit autant.",
            "Au bureau, le cliquetis d’un bouchon sport peut gêner. Un tumbler « silent sip » (Owala SmoothSip) est plus discret. Testez mentalement votre routine : lave-vaisselle autorisé ou non, brosse à paille sous la main.",
          ],
          productSlugs: ["owala-smoothsip-355", "amazon-basics-isotherme"],
        },
        {
          heading: "5. Checklist avant d’acheter",
          paragraphs: [
            "Notez le lieu (sac / bureau / voiture), le volume, et si vous acceptez une paille. Puis ouvrez les fiches : inox, joint, avis sur les fuites, vendeur Amazon.",
            "Les prix bougent. Ce site ne fixe pas un tarif : croisez l’offre du jour. Si vous hésitez encore, le guide complet gourde & tumbler recadre volume, isolation et bouchon.",
          ],
          bullets: [
            "Usage principal noté (un seul, pas trois)",
            "Mesure porte-gobelet si tumbler voiture",
            "Pièces à laver listées (paille = brosse)",
            "Préférer Expédié et vendu par Amazon quand c’est possible",
          ],
        },
      ],
    },
    en: {
      title: "Insulated bottle vs tumbler: which one?",
      subtitle:
        "Closed carry vs sip-all-day — use cases, leaks, washing and product examples.",
      sections: [
        {
          heading: "1. Two formats, two drinking habits",
          paragraphs: [
            "A bottle closes for a bag, bike or hike. A tumbler stays open or uses a straw: desk, car, sofa. Brand comes after the drinking gesture.",
            "If you spill often or pack the bottle on its side → bottle. If you sip all day at a screen → tumbler. Many households end up with both: a leak-proof compact plus a large desk cup.",
          ],
          bullets: [
            "Bottle: seals, spout, sport cap",
            "Tumbler: straw, wide mouth, cup holder",
            "Both: double-wall steel, gaskets to watch",
          ],
        },
        {
          heading: "2. When the bottle wins",
          paragraphs: [
            "Sport, trains, hiking, school: you need something that will not leak in a bag. A sport cap or screw lid is simpler than a multi-part straw.",
            "500 ml remains the urban default. Beyond that, weight (1 L of water ≈ 1 kg) shows up on the shoulder. For a first “bag” buy, real leak-proofing beats a record volume.",
          ],
          productSlugs: ["super-sparrow-500", "qwetch-originals-500", "hydro-flask-710"],
        },
        {
          heading: "3. When the tumbler wins",
          paragraphs: [
            "Desk, remote work, car: you want to drink without unscrewing. A straw and wide mouth make iced water or coffee easier — at the cost of longer washing.",
            "Measure the cup holder before an XXL Stanley Quencher. A tumbler that is too wide stays at home. 700 ml–1 L already covers most sedentary days.",
          ],
          productSlugs: ["stanley-quencher-12l", "owala-freesip-710", "stanley-flip-straw-1l"],
        },
        {
          heading: "4. Leaks, noise, washing",
          paragraphs: [
            "A straw tumbler has more parts (straw, gasket, flap). Skip drying and it smells. A simple bottle lid washes faster, but a mis-seated gasket leaks just as badly.",
            "At the office, a sport-cap click can annoy. A quieter sip lid (Owala SmoothSip) is more discreet. Picture your routine: dishwasher allowed or not, straw brush at hand.",
          ],
          productSlugs: ["owala-smoothsip-355", "amazon-basics-isotherme"],
        },
        {
          heading: "5. Pre-buy checklist",
          paragraphs: [
            "Write down place (bag / desk / car), volume, and whether you accept a straw. Then open product sheets: steel, gasket, leak reviews, Amazon seller.",
            "Prices move. This site does not lock a tariff: check today’s listing. If you still hesitate, the complete bottle & tumbler guide frames volume, insulation and lids.",
          ],
          bullets: [
            "One primary use case, not three",
            "Measure the cup holder for car tumblers",
            "List parts to wash (straw = brush)",
            "Prefer Ships and sold by Amazon when you can",
          ],
        },
      ],
    },
  },
  {
    slug: "volume-capacite-gourde",
    fr: {
      title: "Quelle capacité de gourde ? 350 ml à 1,2 L",
      subtitle:
        "Trop petite = recharges. Trop grande = poids. Repères par usage, avec des exemples de fiches.",
      sections: [
        {
          heading: "1. Le volume est un critère de confort, pas de prestige",
          paragraphs: [
            "Les catalogues mettent en avant 1 L+ comme « journée entière ». En pratique, 1 L d’eau pèse ≈ 1 kg, plus l’inox. Une gourde trop grande reste à la maison ou se vide mal.",
            "Partez de vos points d’eau : bureau avec robinet, salle de sport, randonnée sans source. Le bon volume est celui que vous remplissez vraiment, pas celui du marketing.",
          ],
        },
        {
          heading: "2. Repères par usage",
          paragraphs: [
            "350–400 ml : café, trajet court, sac déjà lourd. 500 ml : défaut urbain (bureau, école, vélo). 700–750 ml : sport / outdoor si vous détestez les allers-retours à la fontaine.",
            "1 L et plus : tumbler bureau / voiture ou randonnée chaude. Mesurez le porte-gobelet et le filet de sac. Un Quencher 1,2 L n’est pas une gourde de randonnée.",
          ],
          bullets: [
            "350–400 ml : café / trajet",
            "500 ml : quotidien sac",
            "700–750 ml : sport",
            "1 L+ : journée sédentaire ou sans point d’eau",
          ],
          productSlugs: ["owala-smoothsip-355", "qwetch-originals-500", "qwetch-active-1l"],
        },
        {
          heading: "3. Poids, goulot, glaçons",
          paragraphs: [
            "Un goulot large facilite glaçons et lavage, mais fuit plus facilement si le bouchon est mal visé. Un goulot étroit verse mieux en marche.",
            "Les tumblers XXL (Stanley, Simple Modern) visent le froid au bureau, pas le gramme près. Pour le trail, un 500–750 ml inox léger (Thermos Ultralight, Super Sparrow) reste plus réaliste.",
          ],
          productSlugs: ["thermos-ultralight-750", "simple-modern-trek-1180", "super-sparrow-500"],
        },
        {
          heading: "4. Enfants, école, avion",
          paragraphs: [
            "À l’école, 350–500 ml + étanchéité battent un litre qui ne rentre pas dans le cartable. Vérifiez le règlement (verre interdit, paille OK ou non).",
            "En cabine, un contenant vide passe ; l’eau se remplit après sécurité. Un format compact évite de se battre avec le filet du siège.",
          ],
          productSlugs: ["owala-smoothsip-355", "amazon-basics-isotherme"],
        },
        {
          heading: "5. Checklist capacité",
          paragraphs: [
            "Notez le nombre de remplissages que vous acceptez par jour, puis choisissez le palier au-dessus — pas deux paliers. Ouvrez la fiche pour la hauteur réelle (tiroir, sac, porte-gobelet).",
            "Si vous hésitez entre 500 et 700 ml, prenez 500 pour le sac et un tumbler séparé pour le bureau plutôt qu’un compromis trop lourd.",
          ],
          bullets: [
            "Compter les points d’eau de votre journée type",
            "Peser mentalement 1 kg si vous visez 1 L",
            "Mesurer hauteur / diamètre avant un XXL",
          ],
        },
      ],
    },
    en: {
      title: "What bottle capacity? 350 ml to 1.2 L",
      subtitle:
        "Too small means refills. Too large means weight. Use-case landmarks with product examples.",
      sections: [
        {
          heading: "1. Capacity is comfort, not prestige",
          paragraphs: [
            "Catalogs push 1 L+ as an “all-day” bottle. In practice, 1 L of water weighs ≈ 1 kg plus the steel. An oversized bottle stays at home or never empties cleanly.",
            "Start from water points: office tap, gym, hike without a spring. The right volume is the one you actually refill — not the marketing number.",
          ],
        },
        {
          heading: "2. Landmarks by use",
          paragraphs: [
            "350–400 ml: coffee, short commute, already-heavy bag. 500 ml: urban default (desk, school, bike). 700–750 ml: sport / outdoor if you hate fountain round-trips.",
            "1 L and up: desk / car tumbler or hot hiking. Measure the cup holder and bag mesh. A 1.2 L Quencher is not a trail bottle.",
          ],
          bullets: [
            "350–400 ml: coffee / commute",
            "500 ml: daily bag",
            "700–750 ml: sport",
            "1 L+: sedentary day or no water point",
          ],
          productSlugs: ["owala-smoothsip-355", "qwetch-originals-500", "qwetch-active-1l"],
        },
        {
          heading: "3. Weight, mouth, ice",
          paragraphs: [
            "A wide mouth helps ice and washing, but leaks more easily if the lid is not seated. A narrow spout pours better on the move.",
            "XXL tumblers (Stanley, Simple Modern) target desk-cold, not grams. For trail use, a light 500–750 ml steel bottle (Thermos Ultralight, Super Sparrow) is more realistic.",
          ],
          productSlugs: ["thermos-ultralight-750", "simple-modern-trek-1180", "super-sparrow-500"],
        },
        {
          heading: "4. Kids, school, flights",
          paragraphs: [
            "At school, 350–500 ml plus a real seal beat a litre that will not fit the backpack. Check the rules (no glass, straw allowed or not).",
            "In cabin, empty bottles go through security; you refill after. A compact size fights less with the seat pocket.",
          ],
          productSlugs: ["owala-smoothsip-355", "amazon-basics-isotherme"],
        },
        {
          heading: "5. Capacity checklist",
          paragraphs: [
            "Count how many refills you accept per day, then pick the next step — not two steps up. Open the sheet for real height (drawer, bag, cup holder).",
            "If you hesitate between 500 and 700 ml, take 500 for the bag and a separate desk tumbler rather than one heavy compromise.",
          ],
          bullets: [
            "Map water points on a typical day",
            "Mentally add 1 kg if you aim for 1 L",
            "Measure height / diameter before an XXL",
          ],
        },
      ],
    },
  },
  {
    slug: "entretien-gourde",
    fr: {
      title: "Entretenir une gourde isotherme : lavage, odeurs, joints",
      subtitle:
        "Inox, paille, bouchon : une routine courte pour éviter le goût de « vieux thermos ».",
      sections: [
        {
          heading: "1. Pourquoi ça sent",
          paragraphs: [
            "L’inox ne « s’imprègne » presque pas ; les odeurs viennent du joint, de la paille et du filet d’eau oublié sous le bouchon. Un séchage incomplet suffit.",
            "Thé, smoothie, lait végétal : rincez le jour même. Plus vous attendez, plus le biofilm s’installe dans les recoins du bouchon.",
          ],
        },
        {
          heading: "2. Routine quotidienne",
          paragraphs: [
            "Démontez bouchon et paille. Eau chaude + liquide vaisselle, brosse goulot et brosse paille. Rincez, séchez à l’air ouvert (bouchon à part).",
            "Lave-vaisselle : seulement si la fiche le dit, souvent le corps oui / le bouchon non. La chaleur déforme les joints. En doute, lavage main.",
          ],
          bullets: [
            "Démontage à chaque lavage profond",
            "Brosse paille si modèle paille",
            "Séchage bouchon séparé",
          ],
          productSlugs: ["qwetch-originals-500", "owala-freesip-710"],
        },
        {
          heading: "3. Détartrage et goût de métal",
          paragraphs: [
            "Un voile blanc = calcaire. Bicarbonate ou vinaigre dilué, trempage court, rinçage abondant. Évitez l’eau de Javel et les pastilles trop agressives sur les joints.",
            "Un goût métallique neuf part souvent après 2–3 cycles. S’il reste, contrôlez le revêtement intérieur (rayures, modèle peint à l’intérieur — à éviter).",
          ],
          productSlugs: ["hydro-flask-710", "amazon-basics-isotherme"],
        },
        {
          heading: "4. Joints, fuites, pièces",
          paragraphs: [
            "Un joint tordu ou mal clipé = fuite dans le sac, pas un « défaut d’isolation ». Vérifiez qu’il est bien assis après chaque lavage.",
            "Les pailles et joints se changent. Notez la marque / le modèle avant d’acheter un lot générique. Un bouchon Stanley n’ira pas sur une Owala.",
          ],
          productSlugs: ["stanley-quencher-12l", "owala-smoothsip-355"],
        },
        {
          heading: "5. Ce qu’il ne faut pas faire",
          paragraphs: [
            "Pas de congélateur (le gel peut déformer), pas de four, pas de javel prolongée. Pas de limonade oubliée 3 jours. Pas de mélange de bouchons entre marques.",
            "Si l’odeur revient malgré un lavage correct, remplacez joint + paille avant de racheter tout le corps. C’est souvent moins cher et plus écologique.",
          ],
          bullets: [
            "Pas de javel / pastilles non prévues",
            "Pas de congélation du contenant plein",
            "Remplacer joint avant de racheter la gourde",
          ],
        },
      ],
    },
    en: {
      title: "Caring for an insulated bottle: wash, smells, gaskets",
      subtitle:
        "Steel, straw, lid: a short routine to avoid that stale thermos taste.",
      sections: [
        {
          heading: "1. Why it smells",
          paragraphs: [
            "Steel barely holds odours; smells come from the gasket, straw and the film of water left under the lid. Incomplete drying is enough.",
            "Tea, smoothie, plant milk: rinse the same day. The longer you wait, the more biofilm sits in lid corners.",
          ],
        },
        {
          heading: "2. Daily routine",
          paragraphs: [
            "Take the lid and straw apart. Hot water + dish soap, mouth brush and straw brush. Rinse, air-dry with the lid off.",
            "Dishwasher: only if the sheet says so — often the body yes / the lid no. Heat warps gaskets. When unsure, hand-wash.",
          ],
          bullets: [
            "Full disassembly for a deep wash",
            "Straw brush on straw models",
            "Dry the lid separately",
          ],
          productSlugs: ["qwetch-originals-500", "owala-freesip-710"],
        },
        {
          heading: "3. Limescale and metal taste",
          paragraphs: [
            "A white film is limescale. Baking soda or diluted vinegar, short soak, thorough rinse. Skip bleach and harsh tablets on gaskets.",
            "A new metallic taste often fades after 2–3 cycles. If it stays, check the interior (scratches, painted insides — avoid those).",
          ],
          productSlugs: ["hydro-flask-710", "amazon-basics-isotherme"],
        },
        {
          heading: "4. Gaskets, leaks, spare parts",
          paragraphs: [
            "A twisted or unclipped gasket leaks in the bag — that is not an insulation failure. Seat it after every wash.",
            "Straws and gaskets are replaceable. Note brand / model before buying a generic pack. A Stanley lid will not fit an Owala.",
          ],
          productSlugs: ["stanley-quencher-12l", "owala-smoothsip-355"],
        },
        {
          heading: "5. What not to do",
          paragraphs: [
            "No freezer (ice can deform), no oven, no long bleach soaks. No lemonade left for three days. No mixing lids across brands.",
            "If the smell returns after a proper wash, replace gasket + straw before buying a whole new body. It is often cheaper and less wasteful.",
          ],
          bullets: [
            "No bleach / unlisted tablets",
            "Do not freeze a full bottle",
            "Replace the gasket before replacing the bottle",
          ],
        },
      ],
    },
  },
  {
    slug: "isolation-froid-chaud",
    fr: {
      title: "Isolation froid / chaud : attentes réalistes",
      subtitle:
        "Double paroi sous vide vs marketing « 24 h » — ce qui tient vraiment café et glaçons.",
      sections: [
        {
          heading: "1. Ce que mesure le labo",
          paragraphs: [
            "Les durées « 24 h froid / 12 h chaud » sont des conditions fermées : peu d’ouvertures, température ambiante stable, bouchon d’origine. Ce n’est pas votre journée en voiture l’été.",
            "L’inox double paroi sous vide reste le meilleur rapport pour gourde / tumbler grand public. Le plastique simple et le verre simple paroi perdent beaucoup plus vite.",
          ],
        },
        {
          heading: "2. Le bouchon compte autant que le corps",
          paragraphs: [
            "La chaleur s’échappe surtout par le haut. Une paille ouverte, un clapet mal fermé ou un joint usé cassent l’isolation même sur une Hydro Flask.",
            "Pour le café : remplissez préchauffé (eau chaude 30 s, vider, remplir). Pour le froid : pré-refroidir, glaçons, limiter les ouvertures.",
          ],
          productSlugs: ["hydro-flask-710", "thermos-ultralight-750"],
        },
        {
          heading: "3. Froid : glaçons et voiture",
          paragraphs: [
            "En voiture au soleil, même un bon tumbler réchauffe. Un Stanley / Owala tient mieux si vous partez de glaçons denses et d’une boisson déjà froide.",
            "Un goulot large aide les glaçons mais augmente les échanges à chaque gorgée. Si le froid est prioritaire, bouchon fermé entre les gorgées.",
          ],
          productSlugs: ["stanley-quencher-12l", "owala-freesip-710", "stanley-flip-straw-1l"],
        },
        {
          heading: "4. Chaud : café, thé, sécurité",
          paragraphs: [
            "Un thermos tient le café buvable plusieurs heures ; « brûlant à 16 h » est rare hors labo. Le thé infusé trop longtemps dans l’inox devient amer — infusez à part.",
            "Ne versez pas d’eau bouillante dans un contenant déjà fissuré. Surveillez les modèles « paint » : une bosse peut casser le vide (perte soudaine d’isolation).",
          ],
          productSlugs: ["qwetch-originals-500", "amazon-basics-isotherme"],
        },
        {
          heading: "5. Comment juger sans croire l’étiquette",
          paragraphs: [
            "Lisez les avis sur la condensation extérieure (signe de vide cassé) et les fuites de bouchon. Une gourde qui sue n’isole plus.",
            "Comparez ensuite volume et usage : un 350 ml café n’a pas besoin des mêmes heures qu’un 1 L bureau. Les prix du jour sont sur les fiches Amazon — pas ici.",
          ],
          bullets: [
            "Préparer (préchaud / préfroid) avant de remplir",
            "Bouchon fermé entre les gorgées si vous visez la durée",
            "Bosse / condensation = vide probablement mort",
          ],
        },
      ],
    },
    en: {
      title: "Hot / cold insulation: realistic expectations",
      subtitle:
        "Vacuum double wall vs “24 h” marketing — what actually holds coffee and ice.",
      sections: [
        {
          heading: "1. What the lab measures",
          paragraphs: [
            "“24 h cold / 12 h hot” figures are closed conditions: few openings, stable room temperature, stock lid. That is not a summer car day.",
            "Vacuum double-wall steel remains the best mainstream bottle / tumbler bet. Single-wall plastic and glass lose heat or cold much faster.",
          ],
        },
        {
          heading: "2. The lid matters as much as the body",
          paragraphs: [
            "Heat leaves mostly through the top. An open straw, a loose flap or a worn gasket kills insulation even on a Hydro Flask.",
            "For coffee: preheat (hot water 30 s, dump, fill). For cold: pre-chill, ice, fewer openings.",
          ],
          productSlugs: ["hydro-flask-710", "thermos-ultralight-750"],
        },
        {
          heading: "3. Cold: ice and cars",
          paragraphs: [
            "In a sunny car, even a good tumbler warms up. Stanley / Owala hold better if you start with dense ice and a drink already cold.",
            "A wide mouth helps ice but increases exchange on every sip. If cold is the priority, close the lid between sips.",
          ],
          productSlugs: ["stanley-quencher-12l", "owala-freesip-710", "stanley-flip-straw-1l"],
        },
        {
          heading: "4. Hot: coffee, tea, safety",
          paragraphs: [
            "A thermos keeps coffee drinkable for hours; “still scalding at 4 pm” is rare outside the lab. Tea left steeping in steel turns bitter — brew separately.",
            "Do not pour boiling water into a cracked vessel. Watch painted models: a dent can break the vacuum (sudden insulation loss).",
          ],
          productSlugs: ["qwetch-originals-500", "amazon-basics-isotherme"],
        },
        {
          heading: "5. How to judge without trusting the label",
          paragraphs: [
            "Read reviews about exterior condensation (dead vacuum) and lid leaks. A sweating bottle is no longer insulating.",
            "Then match volume to use: a 350 ml coffee cup does not need the same hours as a 1 L desk tumbler. Live prices sit on Amazon listings — not here.",
          ],
          bullets: [
            "Preheat / pre-chill before filling",
            "Close the lid between sips if duration matters",
            "Dent / condensation ≈ likely dead vacuum",
          ],
        },
      ],
    },
  },
];
