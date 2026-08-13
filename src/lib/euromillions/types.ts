export type EuroMillionsDraw = {
  /** ISO date YYYY-MM-DD (draw day) */
  date: string;
  /** Optional official / sequential draw id */
  drawId?: string | number;
  numbers: number[];
  stars: number[];
  /** Jackpot / prize pool when known (EUR) */
  jackpotEur?: number | null;
  hasWinner?: boolean | null;
  source: "pedromealha" | "uk-lottery" | "manual";
  sourceUrl?: string;
  fetchedAt: string;
};

export type EuroMillionsStore = {
  updatedAt: string;
  latest?: EuroMillionsDraw | null;
  nextDrawDate?: string | null;
  nextJackpotEur?: number | null;
  draws: EuroMillionsDraw[];
};
