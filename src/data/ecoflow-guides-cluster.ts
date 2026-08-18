import type { GuideArticle } from "./articles";

export const ecoflowClusterGuides: GuideArticle[] = [
  {
    slug: "river-2-vs-river-2-max",
    fr: {
      title: "RIVER 2 vs RIVER 2 Max : 256 Wh ou 512 Wh ?",
      subtitle:
        "Poids, watts, solaire : quand le Max vaut le double de capacité — sans parler à la place d’une DELTA.",
      sections: [
        {
          heading: "1. Même famille, deux autonomies",
          paragraphs: [
            "RIVER 2 : environ 256 Wh, 300 W AC (600 W surge), ≈ 3,5 kg. RIVER 2 Max : 512 Wh, 500 W AC (1 000 W surge), ≈ 6 kg. Chimie LFP des deux côtés, recharge rapide secteur.",
            "Le Max n’est pas « deux RIVER 2 collées » pour tous les usages : la sortie AC plus haute change ce que vous pouvez démarrer (petit frigo, outil léger), pas seulement la durée.",
          ],
          productSlugs: ["river-2", "river-2-max"],
        },
        {
          heading: "2. Quand 256 Wh suffisent",
          paragraphs: [
            "Téléphone, lampes LED, laptop 40–60 W, box en dépannage, week-end sans frigo : la RIVER 2 reste plus légère à porter et plus simple à ranger.",
            "Un micro-ondes, un sèche-cheveux ou un frigo à fort pic de démarrage : hors sujet. Là, on quitte déjà la RIVER 2, Max comprise.",
          ],
        },
        {
          heading: "3. Quand le Max se justifie",
          paragraphs: [
            "DJI / appareil photo, petite glacière 12 V, soirée van, recharge solaire jusqu’à ≈ 220 W : le Max double l’énergie et tient mieux un petit 230 V.",
            "Le poids passe à ≈ 6 kg. Si vous marchez longtemps avec la station, le gain d’autonomie se paie aux épaules. Pour un vrai frigo 230 V ou un backup box+frigo, voyez plutôt RIVER 2 vs DELTA 2.",
          ],
          productSlugs: ["river-2-max", "river-2-pro"],
        },
        {
          heading: "4. Solaire et recharge",
          paragraphs: [
            "RIVER 2 plafonne plus bas en entrée solaire (≈ 110 W) que le Max (≈ 220 W). Un panneau 220 W bifacial est donc mieux exploité sur le Max — encore faut-il du soleil et le bon câble MC4 / XT60 selon kit.",
            "Au secteur, les deux visent une recharge rapide. Ne dimensionnez pas un achat sur un temps de charge marketing : mesurez vos Wh utiles (appareil × heures + 20–30 %).",
          ],
          productSlugs: ["panneau-220w-bifacial", "panneau-100w"],
        },
        {
          heading: "5. Checklist RIVER 2 / Max",
          paragraphs: [
            "Listez les watts max d’un appareil, puis les Wh sur 8–12 h. Si vous dépassez ~300 W ou ~250 Wh utiles, le Max (ou une DELTA) est plus honnête.",
            "Les prix Amazon bougent. Ouvrez les fiches : bundles, vendeur, état. Ce site ne fixe pas un tarif.",
          ],
          bullets: [
            "Portage à pied → RIVER 2",
            "Petite glacière / 500 W utiles → Max",
            "Frigo 230 V / backup maison → DELTA, pas une RIVER",
          ],
        },
      ],
    },
    en: {
      title: "RIVER 2 vs RIVER 2 Max: 256 Wh or 512 Wh?",
      subtitle:
        "Weight, watts, solar: when Max is worth double the capacity — without pretending it is a DELTA.",
      sections: [
        {
          heading: "1. Same family, two runtimes",
          paragraphs: [
            "RIVER 2: about 256 Wh, 300 W AC (600 W surge), ≈ 3.5 kg. RIVER 2 Max: 512 Wh, 500 W AC (1 000 W surge), ≈ 6 kg. LFP chemistry on both, fast AC charging.",
            "Max is not “two RIVER 2s” for every job: higher AC output changes what you can start (small fridge, light tool), not only how long it lasts.",
          ],
          productSlugs: ["river-2", "river-2-max"],
        },
        {
          heading: "2. When 256 Wh is enough",
          paragraphs: [
            "Phones, LED lights, a 40–60 W laptop, emergency router, a fridge-free weekend: RIVER 2 stays lighter to carry and easier to stash.",
            "A microwave, hair dryer or fridge with a hard startup surge is already out of scope — including on Max.",
          ],
        },
        {
          heading: "3. When Max makes sense",
          paragraphs: [
            "Cameras, a small 12 V cooler, van evenings, solar up to ≈ 220 W: Max doubles energy and holds a bit of 230 V better.",
            "Weight goes to ≈ 6 kg. If you hike with the station, extra runtime hits the shoulders. For a real 230 V fridge or router+fridge backup, see RIVER 2 vs DELTA 2.",
          ],
          productSlugs: ["river-2-max", "river-2-pro"],
        },
        {
          heading: "4. Solar and charging",
          paragraphs: [
            "RIVER 2 caps lower on solar input (≈ 110 W) than Max (≈ 220 W). A 220 W bifacial panel is better used on Max — if you have sun and the right MC4 / XT60 lead.",
            "On AC, both aim for fast refill. Do not size a purchase on a marketing charge time: compute useful Wh (load × hours + 20–30 %).",
          ],
          productSlugs: ["panneau-220w-bifacial", "panneau-100w"],
        },
        {
          heading: "5. RIVER 2 / Max checklist",
          paragraphs: [
            "List peak watts, then Wh over 8–12 h. If you exceed ~300 W or ~250 Wh useful, Max (or a DELTA) is the honest pick.",
            "Amazon prices move. Open the sheets: bundles, seller, condition. This site does not lock a tariff.",
          ],
          bullets: [
            "Walking with it → RIVER 2",
            "Small cooler / ~500 W useful → Max",
            "230 V fridge / home backup → DELTA, not a RIVER",
          ],
        },
      ],
    },
  },
  {
    slug: "river-2-vs-delta-2",
    fr: {
      title: "RIVER 2 vs DELTA 2 : camping léger ou vrai 1 kWh ?",
      subtitle:
        "300 W / 256 Wh contre 1 800 W / 1 024 Wh — le saut de gamme, sans jargon inutile.",
      sections: [
        {
          heading: "1. Ce n’est pas un « plus ou moins »",
          paragraphs: [
            "RIVER 2 est une station de poche (≈ 256 Wh, 300 W). DELTA 2 vise ≈ 1 024 Wh et 1 800 W AC, ≈ 12 kg, souvent expansible. On change d’usage, pas seulement d’étiquette.",
            "Si votre liste contient un frigo 230 V, un petit radiateur, un four micro-ondes court ou un PC + écran + box la nuit : partez de DELTA 2. La RIVER 2 calera ou videra trop vite.",
          ],
          productSlugs: ["river-2", "delta-2"],
        },
        {
          heading: "2. Poids et mobilité",
          paragraphs: [
            "RIVER 2 se glisse dans un sac. DELTA 2 se porte à la poignée, se pose dans le van ou la cave. Pour du bivouac à pied, DELTA 2 est trop lourde.",
            "Un duo fréquent : RIVER pour le quotidien léger + DELTA à la maison. Ce n’est pas obligatoire : un seul appareil bien dimensionné évite l’achat double.",
          ],
          productSlugs: ["river-2-max", "delta-2"],
        },
        {
          heading: "3. Frigo, pic, onduleur",
          paragraphs: [
            "Un frigo à compression tire un pic au démarrage. 300 W nominaux de RIVER 2 sont justes ; 1 800 W de DELTA 2 laissent une marge, surtout avec surge.",
            "Mesurez avec une prise wattmètre si vous pouvez. Les plaques constructeur du frigo sont souvent optimistes. Guide dédié : DELTA 2 pour frigo.",
          ],
          productSlugs: ["delta-2", "glacier-classic"],
        },
        {
          heading: "4. Solaire et expansion",
          paragraphs: [
            "DELTA 2 accepte plus de solaire (souvent jusqu’à ≈ 500 W selon config) et des batteries extras. RIVER 2 reste un capteur ~110 W.",
            "Si vous voulez scaler dans 12 mois, DELTA 2 (ou DELTA 3 Classic) est plus cohérent qu’empiler des RIVER.",
          ],
          productSlugs: ["panneau-220w-bifacial", "batterie-extra-delta"],
        },
        {
          heading: "5. Checklist de bascule",
          paragraphs: [
            "Écrivez 3 charges max. Si l’une dépasse 300 W ou si le total dépasse ~400 Wh / nuit, DELTA 2. Sinon RIVER 2 (ou Max) suffit souvent.",
            "Prix indicatifs sur les fiches, pas ici. Bundles solaires Amazon : vérifiez que le panneau matche l’entrée de la station.",
          ],
          bullets: [
            "Pied / sac → RIVER",
            "Van / cave / frigo 230 V → DELTA 2",
            "Hésitation → wattmètre 48 h, puis décider",
          ],
        },
      ],
    },
    en: {
      title: "RIVER 2 vs DELTA 2: light camping or a real 1 kWh?",
      subtitle:
        "300 W / 256 Wh versus 1 800 W / 1 024 Wh — the class jump, without spare jargon.",
      sections: [
        {
          heading: "1. Not a “bit more”",
          paragraphs: [
            "RIVER 2 is a pocket station (≈ 256 Wh, 300 W). DELTA 2 aims at ≈ 1 024 Wh and 1 800 W AC, ≈ 12 kg, often expandable. The job changes, not just the badge.",
            "If your list includes a 230 V fridge, a small heater, a short microwave burst or PC + monitor + router overnight: start from DELTA 2. RIVER 2 will stall or empty too fast.",
          ],
          productSlugs: ["river-2", "delta-2"],
        },
        {
          heading: "2. Weight and mobility",
          paragraphs: [
            "RIVER 2 fits a bag. DELTA 2 is a handle carry into a van or cellar. For walk-in bivouac, DELTA 2 is too heavy.",
            "A common pair: RIVER for light daily use + DELTA at home. It is not mandatory: one well-sized unit beats a double buy.",
          ],
          productSlugs: ["river-2-max", "delta-2"],
        },
        {
          heading: "3. Fridge, surge, inverter",
          paragraphs: [
            "A compressor fridge spikes at start. RIVER 2’s 300 W nominal is tight; DELTA 2’s 1 800 W leaves headroom, especially with surge.",
            "Measure with a watt meter if you can. Fridge nameplates are often optimistic. Dedicated guide: DELTA 2 for a fridge.",
          ],
          productSlugs: ["delta-2", "glacier-classic"],
        },
        {
          heading: "4. Solar and expansion",
          paragraphs: [
            "DELTA 2 takes more solar (often up to ≈ 500 W depending on config) and extra batteries. RIVER 2 stays around a ~110 W cap.",
            "If you want to scale in 12 months, DELTA 2 (or DELTA 3 Classic) is more coherent than stacking RIVERs.",
          ],
          productSlugs: ["panneau-220w-bifacial", "batterie-extra-delta"],
        },
        {
          heading: "5. Switch checklist",
          paragraphs: [
            "Write 3 peak loads. If one exceeds 300 W or the total exceeds ~400 Wh / night, DELTA 2. Otherwise RIVER 2 (or Max) often suffices.",
            "Indicative prices on the sheets, not here. Amazon solar bundles: check the panel matches the station input.",
          ],
          bullets: [
            "Walk / bag → RIVER",
            "Van / cellar / 230 V fridge → DELTA 2",
            "Unsure → watt meter 48 h, then decide",
          ],
        },
      ],
    },
  },
  {
    slug: "delta-2-pour-frigo",
    fr: {
      title: "DELTA 2 pour un frigo : 12 V, 230 V, GLACIER",
      subtitle:
        "Pics de compresseur, Wh par nuit, glacière EcoFlow — méthode pour ne pas sous-dimensionner.",
      sections: [
        {
          heading: "1. Frigo « 50 W » ≠ 50 W tout le temps",
          paragraphs: [
            "Un frigo à compression cyclique : 50–150 W en moyenne, mais un pic au démarrage. C’est le pic qui cale une petite station, pas la moyenne.",
            "DELTA 2 (≈ 1 024 Wh, 1 800 W AC, surge plus haut) est souvent le premier palier réaliste pour un frigo 230 V de camping-car ou un mini-bar en backup court.",
          ],
          productSlugs: ["delta-2", "delta-2-max"],
        },
        {
          heading: "2. 12 V vs 230 V",
          paragraphs: [
            "En 12 V (prise allume-cigare / XT60 selon câble), vous évitez l’onduleur : moins de pertes. Beaucoup de glacières compressor acceptent 12/24 V.",
            "En 230 V, vous branchez une prise domestique : plus simple, plus de pertes. Vérifiez que le pic + marge reste sous 1 800 W (DELTA 2) — un vieux frigo américain peut dépasser.",
          ],
        },
        {
          heading: "3. Combien de Wh pour une nuit ?",
          paragraphs: [
            "Ordre de grandeur : 400–900 Wh / 24 h pour une glacière bien isolée par 25 °C, beaucoup plus par 35 °C ou porte ouverte. Ajoutez 20–30 % de marge et le reste de vos charges (box, LED).",
            "DELTA 2 tient souvent une nuit de glacière + petit confort. Deux jours sans solaire → DELTA 2 Max, extra batterie, ou moins de froid. Mesurez plutôt que de croire la plaquette.",
          ],
          productSlugs: ["delta-2", "batterie-extra-delta"],
        },
        {
          heading: "4. GLACIER vs frigo classique",
          paragraphs: [
            "EcoFlow GLACIER est une glacière pensée pour l’écosystème (contrôle app, batterie enfichable selon version). Un frigo camping 230 V générique peut coûter moins cher mais mal se marier en pic.",
            "Pour du van : GLACIER + station assez grosse. Pour un backup maison d’un vrai frigo cuisine, il faut souvent DELTA Pro / plus de Wh — DELTA 2 est un dépannage, pas 48 h de supermarché.",
          ],
          productSlugs: ["glacier-classic", "delta-2"],
        },
        {
          heading: "5. Checklist frigo + station",
          paragraphs: [
            "Relevez tension (12 / 230 V), watts moyen, et si possible le pic. Testez 2 h sur la station avant un week-end. Solaire 220 W : utile en journée, pas une garantie la nuit.",
            "Prix du jour sur Amazon / fiches. Ce n’est pas un dimensionnement électrique certifié.",
          ],
          bullets: [
            "Préférer 12 V si la glacière le permet",
            "Marge 20–30 % sur les Wh",
            "Porte fermée, plein raisonnable, ombre",
          ],
        },
      ],
    },
    en: {
      title: "DELTA 2 for a fridge: 12 V, 230 V, GLACIER",
      subtitle:
        "Compressor spikes, Wh per night, EcoFlow cooler — a method so you do not undersize.",
      sections: [
        {
          heading: "1. A “50 W” fridge is not 50 W all the time",
          paragraphs: [
            "A cycling compressor fridge: 50–150 W average, but a startup spike. The spike stalls a small station, not the average.",
            "DELTA 2 (≈ 1 024 Wh, 1 800 W AC, higher surge) is often the first realistic step for a 230 V camper fridge or a short mini-bar backup.",
          ],
          productSlugs: ["delta-2", "delta-2-max"],
        },
        {
          heading: "2. 12 V vs 230 V",
          paragraphs: [
            "On 12 V (cig lighter / XT60 depending on cable) you skip the inverter: fewer losses. Many compressor coolers take 12/24 V.",
            "On 230 V you plug a household cord: simpler, more losses. Check spike + margin stays under 1 800 W (DELTA 2) — an old US fridge can exceed that.",
          ],
        },
        {
          heading: "3. How many Wh for a night?",
          paragraphs: [
            "Ballpark: 400–900 Wh / 24 h for a well-insulated cooler at 25 °C, much more at 35 °C or with the lid open. Add 20–30 % margin and the rest of your loads (router, LEDs).",
            "DELTA 2 often covers a cooler night plus light comfort. Two days with no sun → DELTA 2 Max, extra battery, or less cold. Measure rather than trust the plate.",
          ],
          productSlugs: ["delta-2", "batterie-extra-delta"],
        },
        {
          heading: "4. GLACIER vs a generic fridge",
          paragraphs: [
            "EcoFlow GLACIER is a cooler built for the ecosystem (app control, plug-in battery on some versions). A generic 230 V camping fridge can be cheaper but nastier on surge.",
            "For a van: GLACIER + a large enough station. For backing up a full kitchen fridge, you often need DELTA Pro / more Wh — DELTA 2 is a stopgap, not 48 h of supermarket cold.",
          ],
          productSlugs: ["glacier-classic", "delta-2"],
        },
        {
          heading: "5. Fridge + station checklist",
          paragraphs: [
            "Note voltage (12 / 230 V), average watts, and spike if you can. Test 2 hours on the station before a weekend. 220 W solar helps by day, not as a night guarantee.",
            "Live prices on Amazon / sheets. This is not a certified electrical sizing.",
          ],
          bullets: [
            "Prefer 12 V if the cooler allows it",
            "20–30 % Wh margin",
            "Lid closed, reasonable fill, shade",
          ],
        },
      ],
    },
  },
  {
    slug: "river-3-plus-camping",
    fr: {
      title: "RIVER 3 Plus en camping : 286 Wh, 600 W, expansion",
      subtitle:
        "Génération RIVER 3 : plus de watts qu’une RIVER 2, capacité encore compacte — pour qui ?",
      sections: [
        {
          heading: "1. Le positionnement",
          paragraphs: [
            "RIVER 3 Plus : ≈ 286 Wh de base, 600 W AC, LFP ≈ 4 000 cycles, ≈ 4,7 kg, expansion possible. Vous gagnez surtout en puissance de prise, pas en « weekend frigo ».",
            "C’est le sweet spot tente / van léger / télétravail mobile : laptop, drone, lumières, petite pompe, charge USB-C — pas un backup maison.",
          ],
          productSlugs: ["river-3-plus", "river-3"],
        },
        {
          heading: "2. Face à RIVER 2 et RIVER 2 Max",
          paragraphs: [
            "RIVER 2 est plus légère et moins chère en entrée, mais 300 W limitent les petits 230 V. Le Max a plus de Wh (512) ; la 3 Plus a plus de W et une stack plus récente.",
            "Si l’autonomie (Wh) est le critère n°1 sans besoin de 600 W, le Max peut rester plus logique. Si vous calez sur le pic, la 3 Plus (ou une DELTA) est plus honnête.",
          ],
          productSlugs: ["river-2", "river-2-max", "river-3-plus"],
        },
        {
          heading: "3. Solaire camping",
          paragraphs: [
            "Entrée solaire jusqu’à ≈ 220 W : un panneau 220 W bifacial est dans la bonne fenêtre, un 400 W sera bridé. Orientez, évitez l’ombre de tente.",
            "Sans soleil, 286 Wh, c’est une soirée + matin, pas trois jours de glacière. Prévoyez recharge voiture / secteur camping, ou une extra batterie si le modèle le permet.",
          ],
          productSlugs: ["panneau-220w-bifacial", "panneau-rvmax-130"],
        },
        {
          heading: "4. Ce que vous ne branchez pas",
          paragraphs: [
            "Bouilloire 2 000 W, plaque, clim, frigo domestique : non. Une cafetière capsule courte peut passer si le pic reste sous 600 W — testez.",
            "GLACIER / gros 230 V : visez DELTA 2. La 3 Plus reste un compagnon d’électronique et de petit confort.",
          ],
          productSlugs: ["delta-2", "glacier-classic"],
        },
        {
          heading: "5. Checklist week-end",
          paragraphs: [
            "Listez USB-C, 12 V, 230 V. Comptez les Wh (W × h × 1,25). Si vous dépassez ~250 Wh sans solaire, emportez un plan B de recharge.",
            "Fiches produits pour bundles et prix du jour. Version wireless : seulement si vous avez le chargeur compatible — sinon la Plus classique suffit.",
          ],
          bullets: [
            "600 W utiles → 3 Plus plutôt que RIVER 2",
            "Beaucoup de Wh sans watts → Max ou DELTA",
            "Solaire 220 W max utile, pas un 400 W « pour plus tard » sans check d’entrée",
          ],
        },
      ],
    },
    en: {
      title: "RIVER 3 Plus for camping: 286 Wh, 600 W, expansion",
      subtitle:
        "RIVER 3 generation: more watts than a RIVER 2, still compact capacity — for whom?",
      sections: [
        {
          heading: "1. The slot",
          paragraphs: [
            "RIVER 3 Plus: ≈ 286 Wh base, 600 W AC, LFP ≈ 4 000 cycles, ≈ 4.7 kg, expansion possible. You mainly gain outlet power, not a “fridge weekend”.",
            "Sweet spot for tent / light van / mobile work: laptop, drone, lights, small pump, USB-C — not home backup.",
          ],
          productSlugs: ["river-3-plus", "river-3"],
        },
        {
          heading: "2. Versus RIVER 2 and RIVER 2 Max",
          paragraphs: [
            "RIVER 2 is lighter and cheaper at entry, but 300 W limits small 230 V loads. Max has more Wh (512); 3 Plus has more W and a newer stack.",
            "If energy (Wh) is criterion #1 without needing 600 W, Max can still be more logical. If you stall on surge, 3 Plus (or a DELTA) is more honest.",
          ],
          productSlugs: ["river-2", "river-2-max", "river-3-plus"],
        },
        {
          heading: "3. Camping solar",
          paragraphs: [
            "Solar input up to ≈ 220 W: a 220 W bifacial panel fits; a 400 W will be clipped. Aim it, avoid tent shade.",
            "Without sun, 286 Wh is an evening + morning, not three cooler days. Plan car / campsite AC, or an extra battery if the model allows it.",
          ],
          productSlugs: ["panneau-220w-bifacial", "panneau-rvmax-130"],
        },
        {
          heading: "4. What you do not plug in",
          paragraphs: [
            "2 000 W kettle, hob, AC, kitchen fridge: no. A short capsule coffee burst may pass if the spike stays under 600 W — test it.",
            "GLACIER / large 230 V: look at DELTA 2. 3 Plus stays a companion for electronics and light comfort.",
          ],
          productSlugs: ["delta-2", "glacier-classic"],
        },
        {
          heading: "5. Weekend checklist",
          paragraphs: [
            "List USB-C, 12 V, 230 V. Count Wh (W × h × 1.25). If you exceed ~250 Wh with no solar, pack a recharge plan B.",
            "Product sheets for bundles and live prices. Wireless version: only if you have the matching charger — otherwise classic Plus is enough.",
          ],
          bullets: [
            "Need ~600 W → 3 Plus over RIVER 2",
            "Need Wh more than watts → Max or DELTA",
            "220 W solar is the useful cap; do not buy 400 W “for later” without checking input",
          ],
        },
      ],
    },
  },
  {
    slug: "panneau-220w-bifacial-quelle-station",
    fr: {
      title: "Panneau 220 W bifacial : quelle station EcoFlow ?",
      subtitle:
        "Entrée solaire, XT60, ombre, albédo — pour ne pas acheter un panneau que la station bride.",
      sections: [
        {
          heading: "1. 220 W, un sweet spot portable",
          paragraphs: [
            "Le 220 W bifacial est le compromis le plus cité : encore pliable, assez de courant pour une RIVER Max / 3 Plus / petite DELTA, sans le poids d’un 400 W.",
            "Bifacial = un peu d’énergie par la face arrière (sol clair, dalle). Sur herbe sombre, le bonus est faible. L’orientation et l’absence d’ombre comptent plus que le sticker « bifacial ».",
          ],
          productSlugs: ["panneau-220w-bifacial"],
        },
        {
          heading: "2. Matcher l’entrée de la station",
          paragraphs: [
            "RIVER 2 ≈ 110 W max solaire : un 220 W sera largement bridé. RIVER 2 Max / 3 Plus ≈ 220 W : bon match. DELTA 2 souvent jusqu’à ≈ 500 W : un 220 W est un premier panneau, pas le plafond.",
            "Deux 220 W en parallèle / série selon tension MPPT : seulement si la fiche station le permet (V et A). Un mauvais câblage = pas de charge ou alarme.",
          ],
          productSlugs: ["river-2", "river-2-max", "delta-2"],
        },
        {
          heading: "3. Câbles, MC4, XT60",
          paragraphs: [
            "Le panneau EcoFlow sort souvent MC4 ; la station attend un XT60 (ou Anderson selon modèle). Le câble adapté est un accessoire, pas un détail.",
            "Longueur et section : trop long = pertes. Vérifiez le kit Amazon (panneau seul vs panneau + câble). PowerStream / STREAM ont d’autres connectiques — ne mélangez pas les écosystèmes au hasard.",
          ],
          productSlugs: ["panneau-100w", "panneau-400w"],
        },
        {
          heading: "4. STREAM, balcon, portable",
          paragraphs: [
            "Un 220 W pliable n’est pas un kit balcon STREAM (micro-onduleur, injection, règles FR). Pour l’autoconsommation maison, voyez STREAM Ultra X vs Pro.",
            "En camping, posez le panneau face sud (hémisphère nord), inclinez, évitez le sac qui fait de l’ombre. Un 400 W trop grand pour le sac ne partira pas.",
          ],
          productSlugs: ["stream-ultra-x", "stream-pro"],
        },
        {
          heading: "5. Checklist panneau + station",
          paragraphs: [
            "Lisez l’entrée solaire max (W, V, A) sur la fiche station, puis le VOC du panneau. Restez sous les limites. Prix du jour sur Amazon, pas ici.",
            "Un wattmètre / l’app EcoFlow vous dira le réel vs 220 W STC (labo, 25 °C, ensoleillement idéal — vous verrez souvent moins).",
          ],
          bullets: [
            "RIVER 2 → 100 W plus cohérent qu’un 220 W bridé",
            "Max / 3 Plus / DELTA 2 → 220 W pertinent",
            "DELTA plus grosse → 220 W = premier module, pas le seul",
          ],
        },
      ],
    },
    en: {
      title: "220 W bifacial panel: which EcoFlow station?",
      subtitle:
        "Solar input, XT60, shade, albedo — so you do not buy a panel the station will clip.",
      sections: [
        {
          heading: "1. 220 W, a portable sweet spot",
          paragraphs: [
            "The 220 W bifacial is the most cited compromise: still foldable, enough current for a RIVER Max / 3 Plus / small DELTA, without 400 W weight.",
            "Bifacial = a bit of energy from the rear face (light ground, paving). On dark grass the bonus is small. Aim and shade matter more than the “bifacial” sticker.",
          ],
          productSlugs: ["panneau-220w-bifacial"],
        },
        {
          heading: "2. Match the station input",
          paragraphs: [
            "RIVER 2 ≈ 110 W solar max: a 220 W will be heavily clipped. RIVER 2 Max / 3 Plus ≈ 220 W: a good match. DELTA 2 often up to ≈ 500 W: a 220 W is a first panel, not the ceiling.",
            "Two 220 W in parallel / series depending on MPPT voltage: only if the station sheet allows it (V and A). Wrong wiring = no charge or an alarm.",
          ],
          productSlugs: ["river-2", "river-2-max", "delta-2"],
        },
        {
          heading: "3. Cables, MC4, XT60",
          paragraphs: [
            "EcoFlow panels often leave MC4; the station expects XT60 (or Anderson on some models). The right lead is an accessory, not a footnote.",
            "Length and gauge: too long = losses. Check the Amazon kit (panel only vs panel + cable). PowerStream / STREAM use other connectors — do not mix ecosystems at random.",
          ],
          productSlugs: ["panneau-100w", "panneau-400w"],
        },
        {
          heading: "4. STREAM, balcony, portable",
          paragraphs: [
            "A foldable 220 W is not a STREAM balcony kit (micro-inverter, injection, FR rules). For home self-consumption, see STREAM Ultra X vs Pro.",
            "Camping: face south (northern hemisphere), tilt, keep the bag off the cells. A 400 W that will not fit the pack will not leave home.",
          ],
          productSlugs: ["stream-ultra-x", "stream-pro"],
        },
        {
          heading: "5. Panel + station checklist",
          paragraphs: [
            "Read max solar input (W, V, A) on the station sheet, then panel VOC. Stay under the limits. Live prices on Amazon, not here.",
            "A watt meter / the EcoFlow app will show real output vs 220 W STC (lab, 25 °C, ideal sun — you will often see less).",
          ],
          bullets: [
            "RIVER 2 → 100 W is more coherent than a clipped 220 W",
            "Max / 3 Plus / DELTA 2 → 220 W is relevant",
            "Larger DELTA → 220 W = first module, not the only one",
          ],
        },
      ],
    },
  },
  {
    slug: "stream-ultra-x-vs-pro",
    fr: {
      title: "STREAM Ultra X vs STREAM Pro : quel kit balcon ?",
      subtitle:
        "3,84 kWh flagship contre 1,92 kWh modulable — stockage plug-in, pas une station camping.",
      sections: [
        {
          heading: "1. STREAM n’est pas une RIVER",
          paragraphs: [
            "STREAM vise l’autoconsommation maison / balcon : panneaux, micro-onduleur, batterie plug-in. Ce n’est pas un bloc à emporter en forêt.",
            "En France, puissance injectée, copropriété et Enedis / Consuel selon config. Vérifiez les règles actuelles ; ce guide ne remplace pas un installateur.",
          ],
          productSlugs: ["stream-ultra-x", "stream-pro"],
        },
        {
          heading: "2. Ultra X : gros stockage d’un coup",
          paragraphs: [
            "Ultra X : ≈ 3,84 kWh, sortie CA élevée (classe ≈ 2 300 W selon fiche), plusieurs MPPT. Pour un foyer qui veut décaler le solaire vers le soir sans bricoler l’expansion tout de suite.",
            "Investissement plus lourd, installation à planifier (poids, fixation, câbles). Si votre toiture / balcon est petit, vous n’utiliserez pas tout le solaire théorique.",
          ],
          productSlugs: ["stream-ultra-x", "kit-solaire-stream-800"],
        },
        {
          heading: "3. Pro : partir plus petit, scaler",
          paragraphs: [
            "STREAM Pro : ≈ 1,92 kWh, expansion vers une capacité bien plus haute selon stack. 3 MPPT selon config. Idéal pour tester un hiver, puis ajouter une batterie.",
            "Vous acceptez un premier palier plus juste la nuit. Si vos usages soir (plaques, four) sont lourds, Ultra X ou un palier intermédiaire (Max) peut coller mieux.",
          ],
          productSlugs: ["stream-pro", "stream-max"],
        },
        {
          heading: "4. Micro-onduleur seul vs batterie",
          paragraphs: [
            "Sans batterie, vous injectez / autoconsommez surtout en journée. Avec batterie, vous lissez le soir. Le micro-onduleur STREAM se couple à l’écosystème — pas à une DELTA camping au hasard.",
            "PowerStream reste un autre fil (souvent couplé stations existantes). Pour un setup neuf FR, STREAM est la gamme poussée aujourd’hui. Comparatif dédié sur le hub STREAM vs PowerStream.",
          ],
          productSlugs: ["stream-micro-onduleur", "powerstream"],
        },
        {
          heading: "5. Checklist balcon",
          paragraphs: [
            "Ombre, orientation, accord copro, longueur de câble, limite d’injection. Estimez kWh/jour utiles vs facture, pas le Wc marketing seul.",
            "Prix et bundles sur les fiches. Ni devis, ni étude Enedis ici.",
          ],
          bullets: [
            "Tester puis scaler → Pro",
            "Stockage soir ambitieux d’un coup → Ultra X",
            "Journée seulement, sans batterie → micro-onduleur / kit 800 W selon règles",
          ],
        },
      ],
    },
    en: {
      title: "STREAM Ultra X vs STREAM Pro: which balcony kit?",
      subtitle:
        "3.84 kWh flagship versus 1.92 kWh modular — plug-in storage, not a camping station.",
      sections: [
        {
          heading: "1. STREAM is not a RIVER",
          paragraphs: [
            "STREAM is home / balcony self-consumption: panels, micro-inverter, plug-in battery. It is not a block you carry into the woods.",
            "In France, injection power, HOA and Enedis / Consuel depend on the setup. Check current rules; this guide is not an installer.",
          ],
          productSlugs: ["stream-ultra-x", "stream-pro"],
        },
        {
          heading: "2. Ultra X: large storage in one step",
          paragraphs: [
            "Ultra X: ≈ 3.84 kWh, high AC output (≈ 2 300 W class on the sheet), several MPPTs. For a household that wants to shift solar into the evening without expanding immediately.",
            "Heavier spend, installation to plan (weight, mounts, cables). If the roof / balcony is small, you will not use all the theoretical solar.",
          ],
          productSlugs: ["stream-ultra-x", "kit-solaire-stream-800"],
        },
        {
          heading: "3. Pro: start smaller, scale",
          paragraphs: [
            "STREAM Pro: ≈ 1.92 kWh, expansion to a much higher stack depending on config. Up to 3 MPPTs. Good to trial a winter, then add a battery.",
            "You accept a tighter first night. If evening loads (hob, oven) are heavy, Ultra X or a middle rung (Max) may fit better.",
          ],
          productSlugs: ["stream-pro", "stream-max"],
        },
        {
          heading: "4. Micro-inverter only vs battery",
          paragraphs: [
            "Without a battery you mainly inject / self-consume by day. With a battery you smooth the evening. STREAM’s micro-inverter sits in that ecosystem — not on a random camping DELTA.",
            "PowerStream is another thread (often paired with existing stations). For a new FR setup, STREAM is the current push. Dedicated hub: STREAM vs PowerStream.",
          ],
          productSlugs: ["stream-micro-onduleur", "powerstream"],
        },
        {
          heading: "5. Balcony checklist",
          paragraphs: [
            "Shade, orientation, HOA, cable runs, injection cap. Estimate useful kWh/day vs the bill, not marketing Wp alone.",
            "Prices and bundles on the sheets. No quote and no Enedis study here.",
          ],
          bullets: [
            "Trial then scale → Pro",
            "Ambitious evening storage in one buy → Ultra X",
            "Daytime only, no battery → micro-inverter / 800 W kit within the rules",
          ],
        },
      ],
    },
  },
  {
    slug: "delta-3-classic-vs-delta-2",
    fr: {
      title: "DELTA 3 Classic vs DELTA 2 : faut-il changer de génération ?",
      subtitle:
        "Même classe ≈ 1 kWh / 1 800 W, UPS et cycles plus récents — quand garder la 2.",
      sections: [
        {
          heading: "1. Sur le papier, même créneau",
          paragraphs: [
            "DELTA 2 : ≈ 1 024 Wh, 1 800 W, LFP ≈ 3 000 cycles, expansible, solaire souvent jusqu’à ≈ 500 W. DELTA 3 Classic : même ordre de Wh et de watts, LFP ≈ 4 000 cycles, UPS / écosystème génération 3.",
            "Vous n’achetez pas « deux fois plus d’énergie ». Vous achetez une stack plus récente (app, commutation, accessoires DELTA 3). Les bundles Amazon varient : lisez la fiche du jour.",
          ],
          productSlugs: ["delta-2", "delta-3-classic"],
        },
        {
          heading: "2. UPS, télétravail, box",
          paragraphs: [
            "Si l’enjeu est une coupure propre PC + box, la Classic met en avant la commutation rapide de la série 3. La DELTA 2 a déjà un mode UPS / EPS selon firmware — testez vos appareils sensibles.",
            "Ni l’une ni l’autre ne remplacent un onduleur rack pour serveur critique. Pour une cave entière, visez DELTA Pro, pas Classic.",
          ],
          productSlugs: ["delta-3-classic"],
        },
        {
          heading: "3. Accessoires et expansion",
          paragraphs: [
            "Batteries extras et panneaux : restez dans la même génération quand c’est documenté. Un extra DELTA 2 ne se suppose pas compatible Classic.",
            "Si vous avez déjà un panneau 220 W et une DELTA 2 qui tourne, le gain Classic peut ne pas valoir la revente. Si vous partez de zéro en 2026, Classic (ou un palier 3 Plus / Max) est plus « futur ».",
          ],
          productSlugs: ["batterie-extra-delta", "panneau-220w-bifacial"],
        },
        {
          heading: "4. Occasions et prix",
          paragraphs: [
            "DELTA 2 se trouve plus souvent en occasion / bundle soldé. Classic peut afficher un prix neuf plus haut pour des Wh similaires. Faites le ratio € / Wh sur l’offre réelle, pas sur le souvenir d’un prix.",
            "Vendeur Amazon, état, garantie. Une 2 neuve sous garantie bat une 3 douteuse. Pas de tarif inventé ici.",
          ],
          productSlugs: ["delta-2", "delta-3-plus"],
        },
        {
          heading: "5. Checklist génération",
          paragraphs: [
            "Déjà DELTA 2 + solaire qui va → gardez, ajoutez batterie / panneau. Premier achat backup 1 kWh → Classic sauf écart de prix énorme sur une 2 neuve.",
            "Frigo / van : les deux tiennent le créneau ; le pic et les Wh comptent plus que le numéro 2 vs 3. Voir aussi DELTA 2 pour frigo.",
          ],
          bullets: [
            "Zéro équipement, budget neuf → Classic",
            "Parc 2 déjà là → ne pas « upgrader » pour le logo",
            "Plus de Wh → Max / Pro, pas Classic vs 2",
          ],
        },
      ],
    },
    en: {
      title: "DELTA 3 Classic vs DELTA 2: is a new generation worth it?",
      subtitle:
        "Same ≈ 1 kWh / 1 800 W class, newer UPS and cycles — when to keep the 2.",
      sections: [
        {
          heading: "1. On paper, the same slot",
          paragraphs: [
            "DELTA 2: ≈ 1 024 Wh, 1 800 W, LFP ≈ 3 000 cycles, expandable, solar often up to ≈ 500 W. DELTA 3 Classic: similar Wh and watts, LFP ≈ 4 000 cycles, generation-3 UPS / ecosystem.",
            "You are not buying “twice the energy”. You are buying a newer stack (app, switchover, DELTA 3 accessories). Amazon bundles vary: read today’s sheet.",
          ],
          productSlugs: ["delta-2", "delta-3-classic"],
        },
        {
          heading: "2. UPS, remote work, router",
          paragraphs: [
            "If the job is a clean PC + router cutover, Classic pushes series-3 fast switchover. DELTA 2 already has UPS / EPS depending on firmware — test sensitive gear.",
            "Neither replaces a rack UPS for a critical server. For a whole cellar, look at DELTA Pro, not Classic.",
          ],
          productSlugs: ["delta-3-classic"],
        },
        {
          heading: "3. Accessories and expansion",
          paragraphs: [
            "Extra batteries and panels: stay in the same generation when that is documented. A DELTA 2 extra is not assumed Classic-compatible.",
            "If you already have a 220 W panel and a working DELTA 2, Classic may not be worth the resale. Starting from zero in 2026, Classic (or a 3 Plus / Max rung) is more “future”.",
          ],
          productSlugs: ["batterie-extra-delta", "panneau-220w-bifacial"],
        },
        {
          heading: "4. Used units and price",
          paragraphs: [
            "DELTA 2 shows up more often used / in sale bundles. Classic may list higher new for similar Wh. Do the € / Wh on the real offer, not a remembered price.",
            "Amazon seller, condition, warranty. A new warranted 2 beats a dubious 3. No invented tariff here.",
          ],
          productSlugs: ["delta-2", "delta-3-plus"],
        },
        {
          heading: "5. Generation checklist",
          paragraphs: [
            "Already on DELTA 2 + solar that works → keep it, add battery / panel. First 1 kWh backup buy → Classic unless a new 2 is dramatically cheaper.",
            "Fridge / van: both fit the slot; surge and Wh matter more than 2 vs 3. See also DELTA 2 for a fridge.",
          ],
          bullets: [
            "No gear yet, new budget → Classic",
            "Fleet of 2 already there → do not upgrade for the logo",
            "Need more Wh → Max / Pro, not Classic vs 2",
          ],
        },
      ],
    },
  },
];
