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
import { formatEuroMillionsLongDate, parisDateKey } from "./datetime";
import {
  SHARE_FEED,
  SHARE_STORY,
  companionShareCard,
  euroMillionsShareCard,
  lotteryShareImageResponse,
  newsShareImageResponse,
  type ShareCardInput,
} from "./share-card";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw } from "./types";

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
  lastPostedOk?: PostedOkMap;
  lastErrors?: Record<string, string>;
  newsSeeded?: boolean;
  postedNewsSlugs?: string[];
};

export type FacebookNotifyResult = {
  posted: number;
  stories: number;
  instagramPosted: number;
  instagramStories: number;
  instagramUsername: string | null;
  skipped: Record<string, string>;
};

export type FacebookPublishSnapshot = {
  lastPosted: PostedMap;
  lastPostedIg: PostedMap;
  lastPostedOk: PostedOkMap;
  lastErrors: Record<string, string>;
};

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
  lastPostedOk: emptyPostedOk(),
  lastErrors: {},
  newsSeeded: false,
  postedNewsSlugs: [],
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
      lastPostedOk: mergePostedOk(parsed.lastPostedOk),
      lastErrors:
        parsed.lastErrors && typeof parsed.lastErrors === "object"
          ? parsed.lastErrors
          : {},
      newsSeeded: Boolean(parsed.newsSeeded),
      postedNewsSlugs: Array.isArray(parsed.postedNewsSlugs)
        ? parsed.postedNewsSlugs.filter((s) => typeof s === "string")
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
        lastPostedOk: store.lastPostedOk ?? emptyPostedOk(),
        lastErrors: store.lastErrors ?? {},
        newsSeeded: store.newsSeeded ?? false,
        postedNewsSlugs: store.postedNewsSlugs ?? [],
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

async function pngBytes(image: Response): Promise<Uint8Array> {
  return new Uint8Array(await image.arrayBuffer());
}

async function graphJson(
  url: string,
  body: FormData,
): Promise<{ id?: string; post_id?: string; error?: { message?: string } }> {
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
  feed: Response;
  story: Response;
  publicFeedUrl?: string;
  publicStoryUrl?: string;
  storyLinkUrl?: string;
  instagram?: InstagramAccount | null;
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
    bytes: await pngBytes(args.feed),
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
    bytes: await pngBytes(args.story),
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
}): Promise<{ igPosted: boolean; igStory: boolean }> {
  const feedUrl = shareJpegUrl(`${args.publicQuery}&format=ig`);
  const storyUrl = shareJpegUrl(`${args.publicQuery}&format=story`);
  let igPosted = false;
  let igStory = false;
  const feed = await publishInstagram({
    token: args.token,
    igUserId: args.instagram.id,
    imageUrl: feedUrl,
    caption: args.caption,
    story: false,
  });
  if (feed.ok) igPosted = true;
  else console.error("instagram_feed_fail", feed.error);
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
    feed: lotteryShareImageResponse(args.card, SHARE_FEED),
    story: lotteryShareImageResponse(args.card, SHARE_STORY),
    publicFeedUrl: shareJpegUrl(`${args.publicQuery}&format=ig`),
    publicStoryUrl: shareJpegUrl(`${args.publicQuery}&format=story`),
    storyLinkUrl: args.storyLinkUrl,
    instagram: args.instagram,
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
  });
  if (!sent.posted) return { ok: false, error: sent.error };
  return { ok: true };
}

export async function facebookPublishSnapshot(): Promise<FacebookPublishSnapshot> {
  const state = await readState();
  return {
    lastPosted: state.lastPosted,
    lastPostedIg: state.lastPostedIg ?? emptyPosted(),
    lastPostedOk: state.lastPostedOk ?? emptyPostedOk(),
    lastErrors: state.lastErrors ?? {},
  };
}

type DrawPostJob = {
  key: SocialDrawGameId;
  fingerprint: string;
  caption: string;
  card: ShareCardInput;
  publicQuery: string;
  storyLinkUrl?: string;
  sortAt: string;
};

/**
 * Poste fil + story au passage d’un nouveau tirage
 * (EuroMillions, Loto, EuroDreams, Keno, Crescendo).
 * Facebook est tamponné dès le succès fil — Instagram ne bloque plus le suivant.
 * Jeux jamais postés : tirages du jour seulement (pas l’archive).
 * Si un amorçage a avalé le tirage du jour sans poster, on retente.
 */
export async function notifyFacebookOnPublish(
  latest: EuroMillionsDraw | null,
  options?: { force?: boolean },
): Promise<FacebookNotifyResult> {
  const skipped: Record<string, string> = {};
  if (!facebookConfigured()) {
    return {
      posted: 0,
      stories: 0,
      instagramPosted: 0,
      instagramStories: 0,
      instagramUsername: null,
      skipped: { all: "facebook_unconfigured" },
    };
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
  const force = Boolean(options?.force);

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

  for (const gameId of COMPANION_SOCIAL_GAMES) {
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
      jobs.push({
        key: gameId,
        fingerprint,
        caption: companionMessage(draw),
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
        card: euroMillionsShareCard(latest),
        publicQuery: `date=${encodeURIComponent(latest.date)}`,
        storyLinkUrl: fdjAffiliateUrl("euromillions", ""),
        sortAt: `${latest.date}T21:00:00`,
      });
    }
    for (const gameId of COMPANION_SOCIAL_GAMES) {
      const draw = getGameLatest(fdj, gameId);
      if (!companionPublished(draw) || !draw) continue;
      candidates.push({
        key: gameId,
        fingerprint: companionDrawKey(draw),
        caption: companionMessage(draw),
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
      });
      if (igSent.igPosted) instagramPosted += 1;
      if (igSent.igStory) instagramStories += 1;
      await stampIg(job.key, job.fingerprint);
      skipped[`${job.key}:ig`] = igSent.igPosted ? "ig_backfill" : "ig_backfill_fail";
      filled += 1;
    }
  }

  return {
    posted,
    stories,
    instagramPosted,
    instagramStories,
    instagramUsername: instagram?.username || null,
    skipped,
  };
}

const NEWS_PER_RUN = 2;

function newsPermalink(slug: string): string {
  return `https://euromillions-resultats.fr/fr/actualites/${slug}`;
}

function newsCaption(title: string, excerpt: string, slug: string): string {
  const playUrl = fdjAffiliateUrl("euromillions", "");
  return [
    title.trim(),
    "",
    excerpt.trim(),
    "",
    newsPermalink(slug),
    ...(playUrl ? ["", "Jouer sur FDJ.fr :", playUrl] : []),
    "",
    "Site indépendant · 18+ · jeu responsable. Nous ne vendons pas de tickets.",
    "#EuroMillions",
  ].join("\n");
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
    return {
      posted: 0,
      stories: 0,
      instagramPosted: 0,
      instagramStories: 0,
      instagramUsername: null,
      skipped: { news: "facebook_unconfigured" },
    };
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
    const coverUrl = article.imageSrc
      ? article.imageSrc.startsWith("http")
        ? article.imageSrc
        : `https://euromillions-resultats.fr${article.imageSrc}`
      : undefined;
    const q = `kind=news&slug=${encodeURIComponent(article.slug)}`;
    const sent = await postFeedAndStoryImages({
      token,
      caption: newsCaption(title, excerpt, article.slug),
      feed: newsShareImageResponse(title, excerpt, SHARE_FEED, coverUrl),
      story: newsShareImageResponse(title, excerpt, SHARE_STORY, coverUrl),
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
    instagramUsername: instagram?.username || null,
    skipped,
  };
}
