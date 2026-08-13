import { pickLocalized } from "@/i18n/locales";
import type { EuroMillionsDraw } from "@/lib/euromillions/types";
import type { FdjGameDraw } from "@/lib/fdj-games/types";
import { groupLetter, groupNumbers } from "./rules";

function joinNums(values: number[], locale: string): string {
  const sep = locale === "en" ? ", " : ", ";
  return values.join(sep);
}

export type DrawBrief = {
  lead: string;
  paragraphs: string[];
};

export function euroMillionsBrief(
  draw: EuroMillionsDraw,
  locale: string,
  prettyDate: string,
  jackpot: string | null,
): DrawBrief {
  const balls = joinNums(draw.numbers, locale);
  const stars = joinNums(draw.stars, locale);
  const lead = pickLocalized(locale, {
    fr: `Le tirage EuroMillions du ${prettyDate} a donné les boules ${balls} et les étoiles ${stars}.`,
    en: `The EuroMillions draw on ${prettyDate} produced numbers ${balls} and stars ${stars}.`,
    it: `L’estrazione EuroMillions del ${prettyDate} ha dato i numeri ${balls} e le stelle ${stars}.`,
    es: `El sorteo EuroMillions del ${prettyDate} dio los números ${balls} y las estrellas ${stars}.`,
    pt: `O sorteio EuroMillions de ${prettyDate} deu os números ${balls} e as estrelas ${stars}.`,
    de: `Die EuroMillions-Ziehung vom ${prettyDate} brachte die Zahlen ${balls} und die Sterne ${stars}.`,
    nl: `De EuroMillions-trekking van ${prettyDate} gaf de getallen ${balls} en de sterren ${stars}.`,
  });
  const pJackpot = jackpot
    ? pickLocalized(locale, {
        fr: `Jackpot annoncé : ${jackpot}. Un montant annoncé n’est pas un gain personnel : il décrit la cagnotte du rang 1 à ce tirage.`,
        en: `Announced jackpot: ${jackpot}. That figure is the rank-1 pool for this draw, not a personal prize.`,
        it: `Jackpot annunciato: ${jackpot}. Non è una vincita personale: è il montepremi di prima categoria.`,
        es: `Bote anunciado: ${jackpot}. No es un premio personal: es el pozo de la categoría 1.`,
        pt: `Jackpot anunciado: ${jackpot}. Não é um prémio pessoal: é o prémio da 1.ª categoria neste sorteio.`,
        de: `Angekündigter Jackpot: ${jackpot}. Das ist der Rang-1-Topf dieser Ziehung, kein persönlicher Gewinn.`,
        nl: `Aangekondigde jackpot: ${jackpot}. Dat is de rang-1-pot van deze trekking, geen persoonlijke winst.`,
      })
    : pickLocalized(locale, {
        fr: `Le jackpot de ce tirage n’est pas encore renseigné dans nos sources publiques.`,
        en: `The jackpot for this draw is not yet listed in our public sources.`,
        it: `Il jackpot di questa estrazione non è ancora indicato nelle fonti pubbliche.`,
        es: `El bote de este sorteo aún no figura en nuestras fuentes públicas.`,
        pt: `O jackpot deste sorteio ainda não consta das fontes públicas.`,
        de: `Der Jackpot dieser Ziehung steht in unseren öffentlichen Quellen noch nicht.`,
        nl: `De jackpot van deze trekking staat nog niet in onze openbare bronnen.`,
      });
  const pMm = draw.myMillionCode
    ? pickLocalized(locale, {
        fr: `Code My Million publié : ${draw.myMillionCode}. Il est distinct du jackpot EuroMillions — vérifiez-le sur la page My Million.`,
        en: `Published My Million code: ${draw.myMillionCode}. It is separate from the EuroMillions jackpot — check it on the My Million page.`,
        it: `Codice My Million pubblicato: ${draw.myMillionCode}. È distinto dal jackpot — verificate nella pagina My Million.`,
        es: `Código My Million publicado: ${draw.myMillionCode}. Es distinto del bote — compruébelo en la página My Million.`,
        pt: `Código My Million publicado: ${draw.myMillionCode}. É distinto do jackpot — confirme na página My Million.`,
        de: `Veröffentlichter My-Million-Code: ${draw.myMillionCode}. Er ist vom Jackpot getrennt — prüfen Sie ihn auf der My-Million-Seite.`,
        nl: `Gepubliceerde My Million-code: ${draw.myMillionCode}. Die is los van de jackpot — controleer op de My Million-pagina.`,
      })
    : pickLocalized(locale, {
        fr: `Pas de code My Million dans cette fiche (souvent présent sur les grilles jouées en France).`,
        en: `No My Million code on this card (usually present on grids played in France).`,
        it: `Nessun codice My Million in questa scheda (di solito sulle griglie giocate in Francia).`,
        es: `Sin código My Million en esta ficha (suele figurar en las grids jugadas en Francia).`,
        pt: `Sem código My Million nesta ficha (habitual nas grelhas jogadas em França).`,
        de: `Kein My-Million-Code auf dieser Karte (üblich bei in Frankreich gespielten Grids).`,
        nl: `Geen My Million-code op deze fiche (vaak bij grids gespeeld in Frankrijk).`,
      });
  const pHow = pickLocalized(locale, {
    fr: `Utilisez le simulateur pour comparer une grille à ce tirage. Site indépendant, 18+, jeu responsable — aucun système ne bat les probabilités.`,
    en: `Use the simulator to compare a grid with this draw. Independent site, 18+, play responsibly — no system beats the odds.`,
    it: `Usate il simulatore per confrontare una griglia con questa estrazione. Sito indipendente, 18+, gioco responsabile.`,
    es: `Use el simulador para comparar una combinación con este sorteo. Sitio independiente, 18+, juego responsable.`,
    pt: `Use o simulador para comparar uma grelha com este sorteio. Site independente, 18+, jogo responsável.`,
    de: `Vergleichen Sie ein Grid mit dieser Ziehung im Simulator. Unabhängige Seite, 18+, verantwortungsvoll spielen.`,
    nl: `Vergelijk een grid met deze trekking in de simulator. Onafhankelijke site, 18+, speel verantwoord.`,
  });
  return { lead, paragraphs: [pJackpot, pMm, pHow] };
}

export function companionBrief(
  draw: FdjGameDraw,
  locale: string,
  prettyDate: string,
  gameLabel: string,
  jackpot: string | null,
): DrawBrief {
  const main = joinNums(groupNumbers(draw, "main"), locale);
  const chance = groupNumbers(draw, "chance");
  const dream = groupNumbers(draw, "dream");
  const letter = groupLetter(draw);
  const extraBits: string[] = [];
  if (chance.length) extraBits.push(`Chance ${joinNums(chance, locale)}`);
  if (dream.length) extraBits.push(`Dream ${joinNums(dream, locale)}`);
  if (letter) extraBits.push(letter);
  const extra = extraBits.length ? ` · ${extraBits.join(" · ")}` : "";
  const lead = pickLocalized(locale, {
    fr: `Résultat ${gameLabel} du ${prettyDate} : ${main}${extra}.`,
    en: `${gameLabel} result for ${prettyDate}: ${main}${extra}.`,
    it: `Risultato ${gameLabel} del ${prettyDate}: ${main}${extra}.`,
    es: `Resultado ${gameLabel} del ${prettyDate}: ${main}${extra}.`,
    pt: `Resultado ${gameLabel} de ${prettyDate}: ${main}${extra}.`,
    de: `${gameLabel}-Ergebnis vom ${prettyDate}: ${main}${extra}.`,
    nl: `${gameLabel}-uitslag van ${prettyDate}: ${main}${extra}.`,
  });
  const p2 = jackpot
    ? pickLocalized(locale, {
        fr: `Montant / jackpot indiqué par les sources : ${jackpot}. Chiffre informatif, pas un gain garanti pour vous.`,
        en: `Amount / jackpot from public sources: ${jackpot}. Informational only, not a guaranteed personal win.`,
        it: `Importo / jackpot dalle fonti: ${jackpot}. Solo informativo, non una vincita personale.`,
        es: `Importe / bote según las fuentes: ${jackpot}. Orientativo, no un premio personal.`,
        pt: `Montante / jackpot das fontes: ${jackpot}. Informativo, não um prémio pessoal.`,
        de: `Betrag / Jackpot laut Quellen: ${jackpot}. Nur Information, kein persönlicher Gewinn.`,
        nl: `Bedrag / jackpot volgens de bronnen: ${jackpot}. Informatief, geen persoonlijke winst.`,
      })
    : pickLocalized(locale, {
        fr: `Pas de montant de jackpot dans cette fiche — les numéros restent la donnée principale.`,
        en: `No jackpot figure on this card — the numbers remain the main fact.`,
        it: `Nessun importo jackpot in scheda — i numeri restano il dato principale.`,
        es: `Sin cifra de bote en esta ficha — los números son el dato principal.`,
        pt: `Sem valor de jackpot nesta ficha — os números são o dado principal.`,
        de: `Keine Jackpot-Zahl auf dieser Karte — die Zahlen sind die Hauptsache.`,
        nl: `Geen jackpotbedrag op deze fiche — de getallen blijven het hoofdfeit.`,
      });
  const p3 = pickLocalized(locale, {
    fr: `Vérifiez une grille avec le simulateur ${gameLabel} sur cette page. Site indépendant, 18+, jeu responsable.`,
    en: `Check a grid with the ${gameLabel} simulator on this page. Independent site, 18+, play responsibly.`,
    it: `Controllate una griglia con il simulatore ${gameLabel} in questa pagina. Sito indipendente, 18+.`,
    es: `Compruebe una combinación con el simulador ${gameLabel} en esta página. Sitio independiente, 18+.`,
    pt: `Confirme uma grelha com o simulador ${gameLabel} nesta página. Site independente, 18+.`,
    de: `Prüfen Sie ein Grid mit dem ${gameLabel}-Simulator auf dieser Seite. Unabhängig, 18+.`,
    nl: `Controleer een grid met de ${gameLabel}-simulator op deze pagina. Onafhankelijk, 18+.`,
  });
  return { lead, paragraphs: [p2, p3] };
}
