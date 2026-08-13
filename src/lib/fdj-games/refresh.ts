import { FDJ_COMPANION_GAMES } from "./catalog";
import { fetchFdjCompanionDraws } from "./fetch";
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
    byKey.set(key, prev ? { ...prev, ...d, groups: d.groups.length ? d.groups : prev.groups } : d);
  }
  return [...byKey.values()].sort((a, b) => {
    const t = b.plannedAt.localeCompare(a.plannedAt);
    return t !== 0 ? t : b.date.localeCompare(a.date);
  });
}

export async function refreshFdjCompanionGames(): Promise<FdjGamesRefreshResult> {
  const store = await readFdjGamesStore();
  const games: FdjGamesStore["games"] = { ...store.games };
  const counts: Record<string, number> = {};
  const sources: string[] = [];

  for (const game of FDJ_COMPANION_GAMES) {
    try {
      const incoming = await fetchFdjCompanionDraws(game.id, 20);
      const prev = games[game.id]?.draws || [];
      const draws = mergeDraws(prev, incoming).slice(0, 80);
      games[game.id] = {
        latest: draws[0] || null,
        draws,
      };
      counts[game.id] = draws.length;
      sources.push(`${game.apiName}:${incoming.length}`);
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error("fdj_companion_fail", game.id, err);
      counts[game.id] = games[game.id]?.draws?.length || 0;
      sources.push(`${game.apiName}:fail`);
    }
  }

  const next: FdjGamesStore = {
    updatedAt: new Date().toISOString(),
    games,
  };
  await writeFdjGamesStore(next);
  return { ok: true, games: counts, sources };
}
