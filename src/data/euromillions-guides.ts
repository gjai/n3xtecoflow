import type { GuideArticle } from "./articles";

export const EUROMILLIONS_MAIN_GUIDE_SLUG = "comprendre-euromillions";
export const EUROMILLIONS_ODDS_GUIDE_SLUG = "probabilites-euromillions";
export const EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG = "jeu-responsable-euromillions";

const COVER = "/brands/euromillions/hero.svg";
const CREDIT = "EuroMillions Résultats";

export const euromillionsGuideCovers: Record<
  string,
  { src: string; credit: string; creditUrl: string }
> = {
  [EUROMILLIONS_MAIN_GUIDE_SLUG]: {
    src: COVER,
    credit: CREDIT,
    creditUrl: "https://euromillions-resultats.fr",
  },
  [EUROMILLIONS_ODDS_GUIDE_SLUG]: {
    src: COVER,
    credit: CREDIT,
    creditUrl: "https://euromillions-resultats.fr",
  },
  [EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG]: {
    src: COVER,
    credit: CREDIT,
    creditUrl: "https://euromillions-resultats.fr",
  },
};

export const euromillionsGuides: GuideArticle[] = [
  {
    slug: EUROMILLIONS_MAIN_GUIDE_SLUG,
    fr: {
      title: "Comprendre l’EuroMillions",
      subtitle:
        "Boules, étoiles, rangs de gains et lecture des résultats — sans promesse de méthode.",
      sections: [
        {
          heading: "Comment fonctionne un tirage",
          paragraphs: [
            "Chaque tirage EuroMillions tire 5 boules parmi 1–50, puis 2 étoiles parmi 1–12. Votre grille gagne si elle correspond à une combinaison de rangs publiée.",
            "Les tirages ont généralement lieu le mardi et le vendredi soir (horaires opérateurs). Ce site publie les résultats une fois connus des sources publiques.",
          ],
        },
        {
          heading: "Lire un résultat",
          paragraphs: [
            "Sur EuroMillions Résultats, chaque fiche affiche la date, les 5 boules, les 2 étoiles et, quand disponible, le jackpot annoncé.",
            "Les archives permettent de retrouver une date précise. Les stats de fréquences sont purement descriptives : elles ne prédisent pas le prochain tirage.",
          ],
        },
        {
          heading: "Indépendance",
          paragraphs: [
            "Nous ne vendons pas de tickets et ne sommes pas la FDJ ni un opérateur EuroMillions. Pour jouer, passez uniquement par un opérateur légal dans votre pays.",
            "18+ · Jeu responsable · Risque de perte d’argent.",
          ],
        },
      ],
    },
    en: {
      title: "Understanding EuroMillions",
      subtitle:
        "Numbers, stars, prize tiers and how to read results — with no promised system.",
      sections: [
        {
          heading: "How a draw works",
          paragraphs: [
            "Each EuroMillions draw picks 5 numbers from 1–50, then 2 stars from 1–12. Your grid wins if it matches a published prize tier.",
            "Draws usually run Tuesday and Friday evenings (operator schedules). This site publishes results once public sources confirm them.",
          ],
        },
        {
          heading: "Reading a result",
          paragraphs: [
            "On EuroMillions Results, each draw page shows the date, 5 numbers, 2 stars and, when available, the announced jackpot.",
            "Archives let you look up a date. Frequency stats are descriptive only: they do not predict the next draw.",
          ],
        },
        {
          heading: "Independence",
          paragraphs: [
            "We do not sell tickets and are not FDJ or a EuroMillions operator. To play, use only a legal operator in your country.",
            "18+ · Play responsibly · Risk of losing money.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_ODDS_GUIDE_SLUG,
    fr: {
      title: "Probabilités EuroMillions",
      subtitle:
        "Ordres de grandeur utiles — et pourquoi aucune « méthode » ne bat le hasard.",
      sections: [
        {
          heading: "Le jackpot est extrêmement rare",
          paragraphs: [
            "Gagner le jackpot (5 boules + 2 étoiles) est de l’ordre d’une chance sur ~140 millions. Les rangs inférieurs sont plus fréquents, avec des gains plus modestes.",
            "Choisir des dates de naissance ou des « numéros chauds » ne change pas la probabilité d’un tirage donné : chaque combinaison équiprobable reste équiprobable.",
          ],
        },
        {
          heading: "À quoi servent les stats",
          paragraphs: [
            "Les fréquences sur ce site décrivent le passé. Elles aident à visualiser la distribution, pas à « anticiper » le prochain résultat.",
            "Si vous jouez, traitez-le comme un loisir budgeté — jamais comme un investissement.",
          ],
        },
      ],
    },
    en: {
      title: "EuroMillions odds",
      subtitle:
        "Useful orders of magnitude — and why no “system” beats chance.",
      sections: [
        {
          heading: "The jackpot is extremely rare",
          paragraphs: [
            "Winning the jackpot (5 numbers + 2 stars) is on the order of one chance in ~140 million. Lower tiers are more common, with smaller prizes.",
            "Picking birthdays or “hot numbers” does not change the odds of a given draw: every equally likely combination stays equally likely.",
          ],
        },
        {
          heading: "What stats are for",
          paragraphs: [
            "Frequencies on this site describe the past. They help visualize the distribution, not “predict” the next result.",
            "If you play, treat it as a budgeted leisure activity — never as an investment.",
          ],
        },
      ],
    },
  },
  {
    slug: EUROMILLIONS_RESPONSIBLE_GUIDE_SLUG,
    fr: {
      title: "Jeu responsable & EuroMillions",
      subtitle: "Budget loisir, 18+, et ressources d’aide en France.",
      sections: [
        {
          heading: "Règles simples",
          paragraphs: [
            "Réservé aux majeurs (18+). Fixez un budget loisir à l’avance et ne le dépassez pas. Ne poursuivez jamais vos pertes.",
            "Les jeux de tirage comportent un risque de perte d’argent. Aucun résultat passé ne garantit un gain futur.",
          ],
        },
        {
          heading: "Aide",
          paragraphs: [
            "En France : Joueurs Info Service — 09 74 75 13 13 — https://www.joueurs-info-service.fr",
            "Si le jeu n’est plus un plaisir, arrêtez et demandez de l’aide.",
          ],
        },
      ],
    },
    en: {
      title: "Responsible play & EuroMillions",
      subtitle: "Leisure budget, 18+, and support resources in France.",
      sections: [
        {
          heading: "Simple rules",
          paragraphs: [
            "Adults only (18+). Set a leisure budget in advance and do not exceed it. Never chase losses.",
            "Lottery games involve a risk of losing money. No past result guarantees a future win.",
          ],
        },
        {
          heading: "Help",
          paragraphs: [
            "In France: Joueurs Info Service — 09 74 75 13 13 — https://www.joueurs-info-service.fr",
            "If gambling stops being fun, stop and seek help.",
          ],
        },
      ],
    },
  },
];
