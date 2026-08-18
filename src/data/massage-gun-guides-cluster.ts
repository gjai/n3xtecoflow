import type { GuideArticle } from "./articles";

const CREDIT = "Le pistolet de massage (IA)";
const CREDIT_URL = "https://massage-gun.fr";

const cover = (src: string) => ({
  src,
  credit: CREDIT,
  creditUrl: CREDIT_URL,
});

export const massageGunClusterCovers: Record<
  string,
  { src: string; credit: string; creditUrl: string }
> = {
  "amplitude-force-pistolet": cover("/images/massage-gun/pistolets.jpg"),
  "mini-vs-plein-format": cover("/images/massage-gun/comparatifs.jpg"),
  "pistolet-massage-nuque-bureau": cover("/images/massage-gun/hero.jpg"),
  "entretien-pistolet-massage": cover("/images/massage-gun/guides.jpg"),
};

export const massageGunClusterGuides: GuideArticle[] = [
  {
    slug: "amplitude-force-pistolet",
    fr: {
      title: "Amplitude et stall force : ce qui change vraiment",
      subtitle:
        "Millimètres vs marketing, résistance du moteur, bruit — pour choisir sans surpayer.",
      sections: [
        {
          heading: "1. Amplitude ≠ « puissance ressentie »",
          paragraphs: [
            "L’amplitude (mm) est la course de la tête. 16 mm (Theragun Elite / Pro, certains Hypervolt) vise le tissu plus profond. 8–10 mm suffit au confort quotidien et aux mollets fatigués.",
            "Un chiffre élevé sans contrôle = plus de bruit, plus de fatigue du poignet, et parfois un stall dès que vous appuyez. Ce n’est pas un substitut médical : douleur aiguë, consultez.",
          ],
          bullets: [
            "8–10 mm : quotidien / bureau",
            "12–16 mm : sport dense, cuisses, dos",
            "Au-delà du chiffre : stall force + ergonomie",
          ],
        },
        {
          heading: "2. Stall force : le critère oublié",
          paragraphs: [
            "La stall force est la pression avant que le moteur s’arrête. Un pistolet qui cale dès que vous le plaquez sur le quadriceps est frustrant, même à 16 mm sur la fiche.",
            "Les modèles premium (Theragun, Hypervolt 2 Pro) tiennent mieux sous charge. Les entrées de gamme (TOLOCO, AERLANG, Renpho) restent utiles si vous ne « forcez » pas comme un kiné.",
          ],
          productSlugs: ["theragun-elite", "hypervolt-2-pro", "renpho-extend"],
        },
        {
          heading: "3. Bruit, chaleur, embouts",
          paragraphs: [
            "Le moteur brushless premium est plus supportable en open-space. Un modèle bruyant finira au placard si vous habitez en appartement.",
            "Les embouts changent plus la sensation que 2 mm d’amplitude. Fourche pour le rachis (sans insister sur les vertèbres), balle pour les mollets, coussin pour les zones sensibles. La chaleur (AERLANG, certains Brelley) aide les tensions chroniques, pas un claquage aigu.",
          ],
          productSlugs: ["aerlang-massage-gun", "opove-m3-pro", "toloco-massage-gun"],
        },
        {
          heading: "4. Qui a vraiment besoin de 16 mm ?",
          paragraphs: [
            "Sport intensif, masse musculaire importante, habitude du percussion : le haut de gamme a un sens. Bureau, nuque, récup légère : un mini ou un Renpho Active évite de payer une amplitude que vous n’oserez pas utiliser.",
            "Si vous visez surtout la nuque, lisez aussi le guide mini vs plein format et le guide nuque / bureau : un masseur cervical est souvent plus adapté qu’un 16 mm.",
          ],
          productSlugs: ["theragun-pro", "renpho-active", "bob-brad-t2"],
        },
        {
          heading: "5. Checklist avant d’acheter",
          paragraphs: [
            "Notez zones, bruit acceptable, et si vous voyagez. Puis croisez amplitude, stall, embouts et vendeur Amazon. Les prix bougent : ouvrez la fiche du jour.",
            "Ce n’est pas un avis médical. Évitez les os, la gorge, les varices, la grossesse sans avis pro. 2 minutes par zone, pression progressive.",
          ],
          bullets: [
            "Usage sport vs bureau noté",
            "Bruit : testez les avis « appartement »",
            "Embouts inclus listés",
            "Préférer Expédié et vendu par Amazon quand c’est possible",
          ],
        },
      ],
    },
    en: {
      title: "Amplitude and stall force: what actually changes",
      subtitle:
        "Millimetres vs marketing, motor stall, noise — so you do not overpay.",
      sections: [
        {
          heading: "1. Amplitude ≠ “felt power”",
          paragraphs: [
            "Amplitude (mm) is how far the head travels. 16 mm (Theragun Elite / Pro, some Hypervolt) targets deeper tissue. 8–10 mm is enough for daily comfort and tired calves.",
            "A high number without control means more noise, more wrist fatigue, and sometimes stall as soon as you lean in. This is not medical care: see a pro for acute pain.",
          ],
          bullets: [
            "8–10 mm: daily / desk",
            "12–16 mm: dense sport, thighs, back",
            "Beyond the number: stall force + ergonomics",
          ],
        },
        {
          heading: "2. Stall force: the forgotten spec",
          paragraphs: [
            "Stall force is the pressure before the motor stops. A gun that dies on the quads is frustrating even at a marketed 16 mm.",
            "Premium models (Theragun, Hypervolt 2 Pro) hold up better under load. Entry models (TOLOCO, AERLANG, Renpho) still help if you do not press like a physio.",
          ],
          productSlugs: ["theragun-elite", "hypervolt-2-pro", "renpho-extend"],
        },
        {
          heading: "3. Noise, heat, heads",
          paragraphs: [
            "Premium brushless motors are more office-friendly. A loud gun ends in a cupboard if you live in a flat.",
            "Heads change feel more than 2 mm of amplitude. Fork for either side of the spine (do not jam vertebrae), ball for calves, cushion for tender spots. Heat (AERLANG, some Brelley) helps chronic tension, not an acute tear.",
          ],
          productSlugs: ["aerlang-massage-gun", "opove-m3-pro", "toloco-massage-gun"],
        },
        {
          heading: "4. Who actually needs 16 mm?",
          paragraphs: [
            "Heavy sport, larger muscle mass, percussion habit: high-end makes sense. Desk, neck, light recovery: a mini or Renpho Active avoids paying for amplitude you will not dare use.",
            "If the neck is the main target, also read mini vs full-size and the neck / desk guide: a cervical massager often fits better than 16 mm.",
          ],
          productSlugs: ["theragun-pro", "renpho-active", "bob-brad-t2"],
        },
        {
          heading: "5. Pre-buy checklist",
          paragraphs: [
            "Note zones, acceptable noise, and travel. Then cross-check amplitude, stall, heads and Amazon seller. Prices move: open today’s listing.",
            "Not medical advice. Avoid bone, throat, varicose veins, pregnancy without a clinician. About two minutes per area, progressive pressure.",
          ],
          bullets: [
            "Sport vs desk use written down",
            "Noise: read “apartment” reviews",
            "Included heads listed",
            "Prefer Ships and sold by Amazon when you can",
          ],
        },
      ],
    },
  },
  {
    slug: "mini-vs-plein-format",
    fr: {
      title: "Pistolet mini vs plein format : lequel emporter ?",
      subtitle:
        "Poids, autonomie, profondeur — voyage, sport et bureau, avec des exemples de fiches.",
      sections: [
        {
          heading: "1. Le mini n’est pas un « Theragun au rabais »",
          paragraphs: [
            "Un mini (Theragun Mini, certains Renpho / TOLOCO compact) privilégie le sac et le bureau. Moins d’amplitude, moins d’autonomie, mais vous l’utilisez vraiment.",
            "Le plein format tient la stall force et les séances plus longues. Il pèse et bruite plus. Beaucoup de gens achètent un Pro… puis prennent le mini en déplacement.",
          ],
        },
        {
          heading: "2. Voyage et bureau",
          paragraphs: [
            "Cabine, open-space, tiroir de bureau : visez < 500 g, USB-C, bruit raisonnable. Le Theragun Mini et les masseurs cervicaux Brelley rentrent dans cette case.",
            "Un plein format dans un bagage cabine est possible, mais vous le laisserez à l’hôtel. Si 80 % de votre usage est « 10 minutes après l’écran », le mini gagne.",
          ],
          productSlugs: ["theragun-mini", "renpho-active", "brelley-masseur-cervical"],
        },
        {
          heading: "3. Sport et séances longues",
          paragraphs: [
            "Cuisses, fessiers, dos après une sortie longue : le plein format (Elite, Pro, Hypervolt 2 Pro, Renpho Extend) évite de « picorer » trop longtemps avec un mini trop faible.",
            "L’autonomie compte : une batterie USB-C ou amovible vaut mieux qu’un câble propriétaire. Bob & Brad T2 et OPOVE M3 Pro visent ce rapport usage / prix.",
          ],
          productSlugs: [
            "theragun-elite",
            "hypervolt-2-pro",
            "renpho-extend",
            "bob-brad-t2",
          ],
        },
        {
          heading: "4. Le troisième format : masseur cervical",
          paragraphs: [
            "Pour la nuque, un pistolet à percussion demande de l’adresse (angle, pas d’os). Un collier / coussin shiatsu enveloppe mieux trapèzes et cervicales.",
            "Ce n’est pas le même outil : le cervical ne remplace pas un pistolet sur les mollets. Voir le guide nuque / bureau si c’est votre douleur n°1.",
          ],
          productSlugs: ["masseur-cervical-bionique", "brelley-coussin-shiatsu"],
        },
        {
          heading: "5. Checklist format",
          paragraphs: [
            "Comptez les jours de voyage par mois et le bruit acceptable. Un seul usage dominant suffit à trancher. Les prix sont sur Amazon, pas sur cette page.",
            "Si le budget le permet, mini (quotidien) + un modèle milieu de gamme sport est plus utile qu’un seul flagship oublié.",
          ],
          bullets: [
            "Voyage fréquent → mini",
            "Sport dense à la maison → plein format",
            "Nuque / épaules bureau → masseur cervical en plus ou à la place",
          ],
        },
      ],
    },
    en: {
      title: "Mini vs full-size massage gun: which to pack?",
      subtitle:
        "Weight, battery, depth — travel, sport and desk, with product examples.",
      sections: [
        {
          heading: "1. A mini is not a “cheap Theragun”",
          paragraphs: [
            "A mini (Theragun Mini, some compact Renpho / TOLOCO) is for bags and desks. Less amplitude, less runtime, but you actually use it.",
            "Full-size holds stall force and longer sessions. It is heavier and louder. Plenty of people buy a Pro… then take the mini on trips.",
          ],
        },
        {
          heading: "2. Travel and desk",
          paragraphs: [
            "Cabin bag, open-plan office, desk drawer: aim under 500 g, USB-C, reasonable noise. Theragun Mini and Brelley neck massagers fit that box.",
            "A full-size gun can fly, but it will stay in the hotel. If 80 % of your use is “10 minutes after the screen”, the mini wins.",
          ],
          productSlugs: ["theragun-mini", "renpho-active", "brelley-masseur-cervical"],
        },
        {
          heading: "3. Sport and longer sessions",
          paragraphs: [
            "Thighs, glutes, back after a long ride: full-size (Elite, Pro, Hypervolt 2 Pro, Renpho Extend) beats pecking away with an underpowered mini.",
            "Battery matters: USB-C or swappable beats a proprietary cable. Bob & Brad T2 and OPOVE M3 Pro sit in that use / price band.",
          ],
          productSlugs: [
            "theragun-elite",
            "hypervolt-2-pro",
            "renpho-extend",
            "bob-brad-t2",
          ],
        },
        {
          heading: "4. The third format: neck massager",
          paragraphs: [
            "On the neck, a percussion gun needs care (angle, not on bone). A collar / shiatsu cushion wraps traps and cervicals better.",
            "It is not the same tool: a neck massager does not replace a gun on the calves. See the neck / desk guide if that is pain #1.",
          ],
          productSlugs: ["masseur-cervical-bionique", "brelley-coussin-shiatsu"],
        },
        {
          heading: "5. Format checklist",
          paragraphs: [
            "Count travel days per month and acceptable noise. One dominant use is enough to decide. Prices live on Amazon, not on this page.",
            "If budget allows, a daily mini plus a mid-range sport gun beats one forgotten flagship.",
          ],
          bullets: [
            "Frequent travel → mini",
            "Dense home sport → full-size",
            "Desk neck / shoulders → cervical massager as well or instead",
          ],
        },
      ],
    },
  },
  {
    slug: "pistolet-massage-nuque-bureau",
    fr: {
      title: "Nuque et bureau : pistolet ou masseur cervical ?",
      subtitle:
        "Écran, trapèzes, précautions — ce qui aide vraiment après une journée assise.",
      sections: [
        {
          heading: "1. Le pistolet n’est pas idéal partout",
          paragraphs: [
            "Sur la nuque, les os sont proches. Un percussion trop appuyé irrite plus qu’il ne relâche. Restez sur les muscles (trapèzes, haut du dos), jamais sur la colonne ni la gorge.",
            "Après l’écran, 5–8 minutes suffisent. Plus long n’est pas « plus efficace ». Douleur qui irradie, vertiges, antécédents cervicaux : voyez un pro avant tout gadget.",
          ],
        },
        {
          heading: "2. Mini silencieux au bureau",
          paragraphs: [
            "Un Theragun Mini ou un Renpho Active passe mieux en open-space qu’un Pro. Embout coussin, vitesse basse, pas de démonstration sur les collègues.",
            "Le bruit reste le critère n°1 au bureau. Lisez les avis « apartment / office ». Un modèle discount très sonore finira dans le tiroir.",
          ],
          productSlugs: ["theragun-mini", "renpho-active", "toloco-massage-gun"],
        },
        {
          heading: "3. Masseur cervical et shiatsu",
          paragraphs: [
            "Un collier (Brelley, masseur bionique) enveloppe trapèzes et cervicales sans que vous teniez un manche. Le coussin shiatsu va sur le canapé / le dossier.",
            "La chaleur aide les tensions chroniques de bureau. Ce n’est pas un diagnostic : si la douleur est aiguë ou neurologique, arrêtez.",
          ],
          productSlugs: [
            "brelley-masseur-cervical",
            "masseur-cervical-bionique",
            "brelley-coussin-shiatsu",
          ],
        },
        {
          heading: "4. Posture avant le gadget",
          paragraphs: [
            "Écran à hauteur des yeux, pauses 20–20–20, épaules basses. Un pistolet ne corrige pas un laptop trop bas 9 h par jour.",
            "Alternez : marche, étirements doux, puis 2 minutes de percussion sur les trapèzes. Le gadget est le complément, pas le plan entier.",
          ],
        },
        {
          heading: "5. Checklist nuque / bureau",
          paragraphs: [
            "Si votre douleur est surtout cervicale → masseur / coussin en premier. Si ce sont les mollets et le dos sport → pistolet, et un mini pour le bureau.",
            "Pas d’avis médical ici. Prix du jour sur les fiches Amazon. Préférez un vendeur Amazon quand c’est possible.",
          ],
          bullets: [
            "Jamais sur les vertèbres / la gorge",
            "Vitesse basse, embout doux",
            "Chaleur OK sur tension chronique, pas sur inflammation aiguë",
          ],
        },
      ],
    },
    en: {
      title: "Neck and desk: massage gun or cervical massager?",
      subtitle:
        "Screens, traps, cautions — what actually helps after a sitting day.",
      sections: [
        {
          heading: "1. A gun is not ideal everywhere",
          paragraphs: [
            "On the neck, bone is close. Percussion pressed too hard irritates more than it releases. Stay on muscle (traps, upper back), never on the spine or throat.",
            "After screen time, 5–8 minutes is enough. Longer is not “more effective”. Radiating pain, dizziness, cervical history: see a pro before any gadget.",
          ],
        },
        {
          heading: "2. Quiet minis at the desk",
          paragraphs: [
            "A Theragun Mini or Renpho Active fits open-plan better than a Pro. Cushion head, low speed, no demo on colleagues.",
            "Noise is criterion #1 at work. Read “apartment / office” reviews. A loud bargain gun ends in the drawer.",
          ],
          productSlugs: ["theragun-mini", "renpho-active", "toloco-massage-gun"],
        },
        {
          heading: "3. Cervical and shiatsu massagers",
          paragraphs: [
            "A collar (Brelley, bionic neck massager) wraps traps and cervicals without holding a handle. A shiatsu cushion sits on the sofa / chair back.",
            "Heat helps chronic desk tension. This is not a diagnosis: stop if pain is acute or neurological.",
          ],
          productSlugs: [
            "brelley-masseur-cervical",
            "masseur-cervical-bionique",
            "brelley-coussin-shiatsu",
          ],
        },
        {
          heading: "4. Posture before the gadget",
          paragraphs: [
            "Screen at eye height, 20–20–20 breaks, shoulders down. A gun does not fix a laptop that is too low for 9 hours.",
            "Rotate: walk, gentle stretches, then two minutes of percussion on the traps. The gadget is the extra, not the whole plan.",
          ],
        },
        {
          heading: "5. Neck / desk checklist",
          paragraphs: [
            "If pain is mostly cervical → massager / cushion first. If it is sport calves and back → gun, plus a mini for the desk.",
            "Not medical advice. Live prices on Amazon sheets. Prefer an Amazon seller when you can.",
          ],
          bullets: [
            "Never on vertebrae / throat",
            "Low speed, soft head",
            "Heat OK on chronic tension, not on acute inflammation",
          ],
        },
      ],
    },
  },
  {
    slug: "entretien-pistolet-massage",
    fr: {
      title: "Entretenir un pistolet de massage : batterie, têtes, hygiène",
      subtitle:
        "Ce qui use le moteur, comment laver les embouts, et quand arrêter de l’utiliser.",
      sections: [
        {
          heading: "1. Batterie et charge",
          paragraphs: [
            "Lithium : évitez 0 % chronique et la chaleur (voiture, radiateur). USB-C simplifie le voyage ; une batterie amovible se change, un bloc collé non.",
            "Rangez à charge partielle si vous ne l’utilisez pas un mois. Un câble propriétaire perdu = pistolet mort — gardez le câble d’origine.",
          ],
          productSlugs: ["theragun-mini", "hypervolt-2-pro"],
        },
        {
          heading: "2. Embouts et hygiène",
          paragraphs: [
            "Les têtes en mousse / silicone prennent la crème et la sueur. Essuyez après chaque séance. Lavage doux, séchage complet avant de reclipser.",
            "Ne passez pas le corps du pistolet sous l’eau. Un modèle « sport » n’est pas étanche sauf mention contraire sur la fiche.",
          ],
          productSlugs: ["aerlang-massage-gun", "toloco-massage-gun", "renpho-extend"],
        },
        {
          heading: "3. Moteur, stall, chute",
          paragraphs: [
            "Forcer jusqu’au stall en continu use le moteur, surtout en entrée de gamme. Si ça cale, allégez la pression ou changez d’embout.",
            "Une chute sur le carter peut fausser l’axe : vibration bizarre, bruit neuf = arrêtez. Le SAV Amazon dépend du vendeur (d’où Expédié par Amazon).",
          ],
          productSlugs: ["opove-m3-pro", "bob-brad-t2"],
        },
        {
          heading: "4. Masseurs cervicaux et coussins",
          paragraphs: [
            "Housse amovible si possible. La chaleur + transpiration = odeur. Aérez après usage. Ne pliez pas les câbles à chaud.",
            "Un collier n’est pas un jouet enfant. Temps limité, pas d’endormissement avec l’appareil allumé.",
          ],
          productSlugs: ["brelley-masseur-cervical", "brelley-coussin-shiatsu"],
        },
        {
          heading: "5. Quand ne plus l’utiliser",
          paragraphs: [
            "Inflammation aiguë, plaie, thrombose, grossesse (sauf avis), zone osseuse douloureuse. Le guide d’achat complet rappelle aussi l’amplitude et les formats.",
            "Entretien ≠ réparation. Si le pistolet chauffe anormalement ou sent le brûlé, débranchez. Les pièces détachées se commandent selon la marque — notez le modèle.",
          ],
          bullets: [
            "Pas d’eau sur le moteur",
            "Pas de stall prolongé",
            "Pas d’usage médical improvisé",
          ],
        },
      ],
    },
    en: {
      title: "Caring for a massage gun: battery, heads, hygiene",
      subtitle:
        "What wears the motor, how to wash heads, and when to stop using it.",
      sections: [
        {
          heading: "1. Battery and charging",
          paragraphs: [
            "Lithium: avoid chronic 0 % and heat (car, radiator). USB-C helps travel; a swappable pack can be replaced, a glued brick cannot.",
            "Store at a partial charge if you will not use it for a month. A lost proprietary cable kills the gun — keep the original.",
          ],
          productSlugs: ["theragun-mini", "hypervolt-2-pro"],
        },
        {
          heading: "2. Heads and hygiene",
          paragraphs: [
            "Foam / silicone heads pick up cream and sweat. Wipe after each session. Gentle wash, fully dry before clipping back.",
            "Do not run the gun body under water. A “sport” model is not waterproof unless the sheet says so.",
          ],
          productSlugs: ["aerlang-massage-gun", "toloco-massage-gun", "renpho-extend"],
        },
        {
          heading: "3. Motor, stall, drops",
          paragraphs: [
            "Holding stall continuously wears the motor, especially on entry models. If it stalls, ease off or change head.",
            "A drop can bend the shaft: new rattle, odd vibration = stop. Amazon after-sales depends on the seller (hence Ships by Amazon).",
          ],
          productSlugs: ["opove-m3-pro", "bob-brad-t2"],
        },
        {
          heading: "4. Neck massagers and cushions",
          paragraphs: [
            "Removable cover if you can. Heat + sweat = smell. Air out after use. Do not kink cables while hot.",
            "A collar is not a kids’ toy. Limited time, do not fall asleep with it on.",
          ],
          productSlugs: ["brelley-masseur-cervical", "brelley-coussin-shiatsu"],
        },
        {
          heading: "5. When to stop using it",
          paragraphs: [
            "Acute inflammation, wound, thrombosis, pregnancy (unless advised), painful bony spots. The complete buying guide also covers amplitude and formats.",
            "Care ≠ repair. If the gun overheats or smells burnt, unplug. Spare parts depend on the brand — note the model.",
          ],
          bullets: [
            "No water on the motor",
            "No prolonged stall",
            "No improvised medical use",
          ],
        },
      ],
    },
  },
];
