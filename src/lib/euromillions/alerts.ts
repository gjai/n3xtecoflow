import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { confirmAlertHtml, resultAlertHtml } from "@/lib/mail/em-layout";
import { mailConfigured, sendResendEmail } from "@/lib/mail/resend";
import { formatEuroMillionsLongDate } from "./datetime";
import { isEuroMillionsDrawPublished } from "./store";
import type { EuroMillionsDraw } from "./types";

export type AlertPending = {
  email: string;
  token: string;
  locale: string;
  createdAt: string;
};

export type AlertConfirmed = {
  email: string;
  unsubToken: string;
  locale: string;
  confirmedAt: string;
};

export type AlertsStore = {
  updatedAt: string;
  /** Dernier tirage pour lequel un mail a déjà été envoyé (ou amorcé). */
  lastNotifiedDrawDate: string | null;
  pending: AlertPending[];
  confirmed: AlertConfirmed[];
};

const SEED: AlertsStore = {
  updatedAt: new Date().toISOString(),
  lastNotifiedDrawDate: null,
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

export async function readAlertsStore(): Promise<AlertsStore> {
  try {
    const raw = await fs.readFile(dataPath(), "utf8");
    const parsed = JSON.parse(raw) as AlertsStore;
    if (!Array.isArray(parsed?.pending) || !Array.isArray(parsed?.confirmed)) {
      return { ...SEED };
    }
    return parsed;
  } catch {
    return { ...SEED };
  }
}

async function writeAlertsStore(store: AlertsStore): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const next: AlertsStore = {
    ...store,
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

export async function requestAlertSubscribe(args: {
  email: string;
  locale: string;
  ageConfirmed: boolean;
}): Promise<
  | { ok: true; already: boolean }
  | { ok: false; error: "invalid" | "age" | "mail_unconfigured" | "send_failed" }
> {
  if (!args.ageConfirmed) return { ok: false, error: "age" };
  const email = normalizeAlertEmail(args.email);
  if (!isAlertEmail(email)) return { ok: false, error: "invalid" };
  if (!mailConfigured()) return { ok: false, error: "mail_unconfigured" };

  const locale = args.locale === "en" ? "en" : "fr";
  let store = prunePending(await readAlertsStore());
  if (store.confirmed.some((c) => c.email === email)) {
    return { ok: true, already: true };
  }
  store.pending = store.pending.filter((p) => p.email !== email);
  const pending: AlertPending = {
    email,
    token: token(),
    locale,
    createdAt: new Date().toISOString(),
  };
  store.pending.push(pending);
  await writeAlertsStore(store);

  const confirmUrl = `${origin()}/api/euromillions/alerts/confirm?token=${pending.token}`;
  const mail = confirmAlertHtml({ confirmUrl, locale });
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
  store.confirmed = store.confirmed.filter((c) => c.email !== pending.email);
  store.confirmed.push({
    email: pending.email,
    unsubToken: token(),
    locale: pending.locale,
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
  return resultAlertHtml({
    locale: args.locale,
    dateLabel,
    numbers: args.draw.numbers,
    stars: args.draw.stars,
    url: `${origin()}/${args.locale === "en" ? "en" : "fr"}/tirages?date=${args.draw.date}#simulateur`,
    unsubUrl: `${origin()}/api/euromillions/alerts/unsubscribe?token=${args.unsubToken}`,
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
  if (!store.lastNotifiedDrawDate) {
    store.lastNotifiedDrawDate = latest.date;
    await writeAlertsStore(store);
    return { sent: 0, skipped: "seed" };
  }
  if (store.lastNotifiedDrawDate === latest.date) {
    return { sent: 0, skipped: "already" };
  }
  let sent = 0;
  for (const sub of store.confirmed) {
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
  store.lastNotifiedDrawDate = latest.date;
  await writeAlertsStore(store);
  return { sent, skipped: "ok" };
}
