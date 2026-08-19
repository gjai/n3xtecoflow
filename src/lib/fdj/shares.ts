import type { EuroMillionsPrizeTier } from "@/lib/euromillions/types";

export type FdjBoard = {
  count?: number;
  amount?: number;
  currency?: string;
  scale?: number;
  annuity_amount?: number;
  annuity_period?: string;
  annuity_duration?: number;
};

export type FdjPrizeLevel = {
  division_name?: string;
  winning_boards?: FdjBoard[];
};

export type FdjShareSet = {
  winset_name?: string;
  prize_levels?: FdjPrizeLevel[];
};

const SKIP_RANK = /raffle/i;

function boardEur(level: FdjPrizeLevel): FdjBoard | null {
  return (
    (level.winning_boards || []).find((b) => b.currency === "EUR") || null
  );
}

function parseLevel(level: FdjPrizeLevel): EuroMillionsPrizeTier | null {
  const rank = String(level.division_name || "").trim();
  if (!rank || SKIP_RANK.test(rank)) return null;
  const eur = boardEur(level);
  if (!eur) return null;
  const scale = typeof eur.scale === "number" ? eur.scale : 0;
  const div = 10 ** scale;
  const amountEur = typeof eur.amount === "number" ? eur.amount / div : 0;
  const annuityMonthlyEur =
    typeof eur.annuity_amount === "number" ? eur.annuity_amount / div : undefined;
  const annuityMonths =
    typeof eur.annuity_duration === "number" && eur.annuity_duration > 0
      ? eur.annuity_duration
      : undefined;
  return {
    rank,
    winners: typeof eur.count === "number" ? eur.count : 0,
    amountEur,
    ...(annuityMonthlyEur != null ? { annuityMonthlyEur } : {}),
    ...(annuityMonths != null ? { annuityMonths } : {}),
  };
}

export function parseWinsetTiers(
  shares: FdjShareSet[] | undefined,
  needle: string,
): EuroMillionsPrizeTier[] {
  const want = needle.trim().toLowerCase();
  const set = (shares || []).find((s) => {
    const name = String(s.winset_name || "").toLowerCase();
    return want ? name.includes(want) : Boolean(name);
  });
  if (!set?.prize_levels?.length) return [];
  const out: EuroMillionsPrizeTier[] = [];
  for (const level of set.prize_levels) {
    const parsed = parseLevel(level);
    if (parsed) out.push(parsed);
  }
  return out;
}

export function parseRegularPrizeTiers(
  shares?: FdjShareSet[],
): EuroMillionsPrizeTier[] {
  const regular = parseWinsetTiers(shares, "regular");
  if (regular.length) return regular;
  return parseWinsetTiers(shares, "");
}

export function parseExtraPrizeTiers(
  shares?: FdjShareSet[],
): EuroMillionsPrizeTier[] {
  return parseWinsetTiers(shares, "2nd");
}

/** Si le rang 1 est à 0 €, coller le jackpot / la rente annoncés. */
export function fillEmptyJackpotTier(
  tiers: EuroMillionsPrizeTier[] | undefined,
  jackpotEur: number | null,
  jackpotNote: string | null,
): EuroMillionsPrizeTier[] | undefined {
  if (!tiers?.length) return tiers;
  const top = tiers[0];
  if (top.amountEur > 0 || top.annuityMonthlyEur) return tiers;
  const patched = { ...top };
  if (jackpotNote) {
    const [monthlyRaw, yearsRaw] = jackpotNote.split("|");
    const monthly = Number(monthlyRaw);
    const years = Number(yearsRaw);
    if (Number.isFinite(monthly) && monthly > 0) {
      patched.annuityMonthlyEur = monthly;
      if (Number.isFinite(years) && years > 0) {
        patched.annuityMonths = Math.round(years * 12);
      }
    }
  } else if (jackpotEur && jackpotEur > 0) {
    patched.amountEur = jackpotEur;
  }
  if (
    patched.amountEur === top.amountEur &&
    patched.annuityMonthlyEur === top.annuityMonthlyEur &&
    patched.annuityMonths === top.annuityMonths
  ) {
    return tiers;
  }
  return [patched, ...tiers.slice(1)];
}
