import { promises as fs } from "fs";
import path from "path";
import { formatEuroMillionsLongDate } from "./datetime";
import { formatShareJackpot } from "./share-card";
import type { EuroMillionsDraw } from "./types";
import type { FdjGameDraw } from "@/lib/fdj-games/types";
import { companionDrawKey } from "@/lib/fdj-games/keys";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const UPLOAD_URL =
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";

function env(name: string): string {
  return process.env[name]?.trim() || "";
}

export function youtubeConfigured(): boolean {
  return Boolean(
    env("YOUTUBE_CLIENT_ID") &&
      env("YOUTUBE_CLIENT_SECRET") &&
      env("YOUTUBE_REFRESH_TOKEN"),
  );
}

function privacyStatus(): "public" | "unlisted" | "private" {
  const raw = env("YOUTUBE_PRIVACY").toLowerCase();
  if (raw === "unlisted" || raw === "private") return raw;
  return "public";
}

export function youtubeShortTitle(draw: EuroMillionsDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const hook =
    typeof draw.jackpotEur === "number" && draw.jackpotEur > 0
      ? formatShareJackpot(draw.jackpotEur).replace(/^Jackpot /, "")
      : "les numéros";
  const full = `EuroMillions ${date} — ${hook} #Shorts`;
  if (full.length <= 100) return full;
  const compact = `EuroMillions ${draw.date} — ${hook} #Shorts`;
  return compact.length <= 100 ? compact : compact.slice(0, 100);
}

export function youtubeShortDescription(draw: EuroMillionsDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const lines = [
    `Tirage du ${date}`,
    "",
    `${draw.numbers.join(" · ")}  ·  étoiles ${draw.stars.join(" · ")}`,
  ];
  if (draw.myMillionCode) lines.push(`My Million : ${draw.myMillionCode}`);
  if (typeof draw.jackpotEur === "number" && draw.jackpotEur > 0) {
    lines.push(formatShareJackpot(draw.jackpotEur));
  }
  lines.push(
    "",
    `https://euromillions-resultats.fr/fr/tirages/${draw.date}`,
    "18+ · jeu responsable · site indépendant. Nous ne vendons pas de tickets.",
    "",
    "#Shorts #EuroMillions #Tirage #FDJ #MyMillion",
  );
  return lines.join("\n").slice(0, 5000);
}

function numericGroup(
  draw: FdjGameDraw,
  kind: "numbers" | "bonus",
  skipKey?: string,
): number[] {
  const g = draw.groups.find(
    (row) =>
      row.kind === kind &&
      row.values.length &&
      (!skipKey || row.labelKey !== skipKey),
  );
  const nums: number[] = [];
  for (const v of g?.values || []) {
    const n = typeof v === "number" ? v : Number.parseInt(String(v), 10);
    if (Number.isFinite(n)) nums.push(n);
  }
  return nums;
}

function shortHook(jackpotEur?: number | null): string {
  return typeof jackpotEur === "number" && jackpotEur > 0
    ? formatShareJackpot(jackpotEur).replace(/^Jackpot /, "")
    : "les numéros";
}

export function youtubeLotoShortTitle(draw: FdjGameDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const hook = shortHook(draw.jackpotEur);
  const full = `Loto ${date} — ${hook} #Shorts`;
  if (full.length <= 100) return full;
  const compact = `Loto ${draw.date} — ${hook} #Shorts`;
  return compact.length <= 100 ? compact : compact.slice(0, 100);
}

export function youtubeLotoShortDescription(draw: FdjGameDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const numbers = numericGroup(draw, "numbers", "secondDraw");
  const chance = numericGroup(draw, "bonus");
  const lines = [
    `Tirage du ${date}`,
    "",
    `${numbers.join(" · ")}${chance.length ? `  ·  chance ${chance.join(" · ")}` : ""}`,
  ];
  if (typeof draw.jackpotEur === "number" && draw.jackpotEur > 0) {
    lines.push(formatShareJackpot(draw.jackpotEur));
  }
  lines.push(
    "",
    `https://euromillions-resultats.fr/fr/jeux/loto/${companionDrawKey(draw)}`,
    "18+ · jeu responsable · site indépendant. Nous ne vendons pas de tickets.",
    "",
    "#Shorts #Loto #Tirage #FDJ",
  );
  return lines.join("\n").slice(0, 5000);
}

export const YOUTUBE_TAGS_EUROMILLIONS = [
  "EuroMillions",
  "FDJ",
  "tirage",
  "résultats",
  "Shorts",
];

export const YOUTUBE_TAGS_LOTO = ["Loto", "FDJ", "tirage", "résultats", "Shorts"];

export const YOUTUBE_TAGS_EURODREAMS = [
  "EuroDreams",
  "FDJ",
  "tirage",
  "résultats",
  "Shorts",
];

export type YoutubePlaylistKey =
  | "euromillions"
  | "loto"
  | "eurodreams"
  | "mymillion";

export const YOUTUBE_PLAYLIST_TITLES: Record<YoutubePlaylistKey, string> = {
  euromillions: "EuroMillions",
  loto: "Loto",
  eurodreams: "EuroDreams",
  mymillion: "My Million",
};

const PLAYLIST_ENV: Record<YoutubePlaylistKey, string> = {
  euromillions: "YOUTUBE_PLAYLIST_EUROMILLIONS",
  loto: "YOUTUBE_PLAYLIST_LOTO",
  eurodreams: "YOUTUBE_PLAYLIST_EURODREAMS",
  mymillion: "YOUTUBE_PLAYLIST_MYMILLION",
};

export function youtubePlaylistsForEuroMillions(
  draw: EuroMillionsDraw,
): YoutubePlaylistKey[] {
  const keys: YoutubePlaylistKey[] = ["euromillions"];
  if (draw.myMillionCode?.trim()) keys.push("mymillion");
  return keys;
}

export function youtubePlaylistsForCompanion(
  gameId: string,
): YoutubePlaylistKey[] {
  if (gameId === "loto") return ["loto"];
  if (gameId === "eurodreams") return ["eurodreams"];
  return [];
}

export function youtubeEuroDreamsShortTitle(draw: FdjGameDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const hook = shortHook(draw.jackpotEur);
  const full = `EuroDreams ${date} — ${hook} #Shorts`;
  if (full.length <= 100) return full;
  const compact = `EuroDreams ${draw.date} — ${hook} #Shorts`;
  return compact.length <= 100 ? compact : compact.slice(0, 100);
}

export function youtubeEuroDreamsShortDescription(draw: FdjGameDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const numbers = numericGroup(draw, "numbers");
  const dream = numericGroup(draw, "bonus");
  const lines = [
    `Tirage du ${date}`,
    "",
    `${numbers.join(" · ")}${dream.length ? `  ·  rêve ${dream.join(" · ")}` : ""}`,
  ];
  if (typeof draw.jackpotEur === "number" && draw.jackpotEur > 0) {
    lines.push(formatShareJackpot(draw.jackpotEur));
  }
  lines.push(
    "",
    `https://euromillions-resultats.fr/fr/jeux/eurodreams/${companionDrawKey(draw)}`,
    "18+ · jeu responsable · site indépendant. Nous ne vendons pas de tickets.",
    "",
    "#Shorts #EuroDreams #Tirage #FDJ",
  );
  return lines.join("\n").slice(0, 5000);
}

async function youtubeAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("YOUTUBE_CLIENT_ID"),
      client_secret: env("YOUTUBE_CLIENT_SECRET"),
      refresh_token: env("YOUTUBE_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });
  const json = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!json.access_token) {
    throw new Error(
      (json.error_description || json.error || "youtube_token_fail").slice(
        0,
        220,
      ),
    );
  }
  return json.access_token;
}

function apiError(json: unknown, fallback: string): string {
  const err = (json as { error?: { message?: string } } | null)?.error;
  return (err?.message || fallback).slice(0, 220);
}

type PlaylistCache = Partial<Record<YoutubePlaylistKey, string>>;

function playlistCachePath(): string {
  const explicit = env("YOUTUBE_PLAYLISTS_PATH");
  if (explicit) return explicit;
  const fb = env("EM_FACEBOOK_PATH");
  if (fb) return path.join(path.dirname(fb), "youtube-playlists.json");
  return path.join(process.cwd(), "data", "youtube-playlists.json");
}

async function readPlaylistCache(): Promise<PlaylistCache> {
  try {
    const raw = await fs.readFile(playlistCachePath(), "utf8");
    const parsed = JSON.parse(raw) as PlaylistCache;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writePlaylistCache(cache: PlaylistCache): Promise<void> {
  const file = playlistCachePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(cache, null, 2)}\n`);
}

async function listPlaylistIdByTitle(
  token: string,
  title: string,
): Promise<string | null> {
  let page: string | undefined;
  for (let i = 0; i < 8; i += 1) {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlists");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("mine", "true");
    url.searchParams.set("maxResults", "50");
    if (page) url.searchParams.set("pageToken", page);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as {
      items?: { id?: string; snippet?: { title?: string } }[];
      nextPageToken?: string;
      error?: { message?: string };
    };
    if (!res.ok) {
      throw new Error(apiError(json, `youtube_playlists_${res.status}`));
    }
    const hit = json.items?.find((item) => item.snippet?.title === title);
    if (hit?.id) return hit.id;
    page = json.nextPageToken;
    if (!page) break;
  }
  return null;
}

async function createPlaylist(
  token: string,
  key: YoutubePlaylistKey,
): Promise<string> {
  const title = YOUTUBE_PLAYLIST_TITLES[key];
  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        snippet: {
          title,
          description: `Résultats ${title} — euromillions-resultats.fr`,
          defaultLanguage: "fr",
        },
        status: { privacyStatus: "public" },
      }),
    },
  );
  const json = (await res.json()) as {
    id?: string;
    error?: { message?: string };
  };
  if (!res.ok || !json.id) {
    throw new Error(apiError(json, `youtube_playlist_create_${res.status}`));
  }
  return json.id;
}

async function resolvePlaylistId(
  token: string,
  key: YoutubePlaylistKey,
  cache: PlaylistCache,
): Promise<string | null> {
  const fromEnv = env(PLAYLIST_ENV[key]);
  if (fromEnv) return fromEnv;
  if (cache[key]) return cache[key]!;
  const found = await listPlaylistIdByTitle(token, YOUTUBE_PLAYLIST_TITLES[key]);
  if (found) {
    cache[key] = found;
    await writePlaylistCache(cache);
    return found;
  }
  const created = await createPlaylist(token, key);
  cache[key] = created;
  await writePlaylistCache(cache);
  return created;
}

async function addVideoToPlaylist(
  token: string,
  playlistId: string,
  videoId: string,
): Promise<void> {
  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        snippet: {
          playlistId,
          position: 0,
          resourceId: { kind: "youtube#video", videoId },
        },
      }),
    },
  );
  if (res.ok) return;
  const json = await res.json().catch(() => null);
  throw new Error(apiError(json, `youtube_playlist_item_${res.status}`));
}

async function addYoutubeShortToPlaylists(
  token: string,
  videoId: string,
  keys: YoutubePlaylistKey[],
): Promise<void> {
  if (!keys.length) return;
  const cache = await readPlaylistCache();
  for (const key of keys) {
    try {
      const playlistId = await resolvePlaylistId(token, key, cache);
      if (!playlistId) continue;
      await addVideoToPlaylist(token, playlistId, videoId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "playlist_fail";
      console.error("youtube_playlist_fail", key, msg.slice(0, 220));
    }
  }
}

export async function postYoutubeShort(args: {
  bytes: Buffer;
  title: string;
  description: string;
  tags?: string[];
  playlists?: YoutubePlaylistKey[];
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!youtubeConfigured()) return { ok: false, error: "youtube_unconfigured" };
  try {
    const token = await youtubeAccessToken();
    const init = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": String(args.bytes.length),
      },
      body: JSON.stringify({
        snippet: {
          title: args.title.slice(0, 100),
          description: args.description.slice(0, 5000),
          tags: args.tags?.length ? args.tags : YOUTUBE_TAGS_EUROMILLIONS,
          categoryId: "22",
          defaultLanguage: "fr",
          defaultAudioLanguage: "fr",
        },
        status: {
          privacyStatus: privacyStatus(),
          selfDeclaredMadeForKids: false,
          embeddable: true,
        },
      }),
    });
    const location = init.headers.get("location");
    if (!location || !init.ok) {
      const json = await init.json().catch(() => null);
      return { ok: false, error: apiError(json, `youtube_init_${init.status}`) };
    }
    const put = await fetch(location, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "video/mp4",
        "Content-Length": String(args.bytes.length),
      },
      body: new Uint8Array(args.bytes),
    });
    const json = (await put.json()) as { id?: string; error?: { message?: string } };
    if (!put.ok || !json.id) {
      return { ok: false, error: apiError(json, `youtube_upload_${put.status}`) };
    }
    if (args.playlists?.length) {
      await addYoutubeShortToPlaylists(token, json.id, args.playlists);
    }
    return { ok: true, id: json.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "youtube_upload_fail";
    return { ok: false, error: msg.slice(0, 220) };
  }
}
