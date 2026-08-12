import type { GuideArticle } from "./articles";

/**
 * Guides longs « La gourde isotherme » — contenu éditorial bilingue.
 * Pas de prix inventés : oriente vers Amazon.fr du jour.
 */
export const tumblerGuides: GuideArticle[] = [
  {
    slug: "choisir-gourde-isotherme",
    fr: {
      title: "Guide d’achat : choisir une gourde isotherme",
      subtitle:
        "Volume, isolation, bouchon, entretien : la méthode pour ne pas se tromper.",
      sections: [
        {
          heading: "1. Partez de l’usage, pas de la marque",
          paragraphs: [
            "Une bonne gourde isotherme répond à un usage précis : sport, bureau, école, voyage, ou mix quotidien. La marque vient ensuite.",
            "Notez où vous la transportez (sac, porte-gobelet voiture, poche), combien d’heures vous voulez garder le froid ou le chaud, et si vous acceptez une paille / un goulot large.",
          ],
          bullets: [
            "Sport / salle : 500–750 ml, bouchon sport, prise en main ferme",
            "Bureau : 500–700 ml, ouverture simple, peu de bruit",
            "École / enfants : 350–500 ml, étanchéité prioritaire",
            "Randonnée / journée longue : 750 ml–1 L",
          ],
        },
        {
          heading: "2. Capacité : le critère le plus sous-estimé",
          paragraphs: [
            "Trop petite = recharges fréquentes. Trop grande = lourdeur dès qu’elle est remplie (1 L d’eau ≈ 1 kg, plus le contenant).",
            "En pratique, 500 ml couvre la plupart des journées urbaines. Passez à 750 ml si vous détestez les allers-retours à la fontaine, ou si vous partez en outdoor.",
          ],
        },
        {
          heading: "3. Isolation : ce qu’il faut vraiment attendre",
          paragraphs: [
            "L’inox double paroi sous vide conserve mieux que le plastique simple. Les chiffres marketing (« 24 h froid / 12 h chaud ») sont des conditions labo : bouchon fermé, peu d’ouvertures, température ambiante stable.",
            "En usage réel, chaque ouverture, chaque trajet en voiture chaude, et un bouchon mal isolé réduisent les performances. Visez une isolation « crédible » plutôt qu’un record théorique.",
          ],
        },
        {
          heading: "4. Bouchon, paille, fuite",
          paragraphs: [
            "Le bouchon fait autant la qualité perçue que le corps inox. Un joint usé ou mal remis = fuite dans le sac.",
            "Paille : pratique en voiture / bureau, plus de pièces à laver. Bouchon sport / goulot : plus simple à entretenir. Testez mentalement votre routine de lavage avant d’acheter un système complexe.",
          ],
        },
        {
          heading: "5. Matières et santé d’usage",
          paragraphs: [
            "Privilégiez l’inox 18/8 (304) sans BPA sur les pièces plastiques en contact. Évitez les finitions qui s’écaillent vite si vous jetez la gourde dans un sac avec des clés.",
            "Les peintures mates et textures « powder coat » sont agréables mais s’abîment au frottement. Ce n’est pas un défaut de sécurité, juste d’esthétique.",
          ],
        },
        {
          heading: "6. Entretien dès l’achat",
          paragraphs: [
            "Si vous ne voulez pas démonter trois joints chaque semaine, choisissez un bouchon simple. Les odeurs viennent surtout des joints, de la paille et des boissons sucrées laissées trop longtemps.",
            "Lave-vaisselle : beaucoup de fabricants le déconseillent pour le corps (ou le bouchon). En cas de doute, lavage main + brosse longue.",
          ],
        },
        {
          heading: "7. Achat Amazon : ce qu’il faut vérifier",
          paragraphs: [
            "Sur Amazon.fr, préférez « Expédié et vendu par Amazon » quand c’est possible : retours plus simples, stock plus stable.",
            "Lisez les avis récents sur les fuites et le goût métallique. Les photos packshot ne montrent pas l’étanchéité réelle. Le prix change vite : ouvrez la fiche du jour plutôt que de mémoriser un montant.",
          ],
        },
        {
          heading: "8. Checklist avant de commander",
          paragraphs: [
            "Volume adapté, type de bouchon compatible avec votre routine, isolation crédible, entretien acceptable, vendeur fiable.",
            "Ensuite seulement : couleur, marque lifestyle, accessoires (housses, brosses, bouchons de rechange).",
          ],
          bullets: [
            "Usage principal noté",
            "Volume choisi (ml)",
            "Paille oui/non",
            "Lavage : simple ou multi-pièces",
            "Vendeur Amazon vérifié",
          ],
        },
      ],
    },
    en: {
      title: "Buying guide: choosing an insulated bottle",
      subtitle:
        "Capacity, insulation, lid, care: a clear method to avoid a bad buy.",
      sections: [
        {
          heading: "1. Start from use, not brand",
          paragraphs: [
            "A good insulated bottle matches a real use case: sport, desk, school, travel, or mixed daily life. Brand comes second.",
            "Note where you carry it (bag, cup holder, pocket), how long you need hot/cold retention, and whether you accept a straw or wide mouth.",
          ],
          bullets: [
            "Gym: 500–750 ml, sport lid, firm grip",
            "Office: 500–700 ml, quiet simple opening",
            "School/kids: 350–500 ml, leak-proof first",
            "Hiking/long day: 750 ml–1 L",
          ],
        },
        {
          heading: "2. Capacity is underestimated",
          paragraphs: [
            "Too small means constant refills. Too large gets heavy when full (1 L of water ≈ 1 kg plus the bottle).",
            "In practice, 500 ml covers most urban days. Move to 750 ml if you hate fountain trips or go outdoors longer.",
          ],
        },
        {
          heading: "3. Insulation: realistic expectations",
          paragraphs: [
            "Vacuum double-wall stainless beats single-wall plastic. Marketing claims (“24 h cold / 12 h hot”) are lab conditions: sealed lid, few openings, stable room temperature.",
            "Real life—hot cars, frequent sips, weaker lids—cuts performance. Aim for credible insulation, not a theoretical record.",
          ],
        },
        {
          heading: "4. Lids, straws, leaks",
          paragraphs: [
            "The lid often defines perceived quality as much as the steel body. A worn or badly seated gasket leaks into your bag.",
            "Straws are great in cars/desks but mean more parts to wash. Sport lids/mouthpieces are simpler. Imagine your cleaning routine before buying a complex system.",
          ],
        },
        {
          heading: "5. Materials",
          paragraphs: [
            "Prefer 18/8 (304) stainless and BPA-free plastics on contact parts. Avoid finishes that chip quickly if the bottle shares a bag with keys.",
            "Matte powder coats look premium but scuff; that is cosmetic, not a safety issue.",
          ],
        },
        {
          heading: "6. Care from day one",
          paragraphs: [
            "If you will not dismantle three gaskets weekly, pick a simple lid. Smells usually come from seals, straws, and sugary drinks left too long.",
            "Many brands discourage dishwashers for body and/or lid. When unsure: hand wash + long brush.",
          ],
        },
        {
          heading: "7. Buying on Amazon.fr",
          paragraphs: [
            "Prefer “Ships and sold by Amazon” when available for simpler returns and steadier stock.",
            "Read recent reviews about leaks and metallic taste. Packshots do not prove leak-proofing. Prices move fast—open today’s listing instead of memorizing a number.",
          ],
        },
        {
          heading: "8. Checklist before ordering",
          paragraphs: [
            "Right volume, lid matching your routine, credible insulation, acceptable cleaning, reliable seller—then brand and color.",
          ],
          bullets: [
            "Main use noted",
            "Volume chosen (ml)",
            "Straw yes/no",
            "Cleaning complexity OK",
            "Amazon seller checked",
          ],
        },
      ],
    },
  },
  {
    slug: "gourde-vs-tumbler",
    fr: {
      title: "Gourde vs tumbler : que choisir ?",
      subtitle:
        "Bureau, voiture, sport, voyage : deux formats, deux logiques d’usage.",
      sections: [
        {
          heading: "Deux objets, deux jobs",
          paragraphs: [
            "La gourde (bottle) privilégie le transport fermé : sac, randonnée, sport. Le tumbler / mug isotherme privilégie la boisson à portée de main : bureau, voiture, canapé.",
            "Ce n’est pas seulement une question de look. Le volume, le centre de gravité, le bouchon et la paille changent l’expérience.",
          ],
        },
        {
          heading: "Gourde isotherme : forces et limites",
          paragraphs: [
            "Forces : meilleure étanchéité en général, formats 350 ml–1 L, plus facile à glisser verticalement dans un sac.",
            "Limites : moins agréable à « siroter » longtemps sans dévisser ; certains goulots étroits compliquent le nettoyage et les glaçons.",
          ],
        },
        {
          heading: "Tumbler / mug : forces et limites",
          paragraphs: [
            "Forces : paille ou grande ouverture, volumes XXL (souvent 700 ml–1,2 L), tenue en main / porte-gobelet, usage café ou eau tout au long de la journée.",
            "Limites : plus encombrant, parfois moins étanche si on le couche, plus de pièces (paille, clapet) à laver, plus lourd plein.",
          ],
        },
        {
          heading: "Bureau et télétravail",
          paragraphs: [
            "Au bureau, un tumbler avec paille évite d’ouvrir/fermer sans cesse. Une gourde 500–700 ml reste plus discrète et plus « nomade » entre salles de réunion.",
            "Si vous renversez souvent, la gourde fermée gagne. Si vous buvez en continu devant l’écran, le tumbler gagne.",
          ],
        },
        {
          heading: "Voiture et trajets",
          paragraphs: [
            "Mesurez votre porte-gobelet : beaucoup de tumblers XXL ne rentrent pas. Une gourde fine passe mieux, un tumbler « slim » aussi.",
            "La paille est pratique au volant (avec prudence). Vérifiez l’étanchéité si la bouteille peut basculer sur un siège.",
          ],
        },
        {
          heading: "Sport et outdoor",
          paragraphs: [
            "Pour le sport, la gourde compacte et étanche reste le défaut raisonnable. Les tumblers très hauts sont gênants en sac de sport.",
            "En randonnée, le poids plein compte : un litre « juste au cas où » se paie sur les épaules.",
          ],
        },
        {
          heading: "Entretien comparé",
          paragraphs: [
            "Gourde simple = lavage plus rapide. Tumbler à paille = brosse à paille obligatoire, sinon biofilm et odeurs.",
            "Si vous détestez l’entretien, ne prenez pas le système le plus gadget.",
          ],
        },
        {
          heading: "Verdict pratique",
          paragraphs: [
            "Un seul objet pour tout ? Partez sur une gourde 500–750 ml polyvalente. Besoin café/thé au bureau + gros volume ? Tumbler. Beaucoup de gens finissent avec les deux.",
            "Comparez ensuite les modèles dans notre catalogue et les hubs comparatifs — sans fixer un prix en tête : regardez Amazon.fr le jour J.",
          ],
        },
      ],
    },
    en: {
      title: "Bottle vs tumbler: which should you buy?",
      subtitle:
        "Desk, car, sport, travel: two formats, two use patterns.",
      sections: [
        {
          heading: "Two tools, two jobs",
          paragraphs: [
            "Insulated bottles favor closed carry: bag, hike, gym. Tumblers/mugs favor sip-all-day use: desk, car, sofa.",
            "It is not only aesthetics—volume, balance, lid and straw change the experience.",
          ],
        },
        {
          heading: "Bottle strengths and limits",
          paragraphs: [
            "Strengths: usually better sealing, 350 ml–1 L sizes, easy vertical pack fit.",
            "Limits: less pleasant for constant sipping without unscrewing; narrow mouths can hinder cleaning and ice.",
          ],
        },
        {
          heading: "Tumbler strengths and limits",
          paragraphs: [
            "Strengths: straw or wide opening, XXL volumes (often 700 ml–1.2 L), hand/cup-holder use for coffee or water all day.",
            "Limits: bulkier, sometimes less leak-proof if laid down, more parts to wash, heavier when full.",
          ],
        },
        {
          heading: "Office and remote work",
          paragraphs: [
            "At a desk, a straw tumbler avoids constant open/close. A 500–700 ml bottle stays quieter and more mobile between meetings.",
            "If you tip things over, a sealed bottle wins. If you sip continuously on screen, a tumbler wins.",
          ],
        },
        {
          heading: "Car and commute",
          paragraphs: [
            "Measure your cup holder—many XXL tumblers do not fit. Slim bottles/tumblers fare better.",
            "Straws help while driving (carefully). Check sealing if the bottle can tip on a seat.",
          ],
        },
        {
          heading: "Sport and outdoors",
          paragraphs: [
            "For sport, a compact leak-proof bottle is the sensible default. Tall tumblers annoy in gym bags.",
            "On hikes, full weight matters: an “just in case” litre costs shoulder comfort.",
          ],
        },
        {
          heading: "Cleaning compared",
          paragraphs: [
            "Simple bottles wash faster. Straw tumblers need a straw brush or you get biofilm and smells.",
            "If you hate cleaning, skip the most complex lid system.",
          ],
        },
        {
          heading: "Practical verdict",
          paragraphs: [
            "One vessel for everything? Start with a versatile 500–750 ml bottle. Desk coffee + big volume? Tumbler. Many people end up with both.",
            "Then compare models in our catalog—check live Amazon.fr pricing instead of memorizing a number.",
          ],
        },
      ],
    },
  },
  {
    slug: "entretien-gourde",
    fr: {
      title: "Entretenir une gourde ou un tumbler inox",
      subtitle:
        "Odeurs, joints, paille, lave-vaisselle : les gestes qui allongent la durée de vie.",
      sections: [
        {
          heading: "Pourquoi ça sent mauvais",
          paragraphs: [
            "L’inox lui-même retient peu les odeurs. Ce sont les joints, pailles, clapets et résidus sucrés qui fermentent.",
            "Un rinçage rapide ne suffit pas si le liquide a séjourné une nuit. Démontez ce qui se démonte.",
          ],
        },
        {
          heading: "Routine quotidienne (2 minutes)",
          paragraphs: [
            "Videz, rincez à l’eau chaude, laissez sécher ouvert. Une fois par jour suffit pour l’eau plate.",
            "Café, thé, protéines, jus : lavez le soir avec liquide vaisselle et brosse longue. La paille a sa propre brosse.",
          ],
        },
        {
          heading: "Nettoyage en profondeur (hebdo)",
          paragraphs: [
            "Bicarbonate + eau chaude, ou pastilles nettoyantes spécial gourdes, ou vinaigre blanc dilué selon tolérance d’odeur.",
            "Insistez sur le filetage du col et le dessous du bouchon. C’est là que le biofilm s’installe.",
          ],
        },
        {
          heading: "Lave-vaisselle : oui ou non ?",
          paragraphs: [
            "Beaucoup de notices le déconseillent pour le corps (chocs thermiques, peinture) ou pour le bouchon (joints).",
            "Si vous passez en machine : panier haut, programme pas trop agressif, et vérifiez l’état des joints après quelques cycles.",
          ],
        },
        {
          heading: "Taches et goût métallique",
          paragraphs: [
            "Des traces blanches viennent souvent du calcaire : rinçage vinaigre doux puis eau claire.",
            "Un goût métallique neuf disparaît souvent après 2–3 lavages. S’il persiste, contactez le vendeur — parfois un défaut de finition interne.",
          ],
        },
        {
          heading: "Joints et pièces détachées",
          paragraphs: [
            "Un joint craquelé = fuite. Beaucoup de marques vendent des kits de rechange. Notez le modèle avant qu’il soit discontinué.",
            "Pailles plastiques : remplacez-les dès qu’elles se voilent ou se rayent profondément.",
          ],
        },
        {
          heading: "Ce qu’il ne faut pas faire",
          paragraphs: [
            "Ne stockez pas de lait / smoothies des jours durant. N’utilisez pas d’eau de Javel concentrée au long cours (agression joints / finitions).",
            "Ne fermez pas hermétique une gourde encore chaude pleine de liquide gazeux ou en fermentation : risque de pression.",
          ],
        },
        {
          heading: "Durée de vie réaliste",
          paragraphs: [
            "Le corps inox dure des années. Ce qui « meurt » : peinture, bouchon, joints. Budgettez un bouchon de rechange plutôt qu’une nouvelle gourde complète.",
            "Si vous hésitez entre deux modèles, choisissez celui dont les pièces détachées restent trouvables.",
          ],
        },
      ],
    },
    en: {
      title: "Caring for a stainless bottle or tumbler",
      subtitle:
        "Smells, seals, straws, dishwasher: habits that extend lifespan.",
      sections: [
        {
          heading: "Why it smells",
          paragraphs: [
            "Stainless itself holds little odor. Seals, straws, flaps and sugary residue ferment.",
            "A quick rinse fails after overnight liquids. Disassemble what can be disassembled.",
          ],
        },
        {
          heading: "Daily routine (2 minutes)",
          paragraphs: [
            "Empty, hot rinse, dry open. Once a day is enough for plain water.",
            "Coffee, tea, protein, juice: wash at night with soap and a long brush. Straws need their own brush.",
          ],
        },
        {
          heading: "Deep clean (weekly)",
          paragraphs: [
            "Baking soda + hot water, bottle cleaning tablets, or diluted white vinegar if you tolerate the smell.",
            "Focus on neck threads and the underside of the lid—biofilm starts there.",
          ],
        },
        {
          heading: "Dishwasher?",
          paragraphs: [
            "Many manuals discourage it for the body (thermal shock, paint) or lid (gaskets).",
            "If you machine-wash: top rack, milder cycle, and inspect seals after a few runs.",
          ],
        },
        {
          heading: "Stains and metallic taste",
          paragraphs: [
            "White marks are often limescale: mild vinegar rinse then clear water.",
            "New metallic taste often fades after 2–3 washes. If it persists, contact the seller—internal finish issues exist.",
          ],
        },
        {
          heading: "Seals and spare parts",
          paragraphs: [
            "Cracked gaskets leak. Many brands sell spare kits—note your model before it is discontinued.",
            "Replace plastic straws when cloudy or deeply scratched.",
          ],
        },
        {
          heading: "What not to do",
          paragraphs: [
            "Do not store milk/smoothies for days. Avoid harsh bleach soaks that attack seals/finishes.",
            "Do not seal a still-hot bottle full of fizzy or fermenting liquid—pressure risk.",
          ],
        },
        {
          heading: "Realistic lifespan",
          paragraphs: [
            "The steel body lasts years. Paint, lids and seals wear out first. Budget a spare lid before a whole new bottle.",
            "When torn between models, prefer the one with available spare parts.",
          ],
        },
      ],
    },
  },
  {
    slug: "isolation-froid-chaud",
    fr: {
      title: "Isolation froid / chaud : ce qui compte vraiment",
      subtitle:
        "Double paroi, vide, bouchon, tests réalistes : démêler le marketing.",
      sections: [
        {
          heading: "Comment marche l’isotherme inox",
          paragraphs: [
            "Deux parois inox et un vide entre les deux limitent la conduction thermique. Le bouchon complète (ou ruine) le système.",
            "Sans vide correct, vous avez juste une bouteille lourde. D’où l’intérêt d’avis récents plutôt que d’une promesse catalogue.",
          ],
        },
        {
          heading: "Froid vs chaud : asymétrie",
          paragraphs: [
            "Garder le froid est souvent plus facile à « sentir » au quotidien (glaçons encore là le soir). Le chaud dépend beaucoup du volume, du remplissage, et surtout du bouchon.",
            "Un café brûlant dans un tumbler ouvert à paille perd vite. Une gourde bien remplie, fermée, tient mieux.",
          ],
        },
        {
          heading: "Ce que les tests labo ne disent pas",
          paragraphs: [
            "Température ambiante fixe, peu d’ouvertures, protocole standardisé : utile pour comparer des fiches, mauvais miroir d’un trajet en voiture à 35 °C.",
            "Ouvrir 20 fois pour boire = reset thermique partiel. Votre usage compte plus que le slide marketing.",
          ],
        },
        {
          heading: "Le rôle du bouchon",
          paragraphs: [
            "Un bouchon plastique peu isolé est un pont thermique. Les systèmes à paille multiplient les fuites de chaleur/froid.",
            "Pour maximiser l’isolation : remplissage haut, bouchon pleinement engagé, moins d’ouvertures.",
          ],
        },
        {
          heading: "Glaçons, préchauffage, prérefroidissement",
          paragraphs: [
            "Rincer à l’eau glacée avant de remplir aide le froid. Eau bouillante de rinçage avant un thé aide le chaud (attention aux brûlures et aux notices).",
            "Les glaçons améliorent le ressenti froid mais réduisent le volume buvable.",
          ],
        },
        {
          heading: "Quand l’isolation ne suffit pas",
          paragraphs: [
            "En canicule ou en montagne, même une bonne gourde a des limites. Prévoyez un plan B (fontaine, glacière) plutôt qu’un modèle « miracle ».",
            "Pour le café de 8h encore brûlant à 16h : attendez-vous à tiède, pas à une bouilloire.",
          ],
        },
        {
          heading: "Comment comparer sans labo",
          paragraphs: [
            "Même protocole maison : même volume d’eau, même température de départ, même nombre d’ouvertures, mesure après 4–6 h.",
            "Lisez les avis qui décrivent un usage proche du vôtre (voiture, bureau, randonnée).",
          ],
        },
        {
          heading: "À retenir",
          paragraphs: [
            "Double paroi vide + bon bouchon + usage réaliste. Méfiez-vous des records sans contexte.",
            "Choisissez d’abord le format (gourde/tumbler) et le volume ; l’isolation fine se départage ensuite entre deux finalistes.",
          ],
        },
      ],
    },
    en: {
      title: "Hot / cold insulation: what really matters",
      subtitle:
        "Double wall, vacuum, lid, realistic tests: cut through marketing.",
      sections: [
        {
          heading: "How stainless insulation works",
          paragraphs: [
            "Two steel walls with vacuum between them limit heat transfer. The lid completes—or ruins—the system.",
            "Without a proper vacuum you just own a heavy bottle. Recent reviews beat brochure promises.",
          ],
        },
        {
          heading: "Cold vs hot asymmetry",
          paragraphs: [
            "Cold retention is easier to feel day to day (ice still there at night). Heat depends heavily on volume, fill level, and especially the lid.",
            "Piping coffee in an open straw tumbler cools fast. A well-filled sealed bottle holds better.",
          ],
        },
        {
          heading: "What lab tests miss",
          paragraphs: [
            "Fixed room temperature, few openings, standard protocol: good for comparing datasheets, poor mirror of a 35°C car commute.",
            "Opening 20 times to drink partially resets thermal performance. Your use pattern matters more than the marketing slide.",
          ],
        },
        {
          heading: "The lid’s role",
          paragraphs: [
            "A poorly insulated plastic lid is a thermal bridge. Straw systems increase heat/cold leakage.",
            "To maximize insulation: fill high, seat the lid fully, open less often.",
          ],
        },
        {
          heading: "Ice, pre-heat, pre-chill",
          paragraphs: [
            "A cold rinse before filling helps cold drinks. A careful hot rinse before tea helps heat (mind burns and manuals).",
            "Ice improves cold feel but reduces drinkable volume.",
          ],
        },
        {
          heading: "When insulation is not enough",
          paragraphs: [
            "In heatwaves or mountains, even good bottles have limits. Plan a backup (fountain, cooler) instead of chasing a miracle model.",
            "For 8am coffee still scalding at 4pm: expect warm, not a kettle.",
          ],
        },
        {
          heading: "Compare without a lab",
          paragraphs: [
            "Same home protocol: same water volume, same start temperature, same openings, measure after 4–6 hours.",
            "Read reviews that match your use (car, desk, hike).",
          ],
        },
        {
          heading: "Takeaways",
          paragraphs: [
            "Vacuum double wall + good lid + realistic use. Be wary of context-free records.",
            "Pick format (bottle/tumbler) and volume first; fine insulation differences come when shortlisting two finalists.",
          ],
        },
      ],
    },
  },
  {
    slug: "premier-achat-gourde",
    fr: {
      title: "Premier achat gourde isotherme : checklist",
      subtitle:
        "Budget, volume, vendeur Amazon, accessoires : éviter les erreurs de débutant.",
      sections: [
        {
          heading: "Ne commencez pas par la marque lifestyle",
          paragraphs: [
            "Hydro Flask, Stanley, Qwetch, Owala, Super Sparrow… les écarts de prix ne mesurent pas toujours l’écart d’usage.",
            "Pour un premier achat, visez un modèle simple, bien noté sur l’étanchéité, avec un volume clair.",
          ],
        },
        {
          heading: "Fixez volume + bouchon avant le budget",
          paragraphs: [
            "500 ml + bouchon simple couvre 80 % des premiers besoins. Ajoutez la paille seulement si vous savez pourquoi.",
            "Le budget suit : entrée de gamme correcte vs premium paint/branding.",
          ],
        },
        {
          heading: "Lire les avis utiles",
          paragraphs: [
            "Filtrez sur les 3 derniers mois. Cherchez « fuite », « odeur », « lave-vaisselle », « porte-gobelet ».",
            "Ignorez les avis d’une ligne « super ». Les photos clients de joints/pailles aident plus que le packshot officiel.",
          ],
        },
        {
          heading: "Amazon.fr : vendeur et offre",
          paragraphs: [
            "Préférez Expédié et vendu par Amazon quand c’est possible. Vérifiez la fiche active (couleur, volume) : les variantes se mélangent dans les avis.",
            "Les prix bougent. Ne mémorisez pas un montant vu dans un article US en dollars : ouvrez la fiche FR du jour.",
          ],
        },
        {
          heading: "Accessoires vraiment utiles",
          paragraphs: [
            "Brosse longue + brosse paille. Éventuellement un bouchon de rechange. Les stickers et housses sont secondaires.",
            "Une seconde gourde « sale / propre » rotation peut valoir plus qu’un modèle ultra premium unique.",
          ],
        },
        {
          heading: "Erreurs fréquentes",
          paragraphs: [
            "Prendre 1,2 L « au cas où » puis ne plus l’emporter. Prendre un tumbler XXL incompatible porte-gobelet. Sous-estimer l’entretien paille.",
            "Acheter uniquement sur une promo US vue en $ sans vérifier la dispo FR.",
          ],
        },
        {
          heading: "Checklist minute",
          paragraphs: ["Cochez avant d’ajouter au panier :"],
          bullets: [
            "Usage principal écrit",
            "Volume en ml choisi",
            "Paille justifiée ou non",
            "Avis récents fuites OK",
            "Vendeur / expédition Amazon.fr OK",
            "Prix du jour ouvert (en €)",
          ],
        },
        {
          heading: "Et après l’achat",
          paragraphs: [
            "Lavez avant la première utilisation. Testez l’étanchéité à l’envers sur l’évier 10 minutes.",
            "Si fuite dès J1 : ouvrez un retour rapidement plutôt que de « vivre avec ».",
          ],
        },
      ],
    },
    en: {
      title: "First insulated bottle purchase: checklist",
      subtitle:
        "Budget, volume, Amazon seller, accessories: skip beginner mistakes.",
      sections: [
        {
          heading: "Do not start with lifestyle branding",
          paragraphs: [
            "Hydro Flask, Stanley, Qwetch, Owala, Super Sparrow… price gaps do not always equal use gaps.",
            "For a first buy, pick a simple model with strong leak reviews and a clear volume.",
          ],
        },
        {
          heading: "Lock volume + lid before budget",
          paragraphs: [
            "500 ml + simple lid covers most first needs. Add a straw only if you know why.",
            "Budget follows: solid entry option vs premium paint/branding.",
          ],
        },
        {
          heading: "Read useful reviews",
          paragraphs: [
            "Filter to the last 3 months. Search “leak”, “smell”, “dishwasher”, “cup holder”.",
            "Ignore one-line “great” reviews. Customer photos of seals/straws beat official packshots.",
          ],
        },
        {
          heading: "Amazon.fr seller and listing",
          paragraphs: [
            "Prefer Ships and sold by Amazon when possible. Check the active variant (color, volume)—reviews mix variants.",
            "Prices move. Do not memorize a US dollar promo: open today’s FR listing in euros.",
          ],
        },
        {
          heading: "Accessories worth buying",
          paragraphs: [
            "Long brush + straw brush. Maybe a spare lid. Stickers/sleeves are secondary.",
            "A second bottle for rotation can beat one ultra-premium vessel.",
          ],
        },
        {
          heading: "Common mistakes",
          paragraphs: [
            "Buying 1.2 L “just in case” then leaving it home. XXL tumbler that misses the cup holder. Underestimating straw cleaning.",
            "Buying from a US $ promo without checking FR availability.",
          ],
        },
        {
          heading: "One-minute checklist",
          paragraphs: ["Tick before checkout:"],
          bullets: [
            "Main use written down",
            "Volume in ml chosen",
            "Straw justified or not",
            "Recent leak reviews OK",
            "Amazon.fr seller/shipping OK",
            "Today’s price open (EUR)",
          ],
        },
        {
          heading: "After purchase",
          paragraphs: [
            "Wash before first use. Leak-test upside down in the sink for 10 minutes.",
            "If it leaks on day one, start a return early instead of living with it.",
          ],
        },
      ],
    },
  },
  {
    slug: "volume-capacite-gourde",
    fr: {
      title: "Quelle capacité de gourde choisir ?",
      subtitle:
        "350 ml à 1,2 L : poids, recharge, usages — le bon volume sans suracheter.",
      sections: [
        {
          heading: "Le poids change tout",
          paragraphs: [
            "L’eau pèse 1 kg / litre. Une gourde 1 L pleine dépasse souvent 1,2–1,4 kg avec le contenant. Beaucoup abandonnent les grands formats pour cette raison seule.",
            "Demandez-vous : est-ce que je préfère recharger, ou porter ?",
          ],
        },
        {
          heading: "350–500 ml",
          paragraphs: [
            "Idéal enfants, sac léger, café court, premier essai isotherme. Moins adapté journée sport complète sans point d’eau.",
          ],
        },
        {
          heading: "500–750 ml",
          paragraphs: [
            "Le sweet spot urbain et bureau. Assez pour une demi-journée, encore portable. C’est le format que nous recommandons le plus souvent en premier achat.",
          ],
        },
        {
          heading: "750 ml–1 L",
          paragraphs: [
            "Outdoor, open space sans fontaine, grosse transpiration. Vérifiez la hauteur dans le sac et la poche latérale.",
          ],
        },
        {
          heading: "Au-delà de 1 L (tumblers XXL)",
          paragraphs: [
            "Utile au bureau ou en voiture si le porte-gobelet suit. Peu pertinent en mobilité piétonne quotidienne.",
            "Attention : plus de volume = plus long à finir = boissons qui tiédissent / réchauffent selon la saison.",
          ],
        },
        {
          heading: "Café vs eau",
          paragraphs: [
            "Pour le café, un format trop grand pousse à boire tiède depuis longtemps. 350–500 ml suffit souvent.",
            "Pour l’eau, le volume suit la disponibilité des fontaines et votre rythme.",
          ],
        },
        {
          heading: "Astuce multi-gourdes",
          paragraphs: [
            "Deux volumes spécialisés battent souvent un seul compromis médiocre : 500 ml mobilité + tumbler bureau, par exemple.",
          ],
        },
        {
          heading: "Décision rapide",
          paragraphs: [
            "Sans signal fort → 500 ml. Beaucoup de sport / pas de fontaine → 750 ml. Bureau fixe + paille → tumbler 700 ml+.",
          ],
        },
      ],
    },
    en: {
      title: "What bottle capacity should you pick?",
      subtitle:
        "From 350 ml to 1.2 L: weight, refills, use cases—right volume without overbuying.",
      sections: [
        {
          heading: "Weight changes everything",
          paragraphs: [
            "Water weighs 1 kg per litre. A full 1 L bottle often exceeds 1.2–1.4 kg with the vessel. Many people abandon large formats for that reason alone.",
            "Ask: would you rather refill, or carry?",
          ],
        },
        {
          heading: "350–500 ml",
          paragraphs: [
            "Great for kids, light bags, short coffee, first insulated try. Weak for a full sports day without water access.",
          ],
        },
        {
          heading: "500–750 ml",
          paragraphs: [
            "Urban/desk sweet spot. Enough for half a day, still portable. Our most common first-buy recommendation.",
          ],
        },
        {
          heading: "750 ml–1 L",
          paragraphs: [
            "Outdoors, offices without fountains, heavy sweating. Check height in bag side pockets.",
          ],
        },
        {
          heading: "Above 1 L (XXL tumblers)",
          paragraphs: [
            "Useful at a desk or in a car if the cup holder fits. Poor fit for daily walking mobility.",
            "More volume also means drinks sit longer and warm/cool with the season.",
          ],
        },
        {
          heading: "Coffee vs water",
          paragraphs: [
            "For coffee, oversized formats go lukewarm forever—350–500 ml is often enough.",
            "For water, volume follows fountain access and your pace.",
          ],
        },
        {
          heading: "Two-bottle trick",
          paragraphs: [
            "Two specialized sizes often beat one mediocre compromise—e.g. 500 ml mobile + desk tumbler.",
          ],
        },
        {
          heading: "Quick decision",
          paragraphs: [
            "No strong signal → 500 ml. Lots of sport / no fountain → 750 ml. Fixed desk + straw → 700 ml+ tumbler.",
          ],
        },
      ],
    },
  },
  {
    slug: "bouchon-paille-etancheite",
    fr: {
      title: "Bouchon, paille et étanchéité",
      subtitle:
        "Sport lid, straw lid, twist : choisir un système que vous laverez vraiment.",
      sections: [
        {
          heading: "L’étanchéité n’est pas un bonus",
          paragraphs: [
            "Une gourde qui fuit ruinera un sac plus vite qu’une isolation moyenne. Lisez les avis « fuite » avant le reste.",
            "Testez chez vous : remplie, à l’envers, 10 minutes sur l’évier.",
          ],
        },
        {
          heading: "Bouchon à visser classique",
          paragraphs: [
            "Simple, souvent le plus fiable, lavage rapide. Moins pratique à boire en marchant sans s’arrêter.",
          ],
        },
        {
          heading: "Bouchon sport / goulot",
          paragraphs: [
            "Bon compromis sport. Vérifiez le clapet et le joint. Certains couinent ou projettent si on serre trop vite.",
          ],
        },
        {
          heading: "Paille (straw lid)",
          paragraphs: [
            "Confort bureau/voiture. Contrepartie : nettoyage obligatoire de la paille et du siège. Un biofilm s’installe vite avec boissons sucrées.",
            "Préférez les pailles démontables et les brosses adaptées.",
          ],
        },
        {
          heading: "Grande ouverture (wide mouth)",
          paragraphs: [
            "Facile à remplir de glaçons et à laver. Peut être moins « sip-friendly » sans accessoire. Excellent pour l’entretien.",
          ],
        },
        {
          heading: "Pièces et usure",
          paragraphs: [
            "Plus il y a de pièces, plus il y a de points de fuite futurs. Gardez un joint de rechange si le modèle le permet.",
          ],
        },
        {
          heading: "Enfants et école",
          paragraphs: [
            "Priorité étanchéité + facilité d’ouverture pour petites mains. Évitez les systèmes trop complexes à l’entretien parental.",
          ],
        },
        {
          heading: "Choix rapide",
          paragraphs: [
            "Minimal entretien → visser simple. Sport → sport lid. Bureau/voiture → paille. Glaçons / lavage facile → wide mouth.",
          ],
        },
      ],
    },
    en: {
      title: "Lids, straws and leak-proofing",
      subtitle:
        "Sport lids, straw lids, twist caps: pick a system you will actually clean.",
      sections: [
        {
          heading: "Leak-proofing is not optional",
          paragraphs: [
            "A leaking bottle ruins a bag faster than average insulation. Read “leak” reviews first.",
            "Home test: fill, flip upside down, 10 minutes in the sink.",
          ],
        },
        {
          heading: "Classic screw lid",
          paragraphs: [
            "Simple, often most reliable, fast to wash. Less handy for drinking while walking without stopping.",
          ],
        },
        {
          heading: "Sport / spout lid",
          paragraphs: [
            "Good sport compromise. Check the flap and gasket. Some squeak or spit if pressed too hard.",
          ],
        },
        {
          heading: "Straw lids",
          paragraphs: [
            "Desk/car comfort. Trade-off: mandatory straw and seat cleaning. Biofilm grows fast with sugary drinks.",
            "Prefer removable straws and matching brushes.",
          ],
        },
        {
          heading: "Wide mouth",
          paragraphs: [
            "Easy ice fill and cleaning. Less sip-friendly without an add-on. Excellent for maintenance.",
          ],
        },
        {
          heading: "Parts and wear",
          paragraphs: [
            "More parts mean more future leak points. Keep a spare gasket when available.",
          ],
        },
        {
          heading: "Kids and school",
          paragraphs: [
            "Prioritize sealing + easy opening for small hands. Avoid systems that are hell for parents to clean.",
          ],
        },
        {
          heading: "Quick pick",
          paragraphs: [
            "Minimal cleaning → screw lid. Sport → spout. Desk/car → straw. Ice / easy wash → wide mouth.",
          ],
        },
      ],
    },
  },
  {
    slug: "gourde-au-quotidien",
    fr: {
      title: "Gourde isotherme au quotidien",
      subtitle:
        "Sport, bureau, école, voyage : adapter le matériel à la vraie vie.",
      sections: [
        {
          heading: "La bonne gourde est celle que vous sortez",
          paragraphs: [
            "Le meilleur isotherme du monde inutile s’il reste à la cuisine. La portabilité et l’habitude battent la fiche technique.",
            "Placez-la là où vous partez : entrée, sac déjà prêt, bureau.",
          ],
        },
        {
          heading: "Bureau & open space",
          paragraphs: [
            "Tumbler paille ou gourde 500–700 ml. Évitez les ouvertures bruyantes en réunion. Prévoir un coin séchage le soir.",
          ],
        },
        {
          heading: "Sport & salle",
          paragraphs: [
            "Étanchéité + prise en main mouillée. Évitez les XXL qui ne rentrent pas dans la poche du sac de sport.",
            "Rincez le jour même si boisson isotonique / aromatisée.",
          ],
        },
        {
          heading: "École & enfants",
          paragraphs: [
            "Volume modéré, ouverture simple, marquage au nom. Test fuite obligatoire avant J1.",
          ],
        },
        {
          heading: "Voyage & train",
          paragraphs: [
            "Vide à la sécurité aéroport parfois demandé : prévoyez de remplir après. En train, un 500 ml évite les allers-retours bar.",
            "Café du wagon : un format moyen évite le tiédissement interminable.",
          ],
        },
        {
          heading: "Canicule & hiver",
          paragraphs: [
            "En été, prérefroidir + glaçons. En hiver, ne surestimez pas la tenue du chaud si vous ouvrez souvent.",
          ],
        },
        {
          heading: "Hygiène de rythme",
          paragraphs: [
            "Une rotation de deux contenants simplifie les soirées chargées : un propre prêt pendant que l’autre sèche.",
          ],
        },
        {
          heading: "Passer à l’action",
          paragraphs: [
            "Identifiez votre journée type (pas la journée idéale). Choisissez volume + bouchon en conséquence, puis comparez 2–3 modèles du catalogue.",
            "Validez le prix en euros sur Amazon.fr le jour de l’achat.",
          ],
        },
      ],
    },
    en: {
      title: "Insulated bottles in daily life",
      subtitle:
        "Sport, desk, school, travel: match gear to real routines.",
      sections: [
        {
          heading: "The best bottle is the one you bring",
          paragraphs: [
            "The world’s best insulator is useless in the kitchen. Portability and habit beat the datasheet.",
            "Stage it where you leave: doorway, packed bag, desk.",
          ],
        },
        {
          heading: "Office & open space",
          paragraphs: [
            "Straw tumbler or 500–700 ml bottle. Avoid noisy lids in meetings. Plan a drying spot at night.",
          ],
        },
        {
          heading: "Sport & gym",
          paragraphs: [
            "Leak-proofing + wet grip. Skip XXL that miss sport-bag pockets.",
            "Rinse same day after isotonic/flavored drinks.",
          ],
        },
        {
          heading: "School & kids",
          paragraphs: [
            "Moderate volume, simple opening, name label. Mandatory leak test before day one.",
          ],
        },
        {
          heading: "Travel & trains",
          paragraphs: [
            "Airport security may require empty bottles—refill after. On trains, 500 ml cuts bar trips.",
            "For coffee service, a mid size avoids endless lukewarm sipping.",
          ],
        },
        {
          heading: "Heatwaves & winter",
          paragraphs: [
            "In summer, pre-chill + ice. In winter, do not overestimate heat retention with frequent openings.",
          ],
        },
        {
          heading: "Hygiene rhythm",
          paragraphs: [
            "Two-vessel rotation helps busy evenings: one clean and ready while the other dries.",
          ],
        },
        {
          heading: "Next step",
          paragraphs: [
            "Map your typical day (not the ideal day). Pick volume + lid, then shortlist 2–3 catalog models.",
            "Confirm the live euro price on Amazon.fr when you buy.",
          ],
        },
      ],
    },
  },
];

export const tumblerGuideCovers: Record<
  string,
  { src: string; credit: string; creditUrl: string }
> = {
  "choisir-gourde-isotherme": {
    src: "/images/tumbler/guides/choisir.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  "gourde-vs-tumbler": {
    src: "/images/tumbler/guides/vs-tumbler.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  "entretien-gourde": {
    src: "/images/tumbler/guides/entretien.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  "isolation-froid-chaud": {
    src: "/images/tumbler/guides/isolation.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  "premier-achat-gourde": {
    src: "/images/tumbler/guides/premier-achat.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  "volume-capacite-gourde": {
    src: "/images/tumbler/guides/volume.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  "bouchon-paille-etancheite": {
    src: "/images/tumbler/guides/bouchon.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
  "gourde-au-quotidien": {
    src: "/images/tumbler/guides/quotidien.jpg",
    credit: "Unsplash",
    creditUrl: "https://unsplash.com/license",
  },
};
