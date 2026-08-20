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
import { isAppLocale } from "@/i18n/locales";
import { isRateLimited } from "@/lib/http/rate-limit";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw } from "./types";
import {
  type AlertGameId,
  ALERT_GAME_IDS,
  alertGameLabel,
  companionAlertSlug,
  gamesEqual,
  parseAlertGames,
  subscriberGames,
} from "./alert-games";
import { FileLockError, withFileLock } from "@/lib/http/file-lock";

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
  /** Curseur par jeu : évite un renvoi si crash au milieu de la boucle. */
  lastNotified?: Record<AlertGameId, string | null>;
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
const CONFIRM_COOLDOWN_MS = 15 * 60_000;

function dataPath() {
  return (
    process.env.EM_ALERTS_PATH?.trim() ||
    path.join(process.cwd(), "data", "em-alerts.json")
  );
}

function lockPath() {
  return `${dataPath()}.lock`;
}

function withAlertsLock<T>(fn: () => Promise<T>): Promise<T> {
  return withFileLock(lockPath(), fn, {
    staleMs: 25_000,
    retries: 30,
    delayMs: 80,
  });
}

function setSubCursor(
  sub: AlertConfirmed,
  game: AlertGameId,
  key: string,
): AlertConfirmed {
  return {
    ...sub,
    lastNotified: {
      ...emptyLastNotified(),
      ...sub.lastNotified,
      [game]: key,
    },
  };
}

function subNeedsKey(
  sub: AlertConfirmed,
  game: AlertGameId,
  key: string,
  global: string | null,
): boolean {
  if (!subscriberGames(sub.games).includes(game)) return false;
  const cursor = sub.lastNotified?.[game] ?? global;
  return cursor !== key;
}

function normalizeSubLastNotified(
  raw: AlertConfirmed["lastNotified"] | undefined,
): Record<AlertGameId, string | null> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out = emptyLastNotified();
  let any = false;
  for (const id of ALERT_GAME_IDS) {
    const v = raw[id];
    if (typeof v === "string" && v) {
      out[id] = v;
      any = true;
    }
  }
  return any ? out : undefined;
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
      lastNotified: normalizeSubLastNotified(c.lastNotified),
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

function mailLocale(locale: string): "en" | "fr" {
  return locale === "en" ? "en" : "fr";
}

function storeLocale(locale: string): string {
  return isAppLocale(locale) ? locale : "fr";
}

export function alertPageLocale(locale: string): string {
  return storeLocale(locale);
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
      error:
        | "invalid"
        | "age"
        | "games"
        | "mail_unconfigured"
        | "send_failed"
        | "rate_limited";
    }
> {
  if (!args.ageConfirmed) return { ok: false, error: "age" };
  const email = normalizeAlertEmail(args.email);
  if (!isAlertEmail(email)) return { ok: false, error: "invalid" };
  const games = parseAlertGames(args.games);
  if (!games.length) return { ok: false, error: "games" };
  if (!mailConfigured()) return { ok: false, error: "mail_unconfigured" };

  const locale = storeLocale(args.locale);
  const mailLoc = mailLocale(locale);
  let pending: AlertPending;
  try {
    pending = await withAlertsLock(async () => {
      let store = prunePending(await readAlertsStore());
      const existing = store.confirmed.find((c) => c.email === email);
      if (existing && gamesEqual(subscriberGames(existing.games), games)) {
        throw Object.assign(new Error("already"), { code: "already" });
      }
      const existingPending = store.pending.find((p) => p.email === email);
      if (existingPending) {
        const age = Date.now() - Date.parse(existingPending.createdAt);
        if (Number.isFinite(age) && age >= 0 && age < CONFIRM_COOLDOWN_MS) {
          throw Object.assign(new Error("cooldown"), { code: "cooldown" });
        }
      }
      if (
        isRateLimited(`alert-mail:${email}`, {
          windowMs: CONFIRM_COOLDOWN_MS,
          max: 1,
        }) ||
        isRateLimited(`alert-mail-day:${email}`, {
          windowMs: 24 * 3600_000,
          max: 4,
        })
      ) {
        throw Object.assign(new Error("rate_limited"), { code: "rate_limited" });
      }
      store.pending = store.pending.filter((p) => p.email !== email);
      const row: AlertPending = {
        email,
        token: token(),
        locale,
        games,
        createdAt: new Date().toISOString(),
      };
      store.pending.push(row);
      await writeAlertsStore(store);
      return row;
    });
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "already") return { ok: true, already: true };
    if (code === "cooldown") return { ok: true, already: false };
    if (code === "rate_limited" || err instanceof FileLockError) {
      return { ok: false, error: "rate_limited" };
    }
    throw err;
  }

  const confirmUrl = `${origin()}/api/euromillions/alerts/confirm?token=${pending.token}`;
  const mail = confirmAlertHtml({
    confirmUrl,
    locale: mailLoc,
    gameLabels: games.map((id) => alertGameLabel(id, mailLoc)),
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

export async function confirmAlert(
  rawToken: string,
): Promise<{ ok: boolean; locale: string }> {
  const t = rawToken.trim();
  if (!t) return { ok: false, locale: "fr" };
  try {
    return await withAlertsLock(async () => {
      let store = prunePending(await readAlertsStore());
      const pending = store.pending.find((p) => p.token === t);
      if (!pending) return { ok: false, locale: "fr" };
      store.pending = store.pending.filter((p) => p.token !== t);
      const prev = store.confirmed.find((c) => c.email === pending.email);
      store.confirmed = store.confirmed.filter((c) => c.email !== pending.email);
      store.confirmed.push({
        email: pending.email,
        unsubToken: prev?.unsubToken || token(),
        locale: pending.locale,
        games: subscriberGames(pending.games),
        confirmedAt: new Date().toISOString(),
        lastNotified: prev?.lastNotified,
      });
      await writeAlertsStore(store);
      return { ok: true, locale: pending.locale };
    });
  } catch (err) {
    if (err instanceof FileLockError) return { ok: false, locale: "fr" };
    throw err;
  }
}

export async function unsubscribeAlert(
  rawToken: string,
): Promise<{ ok: boolean; locale: string }> {
  const t = rawToken.trim();
  if (!t) return { ok: false, locale: "fr" };
  try {
    return await withAlertsLock(async () => {
      const store = await readAlertsStore();
      const row =
        store.confirmed.find((c) => c.unsubToken === t) ||
        store.pending.find((p) => p.token === t);
      const locale = row?.locale || "fr";
      const had = Boolean(row);
      store.confirmed = store.confirmed.filter((c) => c.unsubToken !== t);
      store.pending = store.pending.filter((p) => p.token !== t);
      if (had) await writeAlertsStore(store);
      return { ok: had, locale };
    });
  } catch (err) {
    if (err instanceof FileLockError) return { ok: false, locale: "fr" };
    throw err;
  }
}

function resultEmail(args: {
  locale: string;
  draw: EuroMillionsDraw;
  unsubToken: string;
}): { subject: string; text: string; html: string } {
  const dateLabel = formatEuroMillionsLongDate(args.draw.date, args.locale);
  const loc = mailLocale(args.locale);
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
  const loc = mailLocale(args.locale);
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
  const date = latest.date;
  const seeded = await withAlertsLock(async () => {
    const store = prunePending(await readAlertsStore());
    if (store.lastNotified.euromillions) return false;
    store.lastNotified.euromillions = date;
    store.lastNotifiedDrawDate = date;
    store.confirmed = store.confirmed.map((c) =>
      setSubCursor(c, "euromillions", date),
    );
    await writeAlertsStore(store);
    return true;
  });
  if (seeded) return { sent: 0, skipped: "seed" };

  let sent = 0;
  const failed = new Set<string>();
  for (;;) {
    const sub = await withAlertsLock(async () => {
      const store = prunePending(await readAlertsStore());
      return (
        store.confirmed.find(
          (s) =>
            !failed.has(s.email) &&
            subNeedsKey(
              s,
              "euromillions",
              date,
              store.lastNotified.euromillions,
            ),
        ) || null
      );
    });
    if (!sub) break;
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
    if (!res.ok) {
      failed.add(sub.email);
      console.error("alert_result_send_fail", sub.email, res.error);
      continue;
    }
    sent += 1;
    await withAlertsLock(async () => {
      const store = prunePending(await readAlertsStore());
      store.confirmed = store.confirmed.map((c) =>
        c.email === sub.email ? setSubCursor(c, "euromillions", date) : c,
      );
      await writeAlertsStore(store);
    });
  }

  await withAlertsLock(async () => {
    const store = prunePending(await readAlertsStore());
    const pending = store.confirmed.some((s) =>
      subNeedsKey(s, "euromillions", date, store.lastNotified.euromillions),
    );
    if (!pending) {
      store.lastNotified.euromillions = date;
      store.lastNotifiedDrawDate = date;
      await writeAlertsStore(store);
    }
  });
  return { sent, skipped: sent ? "ok" : failed.size ? "send_failed" : "already" };
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
    const justSeeded = await withAlertsLock(async () => {
      const store = prunePending(await readAlertsStore());
      if (store.lastNotified[gameId]) return false;
      store.lastNotified[gameId] = latestKey;
      store.confirmed = store.confirmed.map((c) =>
        setSubCursor(c, gameId, latestKey),
      );
      await writeAlertsStore(store);
      return true;
    });
    if (justSeeded) {
      seeded = true;
      continue;
    }

    const snap = prunePending(await readAlertsStore());
    const jobs = companionDrawsToNotify(draws, snap.lastNotified[gameId]);
    for (const draw of jobs) {
      const key = companionDrawKey(draw);
      const failed = new Set<string>();
      for (;;) {
        const sub = await withAlertsLock(async () => {
          const store = prunePending(await readAlertsStore());
          return (
            store.confirmed.find(
              (s) =>
                !failed.has(s.email) &&
                subNeedsKey(s, gameId, key, store.lastNotified[gameId]),
            ) || null
          );
        });
        if (!sub) break;
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
        if (!res.ok) {
          failed.add(sub.email);
          console.error(
            "alert_companion_send_fail",
            gameId,
            sub.email,
            res.error,
          );
          continue;
        }
        sent += 1;
        await withAlertsLock(async () => {
          const store = prunePending(await readAlertsStore());
          store.confirmed = store.confirmed.map((c) =>
            c.email === sub.email ? setSubCursor(c, gameId, key) : c,
          );
          await writeAlertsStore(store);
        });
      }
      await withAlertsLock(async () => {
        const store = prunePending(await readAlertsStore());
        const pending = store.confirmed.some((s) =>
          subNeedsKey(s, gameId, key, store.lastNotified[gameId]),
        );
        if (!pending) {
          store.lastNotified[gameId] = key;
          await writeAlertsStore(store);
        }
      });
    }

    await withAlertsLock(async () => {
      const store = prunePending(await readAlertsStore());
      if (
        store.lastNotified[gameId] !== latestKey &&
        !isRecentDrawDate(latest.date)
      ) {
        store.lastNotified[gameId] = latestKey;
        await writeAlertsStore(store);
      }
    });
  }
  if (seeded && sent === 0) return { sent: 0, skipped: "seed" };
  return { sent, skipped: sent ? "ok" : "already" };
}
