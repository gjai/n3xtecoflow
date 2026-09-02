const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HUB = /^\/(fr|en|it|es|pt|de|nl)\/tirages\/?$/;

/**
 * `/tirages?date=YYYY-MM-DD` est un doublon du hub (canonique /tirages).
 * Google les crawl au lieu des fiches `/tirages/{date}`.
 * Retourne le pathname 308, ou null si rien à rediriger.
 */
export function tiragesDateQueryPath(
  pathname: string,
  date: string | null | undefined,
): string | null {
  const match = pathname.match(HUB);
  if (!match || !date) return null;
  const locale = match[1];
  const iso = date.trim();
  if (ISO_DATE.test(iso)) return `/${locale}/tirages/${iso}`;
  return `/${locale}/tirages`;
}
