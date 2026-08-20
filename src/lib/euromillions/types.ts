export type MyMillionWinner = {
  title: string;
  location: string | null;
  /** ISO date when parseable from FDJ Mag slug */
  date: string | null;
  sourceUrl: string;
  fetchedAt: string;
};

/** Rang de gain « Regular » (ex. 5+2, 5+1, 2) avec montant FR. */
export type EuroMillionsPrizeTier = {
  rank: string;
  /** Gagnants France (FDJ `shares`, devise EUR). */
  winners: number;
  /** Gagnants Europe (FDJ `european_shares`). */
  winnersEurope?: number;
  amountEur: number;
  /** Rente mensuelle (EuroDreams, parfois Keno rang 1). */
  annuityMonthlyEur?: number;
  annuityMonths?: number;
};

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
  /** Code My Million (ex. "MV 866 5058") */
  myMillionCode?: string | null;
  /** Localisation gagnant My Million si connue (Mag FDJ) */
  myMillionLocation?: string | null;
  /** Gains par rang Regular (FDJ shares) quand disponibles */
  prizeTiers?: EuroMillionsPrizeTier[];
  /** Gains option Étoile+ (winset FDJ « Etoile + ») */
  prizeTiersEtoilePlus?: EuroMillionsPrizeTier[];
  source: "pedromealha" | "uk-lottery" | "fdj" | "manual";
  sourceUrl?: string;
  fetchedAt: string;
};

export type EuroMillionsStore = {
  updatedAt: string;
  latest?: EuroMillionsDraw | null;
  nextDrawDate?: string | null;
  nextJackpotEur?: number | null;
  draws: EuroMillionsDraw[];
  /** Annonces Mag FDJ (localisation gagnants) */
  myMillionWinners?: MyMillionWinner[];
};
