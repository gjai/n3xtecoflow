import type { EuroMillionsDraw, EuroMillionsPrizeTier } from "./types";

/** Rang FDJ « Regular » à partir du nombre de boules / étoiles trouvées. */
const RANK_BY_MATCH: Record<string, string> = {
  "5+2": "5+2",
  "5+1": "5+1",
  "5+0": "5",
  "4+2": "4+2",
  "4+1": "4+1",
  "3+2": "3+2",
  "4+0": "4",
  "2+2": "2+2",
  "3+1": "3+1",
  "3+0": "3",
  "1+2": "1+2",
  "2+1": "2+1",
  "2+0": "2",
};

export function countMatches(pick: number[], drawn: number[]): number {
  const set = new Set(drawn);
  return pick.filter((n) => set.has(n)).length;
}

export function rankFromMatches(
  matchedBalls: number,
  matchedStars: number,
): string | null {
  return RANK_BY_MATCH[`${matchedBalls}+${matchedStars}`] ?? null;
}

export function comboKey(numbers: number[], stars: number[]): string {
  const n = [...numbers].sort((a, b) => a - b).join("-");
  const s = [...stars].sort((a, b) => a - b).join("-");
  return `${n}|${s}`;
}

export function findExactComboDraws(
  draws: EuroMillionsDraw[],
  numbers: number[],
  stars: number[],
): EuroMillionsDraw[] {
  if (numbers.length !== 5 || stars.length !== 2) return [];
  const key = comboKey(numbers, stars);
  return draws.filter((d) => comboKey(d.numbers, d.stars) === key);
}

export type TicketCheckResult = {
  date: string;
  matchedBalls: number;
  matchedStars: number;
  rank: string | null;
  amountEur: number | null;
  winners: number | null;
  draw: EuroMillionsDraw;
};

export function findPrizeTier(
  tiers: EuroMillionsPrizeTier[] | undefined,
  rank: string | null,
): EuroMillionsPrizeTier | null {
  if (!rank || !tiers?.length) return null;
  return tiers.find((t) => t.rank === rank) || null;
}

export function checkTicketOnDraw(
  numbers: number[],
  stars: number[],
  draw: EuroMillionsDraw,
): TicketCheckResult {
  const matchedBalls = countMatches(numbers, draw.numbers);
  const matchedStars = countMatches(stars, draw.stars);
  const rank = rankFromMatches(matchedBalls, matchedStars);
  const tier = findPrizeTier(draw.prizeTiers, rank);
  return {
    date: draw.date,
    matchedBalls,
    matchedStars,
    rank,
    amountEur: tier?.amountEur ?? null,
    winners: tier?.winners ?? null,
    draw,
  };
}

export function isValidEuroMillionsPick(
  numbers: number[],
  stars: number[],
): boolean {
  if (numbers.length !== 5 || stars.length !== 2) return false;
  const nSet = new Set(numbers);
  const sSet = new Set(stars);
  if (nSet.size !== 5 || sSet.size !== 2) return false;
  for (const n of numbers) {
    if (!Number.isInteger(n) || n < 1 || n > 50) return false;
  }
  for (const s of stars) {
    if (!Number.isInteger(s) || s < 1 || s > 12) return false;
  }
  return true;
}
