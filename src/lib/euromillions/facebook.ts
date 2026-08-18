import { promises as fs } from "fs";
import path from "path";
import { formatEuroMillionsLongDate } from "./datetime";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw } from "./types";

type FacebookStore = {
  updatedAt: string;
  lastPostedDrawDate: string | null;
  /** Jeton Page renouvelé (volume persisté), pour glisser la fenêtre 60 j. */
  pageAccessToken?: string | null;
};

const SEED: FacebookStore = {
  updatedAt: new Date().toISOString(),
  lastPostedDrawDate: null,
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
    const raw = await fs.readFile(statePath(), "utf8");
    const parsed = JSON.parse(raw) as FacebookStore;
    return {
      ...SEED,
      lastPostedDrawDate: parsed.lastPostedDrawDate ?? null,
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
      { ...store, updatedAt: new Date().toISOString() },
      null,
      2,
    ) + "\n",
  );
}

async function currentPageToken(state: FacebookStore): Promise<string> {
  return state.pageAccessToken?.trim() || envPageToken();
}

/** Prolonge le jeton Page (~60 j) via la clé d’app, et le mémorise sur le volume. */
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
  if (draw.myMillionCode) {
    lines.push(`My Million : ${draw.myMillionCode}`);
  }
  if (typeof draw.jackpotEur === "number" && draw.jackpotEur > 0) {
    lines.push(`Jackpot : ${formatJackpot(draw.jackpotEur)}`);
  }
  lines.push(
    "",
    "Vérifier vos gains :",
    url,
    "",
    "Site indépendant · 18+ · jeu responsable. Nous ne vendons pas de tickets.",
    "#EuroMillions",
  );
  return lines.join("\n");
}

export async function postFacebookDraw(
  draw: EuroMillionsDraw,
  tokenOverride?: string,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const token = tokenOverride?.trim() || envPageToken();
  if (!token) return { ok: false, error: "facebook_unconfigured" };
  const body = new URLSearchParams({
    message: facebookDrawMessage(draw),
    link: facebookDrawPermalink(draw.date),
    access_token: token,
  });
  try {
    const res = await fetch(`${GRAPH}/${encodeURIComponent(pageId())}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json().catch(() => ({}))) as {
      id?: string;
      error?: { message?: string; code?: number };
    };
    if (!res.ok || !json.id) {
      const msg = json.error?.message || `facebook_${res.status}`;
      return { ok: false, error: msg.slice(0, 220) };
    }
    return { ok: true, id: json.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "facebook_error",
    };
  }
}

/**
 * Poste seulement au passage d’un nouveau tirage publié.
 * Premier amorçage : mémorise la date, n’envoie pas l’historique.
 * `force` : poste le tirage courant (test / rattrapage).
 */
export async function notifyFacebookOnPublish(
  latest: EuroMillionsDraw | null,
  options?: { force?: boolean },
): Promise<{ posted: boolean; skipped: string; id?: string }> {
  if (!isEuroMillionsDrawPublished(latest) || !latest) {
    return { posted: false, skipped: "unpublished" };
  }
  if (!facebookConfigured()) {
    return { posted: false, skipped: "facebook_unconfigured" };
  }
  const state = await readState();
  if (!options?.force) {
    if (!state.lastPostedDrawDate) {
      await writeState({ ...state, lastPostedDrawDate: latest.date });
      return { posted: false, skipped: "seed" };
    }
    if (state.lastPostedDrawDate === latest.date) {
      return { posted: false, skipped: "already" };
    }
  }
  const ready = await refreshPageToken(state);
  const sent = await postFacebookDraw(latest, await currentPageToken(ready));
  if (!sent.ok) {
    console.error("facebook_draw_post_fail", sent.error);
    return { posted: false, skipped: sent.error || "send_failed" };
  }
  await writeState({ ...ready, lastPostedDrawDate: latest.date });
  return { posted: true, skipped: "ok", id: sent.id };
}
