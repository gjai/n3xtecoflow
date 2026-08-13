import type { EuroMillionsDraw } from "./types";

export type NumberStat = {
  n: number;
  count: number;
  /** Draws since last appearance (0 = drawn in the latest). */
  delay: number;
  maxDelay: number;
};

export type JackpotRow = {
  date: string;
  jackpotEur: number;
  hasWinner: boolean | null;
};

function buildStats(max: number, drawsNewestFirst: number[][]): NumberStat[] {
  const count = new Map<number, number>();
  const lastIndex = new Map<number, number>();
  for (let i = 1; i <= max; i += 1) count.set(i, 0);

  let runningDelay = new Map<number, number>();
  for (let i = 1; i <= max; i += 1) runningDelay.set(i, 0);
  const maxDelay = new Map<number, number>();

  // drawsNewestFirst[0] is latest
  for (let idx = 0; idx < drawsNewestFirst.length; idx += 1) {
    const set = new Set(drawsNewestFirst[idx]);
    for (let n = 1; n <= max; n += 1) {
      if (set.has(n)) {
        count.set(n, (count.get(n) || 0) + 1);
        if (!lastIndex.has(n)) lastIndex.set(n, idx);
        const streak = runningDelay.get(n) || 0;
        maxDelay.set(n, Math.max(maxDelay.get(n) || 0, streak));
        runningDelay.set(n, 0);
      } else {
        runningDelay.set(n, (runningDelay.get(n) || 0) + 1);
      }
    }
  }
  for (let n = 1; n <= max; n += 1) {
    maxDelay.set(n, Math.max(maxDelay.get(n) || 0, runningDelay.get(n) || 0));
  }

  return Array.from({ length: max }, (_, i) => {
    const n = i + 1;
    return {
      n,
      count: count.get(n) || 0,
      delay: lastIndex.has(n) ? lastIndex.get(n)! : drawsNewestFirst.length,
      maxDelay: maxDelay.get(n) || 0,
    };
  });
}

export function euroMillionsNumberStats(draws: EuroMillionsDraw[]): {
  numbers: NumberStat[];
  stars: NumberStat[];
} {
  const newest = [...draws].sort((a, b) => b.date.localeCompare(a.date));
  return {
    numbers: buildStats(
      50,
      newest.map((d) => d.numbers),
    ),
    stars: buildStats(
      12,
      newest.map((d) => d.stars),
    ),
  };
}

export function jackpotHistory(
  draws: EuroMillionsDraw[],
  limit = 12,
): JackpotRow[] {
  return [...draws]
    .filter((d) => typeof d.jackpotEur === "number" && d.jackpotEur > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((d) => ({
      date: d.date,
      jackpotEur: d.jackpotEur as number,
      hasWinner: d.hasWinner ?? null,
    }));
}
