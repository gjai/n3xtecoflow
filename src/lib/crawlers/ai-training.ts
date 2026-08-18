/**
 * Crawlers d’entraînement IA (pas Googlebot).
 * ClaudeBot + meta-externalagent saturent /tirages (archives).
 * facebookexternalhit (aperçus de lien) n’est pas dans cette liste.
 */
export const AI_TRAINING_ARCHIVE_BOTS = [
  "ClaudeBot",
  "Claude-SearchBot",
  "Anthropic-AI",
  "Claude-Web",
  "meta-externalagent",
  "meta-externalfetcher",
] as const;

const AI_TRAINING_UA =
  /(?:ClaudeBot|Claude-SearchBot|Anthropic-AI|Claude-Web|meta-externalagent|meta-externalfetcher)/i;

/** /fr/tirages, /en/tirages/2024-01-01, etc. */
const ARCHIVE_PATH = /^\/(?:fr|en|it|es|pt|de|nl)\/tirages(?:\/|$)/i;

export function isAiTrainingCrawler(userAgent: string | null): boolean {
  return Boolean(userAgent && AI_TRAINING_UA.test(userAgent));
}

export function isEuroMillionsArchivePath(pathname: string): boolean {
  return ARCHIVE_PATH.test(pathname);
}

export function euroMillionsArchiveRobotsDisallow(locales: string[]): string[] {
  return locales.map((locale) => `/${locale}/tirages`);
}
