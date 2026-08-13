/** Jeux FDJ compagnons (EuroMillions reste le focus du site). */
export type FdjCompanionGameId =
  | "eurodreams"
  | "loto"
  | "crescendo"
  | "keno";

export type FdjResultKind =
  | "numbers"
  | "bonus"
  | "letter"
  | "code"
  | "other";

export type FdjResultGroup = {
  /** Type brut FDJ (ex. "numero chance") */
  type: string;
  kind: FdjResultKind;
  /** Clé i18n sous `games.group.*` */
  labelKey: string;
  values: Array<number | string>;
};

export type FdjGameDraw = {
  gameId: FdjCompanionGameId;
  /** Jour civil YYYY-MM-DD */
  date: string;
  plannedAt: string;
  drawId?: string | number;
  jackpotEur?: number | null;
  /** Ex. rente EuroDreams */
  jackpotNote?: string | null;
  groups: FdjResultGroup[];
  source: "fdj";
  fetchedAt: string;
};

export type FdjGameBucket = {
  latest: FdjGameDraw | null;
  draws: FdjGameDraw[];
};

export type FdjGamesStore = {
  updatedAt: string;
  games: Partial<Record<FdjCompanionGameId, FdjGameBucket>>;
};
