import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { confirmAlertHtml, resultAlertHtml, companionResultAlertHtml } from "@/lib/mail/em-layout";
import { mailConfigured, sendResendEmail } from "@/lib/mail/resend";
import { formatDrawWhen } from "@/lib/fdj-games/display";
import { companionDrawKey } from "@/lib/fdj-games/keys";
import { getGameDraws, readFdjGamesStore } from "@/lib/fdj-games/store";
import type { FdjCompanionGameId, FdjGameDraw } from "@/lib/fdj-games/types";
import { formatEuroMillionsLongDate, parisDateKey } from "./datetime";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw } from "./types";
import {
  type AlertGameId,
  alertGameLabel,
  companionAlertSlug,
  defaultAlertGames,
  gamesEqual,
  parseAlertGames,
  subscriberGames,
} from "./alert-games";

export type { AlertGameId } from "./alert-games";
export {
  ALERT_GAME_IDS,
  defaultAlertGames,
  parseAlertGames,
} from "./alert-games";

export type AlertPending = {
  email: string;
  token: string;
  locale: string;
  games: AlertGameId[];
  createdAt: string;
};

export type AlertConfirmed = {
  email: string;
  unsubToken: string;
  locale: string;
  games: AlertGameId[];
  confirmedAt: string;
};

export type AlertsStore = {
  updatedAt: string;
  /** Dernier tirage EuroMillions pour lequel un mail a déjà été envoyé (ou amorcé). */
  lastNotifiedDrawDate: string | null;
  lastNotified: Record<AlertGameId, string | null>;
  pending: AlertPending[];
  confirmed: AlertConfirmed[];
};

function emptyLastNotified(): Record<AlertGameId, string | null> {
  return {
    euromillions: null,
    loto: null,
    eurodreams: null,
    keno: null,
    crescendo: null,
  };
}

const SEED: AlertsStore = {
  updatedAt: new Date().toISOString(),
  lastNotifiedDrawDate: null,
  lastNotified: emptyLastNotified(),
  pending: [],
  confirmed: [],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PENDING_MS = 7 * 24 * 3600_000;

function dataPath() {
  return (
    process.env.EM_ALERTS_PATH?.trim() ||
    path.join(process.cwd(), "data", "em-alerts.json")
  );
}

function token(): string {
  return randomBytes(24).toString("hex");
}

export function normalizeAlertEmail(raw: string): string {
  return raw.trim().toLowerCase().slice(0, 160);
}

export function isAlertEmail(raw: string): boolean {
  return EMAIL_RE.test(normalizeAlertEmail(raw));
}

function withGames(
  row: { games?: AlertGameId[] } & Record<string, unknown>,
): AlertGameId[] {
  return subscriberGames(parseAlertGames(row.games));
}

function normalizeStore(parsed: Partial<AlertsStore>): AlertsStore {
  const last = emptyLastNotified();
  const incoming = parsed.lastNotified || emptyLastNotified();
  last.euromillions =
    incoming.euromillions ?? parsed.lastNotifiedDrawDate ?? null;
  last.loto = incoming.loto ?? null;
  last.eurodreams = incoming.eurodreams ?? null;
  last.keno = incoming.keno ?? null;
  last.crescendo = incoming.crescendo ?? null;
  return {
    updatedAt: parsed.updatedAt || SEED.updatedAt,
    lastNotifiedDrawDate: last.euromillions,
    lastNotified: last,
    pending: (parsed.pending || []).map((p) => ({
      email: p.email,
      token: p.token,
      locale: p.locale,
      games: withGames(p),
      createdAt: p.createdAt,
    })),
    confirmed: (parsed.confirmed || []).map((c) => ({
      email: c.email,
      unsubToken: c.unsubToken,
      locale: c.locale,
      games: withGames(c),
      confirmedAt: c.confirmedAt,
    })),
  };
}

export async function readAlertsStore(): Promise<AlertsStore> {
  try {
    const raw = await fs.readFile(dataPath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<AlertsStore>;
    if (!Array.isArray(parsed?.pending) || !Array.isArray(parsed?.confirmed)) {
      return { ...SEED, lastNotified: emptyLastNotified() };
    }
    return normalizeStore(parsed);
  } catch {
    return { ...SEED, lastNotified: emptyLastNotified() };
  }
}

async function writeAlertsStore(store: AlertsStore): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const next: AlertsStore = {
    ...store,
    lastNotifiedDrawDate: store.lastNotified.euromillions,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(file, JSON.stringify(next, null, 2) + "\n", "utf8");
}

function prunePending(store: AlertsStore, now = Date.now()): AlertsStore {
  const cutoff = now - PENDING_MS;
  return {
    ...store,
    pending: store.pending.filter((p) => Date.parse(p.createdAt) >= cutoff),
  };
}

function origin(): string {
  return "https://euromillions-resultats.fr";
}

function localePath(locale: string): "en" | "fr" {
  return locale === "en" ? "en" : "fr";
}

export async function requestAlertSubscribe(args: {
  email: string;
  locale: string;
  ageConfirmed: boolean;
  games?: unknown;
}): Promise<
  | { ok: true; already: boolean }
  | {
      ok: false;
      error: "invalid" | "age" | "games" | "mail_unconfigured" | "send_failed";
    }
> {
  if (!args.ageConfirmed) return { ok: false, error: "age" };
  const email = normalizeAlertEmail(args.email);
  if (!isAlertEmail(email)) return { ok: false, error: "invalid" };
  const games = parseAlertGames(args.games);
  if (!games.length) return { ok: false, error: "games" };
  if (!mailConfigured()) return { ok: false, error: "mail_unconfigured" };

  const locale = localePath(args.locale);
  let store = prunePending(await readAlertsStore());
  const existing = store.confirmed.find((c) => c.email === email);
  if (existing && gamesEqual(subscriberGames(existing.games), games)) {
    return { ok: true, already: true };
  }
  store.pending = store.pending.filter((p) => p.email !== email);
  const pending: AlertPending = {
    email,
    token: token(),
    locale,
    games,
    createdAt: new Date().toISOString(),
  };
  store.pending.push(pending);
  await writeAlertsStore(store);

  const confirmUrl = `${origin()}/api/euromillions/alerts/confirm?token=${pending.token}`;
  const mail = confirmAlertHtml({
    confirmUrl,
    locale,
    gameLabels: games.map((id) => alertGameLabel(id, locale)),
  });
  const sent = await sendResendEmail({
    to: email,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
  if (!sent.ok) {
    console.error("alert_confirm_send_fail", sent.error);
    return { ok: false, error: "send_failed" };
  }
  return { ok: true, already: false };
}

export async function confirmAlert(rawToken: string): Promise<boolean> {
  const t = rawToken.trim();
  if (!t) return false;
  let store = prunePending(await readAlertsStore());
  const pending = store.pending.find((p) => p.token === t);
  if (!pending) return false;
  store.pending = store.pending.filter((p) => p.token !== t);
  const prev = store.confirmed.find((c) => c.email === pending.email);
  store.confirmed = store.confirmed.filter((c) => c.email !== pending.email);
  store.confirmed.push({
    email: pending.email,
    unsubToken: prev?.unsubToken || token(),
    locale: pending.locale,
    games: subscriberGames(pending.games),
    confirmedAt: new Date().toISOString(),
  });
  await writeAlertsStore(store);
  return true;
}

export async function unsubscribeAlert(rawToken: string): Promise<boolean> {
  const t = rawToken.trim();
  if (!t) return false;
  const store = await readAlertsStore();
  const had =
    store.confirmed.some((c) => c.unsubToken === t) ||
    store.pending.some((p) => p.token === t);
  store.confirmed = store.confirmed.filter((c) => c.unsubToken !== t);
  store.pending = store.pending.filter((p) => p.token !== t);
  await writeAlertsStore(store);
  return had;
}

function resultEmail(args: {
  locale: string;
  draw: EuroMillionsDraw;
  unsubToken: string;
}): { subject: string; text: string; html: string } {
  const dateLabel = formatEuroMillionsLongDate(args.draw.date, args.locale);
  const loc = localePath(args.locale);
  return resultAlertHtml({
    locale: args.locale,
    dateLabel,
    numbers: args.draw.numbers,
    stars: args.draw.stars,
    url: `${origin()}/${loc}/tirages/${args.draw.date}#simulateur`,
    unsubUrl: `${origin()}/api/euromillions/alerts/unsubscribe?token=${args.unsubToken}`,
  });
}

function groupMailLabel(labelKey: string, locale: string): string {
  const en = locale === "en";
  if (labelKey === "chance") return en ? "Chance" : "Chance";
  if (labelKey === "dream") return "Dream";
  if (labelKey === "secondDraw") return en ? "2nd draw" : "2e tirage";
  if (labelKey === "letter") return en ? "Letter" : "Lettre";
  if (labelKey === "main") return en ? "Numbers" : "Numéros";
  return en ? "Numbers" : "Numéros";
}

function companionResultEmail(args: {
  locale: string;
  draw: FdjGameDraw;
  unsubToken: string;
}): { subject: string; text: string; html: string } {
  const loc = localePath(args.locale);
  const dateLabel = formatEuroMillionsLongDate(args.draw.date, loc);
  const when = formatDrawWhen(args.draw, loc);
  const gameId = args.draw.gameId as Exclude<AlertGameId, "euromillions">;
  const gameLabel = alertGameLabel(gameId, loc);
  let slotLabel: string | null = null;
  if (when.kenoSlot === "midi") slotLabel = loc === "en" ? "Lunchtime" : "Midi";
  else if (when.kenoSlot === "soir") slotLabel = loc === "en" ? "Evening" : "Soir";
  else if (when.time) slotLabel = when.time;

  const groups = args.draw.groups
    .filter(
      (g) =>
        g.values.length &&
        g.kind !== "other" &&
        g.labelKey !== "joker" &&
        g.labelKey !== "multiplier",
    )
    .map((g) => {
      const nums = g.values
        .map((v) => Number(v))
        .filter((n) => Number.isInteger(n) && n > 0);
      if (g.kind === "letter" || nums.length !== g.values.length) {
        return {
          label: groupMailLabel(g.labelKey, loc),
          text: g.values.map(String).join(" · "),
        };
      }
      return {
        label: groupMailLabel(g.labelKey, loc),
        numbers: nums,
      };
    });

  const key = companionDrawKey(args.draw);
  return companionResultAlertHtml({
    locale: loc,
    gameLabel,
    dateLabel,
    slotLabel,
    groups,
    url: `${origin()}/${loc}/jeux/${companionAlertSlug(gameId)}/${key}#simulateur`,
    unsubUrl: `${origin()}/api/euromillions/alerts/unsubscribe?token=${args.unsubToken}`,
    banner: gameId === "keno" ? "bienvenue" : gameId,
  });
}

/**
 * Envoie l’alerte seulement au passage d’un nouveau tirage publié.
 * Premier amorçage : mémorise la date, n’envoie pas l’historique.
 */
export async function notifyAlertsOnPublish(
  latest: EuroMillionsDraw | null,
): Promise<{ sent: number; skipped: string } | null> {
  if (!isEuroMillionsDrawPublished(latest) || !latest) {
    return null;
  }
  if (!mailConfigured()) {
    return { sent: 0, skipped: "mail_unconfigured" };
  }
  const store = prunePending(await readAlertsStore());
  if (!store.lastNotified.euromillions) {
    store.lastNotified.euromillions = latest.date;
    store.lastNotifiedDrawDate = latest.date;
    await writeAlertsStore(store);
    return { sent: 0, skipped: "seed" };
  }
  if (store.lastNotified.euromillions === latest.date) {
    return { sent: 0, skipped: "already" };
  }
  let sent = 0;
  for (const sub of store.confirmed) {
    if (!subscriberGames(sub.games).includes("euromillions")) continue;
    const mail = resultEmail({
      locale: sub.locale,
      draw: latest,
      unsubToken: sub.unsubToken,
    });
    const res = await sendResendEmail({
      to: sub.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (res.ok) sent += 1;
    else console.error("alert_result_send_fail", sub.email, res.error);
  }
  store.lastNotified.euromillions = latest.date;
  store.lastNotifiedDrawDate = latest.date;
  await writeAlertsStore(store);
  return { sent, skipped: "ok" };
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

function isRecentDrawDate(date: string): boolean {
  const today = parisDateKey();
  if (date >= today) return true;
  return date >= parisDateKey(new Date(Date.now() - 36 * 3600 * 1000));
}

function companionDrawsToNotify(
  draws: FdjGameDraw[],
  lastKey: string | null,
): FdjGameDraw[] {
  const published = draws
    .filter(companionPublished)
    .sort((a, b) => a.plannedAt.localeCompare(b.plannedAt));
  if (!published.length) return [];
  const latest = published[published.length - 1]!;
  if (!lastKey) return [];
  const idx = published.findIndex((d) => companionDrawKey(d) === lastKey);
  if (idx >= 0) {
    return published
      .slice(idx + 1)
      .filter((d) => isRecentDrawDate(d.date))
      .slice(-4);
  }
  if (companionDrawKey(latest) !== lastKey && isRecentDrawDate(latest.date)) {
    return [latest];
  }
  return [];
}

export async function notifyCompanionAlertsOnPublish(): Promise<{
  sent: number;
  skipped: string;
} | null> {
  if (!mailConfigured()) {
    return { sent: 0, skipped: "mail_unconfigured" };
  }
  const fdj = await readFdjGamesStore();
  const store = prunePending(await readAlertsStore());
  const gameIds: FdjCompanionGameId[] = [
    "loto",
    "eurodreams",
    "keno",
    "crescendo",
  ];
  let sent = 0;
  let seeded = false;

  for (const gameId of gameIds) {
    const draws = getGameDraws(fdj, gameId);
    const published = draws
      .filter(companionPublished)
      .sort((a, b) => a.plannedAt.localeCompare(b.plannedAt));
    const latest = published[published.length - 1];
    if (!latest) continue;
    const latestKey = companionDrawKey(latest);
    if (!store.lastNotified[gameId]) {
      store.lastNotified[gameId] = latestKey;
      seeded = true;
      continue;
    }
    const jobs = companionDrawsToNotify(draws, store.lastNotified[gameId]);
    for (const draw of jobs) {
      for (const sub of store.confirmed) {
        if (!subscriberGames(sub.games).includes(gameId)) continue;
        const mail = companionResultEmail({
          locale: sub.locale,
          draw,
          unsubToken: sub.unsubToken,
        });
        const res = await sendResendEmail({
          to: sub.email,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
        });
        if (res.ok) sent += 1;
        else console.error("alert_companion_send_fail", gameId, sub.email, res.error);
      }
      store.lastNotified[gameId] = companionDrawKey(draw);
    }
    if (!jobs.length && store.lastNotified[gameId] !== latestKey && !isRecentDrawDate(latest.date)) {
      store.lastNotified[gameId] = latestKey;
    }
  }

  await writeAlertsStore(store);
  if (seeded && sent === 0) return { sent: 0, skipped: "seed" };
  return { sent, skipped: sent ? "ok" : "already" };
}
