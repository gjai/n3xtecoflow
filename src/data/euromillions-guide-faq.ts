export type GuideFaqItem = { question: string; answer: string };

const FAQ: Record<string, { fr: GuideFaqItem[]; en: GuideFaqItem[] }> = {
  "comprendre-euromillions": {
    fr: [
      {
        question: "Quand a lieu le tirage EuroMillions ?",
        answer:
          "En général le mardi et le vendredi vers 21h (heure de Paris). Les horaires exacts relèvent des opérateurs.",
      },
      {
        question: "Ce site vend-il des tickets ?",
        answer:
          "Non. Site éditorial indépendant : résultats, archives et outils. Pour jouer : opérateur légal, 18+.",
      },
      {
        question: "Comment vérifier une grille ?",
        answer:
          "Utilisez le simulateur : 5 boules et 2 étoiles, puis la date du tirage. Nous ne validons pas de ticket physique.",
      },
    ],
    en: [
      {
        question: "When is the EuroMillions draw?",
        answer:
          "Usually Tuesday and Friday around 9pm (Paris time). Exact times are set by operators.",
      },
      {
        question: "Does this site sell tickets?",
        answer:
          "No. Independent editorial site: results, archives and tools. To play: licensed operator, 18+.",
      },
      {
        question: "How do I check a grid?",
        answer:
          "Use the simulator: 5 numbers and 2 stars, then the draw date. We do not validate physical tickets.",
      },
    ],
  },
  "probabilites-euromillions": {
    fr: [
      {
        question: "Quelle est la chance de gagner le jackpot ?",
        answer:
          "Environ 1 sur 140 millions pour une grille simple (5 boules + 2 étoiles). Aucune méthode ne change cette probabilité.",
      },
      {
        question: "Les numéros chauds aident-ils ?",
        answer:
          "Non. Ils décrivent le passé. Chaque combinaison équiprobable le reste.",
      },
      {
        question: "À quoi servent les stats de ce site ?",
        answer:
          "À lire l’historique local, pas à pronostiquer le prochain tirage.",
      },
    ],
    en: [
      {
        question: "What are the jackpot odds?",
        answer:
          "About 1 in 140 million for a single grid (5 numbers + 2 stars). No method changes that probability.",
      },
      {
        question: "Do hot numbers help?",
        answer:
          "No. They describe the past. Every equally likely combination stays equally likely.",
      },
      {
        question: "What are this site’s stats for?",
        answer:
          "To read the local history, not to forecast the next draw.",
      },
    ],
  },
  "jeu-responsable-euromillions": {
    fr: [
      {
        question: "Quel âge minimum ?",
        answer: "18 ans. Les jeux de tirage sont interdits aux mineurs.",
      },
      {
        question: "Où trouver de l’aide en France ?",
        answer:
          "Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr (appel non surtaxé).",
      },
      {
        question: "Faut-il augmenter la mise après une perte ?",
        answer:
          "Non. Ne poursuivez jamais vos pertes. Budget loisir fixé à l’avance.",
      },
    ],
    en: [
      {
        question: "Minimum age?",
        answer: "18. Draw games are forbidden to minors.",
      },
      {
        question: "Where to get help in France?",
        answer:
          "Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
      },
      {
        question: "Should I raise the stake after a loss?",
        answer:
          "No. Never chase losses. Set a leisure budget in advance.",
      },
    ],
  },
  "comprendre-my-million": {
    fr: [
      {
        question: "My Million est-il le jackpot EuroMillions ?",
        answer:
          "Non. C’est un code distinct, associé aux grilles jouées en France. Le gain My Million ne dépend pas des 5 boules et 2 étoiles.",
      },
      {
        question: "Comment vérifier un code ?",
        answer:
          "Sur la page My Million : collez vos codes et choisissez la date du tirage.",
      },
      {
        question: "Ce site délivre-t-il des codes ?",
        answer:
          "Non. Seul l’opérateur (FDJ) fait foi pour un paiement.",
      },
    ],
    en: [
      {
        question: "Is My Million the EuroMillions jackpot?",
        answer:
          "No. It is a separate code on grids played in France. The My Million prize does not depend on the 5 numbers and 2 stars.",
      },
      {
        question: "How do I check a code?",
        answer:
          "On the My Million page: paste your codes and pick the draw date.",
      },
      {
        question: "Does this site issue codes?",
        answer:
          "No. Only the operator (FDJ) is authoritative for a payout.",
      },
    ],
  },
  "rangs-gains-euromillions": {
    fr: [
      {
        question: "Combien de rangs paient ?",
        answer:
          "13 rangs, de 5+2 (jackpot) jusqu’à 2+0. Une seule boule ou une seule étoile ne paie pas.",
      },
      {
        question: "Les montants sont-ils fixes ?",
        answer:
          "Non. Ils dépendent de la cagnotte et du nombre de gagnants. La fiche d’un tirage liste les gains constatés quand la source les fournit.",
      },
      {
        question: "Le simulateur calcule-t-il mon rang ?",
        answer:
          "Oui, sur un tirage déjà publié. Ce n’est pas un outil pour « choisir le rang le plus rentable ».",
      },
    ],
    en: [
      {
        question: "How many tiers pay?",
        answer:
          "13 tiers, from 5+2 (jackpot) down to 2+0. A single number or a single star does not pay.",
      },
      {
        question: "Are amounts fixed?",
        answer:
          "No. They depend on the prize pool and the number of winners. A draw page lists observed prizes when the source provides them.",
      },
      {
        question: "Does the simulator compute my tier?",
        answer:
          "Yes, against a published draw. It is not a tool to pick “the most profitable tier”.",
      },
    ],
  },
  "euromillions-et-autres-tirages": {
    fr: [
      {
        question: "Pourquoi Loto et Keno ici ?",
        answer:
          "Ce sont des tirages FDJ utiles le soir d’un résultat. EuroMillions reste le sujet principal. Pas de « système croisé ».",
      },
      {
        question: "Chaque jeu a-t-il son simulateur ?",
        answer:
          "Oui, sur sa page /jeux/…. Les stats ne se mélangent pas entre jeux.",
      },
      {
        question: "Les archives compagnons sont-elles aussi longues ?",
        answer:
          "Non. L’API publique FDJ plafonne (quelques dizaines de tirages). L’EuroMillions vise un historique long.",
      },
    ],
    en: [
      {
        question: "Why Loto and Keno here?",
        answer:
          "They are FDJ draws useful on result night. EuroMillions remains the main topic. No “cross-game system”.",
      },
      {
        question: "Does each game have its own simulator?",
        answer:
          "Yes, on its /jeux/… page. Stats are not mixed across games.",
      },
      {
        question: "Are companion archives as long?",
        answer:
          "No. The public FDJ API caps at tens of draws. EuroMillions aims at a long history.",
      },
    ],
  },
  "comprendre-loto": {
    fr: [
      {
        question: "Quelle est la grille du Loto ?",
        answer:
          "5 numéros parmi 49 et un numéro Chance parmi 10.",
      },
      {
        question: "Quand a lieu le tirage ?",
        answer:
          "Plusieurs soirs par semaine (repères : lundi, mercredi, samedi). Horaires exacts : FDJ.",
      },
      {
        question: "Où vérifier une grille Loto ?",
        answer:
          "Simulateur sur /jeux/loto#simulateur, contre un tirage déjà publié.",
      },
    ],
    en: [
      {
        question: "What is the Loto grid?",
        answer: "5 numbers from 49 and a Chance number from 10.",
      },
      {
        question: "When is the draw?",
        answer:
          "Several evenings a week (landmarks: Monday, Wednesday, Saturday). Exact times: FDJ.",
      },
      {
        question: "Where do I check a Loto grid?",
        answer:
          "Simulator on /jeux/loto#simulateur, against a published draw.",
      },
    ],
  },
  "comprendre-eurodreams": {
    fr: [
      {
        question: "EuroDreams est-il un jackpot cash ?",
        answer:
          "Le rang 1 est souvent une rente mensuelle pendant un nombre d’années fixé par le règlement — distinct du jackpot EuroMillions.",
      },
      {
        question: "Quelle grille ?",
        answer: "6 numéros parmi 40 et un numéro Dream parmi 5.",
      },
      {
        question: "Le simulateur calcule-t-il ma rente ?",
        answer:
          "Il affiche le rang et le montant (ou la rente) du barème publié. Ce n’est pas un paiement : seul l’opérateur calcule un ticket réel.",
      },
    ],
    en: [
      {
        question: "Is EuroDreams a cash jackpot?",
        answer:
          "Rank 1 is often a monthly annuity for a number of years set by the rules — distinct from the EuroMillions jackpot.",
      },
      {
        question: "What is the grid?",
        answer: "6 numbers from 40 and a Dream number from 5.",
      },
      {
        question: "Does the simulator compute my annuity?",
        answer:
          "It shows the published tier and amount (or annuity). It is not a payout: only the operator settles a real ticket.",
      },
    ],
  },
  "comprendre-keno": {
    fr: [
      {
        question: "Combien de numéros sont tirés ?",
        answer:
          "16 parmi 70 (formule 2025). Vous en jouez 4 à 10 selon votre mise.",
      },
      {
        question: "Midi ou soir ?",
        answer:
          "Deux créneaux par jour en général. Chaque fiche a une URL distincte. Ne mélangez pas les tickets.",
      },
      {
        question: "Le simulateur paie-t-il comme la FDJ ?",
        answer:
          "Non. Il compte les numéros en commun et affiche le rang / montant du barème publié. Le multiplicateur n’est pas appliqué. Seul l’opérateur fait foi pour un ticket réel.",
      },
    ],
    en: [
      {
        question: "How many numbers are drawn?",
        answer: "16 from 70 (2025 formula). You play 4 to 10 depending on your stake.",
      },
      {
        question: "Lunchtime or evening?",
        answer:
          "Usually two slots a day. Each card has a distinct URL. Do not mix tickets.",
      },
      {
        question: "Does the simulator pay like FDJ?",
        answer:
          "No. It counts matching numbers and shows the published tier / amount. The multiplier is not applied. Only the operator is authoritative for a real ticket.",
      },
    ],
  },
  "comprendre-crescendo": {
    fr: [
      {
        question: "Quelle grille Crescendo ?",
        answer: "10 numéros parmi 25 et une lettre.",
      },
      {
        question: "Pourquoi plusieurs fiches le samedi ?",
        answer:
          "Plusieurs tirages le même jour, à des heures différentes. L’URL inclut l’heure de Paris.",
      },
      {
        question: "Le simulateur donne-t-il un gain en euros ?",
        answer:
          "Oui : rang et montant du barème publié pour ce tirage. Ce n’est pas un paiement FDJ.",
      },
    ],
    en: [
      {
        question: "What is the Crescendo grid?",
        answer: "10 numbers from 25 and a letter.",
      },
      {
        question: "Why several Saturday cards?",
        answer:
          "Several draws on the same day, at different times. The URL includes Paris time.",
      },
      {
        question: "Does the simulator give a euro prize?",
        answer:
          "Yes: the published tier and amount for that draw. It is not an FDJ payout.",
      },
    ],
  },
  "lire-resultats-tirages": {
    fr: [
      {
        question: "Où trouver le résultat d’une date ?",
        answer:
          "EuroMillions : /tirages/{date}. Autres jeux : /jeux/{jeu}/{clé}. Keno ajoute midi/soir, Crescendo l’heure.",
      },
      {
        question: "Le brief est-il une actu RSS ?",
        answer:
          "Non. Il est généré à partir de nos données (numéros, jackpot, codes).",
      },
      {
        question: "Puis-je croiser les stats entre jeux ?",
        answer:
          "Non. Chaque jeu a son pool. Une statistique EuroMillions ne dit rien sur le Loto.",
      },
    ],
    en: [
      {
        question: "Where is a dated result?",
        answer:
          "EuroMillions: /tirages/{date}. Other games: /jeux/{game}/{key}. Keno adds lunchtime/evening, Crescendo the time.",
      },
      {
        question: "Is the brief an RSS story?",
        answer:
          "No. It is generated from our data (numbers, jackpot, codes).",
      },
      {
        question: "Can I mix stats across games?",
        answer:
          "No. Each game has its own pool. A EuroMillions statistic says nothing about Loto.",
      },
    ],
  },
  "horaires-tirages-fdj": {
    fr: [
      {
        question: "Ces horaires sont-ils officiels ?",
        answer:
          "Non : repères indicatifs (Europe/Paris). Jours fériés et reports relèvent des opérateurs.",
      },
      {
        question: "EuroMillions, quel créneau ?",
        answer: "Mardi et vendredi, vers 21h heure de Paris, en général.",
      },
      {
        question: "Keno : deux fois par jour ?",
        answer:
          "Oui en général (midi et soir). Vérifiez le créneau sur la fiche, pas seulement la date.",
      },
    ],
    en: [
      {
        question: "Are these times official?",
        answer:
          "No: indicative landmarks (Europe/Paris). Holidays and postponements are set by operators.",
      },
      {
        question: "EuroMillions slot?",
        answer: "Tuesday and Friday, around 9pm Paris time, usually.",
      },
      {
        question: "Keno twice a day?",
        answer:
          "Usually yes (lunchtime and evening). Check the slot on the card, not only the date.",
      },
    ],
  },
  "toucher-un-gain-euromillions": {
    fr: [
      {
        question: "Ce site peut-il encaisser mon ticket ?",
        answer:
          "Non. Site éditorial indépendant : nous ne validons pas de ticket physique et ne versons aucun gain. Passez par un opérateur agréé (en France : FDJ).",
      },
      {
        question: "Combien de temps pour toucher un gain ?",
        answer:
          "En France, en général 60 jours à compter de la date du tirage (forclusion FDJ). Le règlement officiel de l’opérateur prime.",
      },
      {
        question: "Où s’adresser ?",
        answer:
          "Pages officielles FDJ (gains / EuroMillions) ou le compte en ligne où la grille a été validée. Nous ne tenons pas de liste de détaillants.",
      },
    ],
    en: [
      {
        question: "Can this site cash my ticket?",
        answer:
          "No. Independent editorial site: we do not validate physical tickets or pay prizes. Use a licensed operator (in France: FDJ).",
      },
      {
        question: "How long to claim a prize?",
        answer:
          "In France, generally 60 days from the draw date (FDJ time limit). The operator’s official rules prevail.",
      },
      {
        question: "Where do I go?",
        answer:
          "Official FDJ pages (winnings / EuroMillions) or the online account where the grid was validated. We do not keep a retailer list.",
      },
    ],
  },
};

export function getGuideFaq(slug: string, locale: string): GuideFaqItem[] {
  const entry = FAQ[slug];
  if (!entry) return [];
  if (locale !== "fr" && locale !== "en") return [];
  return locale === "en" ? entry.en : entry.fr;
}
