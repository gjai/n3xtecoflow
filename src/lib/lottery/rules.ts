import type { FdjCompanionGameId, FdjGameDraw } from "@/lib/fdj-games/types";

export type CompanionGridSpec = {
  mainCount: number;
  mainMax: number;
  /** Player pick size for Keno (drawn count stays mainCount). */
  pickMin?: number;
  pickMax?: number;
  pickDefault?: number;
  bonus?: { count: number; max: number; labelKey: string };
  letter?: boolean;
  letterPool?: string;
};

export const COMPANION_GRID: Record<FdjCompanionGameId, CompanionGridSpec> = {
  loto: {
    mainCount: 5,
    mainMax: 49,
    bonus: { count: 1, max: 10, labelKey: "chance" },
  },
  eurodreams: {
    mainCount: 6,
    mainMax: 40,
    bonus: { count: 1, max: 5, labelKey: "dream" },
  },
  keno: {
    /** Formule Keno 2025 : 16 numéros tirés parmi 70. */
    mainCount: 16,
    mainMax: 70,
    pickMin: 4,
    pickMax: 10,
    pickDefault: 7,
  },
  crescendo: {
    mainCount: 10,
    mainMax: 25,
    letter: true,
    letterPool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
};

export function groupNumbers(
  draw: FdjGameDraw,
  labelKey: string,
): number[] {
  const g = draw.groups.find((x) => x.labelKey === labelKey);
  if (!g) return [];
  return g.values
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);
}

export function groupLetter(draw: FdjGameDraw): string | null {
  const g = draw.groups.find((x) => x.labelKey === "letter");
  const raw = g?.values[0];
  return raw != null ? String(raw).trim().toUpperCase() : null;
}

export function countMatches(pick: number[], drawn: number[]): number {
  const set = new Set(drawn);
  return pick.filter((n) => set.has(n)).length;
}
