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
  newsShareImageResponse,
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
  lastPostedIg?: PostedMap;
  pageAccessToken?: string | null;
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

const SEED: FacebookStore = {
  updatedAt: new Date().toISOString(),
  lastPosted: { euromillions: null, loto: null, eurodreams: null },
  lastPostedIg: { euromillions: null, loto: null, eurodreams: null },
  pageAccessToken: null,
  newsSeeded: false,
  postedNewsSlugs: [],
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
      lastPostedIg: {
        euromillions: parsed.lastPostedIg?.euromillions ?? null,
        loto: parsed.lastPostedIg?.loto ?? null,
        eurodreams: parsed.lastPostedIg?.eurodreams ?? null,
      },
      pageAccessToken: parsed.pageAccessToken ?? null,
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
        lastPostedIg: store.lastPostedIg ?? SEED.lastPostedIg,
        pageAccessToken: store.pageAccessToken ?? null,
        newsSeeded: store.newsSeeded ?? false,
        postedNewsSlugs: store.postedNewsSlugs ?? [],
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
  for (let i = 0; i < 15; i += 1) {
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
      await new Promise((r) => setTimeout(r, 2000));
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
  instagram?: InstagramAccount | null;
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

  const unpublished = await uploadPhoto({
    token: args.token,
    bytes: await pngBytes(args.story),
    published: false,
  });
  let storyOk = false;
  if (!unpublished.ok || !unpublished.id) {
    console.error("facebook_story_upload_fail", unpublished.error);
  } else {
    const story = await publishStory(args.token, unpublished.id);
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
  const feedUrl = shareJpegUrl(`${args.publicQuery}&format=feed`);
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
  card: ReturnType<typeof euroMillionsShareCard>;
  publicQuery: string;
  instagram?: InstagramAccount | null;
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
    publicFeedUrl: shareJpegUrl(`${args.publicQuery}&format=feed`),
    publicStoryUrl: shareJpegUrl(`${args.publicQuery}&format=story`),
    instagram: args.instagram,
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
  const state = await refreshPageToken(await readState());
  const token = await currentPageToken(state);
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
    instagram,
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
    return {
      posted: 0,
      stories: 0,
      instagramPosted: 0,
      instagramStories: 0,
      instagramUsername: null,
      skipped: { all: "facebook_unconfigured" },
    };
  }
  let state = await refreshPageToken(await readState());
  const token = await currentPageToken(state);
  const instagram = await resolveInstagramAccount(token);
  if (!instagram) skipped.instagram = "unlinked";
  const fdj = await readFdjGamesStore();
  let posted = 0;
  let stories = 0;
  let instagramPosted = 0;
  let instagramStories = 0;

  const stamp = async (key: keyof PostedMap, value: string) => {
    state = {
      ...state,
      lastPosted: { ...state.lastPosted, [key]: value },
      lastPostedIg: {
        ...(state.lastPostedIg || SEED.lastPostedIg!),
        [key]: state.lastPostedIg?.[key] ?? null,
      },
    };
    await writeState(state);
  };

  const stampIg = async (key: keyof PostedMap, value: string) => {
    state = {
      ...state,
      lastPostedIg: {
        euromillions: state.lastPostedIg?.euromillions ?? null,
        loto: state.lastPostedIg?.loto ?? null,
        eurodreams: state.lastPostedIg?.eurodreams ?? null,
        [key]: value,
      },
    };
    await writeState(state);
  };

  const run = async (
    key: keyof PostedMap,
    fingerprint: string,
    caption: string,
    card: ReturnType<typeof euroMillionsShareCard>,
    publicQuery: string,
  ) => {
    const igAlready = state.lastPostedIg?.[key] === fingerprint;
    if (!options?.force) {
      if (!state.lastPosted[key]) {
        await stamp(key, fingerprint);
        skipped[key] = "seed";
        return;
      }
      if (state.lastPosted[key] === fingerprint) {
        if (instagram && !igAlready) {
          const igSent = await postInstagramOnly({
            token,
            caption,
            publicQuery,
            instagram,
          });
          if (igSent.igPosted) instagramPosted += 1;
          if (igSent.igStory) instagramStories += 1;
          await stampIg(key, fingerprint);
          skipped[key] = igSent.igPosted ? "ig_backfill" : "ig_backfill_fail";
          return;
        }
        skipped[key] = "already";
        return;
      }
    }
    const sent = await postFeedAndStory({
      token,
      caption,
      card,
      publicQuery,
      instagram,
    });
    if (!sent.posted) {
      skipped[key] = sent.error || "send_failed";
      console.error("facebook_draw_post_fail", key, sent.error);
      return;
    }
    posted += 1;
    if (sent.story) stories += 1;
    if (sent.igPosted) instagramPosted += 1;
    if (sent.igStory) instagramStories += 1;
    await stamp(key, fingerprint);
    if (sent.igPosted || sent.igStory) await stampIg(key, fingerprint);
    skipped[key] = "ok";
  };

  if (isEuroMillionsDrawPublished(latest) && latest) {
    await run(
      "euromillions",
      latest.date,
      facebookDrawMessage(latest),
      euroMillionsShareCard(latest),
      `date=${encodeURIComponent(latest.date)}`,
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
      `game=${encodeURIComponent(gameId)}&key=${encodeURIComponent(companionDrawKey(draw))}`,
    );
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
  return [
    title.trim(),
    "",
    excerpt.trim(),
    "",
    newsPermalink(slug),
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
  let state = await refreshPageToken(await readState());
  const token = await currentPageToken(state);
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
      feed: newsShareImageResponse(title, excerpt, SHARE_FEED),
      story: newsShareImageResponse(title, excerpt, SHARE_STORY),
      publicFeedUrl: shareJpegUrl(`${q}&format=feed`),
      publicStoryUrl: shareJpegUrl(`${q}&format=story`),
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
