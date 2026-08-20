import { pickLocalized } from "@/i18n/locales";
import { formatEuroMillionsLongDate } from "./datetime";
import { sequentialDrawId } from "./draw-id";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw, EuroMillionsStore } from "./types";

function joinNums(values: number[]): string {
  return values.join(", ");
}

function money(amount: number | null | undefined, locale: string): string | null {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function countLabel(n: number, locale: string): string {
  return new Intl.NumberFormat(
    locale === "en" ? "en-GB" : "fr-FR",
  ).format(n);
}

export function euroMillionsResultsFaq(args: {
  locale: string;
  store: EuroMillionsStore;
  draw?: EuroMillionsDraw | null;
}): { question: string; answer: string }[] {
  const { locale, store } = args;
  const draw = args.draw ?? store.latest ?? null;
  const published = isEuroMillionsDrawPublished(draw);
  const date = draw
    ? formatEuroMillionsLongDate(draw.date, locale)
    : "";
  const next = store.nextDrawDate
    ? formatEuroMillionsLongDate(store.nextDrawDate, locale)
    : "";
  const jackpot = money(draw?.jackpotEur, locale);
  const nextJackpot = money(store.nextJackpotEur, locale);
  const mm = draw?.myMillionCode ? ` ${draw.myMillionCode}` : "";
  const n = published && draw ? joinNums(draw.numbers) : "";
  const s = published && draw ? joinNums(draw.stars) : "";
  const drawNo = sequentialDrawId(draw?.drawId);

  const todayA = published && draw
    ? pickLocalized(locale, {
        fr: `Le tirage du ${date}${drawNo ? ` (n° ${drawNo})` : ""} a donné les boules ${n} et les étoiles ${s}.${mm ? ` Code My Million :${mm}.` : ""}${jackpot ? ` Jackpot annoncé : ${jackpot}.` : ""} Les 13 rangs et les gagnants France / Europe sont sur cette page.`,
        en: `The ${date} draw${drawNo ? ` (no. ${drawNo})` : ""} produced numbers ${n} and stars ${s}.${mm ? ` My Million code:${mm}.` : ""}${jackpot ? ` Announced jackpot: ${jackpot}.` : ""} The 13 prize tiers and France / Europe winner counts are on this page.`,
        it: `L’estrazione del ${date}${drawNo ? ` (n. ${drawNo})` : ""} ha dato i numeri ${n} e le stelle ${s}.${mm ? ` Codice My Million:${mm}.` : ""}${jackpot ? ` Jackpot: ${jackpot}.` : ""} I 13 ranghi e i vincitori Francia / Europa sono in questa pagina.`,
        es: `El sorteo del ${date}${drawNo ? ` (n.º ${drawNo})` : ""} dio los números ${n} y las estrellas ${s}.${mm ? ` Código My Million:${mm}.` : ""}${jackpot ? ` Bote: ${jackpot}.` : ""} Las 13 categorías y los ganadores Francia / Europa están en esta página.`,
        pt: `O sorteio de ${date}${drawNo ? ` (n.º ${drawNo})` : ""} deu os números ${n} e as estrelas ${s}.${mm ? ` Código My Million:${mm}.` : ""}${jackpot ? ` Jackpot: ${jackpot}.` : ""} Os 13 escalões e os vencedores França / Europa estão nesta página.`,
        de: `Die Ziehung vom ${date}${drawNo ? ` (Nr. ${drawNo})` : ""} brachte die Zahlen ${n} und die Sterne ${s}.${mm ? ` My-Million-Code:${mm}.` : ""}${jackpot ? ` Jackpot: ${jackpot}.` : ""} Die 13 Ränge und Gewinner Frankreich / Europa stehen auf dieser Seite.`,
        nl: `De trekking van ${date}${drawNo ? ` (nr. ${drawNo})` : ""} gaf de getallen ${n} en de sterren ${s}.${mm ? ` My Million-code:${mm}.` : ""}${jackpot ? ` Jackpot: ${jackpot}.` : ""} De 13 rangen en winnaars Frankrijk / Europa staan op deze pagina.`,
      })
    : pickLocalized(locale, {
        fr: `L’accueil affiche le dernier tirage publié : 5 boules, 2 étoiles, le code My Million et le tableau des 13 rangs. Les tirages ont lieu le mardi et le vendredi vers 21h (heure de Paris).`,
        en: `The homepage shows the latest published draw: 5 numbers, 2 stars, the My Million code and the 13 prize tiers. Draws are on Tuesdays and Fridays around 9pm Paris time.`,
        it: `La home mostra l’ultima estrazione pubblicata: 5 numeri, 2 stelle, il codice My Million e i 13 ranghi. Estrazioni martedì e venerdì verso le 21 (ora di Parigi).`,
        es: `La portada muestra el último sorteo publicado: 5 números, 2 estrellas, el código My Million y las 13 categorías. Sorteos martes y viernes hacia las 21 h (hora de París).`,
        pt: `A página inicial mostra o último sorteio publicado: 5 números, 2 estrelas, o código My Million e os 13 escalões. Sorteios à terça e sexta por volta das 21h (hora de Paris).`,
        de: `Die Startseite zeigt die letzte veröffentlichte Ziehung: 5 Zahlen, 2 Sterne, My-Million-Code und 13 Ränge. Ziehungen dienstags und freitags gegen 21 Uhr (Pariser Zeit).`,
        nl: `De homepage toont de laatste gepubliceerde trekking: 5 getallen, 2 sterren, de My Million-code en de 13 rangen. Trekkingen op dinsdag en vrijdag rond 21u (Parijse tijd).`,
      });

  const whenA = pickLocalized(locale, {
    fr: `Mardi et vendredi vers 21h (heure de Paris).${next ? ` Prochain tirage : ${next}${nextJackpot ? ` (jackpot estimé ${nextJackpot})` : ""}.` : ""} Les numéros sortent vers 21h15, les rapports de gains souvent vers 22h.`,
    en: `Tuesdays and Fridays around 9pm Paris time.${next ? ` Next draw: ${next}${nextJackpot ? ` (estimated jackpot ${nextJackpot})` : ""}.` : ""} Numbers around 9.15pm, prize reports often around 10pm.`,
    it: `Martedì e venerdì verso le 21 (ora di Parigi).${next ? ` Prossima estrazione: ${next}${nextJackpot ? ` (jackpot stimato ${nextJackpot})` : ""}.` : ""} Numeri verso le 21:15, rapporti spesso verso le 22.`,
    es: `Martes y viernes hacia las 21 h (hora de París).${next ? ` Próximo sorteo: ${next}${nextJackpot ? ` (bote estimado ${nextJackpot})` : ""}.` : ""} Números hacia las 21:15, informes a menudo hacia las 22 h.`,
    pt: `Terça e sexta por volta das 21h (hora de Paris).${next ? ` Próximo sorteio: ${next}${nextJackpot ? ` (jackpot estimado ${nextJackpot})` : ""}.` : ""} Números por volta das 21h15, relatórios muitas vezes pelas 22h.`,
    de: `Dienstags und freitags gegen 21 Uhr (Pariser Zeit).${next ? ` Nächste Ziehung: ${next}${nextJackpot ? ` (geschätzter Jackpot ${nextJackpot})` : ""}.` : ""} Zahlen gegen 21:15, Gewinnberichte oft gegen 22 Uhr.`,
    nl: `Dinsdag en vrijdag rond 21u (Parijse tijd).${next ? ` Volgende trekking: ${next}${nextJackpot ? ` (geschatte jackpot ${nextJackpot})` : ""}.` : ""} Getallen rond 21u15, rapporten vaak rond 22u.`,
  });

  const r1 = published ? draw?.prizeTiers?.[0] : undefined;
  const whoA =
    r1 && (r1.winnersEurope != null || r1.winners != null)
      ? r1.winnersEurope === 0
        ? pickLocalized(locale, {
            fr: `Aucune grille au rang 1 (5+2) en Europe pour le tirage du ${date}. ${countLabel(r1.winners, locale)} gagnant(s) annoncé(s) en France sur ce rang. Vérifiez votre grille avec le simulateur — ne jetez pas le reçu trop vite.`,
            en: `No rank-1 (5+2) winner in Europe for the ${date} draw. ${countLabel(r1.winners, locale)} winner(s) announced in France at that tier. Check your grid with the simulator — don’t discard your ticket too soon.`,
            it: `Nessuna griglia di 1ª categoria (5+2) in Europa per il ${date}. ${countLabel(r1.winners, locale)} vincitore/i in Francia su questo rango. Verificate con il simulatore.`,
            es: `Ninguna combinación de categoría 1 (5+2) en Europa el ${date}. ${countLabel(r1.winners, locale)} ganador(es) en Francia en ese rango. Compruebe su grid con el simulador.`,
            pt: `Nenhuma grelha de 1.ª categoria (5+2) na Europa em ${date}. ${countLabel(r1.winners, locale)} vencedor(es) em França neste escalão. Confirme no simulador.`,
            de: `Kein Rang-1-Gewinn (5+2) in Europa am ${date}. ${countLabel(r1.winners, locale)} Gewinner in Frankreich in diesem Rang. Prüfen Sie Ihr Grid im Simulator.`,
            nl: `Geen rang-1-grid (5+2) in Europa op ${date}. ${countLabel(r1.winners, locale)} winnaar(s) in Frankrijk op die rang. Controleer met de simulator.`,
          })
        : pickLocalized(locale, {
            fr: `Rang 1 (5+2) du ${date} : ${countLabel(r1.winnersEurope ?? 0, locale)} gagnant(s) en Europe, dont ${countLabel(r1.winners, locale)} en France. Les autres rangs sont dans le tableau des gains. Vérifiez votre grille avec le simulateur.`,
            en: `Rank 1 (5+2) on ${date}: ${countLabel(r1.winnersEurope ?? 0, locale)} winner(s) in Europe, including ${countLabel(r1.winners, locale)} in France. Other tiers are in the prize table. Check your grid with the simulator.`,
            it: `1ª categoria (5+2) del ${date}: ${countLabel(r1.winnersEurope ?? 0, locale)} vincitore/i in Europa, di cui ${countLabel(r1.winners, locale)} in Francia. Le altre categorie sono nella tabella. Verificate con il simulatore.`,
            es: `Categoría 1 (5+2) del ${date}: ${countLabel(r1.winnersEurope ?? 0, locale)} ganador(es) en Europa, de ellos ${countLabel(r1.winners, locale)} en Francia. El resto está en la tabla. Use el simulador.`,
            pt: `1.ª categoria (5+2) de ${date}: ${countLabel(r1.winnersEurope ?? 0, locale)} vencedor(es) na Europa, dos quais ${countLabel(r1.winners, locale)} em França. Os outros escalões estão na tabela. Use o simulador.`,
            de: `Rang 1 (5+2) am ${date}: ${countLabel(r1.winnersEurope ?? 0, locale)} Gewinner in Europa, davon ${countLabel(r1.winners, locale)} in Frankreich. Die übrigen Ränge stehen in der Tabelle. Simulator nutzen.`,
            nl: `Rang 1 (5+2) op ${date}: ${countLabel(r1.winnersEurope ?? 0, locale)} winnaar(s) in Europa, waarvan ${countLabel(r1.winners, locale)} in Frankrijk. De andere rangen staan in de tabel. Gebruik de simulator.`,
          })
      : pickLocalized(locale, {
          fr: `Les rapports de gains (gagnants France et Europe) sont en général publiés vers 22h le soir du tirage. En attendant, les 5 boules, 2 étoiles et le code My Million suffisent pour comparer une grille.`,
          en: `Prize reports (France and Europe winner counts) are usually published around 10pm on draw night. Until then, the 5 numbers, 2 stars and My Million code are enough to check a grid.`,
          it: `I rapporti sui premi (vincitori Francia ed Europa) escono in genere verso le 22. Fino ad allora bastano i 5 numeri, le 2 stelle e il codice My Million.`,
          es: `Los informes de premios (ganadores Francia y Europa) suelen publicarse hacia las 22 h. Hasta entonces bastan los 5 números, 2 estrellas y el código My Million.`,
          pt: `Os relatórios de prémios (vencedores França e Europa) saem em geral pelas 22h. Até lá bastam os 5 números, 2 estrelas e o código My Million.`,
          de: `Die Gewinnberichte (Gewinner Frankreich und Europa) erscheinen meist gegen 22 Uhr. Bis dahin reichen 5 Zahlen, 2 Sterne und der My-Million-Code.`,
          nl: `De winstrapporten (winnaars Frankrijk en Europa) volgen meestal rond 22u. Tot dan volstaan de 5 getallen, 2 sterren en de My Million-code.`,
        });

  return [
    {
      question: pickLocalized(locale, {
        fr: "Quels sont les numéros gagnants de l’EuroMillions aujourd’hui ?",
        en: "What are today’s EuroMillions winning numbers?",
        it: "Quali sono i numeri vincenti EuroMillions di oggi ?",
        es: "¿Cuáles son los números ganadores de EuroMillions hoy?",
        pt: "Quais são os números vencedores do EuroMillions hoje?",
        de: "Wie lauten die heutigen EuroMillions-Gewinnzahlen?",
        nl: "Wat zijn de winnende EuroMillions-getallen van vandaag?",
      }),
      answer: todayA,
    },
    {
      question: pickLocalized(locale, {
        fr: "Quand a lieu le prochain tirage EuroMillions ?",
        en: "When is the next EuroMillions draw?",
        it: "Quando è la prossima estrazione EuroMillions ?",
        es: "¿Cuándo es el próximo sorteo EuroMillions?",
        pt: "Quando é o próximo sorteio EuroMillions?",
        de: "Wann ist die nächste EuroMillions-Ziehung?",
        nl: "Wanneer is de volgende EuroMillions-trekking?",
      }),
      answer: whenA,
    },
    {
      question: pickLocalized(locale, {
        fr: "Qui a gagné à l’EuroMillions aujourd’hui ?",
        en: "Who won EuroMillions today?",
        it: "Chi ha vinto all’EuroMillions oggi ?",
        es: "¿Quién ha ganado EuroMillions hoy?",
        pt: "Quem ganhou o EuroMillions hoje?",
        de: "Wer hat heute bei EuroMillions gewonnen?",
        nl: "Wie heeft vandaag EuroMillions gewonnen?",
      }),
      answer: whoA,
    },
    {
      question: pickLocalized(locale, {
        fr: "Comment vérifier une grille EuroMillions ?",
        en: "How do I check a EuroMillions grid?",
        it: "Come verifico una griglia EuroMillions ?",
        es: "¿Cómo comprobar una combinación EuroMillions?",
        pt: "Como verificar uma grelha EuroMillions?",
        de: "Wie prüfe ich ein EuroMillions-Grid?",
        nl: "Hoe controleer ik een EuroMillions-grid?",
      }),
      answer: pickLocalized(locale, {
        fr: "Utilisez le simulateur : 5 boules, 2 étoiles, date du tirage. L’outil indique le rang éventuel. Nous ne validons pas de ticket physique.",
        en: "Use the simulator: 5 numbers, 2 stars, draw date. It shows any matching tier. We do not validate physical tickets.",
        it: "Usate il simulatore: 5 numeri, 2 stelle, data. Indica l’eventuale categoria. Non convalidiamo biglietti fisici.",
        es: "Use el simulador: 5 números, 2 estrellas, fecha. Indica la categoría. No validamos tickets físicos.",
        pt: "Use o simulador: 5 números, 2 estrelas, data. Indica o escalão. Não validamos bilhetes físicos.",
        de: "Nutzen Sie den Simulator: 5 Zahlen, 2 Sterne, Datum. Er zeigt den Rang. Wir prüfen keine physischen Tickets.",
        nl: "Gebruik de simulator: 5 getallen, 2 sterren, datum. Die toont de rang. We valideren geen fysieke tickets.",
      }),
    },
    {
      question: pickLocalized(locale, {
        fr: "Ce site vend-il des tickets ?",
        en: "Does this site sell tickets?",
        it: "Questo sito vende biglietti ?",
        es: "¿Este sitio vende tickets?",
        pt: "Este site vende bilhetes?",
        de: "Verkauft diese Seite Tickets?",
        nl: "Verkoopt deze site tickets?",
      }),
      answer: pickLocalized(locale, {
        fr: "Non. Site éditorial indépendant : résultats, archives et outils. Pour jouer, un opérateur légal (en France : réseau agréé, par exemple FDJ). 18+ · jeu responsable.",
        en: "No. Independent editorial site: results, archives and tools. To play, use a licensed operator (in France: e.g. FDJ). 18+ · play responsibly.",
        it: "No. Sito editoriale indipendente. Per giocare, un operatore legale (in Francia: es. FDJ). 18+.",
        es: "No. Sitio editorial independiente. Para jugar, un operador legal (en Francia: p. ej. FDJ). 18+.",
        pt: "Não. Site editorial independente. Para jogar, um operador legal (em França: p.ex. FDJ). 18+.",
        de: "Nein. Unabhängige redaktionelle Seite. Zum Spielen ein lizenzierter Anbieter (in Frankreich z. B. FDJ). 18+.",
        nl: "Nee. Onafhankelijke editoriale site. Om te spelen: een vergunde operator (in Frankrijk o.a. FDJ). 18+.",
      }),
    },
  ];
}
