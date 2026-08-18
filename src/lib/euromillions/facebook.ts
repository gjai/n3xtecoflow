import { promises as fs } from "fs";
import path from "path";
import { companionDrawKey } from "@/lib/fdj-games/keys";
import {
  getGameLatest,
  readFdjGamesStore,
} from "@/lib/fdj-games/store";
import type { FdjCompanionGameId, FdjGameDraw } from "@/lib/fdj-games/types";
import { formatEuroMillionsLongDate } from "./datetime";
import {
  SHARE_FEED,
  SHARE_STORY,
  companionShareCard,
  euroMillionsShareCard,
  lotteryShareImageResponse,
} from "./share-card";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw } from "./types";

type PostedMap = {
  euromillions: string | null;
  loto: string | null;
  eurodreams: string | null;
};

type FacebookStore = {
  updatedAt: string;
  lastPostedDrawDate?: string | null;
  lastPosted: PostedMap;
  pageAccessToken?: string | null;
};

export type FacebookNotifyResult = {
  posted: number;
  stories: number;
  skipped: Record<string, string>;
};

const SEED: FacebookStore = {
  updatedAt: new Date().toISOString(),
  lastPosted: { euromillions: null, loto: null, eurodreams: null },
  pageAccessToken: null,
};

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
      lastPosted: {
        euromillions:
          parsed.lastPosted?.euromillions ??
          parsed.lastPostedDrawDate ??
          null,
        loto: parsed.lastPosted?.loto ?? null,
        eurodreams: parsed.lastPosted?.eurodreams ?? null,
      },
      pageAccessToken: parsed.pageAccessToken ?? null,
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
        pageAccessToken: store.pageAccessToken ?? null,
      },
      null,
      2,
    ) + "\n",
  );
}

async function currentPageToken(state: FacebookStore): Promise<string> {
  return state.pageAccessToken?.trim() || envPageToken();
}

async function refreshPageToken(state: FacebookStore): Promise<FacebookStore> {
  const token = await currentPageToken(state);
  const appId = process.env.FACEBOOK_APP_ID?.trim();
  const secret = process.env.FACEBOOK_APP_SECRET?.trim();
  if (!token || !appId || !secret) return state;
  const url =
    `${GRAPH}/oauth/access_token?` +
    new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: secret,
      fb_exchange_token: token,
    }).toString();
  try {
    const res = await fetch(url);
    const json = (await res.json().catch(() => ({}))) as {
      access_token?: string;
    };
    if (!res.ok || !json.access_token) return state;
    const next = { ...state, pageAccessToken: json.access_token };
    await writeState(next);
    return next;
  } catch {
    return state;
  }
}

function formatJackpot(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function legalLines(url: string, tag: string): string[] {
  return [
    "",
    "Vérifier vos gains :",
    url,
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
  return [...lines, ...legalLines(url, "#EuroMillions")].join("\n");
}

function companionPermalink(draw: FdjGameDraw): string {
  return `https://euromillions-resultats.fr/fr/jeux/${draw.gameId}/${companionDrawKey(draw)}`;
}

function companionMessage(draw: FdjGameDraw): string {
  const date = formatEuroMillionsLongDate(draw.date, "fr");
  const title = draw.gameId === "loto" ? "Loto" : "EuroDreams";
  const tag = draw.gameId === "loto" ? "#Loto" : "#EuroDreams";
  const lines = [`Résultats ${title} du ${date}`, ""];
  for (const g of draw.groups) {
    if (g.kind !== "numbers" && g.kind !== "bonus") continue;
    const label = g.labelKey === "chance" ? "Chance" : g.labelKey === "dream" ? "Dream" : "Numéros";
    lines.push(`${label} : ${g.values.join(" · ")}`);
  }
  if (typeof draw.jackpotEur === "number" && draw.jackpotEur > 0) {
    lines.push(`Jackpot : ${formatJackpot(draw.jackpotEur)}`);
  }
  return [...lines, ...legalLines(companionPermalink(draw), tag)].join("\n");
}

function companionPublished(draw: FdjGameDraw | null | undefined): boolean {
  return Boolean(
    draw?.groups.some((g) => g.kind === "numbers" && g.values.length >= 5),
  );
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
): Promise<{ ok: boolean; error?: string }> {
  const form = new FormData();
  form.append("access_token", token);
  form.append("photo_id", photoId);
  const json = await graphJson(
    `${GRAPH}/${encodeURIComponent(pageId())}/photo_stories`,
    form,
  );
  if (json.error?.message) {
    return { ok: false, error: json.error.message.slice(0, 220) };
  }
  return { ok: true };
}

async function postFeedAndStory(args: {
  token: string;
  caption: string;
  card: ReturnType<typeof euroMillionsShareCard>;
}): Promise<{ posted: boolean; story: boolean; error?: string }> {
  const feedPng = await pngBytes(
    lotteryShareImageResponse(args.card, SHARE_FEED),
  );
  const feed = await uploadPhoto({
    token: args.token,
    bytes: feedPng,
    caption: args.caption,
    published: true,
  });
  if (!feed.ok) return { posted: false, story: false, error: feed.error };

  const storyPng = await pngBytes(
    lotteryShareImageResponse(args.card, SHARE_STORY),
  );
  const unpublished = await uploadPhoto({
    token: args.token,
    bytes: storyPng,
    published: false,
  });
  if (!unpublished.ok || !unpublished.id) {
    console.error("facebook_story_upload_fail", unpublished.error);
    return { posted: true, story: false };
  }
  const story = await publishStory(args.token, unpublished.id);
  if (!story.ok) {
    console.error("facebook_story_fail", story.error);
    return { posted: true, story: false };
  }
  return { posted: true, story: true };
}

export async function postFacebookDraw(
  draw: EuroMillionsDraw,
  tokenOverride?: string,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const token = tokenOverride?.trim() || envPageToken();
  if (!token) return { ok: false, error: "facebook_unconfigured" };
  const sent = await postFeedAndStory({
    token,
    caption: facebookDrawMessage(draw),
    card: euroMillionsShareCard(draw),
  });
  if (!sent.posted) return { ok: false, error: sent.error };
  return { ok: true };
}

/**
 * Poste fil + story au passage d’un nouveau tirage (EuroMillions, Loto, EuroDreams).
 * Premier amorçage par jeu : mémorise la date, n’envoie pas l’historique.
 */
export async function notifyFacebookOnPublish(
  latest: EuroMillionsDraw | null,
  options?: { force?: boolean },
): Promise<FacebookNotifyResult> {
  const skipped: Record<string, string> = {};
  if (!facebookConfigured()) {
    return { posted: 0, stories: 0, skipped: { all: "facebook_unconfigured" } };
  }
  let state = await refreshPageToken(await readState());
  const token = await currentPageToken(state);
  const fdj = await readFdjGamesStore();
  let posted = 0;
  let stories = 0;

  const stamp = async (key: keyof PostedMap, value: string) => {
    state = {
      ...state,
      lastPosted: { ...state.lastPosted, [key]: value },
    };
    await writeState(state);
  };

  const run = async (
    key: keyof PostedMap,
    fingerprint: string,
    caption: string,
    card: ReturnType<typeof euroMillionsShareCard>,
  ) => {
    if (!options?.force) {
      if (!state.lastPosted[key]) {
        await stamp(key, fingerprint);
        skipped[key] = "seed";
        return;
      }
      if (state.lastPosted[key] === fingerprint) {
        skipped[key] = "already";
        return;
      }
    }
    const sent = await postFeedAndStory({ token, caption, card });
    if (!sent.posted) {
      skipped[key] = sent.error || "send_failed";
      console.error("facebook_draw_post_fail", key, sent.error);
      return;
    }
    posted += 1;
    if (sent.story) stories += 1;
    await stamp(key, fingerprint);
    skipped[key] = "ok";
  };

  if (isEuroMillionsDrawPublished(latest) && latest) {
    await run(
      "euromillions",
      latest.date,
      facebookDrawMessage(latest),
      euroMillionsShareCard(latest),
    );
  } else {
    skipped.euromillions = "unpublished";
  }

  for (const gameId of ["loto", "eurodreams"] as const) {
    const draw = getGameLatest(fdj, gameId as FdjCompanionGameId);
    if (!companionPublished(draw) || !draw) {
      skipped[gameId] = "unpublished";
      continue;
    }
    await run(
      gameId,
      companionDrawKey(draw),
      companionMessage(draw),
      companionShareCard(draw),
    );
  }

  return { posted, stories, skipped };
}
