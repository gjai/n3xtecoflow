import { companionDrawKey } from "@/lib/fdj-games/keys";
import { FDJ_COMPANION_GAMES } from "@/lib/fdj-games/catalog";
import type { FdjGamesStore } from "@/lib/fdj-games/types";
import type { EuroMillionsStore } from "@/lib/euromillions/types";

const DEFAULT_KEY = "a4e8c1b27f9d40e6b3c5d8a1f6e2b490";
const ENDPOINT = "https://api.indexnow.org/indexnow";
/** Locales réellement rédigées (les autres = fallback EN, pas la peine de pinger). */
const INDEX_LOCALES = ["fr", "en"] as const;

function indexNowKey(): string {
  return process.env.INDEXNOW_KEY?.trim() || DEFAULT_KEY;
}

function keyLocation(host: string, key: string): string {
  return `https://${host}/${key}.txt`;
}

export function lotteryIndexNowUrls(
  em: EuroMillionsStore,
  fdj: FdjGamesStore,
): string[] {
  const host = "euromillions-resultats.fr";
  const origin = `https://${host}`;
  const latestPublished =
    em.draws.find((d) => d.numbers.length === 5 && d.stars.length === 2)?.date ||
    em.latest?.date;
  const latest = latestPublished;
  const paths = new Set<string>([
    "",
    "/tirages",
    "/prochain-tirage",
    "/my-million",
    "/alerte-email",
    "/jeux",
    "/generateur",
  ]);
  if (latest) paths.add(`/tirages/${latest}`);
  if (em.nextDrawDate) paths.add(`/tirages/${em.nextDrawDate}`);
  for (const game of FDJ_COMPANION_GAMES) {
    paths.add(`/jeux/${game.slug}`);
    const draw = fdj.games[game.id]?.latest;
    if (draw) paths.add(`/jeux/${game.slug}/${companionDrawKey(draw)}`);
  }
  const urls: string[] = [`${origin}/sitemap.xml`];
  for (const locale of INDEX_LOCALES) {
    for (const path of paths) {
      urls.push(`${origin}/${locale}${path}`);
    }
  }
  return urls;
}

export async function submitIndexNow(
  urls: string[],
  host = "euromillions-resultats.fr",
): Promise<void> {
  if (process.env.INDEXNOW_DISABLED === "1") return;
  const unique = [...new Set(urls)].slice(0, 200);
  if (unique.length === 0) return;
  const key = indexNowKey();
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: keyLocation(host, key),
        urlList: unique,
      }),
    });
    if (!res.ok) {
      console.error("indexnow_fail", host, res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("indexnow_error", host, err);
  }
}
