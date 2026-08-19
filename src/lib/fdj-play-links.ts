import type { LotteryGameId } from "@/lib/fdj-games/nav";
import { fdjAffiliateRel, fdjAffiliateTracked, fdjAffiliateUrl } from "./fdj-affiliate";

const FALLBACK_BY_GAME: Record<LotteryGameId, string> = {
  euromillions: "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million",
  "my-million": "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million",
  loto: "https://www.fdj.fr/jeux-de-tirage/loto",
  eurodreams: "https://www.fdj.fr/jeux-de-tirage/eurodreams",
  crescendo: "https://www.fdj.fr/jeux-de-tirage/crescendo",
  keno: "https://www.fdj.fr/jeux-de-tirage/keno",
};

function affiliateGameId(gameId: LotteryGameId): "euromillions" | "loto" | "eurodreams" | "crescendo" | "keno" {
  return gameId === "my-million" ? "euromillions" : gameId;
}

export function nextDrawAffiliateHref(gameId: LotteryGameId): string {
  return fdjAffiliateUrl(affiliateGameId(gameId), FALLBACK_BY_GAME[gameId]);
}

export function nextDrawAffiliateTracked(gameId: LotteryGameId): boolean {
  return fdjAffiliateTracked(affiliateGameId(gameId));
}

export function nextDrawAffiliateRel(gameId: LotteryGameId): string {
  return fdjAffiliateRel(nextDrawAffiliateTracked(gameId));
}
