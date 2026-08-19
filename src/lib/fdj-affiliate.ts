import type { FdjCompanionGameId } from "@/lib/fdj-games/types";

/** Liens Kwanko / Metaffiliation — un `mclic` par jeu FDJ. */
const ENV_BY_GAME: Record<
  FdjCompanionGameId | "euromillions",
  string
> = {
  euromillions: "FDJ_AFFILIATE_URL",
  loto: "FDJ_AFFILIATE_URL_LOTO",
  eurodreams: "FDJ_AFFILIATE_URL_EURODREAMS",
  crescendo: "FDJ_AFFILIATE_URL_CRESCENDO",
  keno: "FDJ_AFFILIATE_URL_KENO",
};

function envUrl(key: string): string {
  return process.env[key]?.trim() || "";
}

export function fdjAffiliateUrl(
  game: FdjCompanionGameId | "euromillions",
  fallback: string,
): string {
  const tracked = envUrl(ENV_BY_GAME[game]);
  if (tracked) return tracked;
  if (game === "keno") return fallback;
  return envUrl(ENV_BY_GAME.euromillions) || fallback;
}

export function fdjAffiliateTracked(
  game: FdjCompanionGameId | "euromillions",
): boolean {
  return Boolean(envUrl(ENV_BY_GAME[game]));
}

export function fdjAffiliateRel(tracked: boolean): string {
  return tracked ? "sponsored noopener noreferrer" : "noopener noreferrer";
}
