import type { EuroMillionsPrizeTier } from "@/lib/euromillions/types";
import type { FdjCompanionGameId, FdjGameDraw } from "@/lib/fdj-games/types";
import { countMatches, groupNumbers } from "./rules";

export type CompanionCheckResult = {
  rank: string | null;
  amountEur: number | null;
  annuityMonthlyEur: number | null;
  annuityMonths: number | null;
  winners: number | null;
  extraRank: string | null;
  extraAmountEur: number | null;
  hasTable: boolean;
};

function norm(rank: string): string {
  return rank.replace(/\s+/g, " ").trim().toLowerCase();
}

export function findPrizeTier(
  tiers: EuroMillionsPrizeTier[] | undefined,
  rank: string | null,
): EuroMillionsPrizeTier | null {
  if (!rank || !tiers?.length) return null;
  const n = norm(rank);
  return tiers.find((t) => norm(t.rank) === n) || null;
}

/** `division_name` FDJ Regular, tel que publié. */
export function companionDivisionName(
  gameId: FdjCompanionGameId,
  hits: number,
  bonusHit: boolean,
  letterHit: boolean,
  pickCount: number,
): string | null {
  switch (gameId) {
    case "loto":
      if (hits === 5 && bonusHit) return "5 + Chance";
      if (hits === 5) return "5";
      if (hits === 4 && bonusHit) return "4 + Chance";
      if (hits === 4) return "4";
      if (hits === 3 && bonusHit) return "3 + Chance";
      if (hits === 3) return "3";
      if (hits === 2 && bonusHit) return "2 + Chance";
      if (hits === 2) return "2";
      if (bonusHit && hits <= 1) return "0/1 + Chance";
      return null;
    case "eurodreams":
      if (hits === 6 && bonusHit) return "6+1";
      if (hits === 6) return "6+0";
      if (hits >= 2 && hits <= 5) return String(hits);
      return null;
    case "crescendo":
      if (hits === 10) return "10 / 10";
      if (hits >= 6 && hits <= 9) {
        return letterHit ? `${hits} / 10 + L` : `${hits} / 10`;
      }
      if (letterHit) return "Lettre";
      return null;
    case "keno":
      return `${hits}/${pickCount}`;
  }
}

function lotoSecondRank(hits: number): string | null {
  if (hits >= 2 && hits <= 5) return String(hits);
  return null;
}

export function checkCompanionTicket(
  gameId: FdjCompanionGameId,
  draw: FdjGameDraw,
  main: number[],
  bonusHit: boolean,
  letterHit: boolean,
  pickCount: number,
): CompanionCheckResult {
  const drawnMain = groupNumbers(draw, "main");
  const hits = countMatches(main, drawnMain);
  const name = companionDivisionName(
    gameId,
    hits,
    bonusHit,
    letterHit,
    pickCount,
  );
  const hasTable = Boolean(draw.prizeTiers?.length);
  const tier = findPrizeTier(draw.prizeTiers, name);
  const rank = hasTable ? (tier ? tier.rank : null) : name;

  const secondDrawn = groupNumbers(draw, "secondDraw");
  const extraName =
    gameId === "loto" && secondDrawn.length
      ? lotoSecondRank(countMatches(main, secondDrawn))
      : null;
  const extraTier = findPrizeTier(draw.prizeTiersExtra, extraName);

  const extraHasTable = Boolean(draw.prizeTiersExtra?.length);
  const extraRank = extraHasTable
    ? extraTier
      ? extraTier.rank
      : null
    : extraName;

  return {
    rank,
    amountEur: tier?.amountEur ?? null,
    annuityMonthlyEur: tier?.annuityMonthlyEur ?? null,
    annuityMonths: tier?.annuityMonths ?? null,
    winners: tier?.winners ?? null,
    extraRank,
    extraAmountEur: extraTier?.amountEur ?? null,
    hasTable,
  };
}
