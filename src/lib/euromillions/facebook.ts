import { promises as fs } from "fs";
import path from "path";
import { getCompanionGame } from "@/lib/fdj-games/catalog";
import { formatDrawWhen } from "@/lib/fdj-games/display";
import { companionDrawKey } from "@/lib/fdj-games/keys";
import {
  getGameDraws,
  getGameLatest,
  readFdjGamesStore,
} from "@/lib/fdj-games/store";
import type { FdjCompanionGameId, FdjGameDraw } from "@/lib/fdj-games/types";
import { fdjAffiliateUrl } from "@/lib/fdj-affiliate";
import {
  formatEuroMillionsLongDate,
  isNewsShortSlot,
  parisHourKey,
  parisDateKey,
  parisIsoWeekKey,
} from "./datetime";
import {
  SHARE_IG_FEED,
  SHARE_STORY,
  companionShareCard,
  euroMillionsShareCard,
  formatShareJackpot,
  type ShareCardInput,
} from "./share-card";
import { lotterySharePng, newsSharePng, newsCopyForShare } from "./share-render";
import {
  composeNewsShortScript,
  type NewsShortFond,
  type NewsShortMusic,
  type NewsShortVisuel,
} from "./news-short-script";
import { isEuroMillionsDrawPublished, readEuroMillionsStore } from "./store";
import type { EuroMillionsDraw } from "./types";
import {
  postYoutubeShort,
  youtubeConfigured,
  youtubeEuroDreamsShortDescription,
  youtubeEuroDreamsShortTitle,
  youtubeLotoShortDescription,
  youtubeLotoShortTitle,
  youtubePlaylistsForCompanion,
  youtubePlaylistsForEuroMillions,
  youtubeShortDescription,
  youtubeShortTitle,
  youtubeNewsShortDescription,
  youtubeNewsShortTitle,
  YOUTUBE_TAGS_EUROMILLIONS,
  YOUTUBE_TAGS_EURODREAMS,
  YOUTUBE_TAGS_LOTO,
  YOUTUBE_TAGS_NEWS,
  type YoutubePlaylistKey,
} from "./youtube";
import { postTiktokVideo, tiktokConfigured } from "./tiktok";

export const SOCIAL_DRAW_GAMES = [
  "euromillions",
  "loto",
  "eurodreams",
  "keno",
  "crescendo",
] as const;

export type SocialDrawGameId = (typeof SOCIAL_DRAW_GAMES)[number];

type PostedMap = Record<SocialDrawGameId, string | null>;
type PostedOkMap = Record<SocialDrawGameId, boolean>;

type FacebookStore = {
  updatedAt: string;
  lastPostedDrawDate?: string | null;
  lastPosted: PostedMap;
  lastPostedIg?: PostedMap;
  lastPostedReel?: PostedMap;
  lastPostedYoutube?: PostedMap;
  lastPostedTiktok?: PostedMap;
  lastPostedOk?: PostedOkMap;
  lastErrors?: Record<string, string>;
  newsSeeded?: boolean;
  postedNewsSlugs?: string[];
  lastNewsShortWeek?: string | null;
  lastNewsShortSlug?: string | null;
  lastNewsShortDay?: string | null;
  lastNewsShortHour?: string | null;
  lastNewsShortFact?: string | null;
  lastNewsShortFacts?: string[];
};

export type FacebookNotifyResult = {
  posted: number;
  stories: number;
  instagramPosted: number;
  instagramStories: number;
  reels: number;
  instagramReels: number;
  youtubeShorts: number;
  tiktokPosts: number;
  instagramUsername: string | null;
  skipped: Record<string, string>;
};

export type FacebookPublishSnapshot = {
  lastPosted: PostedMap;
  lastPostedIg: PostedMap;
  lastPostedReel: PostedMap;
  lastPostedYoutube: PostedMap;
  lastPostedTiktok: PostedMap;
  lastPostedOk: PostedOkMap;
  lastErrors: Record<string, string>;
  lastNewsShortWeek: string | null;
  lastNewsShortSlug: string | null;
  lastNewsShortDay: string | null;
  lastNewsShortHour: string | null;
  lastNewsShortFact: string | null;
};

function emptyNotify(
  skipped: Record<string, string>,
  extra?: Partial<FacebookNotifyResult>,
): FacebookNotifyResult {
  return {
    posted: 0,
    stories: 0,
    instagramPosted: 0,
    instagramStories: 0,
    reels: 0,
    instagramReels: 0,
    youtubeShorts: 0,
    tiktokPosts: 0,
    instagramUsername: null,
    skipped,
    ...extra,
  };
}

function emptyPosted(): PostedMap {
  return {
    euromillions: null,
    loto: null,
    eurodreams: null,
    keno: null,
    crescendo: null,
  };
}

function emptyPostedOk(): PostedOkMap {
  return {
    euromillions: false,
    loto: false,
    eurodreams: false,
    keno: false,
    crescendo: false,
  };
}

function mergePosted(
  raw?: Partial<PostedMap> | null,
  legacyDate?: string | null,
): PostedMap {
  return {
    ...emptyPosted(),
    ...raw,
    euromillions: raw?.euromillions ?? legacyDate ?? null,
  };
}

function mergePostedOk(raw?: Partial<PostedOkMap> | null): PostedOkMap {
  return { ...emptyPostedOk(), ...raw };
}

const SEED: FacebookStore = {
  updatedAt: new Date().toISOString(),
  lastPosted: emptyPosted(),
  lastPostedIg: emptyPosted(),
  lastPostedReel: emptyPosted(),
  lastPostedYoutube: emptyPosted(),
  lastPostedTiktok: emptyPosted(),
  lastPostedOk: emptyPostedOk(),
  lastErrors: {},
  newsSeeded: false,
  postedNewsSlugs: [],
  lastNewsShortWeek: null,
  lastNewsShortSlug: null,
  lastNewsShortDay: null,
  lastNewsShortHour: null,
  lastNewsShortFact: null,
  lastNewsShortFacts: [],
};

const COMPANION_SOCIAL_GAMES: FdjCompanionGameId[] = [
  "loto",
  "eurodreams",
  "keno",
  "crescendo",
];

/** Instagram waits used to eat the 180s refresh budget before Loto/Keno posted. */
const MAX_DRAW_POSTS_PER_RUN = 3;
const IG_WAIT_TRIES = 8;
const IG_WAIT_MS = 1000;

const GRAPH = `https://graph.facebook.com/${
  process.env.FACEBOOK_GRAPH_VERSION?.trim() || "v26.0"
}`;

function statePath() {
  return (
    process.env.EM_FACEBOOK_PATH?.trim() ||
    path.join(process.cwd(), "data", "em-facebook.json")
  );
}

function envPageToken(): string {
  return process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim() || "";
}

export function facebookConfigured(): boolean {
  return Boolean(envPageToken());
}

function pageId(): string {
  return process.env.FACEBOOK_PAGE_ID?.trim() || "1301770579682898";
}

async function readState(): Promise<FacebookStore> {
  try {
    const raw = await fs.readFile(
      /* turbopackIgnore: true */ statePath(),
      "utf8",
    );
    const parsed = JSON.parse(raw) as FacebookStore;
    return {
      ...SEED,
      lastPosted: mergePosted(parsed.lastPosted, parsed.lastPostedDrawDate),
      lastPostedIg: mergePosted(parsed.lastPostedIg),
      lastPostedReel: mergePosted(parsed.lastPostedReel),
      lastPostedYoutube: mergePosted(parsed.lastPostedYoutube),
      lastPostedTiktok: mergePosted(parsed.lastPostedTiktok),
      lastPostedOk: mergePostedOk(parsed.lastPostedOk),
      lastErrors:
        parsed.lastErrors && typeof parsed.lastErrors === "object"
          ? parsed.lastErrors
          : {},
      newsSeeded: Boolean(parsed.newsSeeded),
      postedNewsSlugs: Array.isArray(parsed.postedNewsSlugs)
        ? parsed.postedNewsSlugs.filter((s) => typeof s === "string")
        : [],
      lastNewsShortWeek:
        typeof parsed.lastNewsShortWeek === "string"
          ? parsed.lastNewsShortWeek
          : null,
      lastNewsShortSlug:
        typeof parsed.lastNewsShortSlug === "string"
          ? parsed.lastNewsShortSlug
          : null,
      lastNewsShortDay:
        typeof parsed.lastNewsShortDay === "string"
          ? parsed.lastNewsShortDay
          : null,
      lastNewsShortHour:
        typeof parsed.lastNewsShortHour === "string"
          ? parsed.lastNewsShortHour
          : null,
      lastNewsShortFact:
        typeof parsed.lastNewsShortFact === "string"
          ? parsed.lastNewsShortFact
          : null,
      lastNewsShortFacts: Array.isArray(parsed.lastNewsShortFacts)
        ? parsed.lastNewsShortFacts
            .filter((s): s is string => typeof s === "string" && s.length > 12)
            .slice(-24)
        : typeof parsed.lastNewsShortFact === "string"
          ? [parsed.lastNewsShortFact]
          : [],
    };
  } catch {
    return { ...SEED };
  }
}

async function writeState(store: FacebookStore): Promise<void> {
  const file = statePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(
    file,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        lastPosted: store.lastPosted,
        lastPostedIg: store.lastPostedIg ?? emptyPosted(),
        lastPostedReel: store.lastPostedReel ?? emptyPosted(),
        lastPostedYoutube: store.lastPostedYoutube ?? emptyPosted(),
        lastPostedTiktok: store.lastPostedTiktok ?? emptyPosted(),
        lastPostedOk: store.lastPostedOk ?? emptyPostedOk(),
        lastErrors: store.lastErrors ?? {},
        newsSeeded: store.newsSeeded ?? false,
        postedNewsSlugs: store.postedNewsSlugs ?? [],
        lastNewsShortWeek: store.lastNewsShortWeek ?? null,
        lastNewsShortSlug: store.lastNewsShortSlug ?? null,
        lastNewsShortDay: store.lastNewsShortDay ?? null,
        lastNewsShortHour: store.lastNewsShortHour ?? null,
        lastNewsShortFact: store.lastNewsShortFact ?? null,
        lastNewsShortFacts: store.lastNewsShortFacts ?? [],
      },
      null,
      2,
    ) + "\n",
  );
}

function formatJackpot(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function legalLines(
  url: string,
  tag: string,
  gameId?: SocialDrawGameId,
): string[] {
  const playUrl = fdjAffiliateUrl(gameId || "euromillions", "");
  return [
    "",
    "Vérifier vos gains :",
    url,
    ...(playUrl ? ["", "Jouer sur FDJ.fr :", playUrl] : []),
    "",
    "Site indépendant · 18+ · jeu responsable. Nous ne vendons pas de tickets.",
    tag,
  ];
}

export function facebookDrawPermalink(date: string): string {
  return `https://euromillions-resultats.fr/fr/tirages/${date}`;
}

export function facebookDrawMessage(draw: EuroMillionsDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const url = facebookDrawPermalink(draw.date);
  const lines = [
    `Résultats EuroMillions du ${date}`,
    "",
    `Boules : ${draw.numbers.join(" · ")}`,
    `Étoiles : ${draw.stars.join(" · ")}`,
  ];
  if (draw.myMillionCode) lines.push(`My Million : ${draw.myMillionCode}`);
  if (typeof draw.jackpotEur === "number" && draw.jackpotEur > 0) {
    lines.push(`Jackpot : ${formatJackpot(draw.jackpotEur)}`);
  }
  return [...lines, ...legalLines(url, "#EuroMillions", "euromillions")].join("\n");
}

/** Légende Reel : accroche en première ligne, plus courte que le post photo. */
export function facebookReelMessage(draw: EuroMillionsDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const hookTail =
    typeof draw.jackpotEur === "number" && draw.jackpotEur > 0
      ? formatShareJackpot(draw.jackpotEur).replace(/^Jackpot /, "jackpot ")
      : "les numéros";
  const lines = [
    `Tirage du ${date} — ${hookTail}`,
    "",
    `${draw.numbers.join(" · ")}  ·  étoiles ${draw.stars.join(" · ")}`,
  ];
  if (draw.myMillionCode) lines.push(`My Million : ${draw.myMillionCode}`);
  lines.push(
    "",
    facebookDrawPermalink(draw.date),
    "18+ · jeu responsable · site indépendant",
    "#EuroMillions",
  );
  return lines.join("\n");
}

/** Légende Reel compagnon : Loto (sans 2e tirage) ou EuroDreams. */
export function companionReelMessage(draw: FdjGameDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const hookTail =
    typeof draw.jackpotEur === "number" && draw.jackpotEur > 0
      ? formatShareJackpot(draw.jackpotEur).replace(/^Jackpot /, "jackpot ")
      : "les numéros";
  const main =
    draw.groups.find(
      (g) => g.kind === "numbers" && g.labelKey !== "secondDraw" && g.values.length,
    ) || draw.groups.find((g) => g.kind === "numbers" && g.values.length);
  const bonus = draw.groups.find((g) => g.kind === "bonus" && g.values.length);
  const dreams = draw.gameId === "eurodreams";
  const bonusWord = dreams ? "rêve" : "chance";
  const lines = [
    `${dreams ? "EuroDreams" : "Loto"} — tirage du ${date} — ${hookTail}`,
    "",
    `${(main?.values || []).join(" · ")}${bonus ? `  ·  ${bonusWord} ${bonus.values.join(" · ")}` : ""}`,
  ];
  lines.push(
    "",
    companionPermalink(draw),
    "18+ · jeu responsable · site indépendant",
    dreams ? "#EuroDreams" : "#Loto",
  );
  return lines.join("\n");
}

function companionPermalink(draw: FdjGameDraw): string {
  return `https://euromillions-resultats.fr/fr/jeux/${draw.gameId}/${companionDrawKey(draw)}`;
}

function companionTitle(draw: FdjGameDraw): string {
  return getCompanionGame(draw.gameId)?.labelFr || draw.gameId;
}

function companionHashtag(gameId: FdjCompanionGameId): string {
  if (gameId === "loto") return "#Loto";
  if (gameId === "eurodreams") return "#EuroDreams";
  if (gameId === "keno") return "#Keno";
  return "#Crescendo";
}

function companionHeadline(draw: FdjGameDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const title = companionTitle(draw);
  const when = formatDrawWhen(draw, "fr");
  if (when.kenoSlot === "midi") return `Résultats ${title} du ${date} — Midi`;
  if (when.kenoSlot === "soir") return `Résultats ${title} du ${date} — Soir`;
  if (when.time) return `Résultats ${title} du ${date} — ${when.time}`;
  return `Résultats ${title} du ${date}`;
}

function groupCaptionLabel(labelKey: string): string {
  if (labelKey === "chance") return "Chance";
  if (labelKey === "dream") return "Dream";
  if (labelKey === "secondDraw") return "2nd tirage";
  if (labelKey === "multiplier") return "Multiplicateur";
  if (labelKey === "letter") return "Lettre";
  if (labelKey === "joker") return "Joker";
  return "Numéros";
}

function companionMessage(draw: FdjGameDraw): string {
  const tag = companionHashtag(draw.gameId);
  const lines = [companionHeadline(draw), ""];
  for (const g of draw.groups) {
    if (!g.values.length) continue;
    if (g.kind === "other") continue;
    lines.push(`${groupCaptionLabel(g.labelKey)} : ${g.values.join(" · ")}`);
  }
  if (typeof draw.jackpotEur === "number" && draw.jackpotEur > 0) {
    lines.push(`Jackpot : ${formatJackpot(draw.jackpotEur)}`);
  }
  return [...lines, ...legalLines(companionPermalink(draw), tag, draw.gameId)].join(
    "\n",
  );
}

function companionPublished(draw: FdjGameDraw | null | undefined): boolean {
  if (!draw) return false;
  const numbers = draw.groups.filter(
    (g) => g.kind === "numbers" && g.values.length > 0,
  );
  if (draw.gameId === "keno") {
    return numbers.some((g) => g.values.length >= 10);
  }
  if (draw.gameId === "crescendo") {
    return numbers.some((g) => g.values.length >= 8);
  }
  return numbers.some((g) => g.values.length >= 5);
}

function isTodayParis(date: string): boolean {
  return date === parisDateKey();
}

/** Catch up missed nights without dumping the archive. */
function isRecentDrawDate(date: string): boolean {
  const today = parisDateKey();
  if (date >= today) return true;
  return date >= parisDateKey(new Date(Date.now() - 36 * 3600 * 1000));
}

function companionJobsForGame(
  gameId: FdjCompanionGameId,
  draws: FdjGameDraw[],
  lastKey: string | null,
  lastOk: boolean,
  force: boolean,
): FdjGameDraw[] {
  const published = draws
    .filter(companionPublished)
    .sort((a, b) => a.plannedAt.localeCompare(b.plannedAt));
  if (!published.length) return [];
  const latest = published[published.length - 1]!;

  if (force) return [latest];

  if (!lastKey) {
    const todayDraws = published.filter((d) => isTodayParis(d.date));
    if (todayDraws.length) return todayDraws;
    return isRecentDrawDate(latest.date) ? [latest] : [];
  }

  const idx = published.findIndex((d) => companionDrawKey(d) === lastKey);
  if (idx >= 0) {
    const newer = published.slice(idx + 1);
    if (newer.length) return newer;
    if (!lastOk && isTodayParis(latest.date) && companionDrawKey(latest) === lastKey) {
      return [latest];
    }
    return [];
  }

  if (companionDrawKey(latest) !== lastKey && isRecentDrawDate(latest.date)) {
    return [latest];
  }
  return [];
}

async function graphJson(
  url: string,
  body: FormData,
): Promise<{
  id?: string;
  post_id?: string;
  video_id?: string;
  upload_url?: string;
  uri?: string;
  error?: { message?: string };
}> {
  const res = await fetch(url, { method: "POST", body });
  return (await res.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: { message?: string };
  };
}

async function uploadPhoto(args: {
  token: string;
  bytes: Uint8Array;
  caption?: string;
  published: boolean;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const form = new FormData();
  form.append("access_token", args.token);
  form.append("published", args.published ? "true" : "false");
  if (args.caption) form.append("caption", args.caption);
  form.append(
    "source",
    new Blob([Buffer.from(args.bytes)], { type: "image/png" }),
    "tirage.png",
  );
  const json = await graphJson(
    `${GRAPH}/${encodeURIComponent(pageId())}/photos`,
    form,
  );
  if (!json.id) {
    return { ok: false, error: (json.error?.message || "photo_fail").slice(0, 220) };
  }
  return { ok: true, id: json.id };
}

async function publishStory(
  token: string,
  photoId: string,
  linkUrl?: string,
): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append("access_token", token);
  form.append("photo_id", photoId);
  if (linkUrl) form.append("link_url", linkUrl);
  const json = await graphJson(
    `${GRAPH}/${encodeURIComponent(pageId())}/photo_stories`,
    form,
  );
  if (json.error?.message) {
    return { ok: false, error: json.error.message.slice(0, 220) };
  }
  return { ok: true };
}

const SHARE_PUBLIC = "https://euromillions-resultats.fr/api/euromillions/share-image";

function shareJpegUrl(query: string): string {
  return `${SHARE_PUBLIC}?${query}&fmt=jpg`;
}

async function graphGet(path: string, token: string, fields?: string) {
  const q = new URLSearchParams({ access_token: token });
  if (fields) q.set("fields", fields);
  const res = await fetch(`${GRAPH}/${path}?${q.toString()}`);
  return (await res.json().catch(() => ({}))) as Record<string, unknown>;
}

export type InstagramAccount = { id: string; username: string | null };

export async function resolveInstagramAccount(
  token: string,
): Promise<InstagramAccount | null> {
  const json = await graphGet(
    encodeURIComponent(pageId()),
    token,
    "instagram_business_account{id,username}",
  );
  const ig = json.instagram_business_account as
    | { id?: string; username?: string }
    | undefined;
  if (!ig?.id) return null;
  return { id: ig.id, username: ig.username || null };
}

async function photoCdnUrl(
  token: string,
  photoId: string,
): Promise<string | null> {
  const json = await graphGet(encodeURIComponent(photoId), token, "images");
  const images = (json.images as { source?: string; width?: number }[]) || [];
  const top = [...images].sort((a, b) => (b.width || 0) - (a.width || 0))[0];
  return top?.source || null;
}

async function waitIgContainer(
  token: string,
  creationId: string,
): Promise<{ ok: boolean; error?: string }> {
  for (let i = 0; i < IG_WAIT_TRIES; i += 1) {
    const json = await graphGet(
      encodeURIComponent(creationId),
      token,
      "status_code,status",
    );
    const code = String(json.status_code || "");
    if (code === "ERROR" || code === "EXPIRED") {
      return {
        ok: false,
        error: String(json.status || code).slice(0, 220),
      };
    }
    if (code === "IN_PROGRESS") {
      await new Promise((r) => setTimeout(r, IG_WAIT_MS));
      continue;
    }
    return { ok: true };
  }
  return { ok: true };
}

async function waitIgReelReady(
  token: string,
  creationId: string,
): Promise<{ ok: boolean; error?: string }> {
  for (let i = 0; i < 24; i += 1) {
    const json = await graphGet(
      encodeURIComponent(creationId),
      token,
      "status_code,status",
    );
    const code = String(json.status_code || "");
    if (code === "FINISHED") return { ok: true };
    if (code === "ERROR" || code === "EXPIRED") {
      return { ok: false, error: String(json.status || code).slice(0, 220) };
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return { ok: false, error: "ig_reel_timeout" };
}

async function ruploadVideo(
  uri: string,
  token: string,
  bytes: Buffer,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(uri, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${token}`,
      offset: "0",
      file_size: String(bytes.length),
    },
    body: new Uint8Array(bytes),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: (text || `rupload_${res.status}`).slice(0, 220) };
  }
  return { ok: true };
}

async function postFacebookReel(
  token: string,
  bytes: Buffer,
  caption: string,
): Promise<{ ok: boolean; error?: string }> {
  const start = new FormData();
  start.append("access_token", token);
  start.append("upload_phase", "start");
  const started = await graphJson(
    `${GRAPH}/${encodeURIComponent(pageId())}/video_reels`,
    start,
  );
  const videoId = started.video_id || started.id;
  if (!videoId || !started.upload_url) {
    return {
      ok: false,
      error: (started.error?.message || "reel_start_fail").slice(0, 220),
    };
  }
  const uploaded = await ruploadVideo(started.upload_url, token, bytes);
  if (!uploaded.ok) return uploaded;
  const finish = new FormData();
  finish.append("access_token", token);
  finish.append("upload_phase", "finish");
  finish.append("video_id", videoId);
  finish.append("video_state", "PUBLISHED");
  finish.append("description", caption.slice(0, 8000));
  const done = await graphJson(
    `${GRAPH}/${encodeURIComponent(pageId())}/video_reels`,
    finish,
  );
  if (done.error?.message && !done.id && !done.post_id) {
    return { ok: false, error: done.error.message.slice(0, 220) };
  }
  return { ok: true };
}

async function postInstagramReel(args: {
  token: string;
  igUserId: string;
  bytes: Buffer;
  caption: string;
}): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append("access_token", args.token);
  form.append("media_type", "REELS");
  form.append("upload_type", "resumable");
  form.append("share_to_feed", "true");
  form.append("thumb_offset", "0");
  form.append("caption", args.caption.slice(0, 2200));
  const created = await graphJson(
    `${GRAPH}/${encodeURIComponent(args.igUserId)}/media`,
    form,
  );
  if (!created.id) {
    return {
      ok: false,
      error: (created.error?.message || "ig_reel_container_fail").slice(0, 220),
    };
  }
  const uri =
    created.uri ||
    `https://rupload.facebook.com/ig-api-upload/${encodeURIComponent(created.id)}`;
  const uploaded = await ruploadVideo(uri, args.token, args.bytes);
  if (!uploaded.ok) return uploaded;
  const ready = await waitIgReelReady(args.token, created.id);
  if (!ready.ok) return ready;
  const publish = new FormData();
  publish.append("access_token", args.token);
  publish.append("creation_id", created.id);
  const json = await graphJson(
    `${GRAPH}/${encodeURIComponent(args.igUserId)}/media_publish`,
    publish,
  );
  if (json.error?.message && !json.id) {
    return { ok: false, error: json.error.message.slice(0, 220) };
  }
  return { ok: true };
}

export async function postEuroMillionsReels(args: {
  token: string;
  card: ShareCardInput;
  caption: string;
  instagram?: InstagramAccount | null;
  youtubeTitle?: string;
  youtubeDescription?: string;
  youtubeTags?: string[];
  youtubePlaylists?: YoutubePlaylistKey[];
  skipReel?: boolean;
  skipYoutube?: boolean;
  skipTiktok?: boolean;
}): Promise<{
  facebook: boolean;
  instagram: boolean;
  youtube: boolean;
  tiktok: boolean;
}> {
  let facebook = false;
  let instagram = false;
  let youtube = false;
  let tiktok = false;
  const wantReel = !args.skipReel;
  const wantYt =
    !args.skipYoutube &&
    youtubeConfigured() &&
    Boolean(args.youtubeTitle && args.youtubeDescription);
  const wantTiktok = !args.skipTiktok && tiktokConfigured();
  if (!wantReel && !wantYt && !wantTiktok) {
    return { facebook, instagram, youtube, tiktok };
  }
  try {
    const { lotteryShareMp4 } = await import("./share-video");
    const mp4 = await lotteryShareMp4(args.card);
    if (wantReel) {
      const fb = await postFacebookReel(args.token, mp4, args.caption);
      if (fb.ok) facebook = true;
      else console.error("facebook_reel_fail", fb.error);
      if (args.instagram) {
        const ig = await postInstagramReel({
          token: args.token,
          igUserId: args.instagram.id,
          bytes: mp4,
          caption: args.caption,
        });
        if (ig.ok) instagram = true;
        else console.error("instagram_reel_fail", ig.error);
      }
    }
    if (wantYt) {
      const yt = await postYoutubeShort({
        bytes: mp4,
        title: args.youtubeTitle!,
        description: args.youtubeDescription!,
        tags: args.youtubeTags,
        playlists: args.youtubePlaylists,
      });
      if (yt.ok) youtube = true;
      else console.error("youtube_short_fail", yt.error);
    }
    if (wantTiktok) {
      const tk = await postTiktokVideo({
        bytes: mp4,
        caption: args.caption,
      });
      if (tk.ok) tiktok = true;
      else console.error("tiktok_post_fail", tk.error);
    }
  } catch (err) {
    console.error("share_reel_fail", err);
  }
  return { facebook, instagram, youtube, tiktok };
}

async function postNewsReels(args: {
  token: string;
  title: string;
  excerpt: string;
  body?: string;
  imageSrc?: string | null;
  mood?: NewsShortMusic;
  sfx?: string[];
  fond?: NewsShortFond;
  visuelSeed?: string | null;
  visuels?: NewsShortVisuel[];
  photoBufs?: Buffer[];
  caption: string;
  instagram?: InstagramAccount | null;
  youtubeTitle: string;
  youtubeDescription: string;
  skipReel?: boolean;
  skipYoutube?: boolean;
  skipTiktok?: boolean;
}): Promise<{
  facebook: boolean;
  instagram: boolean;
  youtube: boolean;
  tiktok: boolean;
}> {
  let facebook = false;
  let instagram = false;
  let youtube = false;
  let tiktok = false;
  const wantReel = !args.skipReel;
  const wantYt = !args.skipYoutube && youtubeConfigured();
  const wantTiktok = !args.skipTiktok && tiktokConfigured();
  if (!wantReel && !wantYt && !wantTiktok) {
    return { facebook, instagram, youtube, tiktok };
  }
  try {
    const { newsShareMp4 } = await import("./share-video");
    const generated =
      args.photoBufs !== undefined
        ? args.photoBufs
        : await (await import("./news-short-script")).generateNewsShortPhotos({
            title: args.title,
            excerpt: args.excerpt,
            body: args.body || "",
            game: "euromillions",
            fact: args.visuelSeed || args.title,
            permalink: "",
            imageSrc: null,
            source: "ai",
            voix: false,
            music: args.mood,
            sfx: args.sfx,
            visuels: args.visuels,
          });
    const mp4 = await newsShareMp4(args.title, args.excerpt, {
      body: args.body,
      imageSrc: generated.length ? null : args.imageSrc,
      mood: args.mood,
      sfx: args.sfx,
      fond: args.fond,
      visuelSeed: args.visuelSeed,
      visuels: args.visuels,
      photoBufs: generated,
    });
    if (wantReel) {
      const fb = await postFacebookReel(args.token, mp4, args.caption);
      if (fb.ok) facebook = true;
      else console.error("facebook_news_reel_fail", fb.error);
      if (args.instagram) {
        const ig = await postInstagramReel({
          token: args.token,
          igUserId: args.instagram.id,
          bytes: mp4,
          caption: args.caption,
        });
        if (ig.ok) instagram = true;
        else console.error("instagram_news_reel_fail", ig.error);
      }
    }
    if (wantYt) {
      const yt = await postYoutubeShort({
        bytes: mp4,
        title: args.youtubeTitle,
        description: args.youtubeDescription,
        tags: YOUTUBE_TAGS_NEWS,
      });
      if (yt.ok) youtube = true;
      else console.error("youtube_news_short_fail", yt.error);
    }
    if (wantTiktok) {
      const tk = await postTiktokVideo({
        bytes: mp4,
        caption: args.caption,
      });
      if (tk.ok) tiktok = true;
      else console.error("tiktok_news_post_fail", tk.error);
    }
  } catch (err) {
    console.error("news_share_reel_fail", err);
  }
  return { facebook, instagram, youtube, tiktok };
}

async function publishInstagram(args: {
  token: string;
  igUserId: string;
  imageUrl: string;
  caption?: string;
  story: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append("access_token", args.token);
  form.append("image_url", args.imageUrl);
  if (args.story) form.append("media_type", "STORIES");
  else if (args.caption) form.append("caption", args.caption.slice(0, 2200));
  const created = await graphJson(
    `${GRAPH}/${encodeURIComponent(args.igUserId)}/media`,
    form,
  );
  if (!created.id) {
    return {
      ok: false,
      error: (created.error?.message || "ig_container_fail").slice(0, 220),
    };
  }
  const ready = await waitIgContainer(args.token, created.id);
  if (!ready.ok) return ready;
  const publish = new FormData();
  publish.append("access_token", args.token);
  publish.append("creation_id", created.id);
  const json = await graphJson(
    `${GRAPH}/${encodeURIComponent(args.igUserId)}/media_publish`,
    publish,
  );
  if (json.error?.message && !json.id) {
    return { ok: false, error: json.error.message.slice(0, 220) };
  }
  return { ok: true };
}

async function postFeedAndStoryImages(args: {
  token: string;
  caption: string;
  feedBytes: Uint8Array;
  storyBytes: Uint8Array;
  publicFeedUrl?: string;
  publicStoryUrl?: string;
  storyLinkUrl?: string;
  instagram?: InstagramAccount | null;
  skipInstagramFeed?: boolean;
  onFacebookPosted?: () => Promise<void>;
}): Promise<{
  posted: boolean;
  story: boolean;
  igPosted: boolean;
  igStory: boolean;
  error?: string;
}> {
  const feed = await uploadPhoto({
    token: args.token,
    bytes: args.feedBytes,
    caption: args.caption,
    published: true,
  });
  if (!feed.ok) {
    return {
      posted: false,
      story: false,
      igPosted: false,
      igStory: false,
      error: feed.error,
    };
  }
  if (args.onFacebookPosted) await args.onFacebookPosted();

  const unpublished = await uploadPhoto({
    token: args.token,
    bytes: args.storyBytes,
    published: false,
  });
  let storyOk = false;
  if (!unpublished.ok || !unpublished.id) {
    console.error("facebook_story_upload_fail", unpublished.error);
  } else {
    const story = await publishStory(args.token, unpublished.id, args.storyLinkUrl);
    if (!story.ok) console.error("facebook_story_fail", story.error);
    else storyOk = true;
  }

  let igPosted = false;
  let igStory = false;
  const ig = args.instagram;
  if (ig?.id) {
    if (!args.skipInstagramFeed) {
      const feedFallback = feed.id
        ? await photoCdnUrl(args.token, feed.id)
        : null;
      const feedUrls = [args.publicFeedUrl, feedFallback].filter(
        (u): u is string => Boolean(u),
      );
      for (const imageUrl of feedUrls) {
        const sent = await publishInstagram({
          token: args.token,
          igUserId: ig.id,
          imageUrl,
          caption: args.caption,
          story: false,
        });
        if (sent.ok) {
          igPosted = true;
          break;
        }
        console.error("instagram_feed_fail", sent.error);
      }
    }
    const storyFallback = unpublished.id
      ? await photoCdnUrl(args.token, unpublished.id)
      : null;
    const storyUrls = [args.publicStoryUrl, storyFallback].filter(
      (u): u is string => Boolean(u),
    );
    for (const imageUrl of storyUrls) {
      const sent = await publishInstagram({
        token: args.token,
        igUserId: ig.id,
        imageUrl,
        story: true,
      });
      if (sent.ok) {
        igStory = true;
        break;
      }
      console.error("instagram_story_fail", sent.error);
    }
  }

  return { posted: true, story: storyOk, igPosted, igStory };
}

async function postInstagramOnly(args: {
  token: string;
  caption: string;
  publicQuery: string;
  instagram: InstagramAccount;
  skipFeed?: boolean;
}): Promise<{ igPosted: boolean; igStory: boolean }> {
  const feedUrl = shareJpegUrl(`${args.publicQuery}&format=ig`);
  const storyUrl = shareJpegUrl(`${args.publicQuery}&format=story`);
  let igPosted = false;
  let igStory = false;
  if (!args.skipFeed) {
    const feed = await publishInstagram({
      token: args.token,
      igUserId: args.instagram.id,
      imageUrl: feedUrl,
      caption: args.caption,
      story: false,
    });
    if (feed.ok) igPosted = true;
    else console.error("instagram_feed_fail", feed.error);
  }
  const story = await publishInstagram({
    token: args.token,
    igUserId: args.instagram.id,
    imageUrl: storyUrl,
    story: true,
  });
  if (story.ok) igStory = true;
  else console.error("instagram_story_fail", story.error);
  return { igPosted, igStory };
}

async function postFeedAndStory(args: {
  token: string;
  caption: string;
  card: ShareCardInput;
  publicQuery: string;
  storyLinkUrl?: string;
  instagram?: InstagramAccount | null;
  skipInstagramFeed?: boolean;
  onFacebookPosted?: () => Promise<void>;
}): Promise<{
  posted: boolean;
  story: boolean;
  igPosted: boolean;
  igStory: boolean;
  error?: string;
}> {
  return postFeedAndStoryImages({
    token: args.token,
    caption: args.caption,
    feedBytes: await lotterySharePng(args.card, SHARE_IG_FEED),
    storyBytes: await lotterySharePng(args.card, SHARE_STORY),
    publicFeedUrl: shareJpegUrl(`${args.publicQuery}&format=ig`),
    publicStoryUrl: shareJpegUrl(`${args.publicQuery}&format=story`),
    storyLinkUrl: args.storyLinkUrl,
    instagram: args.instagram,
    skipInstagramFeed: args.skipInstagramFeed,
    onFacebookPosted: args.onFacebookPosted,
  });
}

export async function facebookMetaStatus(): Promise<{
  configured: boolean;
  tokenValid: boolean;
  instagram: InstagramAccount | null;
  error?: string;
}> {
  if (!facebookConfigured()) {
    return { configured: false, tokenValid: false, instagram: null };
  }
  const token = envPageToken();
  const json = await graphGet(
    encodeURIComponent(pageId()),
    token,
    "id,name,instagram_business_account{id,username}",
  );
  const err = json.error as { message?: string } | undefined;
  if (err?.message) {
    return {
      configured: true,
      tokenValid: false,
      instagram: null,
      error: err.message.slice(0, 220),
    };
  }
  const ig = json.instagram_business_account as
    | { id?: string; username?: string }
    | undefined;
  return {
    configured: true,
    tokenValid: true,
    instagram: ig?.id ? { id: ig.id, username: ig.username || null } : null,
  };
}

export async function postFacebookDraw(
  draw: EuroMillionsDraw,
  tokenOverride?: string,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const token = tokenOverride?.trim() || envPageToken();
  if (!token) return { ok: false, error: "facebook_unconfigured" };
  const instagram = await resolveInstagramAccount(token);
  const sent = await postFeedAndStory({
    token,
    caption: facebookDrawMessage(draw),
    card: euroMillionsShareCard(draw),
    publicQuery: `date=${encodeURIComponent(draw.date)}`,
    storyLinkUrl: fdjAffiliateUrl("euromillions", ""),
    instagram,
    skipInstagramFeed: true,
  });
  if (!sent.posted) return { ok: false, error: sent.error };
  await postEuroMillionsReels({
    token,
    card: euroMillionsShareCard(draw),
    caption: facebookReelMessage(draw),
    instagram,
    youtubeTitle: youtubeShortTitle(draw),
    youtubeDescription: youtubeShortDescription(draw),
    youtubeTags: YOUTUBE_TAGS_EUROMILLIONS,
    youtubePlaylists: youtubePlaylistsForEuroMillions(draw),
  });
  return { ok: true };
}

export async function facebookPublishSnapshot(): Promise<FacebookPublishSnapshot> {
  const state = await readState();
  return {
    lastPosted: state.lastPosted,
    lastPostedIg: state.lastPostedIg ?? emptyPosted(),
    lastPostedReel: state.lastPostedReel ?? emptyPosted(),
    lastPostedYoutube: state.lastPostedYoutube ?? emptyPosted(),
    lastPostedTiktok: state.lastPostedTiktok ?? emptyPosted(),
    lastPostedOk: state.lastPostedOk ?? emptyPostedOk(),
    lastErrors: state.lastErrors ?? {},
    lastNewsShortWeek: state.lastNewsShortWeek ?? null,
    lastNewsShortSlug: state.lastNewsShortSlug ?? null,
    lastNewsShortDay: state.lastNewsShortDay ?? null,
    lastNewsShortHour: state.lastNewsShortHour ?? null,
    lastNewsShortFact: state.lastNewsShortFact ?? null,
  };
}

type DrawPostJob = {
  key: SocialDrawGameId;
  fingerprint: string;
  caption: string;
  reelCaption?: string;
  youtubeTitle?: string;
  youtubeDescription?: string;
  youtubeTags?: string[];
  youtubePlaylists?: YoutubePlaylistKey[];
  card: ShareCardInput;
  publicQuery: string;
  storyLinkUrl?: string;
  sortAt: string;
};

function postsVideoReel(key: SocialDrawGameId): boolean {
  return key === "euromillions" || key === "loto" || key === "eurodreams";
}

function companionVideoFields(draw: FdjGameDraw): {
  reelCaption: string;
  youtubeTitle: string;
  youtubeDescription: string;
  youtubeTags: string[];
  youtubePlaylists: YoutubePlaylistKey[];
} | null {
  if (draw.gameId === "loto") {
    return {
      reelCaption: companionReelMessage(draw),
      youtubeTitle: youtubeLotoShortTitle(draw),
      youtubeDescription: youtubeLotoShortDescription(draw),
      youtubeTags: YOUTUBE_TAGS_LOTO,
      youtubePlaylists: youtubePlaylistsForCompanion("loto"),
    };
  }
  if (draw.gameId === "eurodreams") {
    return {
      reelCaption: companionReelMessage(draw),
      youtubeTitle: youtubeEuroDreamsShortTitle(draw),
      youtubeDescription: youtubeEuroDreamsShortDescription(draw),
      youtubeTags: YOUTUBE_TAGS_EURODREAMS,
      youtubePlaylists: youtubePlaylistsForCompanion("eurodreams"),
    };
  }
  return null;
}

async function notifyYoutubeOnly(
  latest: EuroMillionsDraw | null,
  options?: { force?: boolean; games?: SocialDrawGameId[] },
): Promise<FacebookNotifyResult> {
  const skipped: Record<string, string> = { all: "facebook_unconfigured" };
  const only = options?.games;
  const wantEm = !only || only.includes("euromillions");
  if (
    !youtubeConfigured() ||
    !wantEm ||
    !isEuroMillionsDrawPublished(latest) ||
    !latest
  ) {
    return emptyNotify(skipped);
  }
  const state = await readState();
  if (
    !options?.force &&
    state.lastPostedYoutube?.euromillions === latest.date
  ) {
    skipped["euromillions:youtube"] = "already";
    return emptyNotify(skipped);
  }
  const { lotteryShareMp4 } = await import("./share-video");
  const mp4 = await lotteryShareMp4(euroMillionsShareCard(latest));
  const yt = await postYoutubeShort({
    bytes: mp4,
    title: youtubeShortTitle(latest),
    description: youtubeShortDescription(latest),
    tags: YOUTUBE_TAGS_EUROMILLIONS,
    playlists: youtubePlaylistsForEuroMillions(latest),
  });
  if (!yt.ok) {
    skipped["euromillions:youtube"] = yt.error || "youtube_fail";
    return emptyNotify(skipped);
  }
  await writeState({
    ...state,
    lastPostedYoutube: {
      ...(state.lastPostedYoutube ?? emptyPosted()),
      euromillions: latest.date,
    },
  });
  skipped["euromillions:youtube"] = "ok";
  return emptyNotify(skipped, { youtubeShorts: 1 });
}

/**
 * Poste fil + story au passage d’un nouveau tirage
 * (EuroMillions, Loto, EuroDreams, Keno, Crescendo).
 * Facebook est tamponné dès le succès fil — Instagram ne bloque plus le suivant.
 * Jeux jamais postés : tirages du jour seulement (pas l’archive).
 * Si un amorçage a avalé le tirage du jour sans poster, on retente.
 */
export async function notifyFacebookOnPublish(
  latest: EuroMillionsDraw | null,
  options?: { force?: boolean; games?: SocialDrawGameId[] },
): Promise<FacebookNotifyResult> {
  const skipped: Record<string, string> = {};
  if (!facebookConfigured()) {
    return notifyYoutubeOnly(latest, options);
  }
  let state = await readState();
  const token = envPageToken();
  const instagram = await resolveInstagramAccount(token);
  if (!instagram) skipped.instagram = "unlinked";
  const fdj = await readFdjGamesStore();
  let posted = 0;
  let stories = 0;
  let instagramPosted = 0;
  let instagramStories = 0;
  let reels = 0;
  let instagramReels = 0;
  let youtubeShorts = 0;
  let tiktokPosts = 0;
  const force = Boolean(options?.force);
  const only = options?.games;
  const want = (id: SocialDrawGameId) => !only || only.includes(id);

  const persist = async (patch: Partial<FacebookStore>) => {
    state = { ...state, ...patch };
    await writeState(state);
  };

  const stampFb = async (key: SocialDrawGameId, value: string) => {
    await persist({
      lastPosted: { ...state.lastPosted, [key]: value },
      lastPostedOk: { ...(state.lastPostedOk ?? emptyPostedOk()), [key]: true },
      lastPostedIg: {
        ...(state.lastPostedIg ?? emptyPosted()),
        [key]: state.lastPostedIg?.[key] ?? null,
      },
      lastErrors: { ...(state.lastErrors || {}), [key]: "ok" },
    });
  };

  const stampIg = async (key: SocialDrawGameId, value: string) => {
    await persist({
      lastPostedIg: {
        ...(state.lastPostedIg ?? emptyPosted()),
        [key]: value,
      },
    });
  };

  const stampReel = async (key: SocialDrawGameId, value: string) => {
    await persist({
      lastPostedReel: {
        ...(state.lastPostedReel ?? emptyPosted()),
        [key]: value,
      },
    });
  };

  const stampYoutube = async (key: SocialDrawGameId, value: string) => {
    await persist({
      lastPostedYoutube: {
        ...(state.lastPostedYoutube ?? emptyPosted()),
        [key]: value,
      },
    });
  };

  const stampTiktok = async (key: SocialDrawGameId, value: string) => {
    await persist({
      lastPostedTiktok: {
        ...(state.lastPostedTiktok ?? emptyPosted()),
        [key]: value,
      },
    });
  };

  const stampError = async (key: string, error: string) => {
    await persist({
      lastErrors: { ...(state.lastErrors || {}), [key]: error.slice(0, 220) },
    });
  };

  const confirmSeed = async (key: SocialDrawGameId) => {
    await persist({
      lastPostedOk: { ...(state.lastPostedOk ?? emptyPostedOk()), [key]: true },
    });
  };

  const jobs: DrawPostJob[] = [];

  if (want("euromillions")) {
  if (isEuroMillionsDrawPublished(latest) && latest) {
    const fingerprint = latest.date;
    const last = state.lastPosted.euromillions;
    const lastOk = Boolean(state.lastPostedOk?.euromillions);
    const needsPost =
      force ||
      last !== fingerprint ||
      (!lastOk && isTodayParis(latest.date)) ||
      (!last && isRecentDrawDate(latest.date));
    if (needsPost) {
      jobs.push({
        key: "euromillions",
        fingerprint,
        caption: facebookDrawMessage(latest),
        reelCaption: facebookReelMessage(latest),
        youtubeTitle: youtubeShortTitle(latest),
        youtubeDescription: youtubeShortDescription(latest),
        youtubeTags: YOUTUBE_TAGS_EUROMILLIONS,
        youtubePlaylists: youtubePlaylistsForEuroMillions(latest),
        card: euroMillionsShareCard(latest),
        publicQuery: `date=${encodeURIComponent(latest.date)}`,
        storyLinkUrl: fdjAffiliateUrl("euromillions", ""),
        sortAt: `${latest.date}T21:00:00`,
      });
    } else {
      if (last === fingerprint && !lastOk) await confirmSeed("euromillions");
      skipped.euromillions = "already";
    }
  } else {
    skipped.euromillions = "unpublished";
  }
  }

  for (const gameId of COMPANION_SOCIAL_GAMES) {
    if (!want(gameId)) continue;
    const pending = companionJobsForGame(
      gameId,
      getGameDraws(fdj, gameId),
      state.lastPosted[gameId],
      Boolean(state.lastPostedOk?.[gameId]),
      force,
    );
    if (!pending.length) {
      const latestCompanion = getGameLatest(fdj, gameId);
      if (!companionPublished(latestCompanion)) skipped[gameId] = "unpublished";
      else if (
        latestCompanion &&
        state.lastPosted[gameId] === companionDrawKey(latestCompanion)
      ) {
        if (!state.lastPostedOk?.[gameId]) await confirmSeed(gameId);
        skipped[gameId] = skipped[gameId] || "already";
      } else skipped[gameId] = skipped[gameId] || "not_due";
      continue;
    }
    for (const draw of pending) {
      const fingerprint = companionDrawKey(draw);
      const video = companionVideoFields(draw);
      jobs.push({
        key: gameId,
        fingerprint,
        caption: companionMessage(draw),
        reelCaption: video?.reelCaption,
        youtubeTitle: video?.youtubeTitle,
        youtubeDescription: video?.youtubeDescription,
        youtubeTags: video?.youtubeTags,
        youtubePlaylists: video?.youtubePlaylists,
        card: companionShareCard(draw),
        publicQuery: `game=${encodeURIComponent(gameId)}&key=${encodeURIComponent(fingerprint)}`,
        storyLinkUrl: fdjAffiliateUrl(gameId, ""),
        sortAt: draw.plannedAt,
      });
    }
  }

  jobs.sort((a, b) => a.sortAt.localeCompare(b.sortAt));
  const queue = jobs.slice(0, MAX_DRAW_POSTS_PER_RUN);
  if (jobs.length > queue.length) {
    skipped.queued = `${jobs.length - queue.length}_deferred`;
  }

  const run = async (job: DrawPostJob) => {
    const skipKey = `${job.key}:${job.fingerprint}`;
    const sent = await postFeedAndStory({
      token,
      caption: job.caption,
      card: job.card,
      publicQuery: job.publicQuery,
      storyLinkUrl: job.storyLinkUrl,
      instagram,
      skipInstagramFeed: postsVideoReel(job.key),
      onFacebookPosted: () => stampFb(job.key, job.fingerprint),
    });
    if (!sent.posted) {
      skipped[skipKey] = sent.error || "send_failed";
      await stampError(skipKey, sent.error || "send_failed");
      console.error("facebook_draw_post_fail", job.key, job.fingerprint, sent.error);
      return;
    }
    posted += 1;
    if (sent.story) stories += 1;
    if (sent.igPosted) instagramPosted += 1;
    if (sent.igStory) instagramStories += 1;
    if (sent.igPosted || sent.igStory) await stampIg(job.key, job.fingerprint);
    skipped[skipKey] = "ok";
    if (postsVideoReel(job.key)) {
      const reel = await postEuroMillionsReels({
        token,
        card: job.card,
        caption: job.reelCaption || job.caption,
        instagram,
        youtubeTitle: job.youtubeTitle,
        youtubeDescription: job.youtubeDescription,
        youtubeTags: job.youtubeTags,
        youtubePlaylists: job.youtubePlaylists,
        skipReel: !force && state.lastPostedReel?.[job.key] === job.fingerprint,
        skipYoutube:
          !force && state.lastPostedYoutube?.[job.key] === job.fingerprint,
        skipTiktok:
          !force && state.lastPostedTiktok?.[job.key] === job.fingerprint,
      });
      if (reel.facebook) reels += 1;
      if (reel.instagram) {
        instagramReels += 1;
        instagramPosted += 1;
        await stampIg(job.key, job.fingerprint);
      }
      if (reel.facebook || reel.instagram) {
        await stampReel(job.key, job.fingerprint);
        skipped[`${skipKey}:reel`] = "ok";
      } else if (
        force ||
        state.lastPostedReel?.[job.key] !== job.fingerprint
      ) {
        skipped[`${skipKey}:reel`] = "reel_fail";
        await stampError(`${skipKey}:reel`, "reel_fail");
      }
      if (reel.youtube) {
        youtubeShorts += 1;
        await stampYoutube(job.key, job.fingerprint);
        skipped[`${skipKey}:youtube`] = "ok";
      } else if (
        youtubeConfigured() &&
        (force || state.lastPostedYoutube?.[job.key] !== job.fingerprint)
      ) {
        skipped[`${skipKey}:youtube`] = "youtube_fail";
        await stampError(`${skipKey}:youtube`, "youtube_fail");
      }
      if (reel.tiktok) {
        tiktokPosts += 1;
        await stampTiktok(job.key, job.fingerprint);
        skipped[`${skipKey}:tiktok`] = "ok";
      } else if (
        tiktokConfigured() &&
        (force || state.lastPostedTiktok?.[job.key] !== job.fingerprint)
      ) {
        skipped[`${skipKey}:tiktok`] = "tiktok_fail";
        await stampError(`${skipKey}:tiktok`, "tiktok_fail");
      }
    }
  };

  for (const job of queue) {
    await run(job);
  }

  if (instagram && posted < MAX_DRAW_POSTS_PER_RUN) {
    const backfillBudget = MAX_DRAW_POSTS_PER_RUN - posted;
    let filled = 0;
    const candidates: DrawPostJob[] = [];
    if (isEuroMillionsDrawPublished(latest) && latest) {
      candidates.push({
        key: "euromillions",
        fingerprint: latest.date,
        caption: facebookDrawMessage(latest),
        reelCaption: facebookReelMessage(latest),
        youtubeTitle: youtubeShortTitle(latest),
        youtubeDescription: youtubeShortDescription(latest),
        youtubeTags: YOUTUBE_TAGS_EUROMILLIONS,
        youtubePlaylists: youtubePlaylistsForEuroMillions(latest),
        card: euroMillionsShareCard(latest),
        publicQuery: `date=${encodeURIComponent(latest.date)}`,
        storyLinkUrl: fdjAffiliateUrl("euromillions", ""),
        sortAt: `${latest.date}T21:00:00`,
      });
    }
    for (const gameId of COMPANION_SOCIAL_GAMES) {
      const draw = getGameLatest(fdj, gameId);
      if (!companionPublished(draw) || !draw) continue;
      const video = companionVideoFields(draw);
      candidates.push({
        key: gameId,
        fingerprint: companionDrawKey(draw),
        caption: companionMessage(draw),
        reelCaption: video?.reelCaption,
        youtubeTitle: video?.youtubeTitle,
        youtubeDescription: video?.youtubeDescription,
        youtubeTags: video?.youtubeTags,
        youtubePlaylists: video?.youtubePlaylists,
        card: companionShareCard(draw),
        publicQuery: `game=${encodeURIComponent(gameId)}&key=${encodeURIComponent(companionDrawKey(draw))}`,
        storyLinkUrl: fdjAffiliateUrl(gameId, ""),
        sortAt: draw.plannedAt,
      });
    }
    for (const job of candidates) {
      if (filled >= backfillBudget) break;
      if (state.lastPosted[job.key] !== job.fingerprint) continue;
      if (state.lastPostedIg?.[job.key] === job.fingerprint) continue;
      const igSent = await postInstagramOnly({
        token,
        caption: job.caption,
        publicQuery: job.publicQuery,
        instagram,
        skipFeed: postsVideoReel(job.key),
      });
      if (igSent.igPosted) instagramPosted += 1;
      if (igSent.igStory) instagramStories += 1;
      await stampIg(job.key, job.fingerprint);
      skipped[`${job.key}:ig`] = igSent.igPosted ? "ig_backfill" : "ig_backfill_fail";
      filled += 1;
    }
  }

  if (
    !queue.some((j) => j.key === "euromillions") &&
    want("euromillions") &&
    isEuroMillionsDrawPublished(latest) &&
    latest &&
    (force ||
      state.lastPostedReel?.euromillions !== latest.date ||
      (youtubeConfigured() &&
        state.lastPostedYoutube?.euromillions !== latest.date) ||
      (tiktokConfigured() &&
        state.lastPostedTiktok?.euromillions !== latest.date))
  ) {
    const reel = await postEuroMillionsReels({
      token,
      card: euroMillionsShareCard(latest),
      caption: facebookReelMessage(latest),
      instagram,
      youtubeTitle: youtubeShortTitle(latest),
      youtubeDescription: youtubeShortDescription(latest),
      youtubeTags: YOUTUBE_TAGS_EUROMILLIONS,
      youtubePlaylists: youtubePlaylistsForEuroMillions(latest),
      skipReel: !force && state.lastPostedReel?.euromillions === latest.date,
      skipYoutube:
        !force && state.lastPostedYoutube?.euromillions === latest.date,
      skipTiktok:
        !force && state.lastPostedTiktok?.euromillions === latest.date,
    });
    if (reel.facebook) reels += 1;
    if (reel.instagram) {
      instagramReels += 1;
      instagramPosted += 1;
      await stampIg("euromillions", latest.date);
    }
    if (reel.facebook || reel.instagram) {
      await stampReel("euromillions", latest.date);
      skipped["euromillions:reel"] = skipped["euromillions:reel"] || "reel_backfill";
    } else if (
      force ||
      state.lastPostedReel?.euromillions !== latest.date
    ) {
      skipped["euromillions:reel"] = "reel_backfill_fail";
    }
    if (reel.youtube) {
      youtubeShorts += 1;
      await stampYoutube("euromillions", latest.date);
      skipped["euromillions:youtube"] =
        skipped["euromillions:youtube"] || "youtube_backfill";
    } else if (
      youtubeConfigured() &&
      (force || state.lastPostedYoutube?.euromillions !== latest.date)
    ) {
      skipped["euromillions:youtube"] = "youtube_backfill_fail";
    }
    if (reel.tiktok) {
      tiktokPosts += 1;
      await stampTiktok("euromillions", latest.date);
      skipped["euromillions:tiktok"] =
        skipped["euromillions:tiktok"] || "tiktok_backfill";
    } else if (
      tiktokConfigured() &&
      (force || state.lastPostedTiktok?.euromillions !== latest.date)
    ) {
      skipped["euromillions:tiktok"] = "tiktok_backfill_fail";
    }
  }

  const companionReelGames: FdjCompanionGameId[] = ["loto", "eurodreams"];
  for (const gameId of companionReelGames) {
    const latestDraw = getGameLatest(fdj, gameId);
    const drawKey = latestDraw ? companionDrawKey(latestDraw) : null;
    const video = latestDraw ? companionVideoFields(latestDraw) : null;
    if (
      queue.some((j) => j.key === gameId) ||
      !want(gameId) ||
      !companionPublished(latestDraw) ||
      !latestDraw ||
      !drawKey ||
      !video
    ) {
      continue;
    }
    if (
      !force &&
      state.lastPostedReel?.[gameId] === drawKey &&
      (!youtubeConfigured() || state.lastPostedYoutube?.[gameId] === drawKey) &&
      (!tiktokConfigured() || state.lastPostedTiktok?.[gameId] === drawKey)
    ) {
      continue;
    }
    const reel = await postEuroMillionsReels({
      token,
      card: companionShareCard(latestDraw),
      caption: video.reelCaption,
      instagram,
      youtubeTitle: video.youtubeTitle,
      youtubeDescription: video.youtubeDescription,
      youtubeTags: video.youtubeTags,
      youtubePlaylists: video.youtubePlaylists,
      skipReel: !force && state.lastPostedReel?.[gameId] === drawKey,
      skipYoutube: !force && state.lastPostedYoutube?.[gameId] === drawKey,
      skipTiktok: !force && state.lastPostedTiktok?.[gameId] === drawKey,
    });
    if (reel.facebook) reels += 1;
    if (reel.instagram) {
      instagramReels += 1;
      instagramPosted += 1;
      await stampIg(gameId, drawKey);
    }
    if (reel.facebook || reel.instagram) {
      await stampReel(gameId, drawKey);
      skipped[`${gameId}:reel`] = skipped[`${gameId}:reel`] || "reel_backfill";
    } else if (force || state.lastPostedReel?.[gameId] !== drawKey) {
      skipped[`${gameId}:reel`] = "reel_backfill_fail";
    }
    if (reel.youtube) {
      youtubeShorts += 1;
      await stampYoutube(gameId, drawKey);
      skipped[`${gameId}:youtube`] =
        skipped[`${gameId}:youtube`] || "youtube_backfill";
    } else if (
      youtubeConfigured() &&
      (force || state.lastPostedYoutube?.[gameId] !== drawKey)
    ) {
      skipped[`${gameId}:youtube`] = "youtube_backfill_fail";
    }
    if (reel.tiktok) {
      tiktokPosts += 1;
      await stampTiktok(gameId, drawKey);
      skipped[`${gameId}:tiktok`] =
        skipped[`${gameId}:tiktok`] || "tiktok_backfill";
    } else if (
      tiktokConfigured() &&
      (force || state.lastPostedTiktok?.[gameId] !== drawKey)
    ) {
      skipped[`${gameId}:tiktok`] = "tiktok_backfill_fail";
    }
  }

  return {
    posted,
    stories,
    instagramPosted,
    instagramStories,
    reels,
    instagramReels,
    youtubeShorts,
    tiktokPosts,
    instagramUsername: instagram?.username || null,
    skipped,
  };
}

const NEWS_PER_RUN = 2;

function newsPermalink(slug: string): string {
  return `https://euromillions-resultats.fr/fr/actualites/${slug}`;
}

function newsCaption(title: string, excerpt: string, slugOrUrl: string): string {
  const playUrl = fdjAffiliateUrl("euromillions", "");
  const url = slugOrUrl.startsWith("http")
    ? slugOrUrl
    : newsPermalink(slugOrUrl);
  return [
    title.trim(),
    "",
    excerpt.trim(),
    "",
    url,
    ...(playUrl ? ["", "Jouer sur FDJ.fr :", playUrl] : []),
    "",
    "Site indépendant · 18+ · jeu responsable. Nous ne vendons pas de tickets.",
    "#EuroMillions",
  ].join("\n");
}

export type WeeklyNewsPick = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  body: string;
  imageSrc: string | null;
};

/** Dernière actu EuroMillions publiée dans la semaine ISO Paris. Pas d’archive hors semaine. */
export function pickWeeklyNewsArticle(
  articles: {
    slug: string;
    siteId?: string;
    publishedAt?: string;
    imageSrc?: string;
    fr?: { title?: string; excerpt?: string; body?: string[] };
  }[],
  weekKey: string,
  extraFacts?: string[] | null,
): WeeklyNewsPick | null {
  const ranked = articles
    .filter(
      (a) =>
        (a.siteId || "ecoflow") === "euromillions" &&
        Boolean(a.slug) &&
        Boolean(a.fr?.title) &&
        Boolean(a.publishedAt),
    )
    .map((a) => {
      const publishedAt = a.publishedAt!;
      const at = new Date(publishedAt);
      const week = Number.isNaN(at.getTime())
        ? ""
        : parisIsoWeekKey(at);
      const copy = newsCopyForShare({
        excerpt: a.fr?.excerpt,
        body: a.fr?.body,
        extraFacts,
      });
      return {
        slug: a.slug,
        title: a.fr!.title!.trim(),
        excerpt: copy.excerpt,
        publishedAt,
        body: copy.body,
        imageSrc: a.imageSrc?.trim() || null,
        week,
      };
    })
    .filter((a) => a.week === weekKey)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const top = ranked[0];
  if (!top) return null;
  return {
    slug: top.slug,
    title: top.title,
    excerpt: top.excerpt,
    publishedAt: top.publishedAt,
    body: top.body,
    imageSrc: top.imageSrc,
  };
}

let newsShortRunning = false;

/**
 * Un Short/Reel histoire chaque heure : scénario IA + photos déjà générées.
 * Désactivé tant que `NEWS_SHORT_ENABLED` n’est pas `1`. `force` ignore créneau et flag.
 */
export async function notifyWeeklyNewsShort(options?: {
  force?: boolean;
}): Promise<FacebookNotifyResult> {
  const skipped: Record<string, string> = {};
  if (newsShortRunning) {
    return emptyNotify({ newsShort: "in_flight" });
  }
  newsShortRunning = true;
  try {
    return await notifyWeeklyNewsShortBody(options, skipped);
  } finally {
    newsShortRunning = false;
  }
}

async function notifyWeeklyNewsShortBody(
  options: { force?: boolean } | undefined,
  skipped: Record<string, string>,
): Promise<FacebookNotifyResult> {
  const enabled = process.env.NEWS_SHORT_ENABLED?.trim() === "1";
  if (!options?.force && !enabled) {
    return emptyNotify({ newsShort: "disabled" });
  }
  if (!options?.force && !isNewsShortSlot()) {
    skipped.newsShort = "outside_hourly_slot";
    return emptyNotify(skipped);
  }
  const dayKey = parisDateKey();
  const hourKey = parisHourKey();
  console.error("news_short_start", hourKey, options?.force ? "force" : "cron");
  if (!facebookConfigured() && !youtubeConfigured() && !tiktokConfigured()) {
    return emptyNotify({ newsShort: "unconfigured" });
  }
  let state = await readState();
  if (!options?.force && state.lastNewsShortHour === hourKey) {
    skipped.newsShort = "already_this_hour";
    return emptyNotify(skipped);
  }
  const avoidFacts = [
    ...(state.lastNewsShortFacts || []),
    state.lastNewsShortFact,
  ]
    .filter((s): s is string => Boolean(s && s.length > 12))
    .slice(-24);
  const script = await composeNewsShortScript({
    avoidFacts,
  });
  const { generateNewsShortPhotos } = await import("./news-short-script");
  const photoBufs = await generateNewsShortPhotos(script);
  console.error("news_short_photos", photoBufs.length, "stock");
  const token = envPageToken();
  const instagram = token ? await resolveInstagramAccount(token) : null;
  if (token && !instagram) skipped.instagram = "unlinked";
  if (!token) skipped.facebook = "unconfigured";
  const stamp = `${script.game}:${hourKey}`;
  const caption = newsCaption(script.title, script.excerpt, script.permalink);
  const sent = await postNewsReels({
    token,
    title: script.title,
    excerpt: script.excerpt,
    body: script.body,
    imageSrc: script.imageSrc,
    mood: script.music,
    sfx: script.sfx,
    fond: script.visuels?.[0]?.fond,
    visuelSeed: script.fact,
    visuels: script.visuels,
    photoBufs,
    caption,
    instagram,
    youtubeTitle: youtubeNewsShortTitle(script.title),
    youtubeDescription: youtubeNewsShortDescription({
      title: script.title,
      excerpt: script.excerpt,
      url: script.permalink,
    }),
    skipReel: !token,
  });
  const ok = sent.facebook || sent.instagram || sent.youtube || sent.tiktok;
  if (!ok) {
    skipped.newsShort = "send_failed";
    return emptyNotify(skipped, {
      instagramUsername: instagram?.username || null,
    });
  }
  state = {
    ...state,
    lastNewsShortWeek: parisIsoWeekKey(),
    lastNewsShortSlug: stamp,
    lastNewsShortDay: dayKey,
    lastNewsShortHour: hourKey,
    lastNewsShortFact: script.fact,
    lastNewsShortFacts: [...avoidFacts, script.fact]
      .filter((s, i, all) => all.indexOf(s) === i)
      .slice(-24),
  };
  await writeState(state);
  skipped.newsShort = stamp;
  return {
    posted: 0,
    stories: 0,
    instagramPosted: 0,
    instagramStories: 0,
    reels: sent.facebook ? 1 : 0,
    instagramReels: sent.instagram ? 1 : 0,
    youtubeShorts: sent.youtube ? 1 : 0,
    tiktokPosts: sent.tiktok ? 1 : 0,
    instagramUsername: instagram?.username || null,
    skipped,
  };
}

/**
 * Poste fil + story pour les actus EuroMillions nouvellement ingérées.
 * Premier amorçage : mémorise les slugs déjà en archive, n’envoie pas l’historique.
 * Max 2 posts par ingest. Les échecs sont retentés au cron suivant.
 */
export async function notifyFacebookNews(
  fresh: {
    slug: string;
    siteId?: string;
    publishedAt?: string;
    fr?: { title?: string; excerpt?: string };
  }[],
): Promise<FacebookNotifyResult> {
  const skipped: Record<string, string> = {};
  const emFresh = fresh.filter(
    (a) => (a.siteId || "ecoflow") === "euromillions" && a.slug && a.fr?.title,
  );
  if (!facebookConfigured()) {
    return emptyNotify({ news: "facebook_unconfigured" });
  }
  let state = await readState();
  const token = envPageToken();
  const instagram = await resolveInstagramAccount(token);
  if (!instagram) skipped.instagram = "unlinked";
  const { readNewsStore } = await import("@/lib/news/store");
  const { newsSiteId } = await import("@/lib/news/types");
  const store = await readNewsStore();
  const created = new Set(emFresh.map((a) => a.slug));

  if (!state.newsSeeded) {
    state = {
      ...state,
      newsSeeded: true,
      postedNewsSlugs: store.articles
        .filter((a) => newsSiteId(a) === "euromillions" && !created.has(a.slug))
        .map((a) => a.slug),
    };
    await writeState(state);
    skipped.news = "seed";
  }

  const already = new Set(state.postedNewsSlugs || []);
  const queue = store.articles
    .filter(
      (a) =>
        newsSiteId(a) === "euromillions" &&
        Boolean(a.fr?.title) &&
        !already.has(a.slug),
    )
    .sort((a, b) => {
      const af = created.has(a.slug) ? 0 : 1;
      const bf = created.has(b.slug) ? 0 : 1;
      if (af !== bf) return af - bf;
      return (b.publishedAt || "").localeCompare(a.publishedAt || "");
    })
    .slice(0, NEWS_PER_RUN);

  let posted = 0;
  let stories = 0;
  let instagramPosted = 0;
  let instagramStories = 0;
  for (const article of queue) {
    const title = article.fr?.title?.trim() || article.slug;
    const excerpt = article.fr?.excerpt?.trim() || "";
    const q = `kind=news&slug=${encodeURIComponent(article.slug)}`;
    const sent = await postFeedAndStoryImages({
      token,
      caption: newsCaption(title, excerpt, article.slug),
      feedBytes: await newsSharePng(title, excerpt, SHARE_IG_FEED),
      storyBytes: await newsSharePng(title, excerpt, SHARE_STORY),
      publicFeedUrl: shareJpegUrl(`${q}&format=ig`),
      publicStoryUrl: shareJpegUrl(`${q}&format=story`),
      storyLinkUrl: fdjAffiliateUrl("euromillions", ""),
      instagram,
    });
    if (!sent.posted) {
      skipped[article.slug] = sent.error || "send_failed";
      console.error("facebook_news_post_fail", article.slug, sent.error);
      continue;
    }
    posted += 1;
    if (sent.story) stories += 1;
    if (sent.igPosted) instagramPosted += 1;
    if (sent.igStory) instagramStories += 1;
    already.add(article.slug);
    state = {
      ...state,
      newsSeeded: true,
      postedNewsSlugs: [...already],
    };
    await writeState(state);
    skipped[article.slug] = "ok";
  }
  return {
    posted,
    stories,
    instagramPosted,
    instagramStories,
    reels: 0,
    instagramReels: 0,
    youtubeShorts: 0,
    tiktokPosts: 0,
    instagramUsername: instagram?.username || null,
    skipped,
  };
}
