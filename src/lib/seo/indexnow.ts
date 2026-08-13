import { EUROMILLIONS_LOCALES } from "@/i18n/locales";
import { companionDrawKey } from "@/lib/fdj-games/keys";
import { FDJ_COMPANION_GAMES } from "@/lib/fdj-games/catalog";
import type { FdjGamesStore } from "@/lib/fdj-games/types";
import type { EuroMillionsStore } from "@/lib/euromillions/types";

const DEFAULT_KEY = "a4e8c1b27f9d40e6b3c5d8a1f6e2b490";
const HOST = "euromillions-resultats.fr";
const ENDPOINT = "https://api.indexnow.org/indexnow";

function indexNowKey(): string {
  return process.env.INDEXNOW_KEY?.trim() || DEFAULT_KEY;
}

function keyLocation(key: string): string {
  return `https://${HOST}/${key}.txt`;
}

export function lotteryIndexNowUrls(
  em: EuroMillionsStore,
  fdj: FdjGamesStore,
): string[] {
  const origin = `https://${HOST}`;
  const latest = em.latest?.date || em.draws[0]?.date;
  const paths = new Set<string>([
    "",
    "/tirages",
    "/prochain-tirage",
    "/my-million",
    "/stats",
    "/jeux",
  ]);
  if (latest) paths.add(`/tirages/${latest}`);
  for (const game of FDJ_COMPANION_GAMES) {
    paths.add(`/jeux/${game.slug}`);
    const draw = fdj.games[game.id]?.latest;
    if (draw) paths.add(`/jeux/${game.slug}/${companionDrawKey(draw)}`);
  }
  const urls: string[] = [];
  for (const locale of EUROMILLIONS_LOCALES) {
    for (const path of paths) {
      urls.push(`${origin}/${locale}${path}`);
    }
  }
  return urls;
}

/** Fire-and-forget: never throw into the refresh path. */
export async function submitIndexNow(urls: string[]): Promise<void> {
  if (process.env.INDEXNOW_DISABLED === "1") return;
  const unique = [...new Set(urls)].slice(0, 200);
  if (unique.length === 0) return;
  const key = indexNowKey();
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: keyLocation(key),
        urlList: unique,
      }),
    });
    if (!res.ok) {
      console.error("indexnow_fail", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("indexnow_error", err);
  }
}
