import { promises as fs } from "fs";
import path from "path";
import {
  companionDrawKey,
} from "./keys";
import type {
  FdjCompanionGameId,
  FdjGameDraw,
  FdjGamesStore,
} from "./types";

const SEED: FdjGamesStore = {
  updatedAt: new Date().toISOString(),
  games: {},
};

function dataPath() {
  return (
    process.env.FDJ_GAMES_DATA_PATH?.trim() ||
    path.join(process.cwd(), "data", "fdj-games.json")
  );
}

export async function readFdjGamesStore(): Promise<FdjGamesStore> {
  try {
    const raw = await fs.readFile(dataPath(), "utf8");
    const parsed = JSON.parse(raw) as FdjGamesStore;
    if (!parsed?.games || typeof parsed.games !== "object") return { ...SEED };
    return parsed;
  } catch {
    return { ...SEED, games: {} };
  }
}

export async function writeFdjGamesStore(store: FdjGamesStore): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(store, null, 2) + "\n", "utf8");
}

export function getGameDraws(
  store: FdjGamesStore,
  gameId: FdjCompanionGameId,
): FdjGameDraw[] {
  return store.games[gameId]?.draws || [];
}

export function getGameLatest(
  store: FdjGamesStore,
  gameId: FdjCompanionGameId,
): FdjGameDraw | null {
  return store.games[gameId]?.latest || store.games[gameId]?.draws?.[0] || null;
}

export function getDrawByKey(
  store: FdjGamesStore,
  gameId: FdjCompanionGameId,
  key: string,
): FdjGameDraw | undefined {
  return getGameDraws(store, gameId).find((d) => companionDrawKey(d) === key);
}
