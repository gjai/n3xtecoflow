import type { GuideArticle } from "./articles";

export const EUROMILLIONS_LOTO_GUIDE_SLUG = "comprendre-loto";
export const EUROMILLIONS_EURODREAMS_GUIDE_SLUG = "comprendre-eurodreams";
export const EUROMILLIONS_KENO_GUIDE_SLUG = "comprendre-keno";
export const EUROMILLIONS_CRESCENDO_GUIDE_SLUG = "comprendre-crescendo";
export const EUROMILLIONS_READ_RESULTS_GUIDE_SLUG = "lire-resultats-tirages";
export const EUROMILLIONS_SCHEDULE_GUIDE_SLUG = "horaires-tirages-fdj";

export const euromillionsCompanionGuidesRaw: GuideArticle[] = [
  {
    slug: EUROMILLIONS_LOTO_GUIDE_SLUG,
    fr: {
      title: "Comprendre le Loto",
      subtitle:
        "5 numéros sur 49, numéro Chance, lecture d’un résultat — sans promesse de méthode.",
      sections: [
        {
          heading: "Ce qu’est (et n’est pas) le Loto",
          paragraphs: [
            "Le Loto est un jeu de tirage français : une grille combine 5 numéros parmi 49 et un numéro Chance parmi 10. Un tirage public désigne ensuite la combinaison gagnante. Les rangs de gains dépendent du nombre de numéros trouvés, et du Chance.",
            "Ce site est éditorial et indépendant. Nous publions les résultats, des archives récentes, un simulateur et des stats descriptives. Nous ne vendons pas de tickets, ne sommes pas la FDJ, et aucun texte ici n’est un conseil pour « battre » le hasard.",
          ],
        },
        {
          heading: "Comment se déroule un tirage",
          paragraphs: [
            "En pratique, le Loto est tiré plusieurs soirs par semaine (lundi, mercredi, samedi — horaires indicatifs, Europe/Paris). Les horaires exacts relèvent de la FDJ.",
            "Une fois le tirage effectué, les sources publiques publient les 5 numéros, le numéro Chance, parfois un jackpot. EuroMillions Résultats interroge ces sources puis affiche la fiche du jour.",
          ],
        },
        {
          heading: "Lire une fiche résultat",
          paragraphs: [
            "Chaque fiche Loto montre la date, les 5 numéros (ordre croissant) et le Chance. Un lien mène au tirage voisin dans l’archive locale. Le simulateur compare une grille à un tirage déjà publié — il ne prédit rien.",
            "Les stats de fréquences décrivent seulement le passé observé sur cet historique local. Un numéro « en retard » n’est pas plus probable au prochain tirage.",
          ],
        },
        {
          heading: "Jackpot et rangs",
          paragraphs: [
            "Le rang 1 (5 numéros + Chance) est extrêmement rare. S’il n’y a pas de gagnant, le jackpot est en général reporté, dans les limites du règlement. Un montant annoncé n’est pas un gain personnel : c’est la cagnotte du rang 1 à ce tirage.",
            "Les montants des rangs inférieurs varient selon les mises et le nombre de gagnants. Seul l’opérateur fait foi pour un paiement.",
          ],
        },
        {
          heading: "Simulateur et archives",
          paragraphs: [
            "Sur la page Loto, le simulateur vous fait choisir 5 numéros et un Chance, puis compare au tirage choisi : rang et montant du barème publié (y compris le 2e tirage s’il est dans la source). Un compteur indique combien d’autres tirages de l’archive locale partagent au moins 3 numéros — lecture historique, pas un pronostic.",
            "Les archives compagnons sont plus courtes que l’historique EuroMillions : l’API publique FDJ ne remonte pas à 2004. Nous paginons ce que la source autorise et conservons jusqu’à 250 tirages.",
          ],
        },
        {
          heading: "Indépendance et jeu responsable",
          paragraphs: [
            "Pour jouer, passez uniquement par un opérateur légal (en France : réseau agréé, par exemple FDJ). Réservé aux majeurs (18+). Budget loisir, jamais un « système ».",
            "18+ · Jeu responsable · Risque de perte d’argent. Aide : Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    en: {
      title: "Understanding Loto",
      subtitle:
        "5 numbers from 49, Chance number, reading a result — with no promised system.",
      sections: [
        {
          heading: "What Loto is (and is not)",
          paragraphs: [
            "Loto is a French lottery: a grid combines 5 numbers from 49 and a Chance number from 10. A public draw then selects the winning combination. Prize tiers depend on how many numbers you match, and on Chance.",
            "This site is independent and editorial. We publish results, recent archives, a simulator and descriptive stats. We do not sell tickets, we are not FDJ, and nothing here is advice on “beating” chance.",
          ],
        },
        {
          heading: "How a draw works",
          paragraphs: [
            "In practice, Loto is drawn several evenings a week (Monday, Wednesday, Saturday — indicative times, Europe/Paris). Exact times are set by FDJ.",
            "After the draw, public sources publish the 5 numbers, the Chance number, sometimes a jackpot. EuroMillions Results polls those sources, then displays the day’s page.",
          ],
        },
        {
          heading: "Reading a result page",
          paragraphs: [
            "Each Loto page shows the date, 5 numbers (ascending) and Chance. A link leads to neighbouring draws in the local archive. The simulator compares a grid to a published draw — it does not predict anything.",
            "Frequency stats only describe the past on this local history. An “overdue” number is no more likely next draw.",
          ],
        },
        {
          heading: "Jackpot and tiers",
          paragraphs: [
            "Rank 1 (5 numbers + Chance) is extremely rare. If there is no winner, the jackpot is usually rolled over, within the game rules. An announced amount is not a personal prize: it is the rank-1 pool for that draw.",
            "Lower-tier amounts vary with stakes and the number of winners. Only the operator is authoritative for a payout.",
          ],
        },
        {
          heading: "Simulator and archives",
          paragraphs: [
            "On the Loto page, the simulator lets you pick 5 numbers and a Chance, then compares them with the chosen draw: published tier and amount (including the 2nd draw if the source has it). A counter shows how many other local draws share at least 3 numbers — historical reading, not a forecast.",
            "Companion archives are shorter than the EuroMillions history: the public FDJ API does not go back to 2004. We paginate what the source allows and keep up to 250 draws.",
          ],
        },
        {
          heading: "Independence and responsible play",
          paragraphs: [
            "To play, use only a licensed operator (in France: an authorised network such as FDJ). Adults only (18+). Leisure budget, never a “system”.",
            "18+ · Play responsibly · Risk of losing money. France help: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_EURODREAMS_GUIDE_SLUG,
    fr: {
      title: "Comprendre EuroDreams",
      subtitle:
        "6 numéros sur 40, numéro Dream, rente possible — lecture d’un résultat, sans méthode miracle.",
      sections: [
        {
          heading: "Ce qu’est EuroDreams",
          paragraphs: [
            "EuroDreams est un tirage européen proposé notamment via la FDJ : une grille combine 6 numéros parmi 40 et un numéro Dream parmi 5. Le rang 1 est souvent présenté comme une rente mensuelle pendant un nombre d’années fixé par le règlement — ce n’est pas un jackpot « cash » identique à l’EuroMillions.",
            "Ce site affiche le résultat public (numéros, Dream, montant / note de rente quand la source le fournit). Nous ne calculons pas votre rente personnelle et ne vendons pas de tickets.",
          ],
        },
        {
          heading: "Horaires et lecture",
          paragraphs: [
            "Les tirages ont généralement lieu en début de semaine et en fin de semaine (horaires indicatifs). Consultez la page EuroDreams pour le prochain créneau connu et le dernier résultat publié.",
            "La fiche montre les 6 numéros et le Dream. Si une rente est indiquée (montant / mois × années), c’est une donnée de source publique, pas un gain garanti pour vous.",
          ],
        },
        {
          heading: "Rangs et Dream",
          paragraphs: [
            "Les rangs dépendent du nombre de numéros justes et du Dream. Trouver le Dream sans assez de numéros ne suffit pas ; inversement, 6 numéros sans le Dream n’est pas le rang 1.",
            "Le tableau de gains publié (dont la rente 6+0 / 6+1) figure sur chaque fiche. Le simulateur affiche le rang et le montant ou la rente de ce barème — pour vérifier une grille, pas pour « optimiser » un rang.",
          ],
        },
        {
          heading: "Simulateur",
          paragraphs: [
            "Choisissez 6 numéros (1–40) et un Dream (1–5), puis la date du tirage. L’outil compare votre grille au résultat publié et signale les autres tirages de l’archive locale avec au moins 3 numéros en commun.",
            "Ce n’est pas un outil de pronostic. Un Dream « qui sort souvent » dans un historique court n’a pas plus de chances au prochain tirage.",
          ],
        },
        {
          heading: "Résultats",
          paragraphs: [
            "Les archives EuroDreams de ce site sont limitées par l’API publique FDJ (quelques dizaines de tirages, pas des années). Chaque fiche a une URL unique pour le référencement et le partage.",
            "EuroMillions reste le focus du site : plus d’historique, plus de rangs détaillés. EuroDreams est un compagnon, pas un « système croisé ».",
          ],
        },
        {
          heading: "Jeu responsable",
          paragraphs: [
            "Une rente affichée n’est pas un revenu. Réservé aux majeurs (18+). Budget loisir, opérateur légal uniquement.",
            "18+ · Jeu responsable · Risque de perte. Aide : Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    en: {
      title: "Understanding EuroDreams",
      subtitle:
        "6 numbers from 40, Dream number, possible annuity — how to read a result, with no miracle system.",
      sections: [
        {
          heading: "What EuroDreams is",
          paragraphs: [
            "EuroDreams is a European draw offered via FDJ among others: a grid combines 6 numbers from 40 and a Dream number from 5. Rank 1 is often presented as a monthly annuity for a number of years set by the rules — it is not a cash jackpot identical to EuroMillions.",
            "This site shows the public result (numbers, Dream, amount / annuity note when the source provides it). We do not calculate your personal annuity and we do not sell tickets.",
          ],
        },
        {
          heading: "Schedule and reading",
          paragraphs: [
            "Draws usually take place early and late in the week (indicative times). Check the EuroDreams page for the next known slot and the latest published result.",
            "The page shows the 6 numbers and the Dream. If an annuity is listed (amount / month × years), that is a public-source figure, not a guaranteed win for you.",
          ],
        },
        {
          heading: "Tiers and Dream",
          paragraphs: [
            "Tiers depend on how many numbers you match and on the Dream. Matching the Dream without enough numbers is not enough; conversely, 6 numbers without the Dream is not rank 1.",
            "The published prize table (including the 6+0 / 6+1 annuity) is on each card. The simulator shows the tier and the amount or annuity from that table — to check a grid, not to “optimise” a tier.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Pick 6 numbers (1–40) and a Dream (1–5), then the draw date. The tool compares your grid with the published result and flags other local-archive draws with at least 3 numbers in common.",
            "It is not a forecasting tool. A Dream that “comes up often” in a short history is no more likely next draw.",
          ],
        },
        {
          heading: "Results",
          paragraphs: [
            "EuroDreams archives on this site are limited by the public FDJ API (tens of draws, not years). Each card has a unique URL for search and sharing.",
            "EuroMillions remains the site’s focus: more history, more detailed tiers. EuroDreams is a companion, not a “cross-game system”.",
          ],
        },
        {
          heading: "Responsible play",
          paragraphs: [
            "A listed annuity is not income. Adults only (18+). Leisure budget, licensed operator only.",
            "18+ · Play responsibly · Risk of loss. Help: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_KENO_GUIDE_SLUG,
    fr: {
      title: "Comprendre le Keno",
      subtitle:
        "Tirages midi et soir, 16 numéros parmi 70, vous en jouez 4 à 10 — lecture et simulateur.",
      sections: [
        {
          heading: "Le principe",
          paragraphs: [
            "Au Keno (formule 2025), l’opérateur tire 16 numéros parmi 70. Vous choisissez combien de numéros jouer (4 à 10). Le gain dépend du nombre de numéros trouvés et du format de mise — barème FDJ publié sur chaque fiche, pas un jackpot unique type EuroMillions.",
            "Ce site affiche les numéros et le tableau de gains publiés pour chaque créneau (midi / soir). Nous ne vendons pas de tickets.",
          ],
        },
        {
          heading: "Midi et soir",
          paragraphs: [
            "Il y a en général deux tirages par jour civil : un créneau midi et un créneau soir (heure de Paris). Chaque fiche a une URL distincte (date + midi ou soir) pour éviter de confondre deux résultats du même jour.",
            "Les horaires exacts relèvent de la FDJ. Notre page Keno résume le prochain créneau à titre indicatif.",
          ],
        },
        {
          heading: "Lire une fiche",
          paragraphs: [
            "La fiche liste les numéros tirés. L’historique local est plus court que pour l’EuroMillions : l’API publique ne remonte pas très loin. Les anciennes formules (nombre de numéros tirés différent) peuvent apparaître dans des sources plus anciennes ; nous affichons ce que la source actuelle publie.",
            "Un multiplicateur éventuel, s’il est fourni par la source, est affiché comme donnée annexe — il ne change pas les numéros tirés.",
          ],
        },
        {
          heading: "Simulateur",
          paragraphs: [
            "Choisissez d’abord combien de numéros vous « jouez » (4 à 10, défaut 7), puis cochez-les (1–70). Comparez au tirage midi ou soir choisi. L’outil compte les numéros en commun et affiche le rang / montant du barème publié.",
            "Le multiplicateur option n’est pas appliqué dans le simulateur. Pour un ticket réel, seul l’opérateur fait foi.",
          ],
        },
        {
          heading: "Stats",
          paragraphs: [
            "Les fréquences portent sur les numéros tirés dans l’archive locale, pas sur « votre » taille de grille. Un numéro fréquent sur 20 tirages ne dit rien du prochain Keno.",
            "Keno n’est pas l’EuroMillions : ne mélangez pas les stats entre jeux.",
          ],
        },
        {
          heading: "Jeu responsable",
          paragraphs: [
            "Plusieurs tirages par jour n’invitent pas à jouer plus souvent. Budget loisir, 18+, opérateur légal.",
            "18+ · Jeu responsable · Risque de perte. Aide : Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    en: {
      title: "Understanding Keno",
      subtitle:
        "Lunchtime and evening draws, 16 numbers from 70, you play 4 to 10 — reading and simulator.",
      sections: [
        {
          heading: "The idea",
          paragraphs: [
            "In Keno (2025 formula), the operator draws 16 numbers from 70. You choose how many numbers to play (4 to 10). The prize depends on how many you match and on the stake format — the FDJ table published on each card, not a single EuroMillions-style jackpot.",
            "This site shows the published numbers and prize table for each slot (lunchtime / evening). We do not sell tickets.",
          ],
        },
        {
          heading: "Lunchtime and evening",
          paragraphs: [
            "There are usually two draws per calendar day: a lunchtime slot and an evening slot (Paris time). Each card has a distinct URL (date + lunchtime or evening) so two results on the same day are not mixed up.",
            "Exact times are set by FDJ. Our Keno page summarises the next slot as a guide only.",
          ],
        },
        {
          heading: "Reading a card",
          paragraphs: [
            "The card lists the drawn numbers. Local history is shorter than for EuroMillions: the public API does not go very far back. Older formulas (a different count of drawn numbers) may appear in older sources; we show what the current source publishes.",
            "A multiplier, if the source provides one, is shown as extra data — it does not change the drawn numbers.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "First choose how many numbers you “play” (4 to 10, default 7), then tick them (1–70). Compare with the chosen lunchtime or evening draw. The tool counts matching numbers and shows the published tier / amount.",
            "The optional multiplier is not applied in the simulator. For a real ticket, only the operator is authoritative.",
          ],
        },
        {
          heading: "Stats",
          paragraphs: [
            "Frequencies cover numbers drawn in the local archive, not “your” grid size. A frequent number over 20 draws says nothing about the next Keno.",
            "Keno is not EuroMillions: do not mix stats across games.",
          ],
        },
        {
          heading: "Responsible play",
          paragraphs: [
            "Several draws a day is not an invitation to play more often. Leisure budget, 18+, licensed operator.",
            "18+ · Play responsibly · Risk of loss. Help: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_CRESCENDO_GUIDE_SLUG,
    fr: {
      title: "Comprendre Crescendo",
      subtitle:
        "10 numéros sur 25, une lettre, plusieurs tirages le samedi — lecture et simulateur.",
      sections: [
        {
          heading: "Ce qu’est Crescendo",
          paragraphs: [
            "Crescendo est un tirage FDJ : une grille combine 10 numéros parmi 25 et une lettre. Plusieurs tirages peuvent avoir lieu le samedi, à des heures différentes — chaque fiche a une URL unique (date + heure Paris).",
            "Site indépendant : résultats publics, archives récentes, simulateur. Pas de vente de tickets.",
          ],
        },
        {
          heading: "Plusieurs tirages le même jour",
          paragraphs: [
            "Contrairement à l’EuroMillions (une grille par date), Crescendo peut publier plusieurs résultats le même samedi. Ne comparez pas une grille au « tirage du samedi » sans l’heure.",
            "La page du jeu liste les tirages récents avec l’heure. Cliquez une fiche pour le brief et le simulateur prérempli sur ce tirage.",
          ],
        },
        {
          heading: "Lire les numéros et la lettre",
          paragraphs: [
            "La fiche affiche les 10 numéros et la lettre tirée. Les rangs officiels combinent le nombre de numéros justes et la lettre ; le barème publié est sur la fiche.",
            "Notre simulateur compte les numéros en commun, la lettre, et affiche le rang / montant de ce barème.",
          ],
        },
        {
          heading: "Simulateur",
          paragraphs: [
            "Cochez 10 numéros (1–25) et une lettre A–Z, choisissez le tirage (date-heure), puis vérifiez. Un compteur signale d’autres tirages de l’archive avec au moins 3 numéros en commun.",
            "Hasard sans mémoire : une lettre « en retard » n’est pas due.",
          ],
        },
        {
          heading: "Résultats",
          paragraphs: [
            "L’historique local Crescendo est limité par l’API publique (quelques dizaines de tirages). Nous conservons jusqu’à 250 résultats quand la source les fournit.",
            "Crescendo n’est pas un « Loto du samedi » : règles, pool et horaires sont distincts.",
          ],
        },
        {
          heading: "Jeu responsable",
          paragraphs: [
            "Plusieurs tirages le samedi n’impliquent pas de miser sur chacun. 18+, budget loisir, opérateur légal.",
            "18+ · Jeu responsable · Risque de perte. Aide : Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    en: {
      title: "Understanding Crescendo",
      subtitle:
        "10 numbers from 25, a letter, several Saturday draws — reading and simulator.",
      sections: [
        {
          heading: "What Crescendo is",
          paragraphs: [
            "Crescendo is an FDJ draw: a grid combines 10 numbers from 25 and a letter. Several draws can take place on Saturday, at different times — each card has a unique URL (date + Paris time).",
            "Independent site: public results, recent archives, simulator. No ticket sales.",
          ],
        },
        {
          heading: "Several draws on the same day",
          paragraphs: [
            "Unlike EuroMillions (one grid per date), Crescendo can publish several results on the same Saturday. Do not compare a grid with “Saturday’s draw” without the time.",
            "The game page lists recent draws with the time. Open a card for the brief and a simulator pre-filled on that draw.",
          ],
        },
        {
          heading: "Reading numbers and the letter",
          paragraphs: [
            "The card shows the 10 numbers and the drawn letter. Official tiers combine how many numbers you match and the letter; the published table is on the card.",
            "Our simulator counts matching numbers, the letter, and shows the tier / amount from that table.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Tick 10 numbers (1–25) and a letter A–Z, pick the draw (date-time), then check. A counter flags other archive draws with at least 3 numbers in common.",
            "Chance has no memory: an “overdue” letter is not due.",
          ],
        },
        {
          heading: "Results",
          paragraphs: [
            "Local Crescendo history is limited by the public API (tens of draws). We keep up to 250 results when the source provides them.",
            "Crescendo is not “Saturday Loto”: rules, pool and times are distinct.",
          ],
        },
        {
          heading: "Responsible play",
          paragraphs: [
            "Several Saturday draws does not mean staking on each one. 18+, leisure budget, licensed operator.",
            "18+ · Play responsibly · Risk of loss. Help: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_READ_RESULTS_GUIDE_SLUG,
    fr: {
      title: "Lire un résultat de tirage",
      subtitle:
        "Méthode commune : fiche, brief, archives, simulateur — pour EuroMillions et les jeux compagnons.",
      sections: [
        {
          heading: "Une URL par tirage",
          paragraphs: [
            "Chaque résultat a une page dédiée. EuroMillions : /tirages/{date}. Loto et EuroDreams : /jeux/{jeu}/{date}. Keno : date + midi ou soir. Crescendo : date + heure. Cela évite de coller deux résultats sur la même adresse.",
            "Le brief en tête de fiche reformule les numéros publiés, le jackpot s’il est connu, et rappelle le simulateur. Il est généré à partir de nos données, pas d’un fil d’actualité étranger.",
          ],
        },
        {
          heading: "Ce que montre une fiche",
          paragraphs: [
            "Date (et créneau si besoin), numéros dans l’ordre croissant, bonus (étoiles, Chance, Dream, lettre), jackpot ou rente quand la source le fournit. Pour l’EuroMillions : code My Million et les 13 rangs. Pour Loto, EuroDreams, Keno et Crescendo : tableau de gains du tirage quand la source le publie.",
            "Les montants sont informatifs. Seul l’opérateur légal valide un ticket et un paiement.",
          ],
        },
        {
          heading: "Résultats",
          paragraphs: [
            "Les archives EuroMillions visent un historique long (backfill progressif depuis 2004 via des sources publiques). Les jeux compagnons dépendent de l’API FDJ : quelques dizaines de tirages, pas vingt ans.",
            "Un tableau de fréquences sur un historique court est du bruit. Ne l’utilisez pas comme pronostic.",
          ],
        },
        {
          heading: "Simulateur",
          paragraphs: [
            "Le simulateur compare une grille à un tirage déjà publié. Il ne « tire » pas le futur. Pour l’EuroMillions, il indique aussi le rang (5+2 jusqu’à 2+0) et, si la source l’a, le gain unitaire.",
            "Pour Loto, EuroDreams, Keno et Crescendo, il affiche aussi le rang et le montant du barème publié pour ce tirage (hors options comme le multiplicateur Keno).",
          ],
        },
        {
          heading: "Ne pas croiser les jeux",
          paragraphs: [
            "Une statistique EuroMillions ne dit rien sur le Loto. Un numéro « chaud » au Keno n’informe pas Crescendo. Chaque jeu a son pool et son calendrier.",
            "Pas de « combiné magique ». Si vous jouez, un opérateur légal, 18+, budget loisir.",
          ],
        },
        {
          heading: "Jeu responsable",
          paragraphs: [
            "Lire un résultat n’oblige pas à rejouer. 18+ · risque de perte. Aide : Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    en: {
      title: "How to read a draw result",
      subtitle:
        "Shared method: card, brief, archives, simulator — for EuroMillions and companion games.",
      sections: [
        {
          heading: "One URL per draw",
          paragraphs: [
            "Each result has its own page. EuroMillions: /tirages/{date}. Loto and EuroDreams: /jeux/{game}/{date}. Keno: date + lunchtime or evening. Crescendo: date + time. That avoids stacking two results on the same address.",
            "The brief at the top of the card restates the published numbers, the jackpot if known, and points to the simulator. It is generated from our data, not from a foreign news feed.",
          ],
        },
        {
          heading: "What a card shows",
          paragraphs: [
            "Date (and slot if needed), numbers in ascending order, bonus (stars, Chance, Dream, letter), jackpot or annuity when the source provides it. For EuroMillions: My Million code and the 13 tiers. For Loto, EuroDreams, Keno and Crescendo: the draw’s prize table when the source publishes it.",
            "Amounts are informational. Only the licensed operator validates a ticket and a payout.",
          ],
        },
        {
          heading: "Results",
          paragraphs: [
            "EuroMillions archives aim at a long history (progressive backfill from 2004 via public sources). Companion games depend on the FDJ API: tens of draws, not twenty years.",
            "A frequency table on a short history is noise. Do not use it as a forecast.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "The simulator compares a grid with a published draw. It does not “draw” the future. For EuroMillions it also shows the tier (5+2 down to 2+0) and, if the source has it, the unit prize.",
            "For Loto, EuroDreams, Keno and Crescendo it also shows the published tier and amount for that draw (excluding options such as the Keno multiplier).",
          ],
        },
        {
          heading: "Do not mix games",
          paragraphs: [
            "A EuroMillions statistic says nothing about Loto. A “hot” Keno number does not inform Crescendo. Each game has its own pool and calendar.",
            "No “magic combo”. If you play: licensed operator, 18+, leisure budget.",
          ],
        },
        {
          heading: "Responsible play",
          paragraphs: [
            "Reading a result does not mean you have to play again. 18+ · risk of loss. Help: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_SCHEDULE_GUIDE_SLUG,
    fr: {
      title: "Horaires des tirages FDJ",
      subtitle:
        "Repères indicatifs (Europe/Paris) pour EuroMillions, Loto, EuroDreams, Keno et Crescendo.",
      sections: [
        {
          heading: "Avertissement",
          paragraphs: [
            "Les horaires exacts, jours fériés et reports relèvent des opérateurs (FDJ en France, opérateurs nationaux pour l’EuroMillions). Ce guide donne des repères utiles pour lire nos pages, pas un calendrier officiel.",
            "La page « prochain tirage » EuroMillions affiche un compte à rebours vers le créneau habituel (mardi / vendredi vers 21h, heure de Paris) et le jackpot estimé quand il est public.",
          ],
        },
        {
          heading: "EuroMillions",
          paragraphs: [
            "En général le mardi et le vendredi, vers 21h (Europe/Paris). Après le tirage, les sources publiques publient boules, étoiles, jackpot et, en France, le code My Million. Notre poller interroge ensuite les sources toutes les 20 secondes tant que le rapport manque.",
            "Un jackpot annoncé pour « ce soir » n’est pas un gain. S’il n’y a pas de rang 1, il est souvent reporté.",
          ],
        },
        {
          heading: "Loto et EuroDreams",
          paragraphs: [
            "Loto : plusieurs soirs par semaine (repères : lundi, mercredi, samedi). EuroDreams : deux tirages par semaine, en début et fin de semaine. Consultez la page du jeu pour le résumé du prochain créneau.",
            "Chaque fiche Loto / EuroDreams est datée (un tirage par jour civil dans nos URLs).",
          ],
        },
        {
          heading: "Keno",
          paragraphs: [
            "Deux créneaux par jour en général : midi et soir. Nos fiches distinguent les deux. Ne vérifiez pas un ticket du soir sur le résultat de midi.",
          ],
        },
        {
          heading: "Crescendo",
          paragraphs: [
            "Plusieurs tirages le samedi, à des heures distinctes. L’URL inclut l’heure de Paris (HHMM) pour ne pas fusionner les résultats.",
          ],
        },
        {
          heading: "Jeu responsable",
          paragraphs: [
            "Connaître l’horaire n’est pas une raison de jouer « pile à l’heure ». 18+, budget loisir, opérateur légal. Aide : Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    en: {
      title: "FDJ draw schedules",
      subtitle:
        "Indicative landmarks (Europe/Paris) for EuroMillions, Loto, EuroDreams, Keno and Crescendo.",
      sections: [
        {
          heading: "Disclaimer",
          paragraphs: [
            "Exact times, public holidays and postponements are set by operators (FDJ in France, national operators for EuroMillions). This guide gives useful landmarks for reading our pages, not an official calendar.",
            "The EuroMillions “next draw” page shows a countdown to the usual slot (Tuesday / Friday around 9pm, Paris time) and the estimated jackpot when it is public.",
          ],
        },
        {
          heading: "EuroMillions",
          paragraphs: [
            "Usually Tuesday and Friday, around 9pm (Europe/Paris). After the draw, public sources publish numbers, stars, jackpot and, in France, the My Million code. Our poller then queries sources every 20 seconds while the report is missing.",
            "A jackpot announced for “tonight” is not a win. If there is no rank 1, it is often rolled over.",
          ],
        },
        {
          heading: "Loto and EuroDreams",
          paragraphs: [
            "Loto: several evenings a week (landmarks: Monday, Wednesday, Saturday). EuroDreams: two draws a week, early and late in the week. Check the game page for the next-slot summary.",
            "Each Loto / EuroDreams card is dated (one draw per calendar day in our URLs).",
          ],
        },
        {
          heading: "Keno",
          paragraphs: [
            "Usually two slots a day: lunchtime and evening. Our cards distinguish the two. Do not check an evening ticket against the lunchtime result.",
          ],
        },
        {
          heading: "Crescendo",
          paragraphs: [
            "Several Saturday draws, at distinct times. The URL includes Paris time (HHMM) so results are not merged.",
          ],
        },
        {
          heading: "Responsible play",
          paragraphs: [
            "Knowing the time is not a reason to play “right on the hour”. 18+, leisure budget, licensed operator. Help: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
  },
];
