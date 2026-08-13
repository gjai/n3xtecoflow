/** ICS récurrent mardi + vendredi 21h Europe/Paris — pas une newsletter. */
export function euroMillionsDrawCalendarIcs(origin: string): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EuroMillions Resultats//Draws//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:EuroMillions — tirages",
    "X-WR-TIMEZONE:Europe/Paris",
    "BEGIN:VEVENT",
    "UID:euromillions-draw@euromillions-resultats.fr",
    `DTSTAMP:${stamp}`,
    "DTSTART;TZID=Europe/Paris:20260106T210000",
    "DTEND;TZID=Europe/Paris:20260106T213000",
    "RRULE:FREQ=WEEKLY;BYDAY=TU,FR",
    "SUMMARY:Tirage EuroMillions",
    "DESCRIPTION:Résultat vers 21h (Europe/Paris). Site indépendant, 18+\\, jeu responsable. Pas de vente de tickets.",
    `URL:${origin}/fr/prochain-tirage`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
