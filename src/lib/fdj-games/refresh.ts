import { FDJ_COMPANION_GAMES } from "./catalog";
import { fetchFdjCompanionDraws, fetchFdjCompanionHistory } from "./fetch";
import { readFdjGamesStore, writeFdjGamesStore } from "./store";
import type { FdjGameDraw, FdjGamesStore } from "./types";

export type FdjGamesRefreshResult = {
  ok: true;
  games: Record<string, number>;
  sources: string[];
};

function mergeDraws(
  existing: FdjGameDraw[],
  incoming: FdjGameDraw[],
): FdjGameDraw[] {
  const byKey = new Map<string, FdjGameDraw>();
  for (const d of existing) {
    byKey.set(`${d.date}|${d.plannedAt}|${d.drawId ?? ""}`, d);
  }
  for (const d of incoming) {
    const key = `${d.date}|${d.plannedAt}|${d.drawId ?? ""}`;
    const prev = byKey.get(key);
    byKey.set(
      key,
      prev
        ? {
            ...prev,
            ...d,
            groups: d.groups.length ? d.groups : prev.groups,
            prizeTiers: d.prizeTiers?.length ? d.prizeTiers : prev.prizeTiers,
            prizeTiersExtra: d.prizeTiersExtra?.length
              ? d.prizeTiersExtra
              : prev.prizeTiersExtra,
          }
        : d,
    );
  }
  return [...byKey.values()].sort((a, b) => {
    const t = b.plannedAt.localeCompare(a.plannedAt);
    return t !== 0 ? t : b.date.localeCompare(a.date);
  });
}

export async function refreshFdjCompanionGames(options?: {
  parallel?: boolean;
  size?: number;
}): Promise<FdjGamesRefreshResult> {
  const store = await readFdjGamesStore();
  const games: FdjGamesStore["games"] = { ...store.games };
  const counts: Record<string, number> = {};
  const sources: string[] = [];
  const size = options?.size ?? 20;
  const deep = size > 20;

  async function pullOne(game: (typeof FDJ_COMPANION_GAMES)[number]) {
    try {
      const incoming = deep
        ? await fetchFdjCompanionHistory(game.id, 160)
        : await fetchFdjCompanionDraws(game.id, size);
      const prev = games[game.id]?.draws || [];
      const draws = mergeDraws(prev, incoming).slice(0, 250);
      games[game.id] = {
        latest: draws[0] || null,
        draws,
      };
      counts[game.id] = draws.length;
      sources.push(`${game.apiName}:${incoming.length}`);
    } catch (err) {
      console.error("fdj_companion_fail", game.id, err);
      counts[game.id] = games[game.id]?.draws?.length || 0;
      sources.push(`${game.apiName}:fail`);
    }
  }

  if (options?.parallel) {
    await Promise.all(FDJ_COMPANION_GAMES.map((game) => pullOne(game)));
  } else {
    for (const game of FDJ_COMPANION_GAMES) {
      await pullOne(game);
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const next: FdjGamesStore = {
    updatedAt: new Date().toISOString(),
    games,
  };
  await writeFdjGamesStore(next);
  return { ok: true, games: counts, sources };
}
