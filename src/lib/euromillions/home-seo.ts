import { pickLocalized } from "@/i18n/locales";
import { formatEuroMillionsLongDate } from "./datetime";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw, EuroMillionsStore } from "./types";

function joinNums(values: number[]): string {
  return values.join(", ");
}

export function euroMillionsHomeTitle(
  locale: string,
  latest: EuroMillionsDraw | null,
): string {
  if (!isEuroMillionsDrawPublished(latest) || !latest) {
    return pickLocalized(locale, {
      fr: "Résultats EuroMillions : numéros, My Million et gains",
      en: "EuroMillions results: numbers, My Million and prizes",
      it: "Risultati EuroMillions: numeri, My Million e premi",
      es: "Resultados EuroMillions: números, My Million y premios",
      pt: "Resultados EuroMillions: números, My Million e prémios",
      de: "EuroMillions-Ergebnisse: Zahlen, My Million und Gewinne",
      nl: "EuroMillions-uitslagen: getallen, My Million en prijzen",
    });
  }
  const date = formatEuroMillionsLongDate(latest.date, locale);
  return pickLocalized(locale, {
    fr: `Résultats EuroMillions du ${date} : numéros, My Million, gains`,
    en: `EuroMillions results for ${date}: numbers, My Million, prizes`,
    it: `Risultati EuroMillions del ${date}: numeri, My Million, premi`,
    es: `Resultados EuroMillions del ${date}: números, My Million, premios`,
    pt: `Resultados EuroMillions de ${date}: números, My Million, prémios`,
    de: `EuroMillions-Ergebnisse vom ${date}: Zahlen, My Million, Gewinne`,
    nl: `EuroMillions-uitslagen van ${date}: getallen, My Million, prijzen`,
  });
}

export function euroMillionsHomeDescription(
  locale: string,
  latest: EuroMillionsDraw | null,
  store: EuroMillionsStore,
): string {
  if (isEuroMillionsDrawPublished(latest) && latest) {
    const date = formatEuroMillionsLongDate(latest.date, locale);
    const balls = joinNums(latest.numbers);
    const stars = joinNums(latest.stars);
    const mm = latest.myMillionCode
      ? pickLocalized(locale, {
          fr: `, code My Million ${latest.myMillionCode}`,
          en: `, My Million code ${latest.myMillionCode}`,
          it: `, codice My Million ${latest.myMillionCode}`,
          es: `, código My Million ${latest.myMillionCode}`,
          pt: `, código My Million ${latest.myMillionCode}`,
          de: `, My-Million-Code ${latest.myMillionCode}`,
          nl: `, My Million-code ${latest.myMillionCode}`,
        })
      : "";
    return pickLocalized(locale, {
      fr: `Résultats EuroMillions du ${date} : boules ${balls}, étoiles ${stars}${mm}. Tableau des 13 rangs. Site indépendant, 18+.`,
      en: `EuroMillions results for ${date}: numbers ${balls}, stars ${stars}${mm}. 13 prize tiers. Independent site, 18+.`,
      it: `Risultati EuroMillions del ${date}: numeri ${balls}, stelle ${stars}${mm}. 13 categorie. Sito indipendente, 18+.`,
      es: `Resultados EuroMillions del ${date}: números ${balls}, estrellas ${stars}${mm}. 13 categorías. Sitio independiente, 18+.`,
      pt: `Resultados EuroMillions de ${date}: números ${balls}, estrelas ${stars}${mm}. 13 escalões. Site independente, 18+.`,
      de: `EuroMillions-Ergebnisse vom ${date}: Zahlen ${balls}, Sterne ${stars}${mm}. 13 Ränge. Unabhängig, 18+.`,
      nl: `EuroMillions-uitslagen van ${date}: getallen ${balls}, sterren ${stars}${mm}. 13 rangen. Onafhankelijk, 18+.`,
    });
  }
  const next = store.nextDrawDate
    ? formatEuroMillionsLongDate(store.nextDrawDate, locale)
    : "";
  return pickLocalized(locale, {
    fr: `Résultats EuroMillions : derniers numéros, étoiles, My Million et gains par rang. Prochain tirage${next ? ` le ${next}` : ""} vers 21h. Site indépendant, 18+.`,
    en: `EuroMillions results: latest numbers, stars, My Million and prize tiers. Next draw${next ? ` on ${next}` : ""} around 9pm. Independent site, 18+.`,
    it: `Risultati EuroMillions: ultimi numeri, stelle, My Million e premi. Prossima estrazione${next ? ` il ${next}` : ""} verso le 21. Sito indipendente, 18+.`,
    es: `Resultados EuroMillions: últimos números, estrellas, My Million y premios. Próximo sorteo${next ? ` el ${next}` : ""} hacia las 21 h. Sitio independiente, 18+.`,
    pt: `Resultados EuroMillions: últimos números, estrelas, My Million e prémios. Próximo sorteio${next ? ` em ${next}` : ""} por volta das 21h. Site independente, 18+.`,
    de: `EuroMillions-Ergebnisse: letzte Zahlen, Sterne, My Million und Ränge. Nächste Ziehung${next ? ` am ${next}` : ""} gegen 21 Uhr. Unabhängig, 18+.`,
    nl: `EuroMillions-uitslagen: laatste getallen, sterren, My Million en rangen. Volgende trekking${next ? ` op ${next}` : ""} rond 21u. Onafhankelijk, 18+.`,
  });
}
