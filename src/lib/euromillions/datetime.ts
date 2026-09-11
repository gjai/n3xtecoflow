import { intlLocale } from "@/i18n/locales";

const PARIS = "Europe/Paris";

export function formatEuroMillionsLongDate(iso: string, locale: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function parisDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Semaine ISO (lundi–dimanche) du jour civil Paris. Ex. `2026-W37`.
 * Sert de tampon « un Short actu / semaine ».
 */
export function isoWeekKeyFromParisDate(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return isoWeekKeyFromParisDate(parisDateKey());
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const utc = new Date(Date.UTC(y, mo - 1, d));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const isoYear = utc.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

export function parisIsoWeekKey(date = new Date()): string {
  return isoWeekKeyFromParisDate(parisDateKey(date));
}

/**
 * lastmod sitemap d’une fiche `/tirages/{date}`.
 * Le soir du tirage (date = aujourd’hui Paris) doit être « maintenant »,
 * pas minuit UTC — sinon Google croit que la page n’a pas bougé depuis le matin.
 */
export function sitemapLastModifiedForDrawDate(
  date: string,
  today = parisDateKey(),
  now = new Date(),
): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return now;
  return date >= today ? now : new Date(`${date}T12:00:00Z`);
}

/** Jour civil Paris. Un `planned_at` 00:15 Paris ne doit pas basculer J−1 (UTC). */
export function toParisIsoDate(input: string): string {
  const trimmed = String(input || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return trimmed.slice(0, 10);
  return parisDateKey(d);
}

/** Convert a Paris wall-clock (date + hour) to a UTC Date. */
export function parisLocalToUtc(
  isoDate: string,
  hour = 21,
  minute = 0,
): Date {
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  for (const offset of ["+01:00", "+02:00"] as const) {
    const candidate = new Date(`${isoDate}T${hh}:${mm}:00${offset}`);
    if (Number.isNaN(candidate.getTime())) continue;
    const day = parisDateKey(candidate);
    const parisHour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: PARIS,
        hour: "2-digit",
        hourCycle: "h23",
      }).format(candidate),
    );
    const parisMin = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: PARIS,
        minute: "2-digit",
      }).format(candidate),
    );
    if (day === isoDate && parisHour === hour && parisMin === minute) {
      return candidate;
    }
  }
  return new Date(`${isoDate}T${hh}:${mm}:00+02:00`);
}

export function parisWeekday(isoDate: string): number {
  const d = new Date(`${isoDate}T12:00:00+01:00`);
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS,
    weekday: "short",
  }).format(d);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[wd] ?? d.getUTCDay();
}

export function parisHourMinute(date = new Date()): { hour: number; minute: number } {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: PARIS,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date),
  );
  const minute = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: PARIS,
      minute: "2-digit",
    }).format(date),
  );
  return { hour, minute };
}

/** Mar/ven 21h05–22h25 Paris : poll VPS, pas GitHub Actions. */
export function isEuroMillionsLiveWindow(now = new Date()): boolean {
  const wd = parisWeekday(parisDateKey(now));
  if (wd !== 2 && wd !== 5) return false;
  const { hour, minute } = parisHourMinute(now);
  const t = hour * 60 + minute;
  return t >= 21 * 60 + 5 && t < 22 * 60 + 25;
}

/** Clé Paris `YYYY-MM-DDTHH` : un Short histoire par heure civile. */
export function parisHourKey(date = new Date()): string {
  const { hour } = parisHourMinute(date);
  return `${parisDateKey(date)}T${String(hour).padStart(2, "0")}`;
}

/** Toutes les heures, minutes 00–19 Paris (cron GitHub `0 * * * *`). */
export function isNewsShortSlot(now = new Date()): boolean {
  const { minute } = parisHourMinute(now);
  return minute < 20;
}

/** Loto lun/mer/sam + EuroMillions mar/ven. */
export function isJackpotBuysDrawDay(now = new Date()): boolean {
  const wd = parisWeekday(parisDateKey(now));
  return wd === 1 || wd === 2 || wd === 3 || wd === 5 || wd === 6;
}

/** 10h Paris le jour de tirage, jusqu’à 21h si le cron du matin a loupé. */
export function isJackpotBuysSlot(now = new Date()): boolean {
  if (!isJackpotBuysDrawDay(now)) return false;
  const { hour } = parisHourMinute(now);
  return hour >= 10 && hour < 21;
}

/**
 * Heure Paris où un autre Reel est déjà prévu :
 * Ticket gagnant (10h Loto/EM) ou résultats vidéo (21h, + 22h EuroMillions).
 */
export function newsShortBlockedByOtherReel(now = new Date()): boolean {
  const { hour } = parisHourMinute(now);
  const wd = parisWeekday(parisDateKey(now));
  if (hour === 10 && isJackpotBuysDrawDay(now)) return true;
  if (hour === 21 && wd >= 1 && wd <= 6) return true;
  if (hour === 22 && (wd === 2 || wd === 5)) return true;
  return false;
}

export function formatParisTime(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: PARIS,
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatParisDateTime(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: PARIS,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Typical EuroMillions draw ~21:00 Europe/Paris. */
export const EM_DRAW_HOUR = 21;
export const EM_DRAW_MINUTE = 0;
/** FDJ sales close ~20:15 Europe/Paris on draw days. */
export const EM_SALES_CUTOFF_HOUR = 20;
export const EM_SALES_CUTOFF_MINUTE = 15;
/** Lots payable 60 days from the draw date (FDJ). */
export const FORCLUSION_DAYS = 60;

export function isEuroMillionsDrawWeekday(isoDate: string): boolean {
  const wd = parisWeekday(isoDate);
  return wd === 2 || wd === 5;
}

export function euroMillionsResultPending(options: {
  latestDate: string | null | undefined;
  nextDrawDate: string | null | undefined;
  now?: Date;
}): boolean {
  const now = options.now || new Date();
  const today = parisDateKey(now);
  const hasToday = options.latestDate === today;
  if (hasToday) return false;

  const next = options.nextDrawDate;
  if (next === today) return true;

  if (isEuroMillionsDrawWeekday(today)) {
    return true;
  }
  return false;
}

export function isEuroMillionsForclos(
  isoDate: string,
  now = new Date(),
): boolean {
  const start = parisLocalToUtc(isoDate, 0, 0);
  const limitMs = start.getTime() + FORCLUSION_DAYS * 86_400_000;
  return now.getTime() > limitMs;
}

export function euroMillionsSalesOpen(
  nextDrawDate: string | null | undefined,
  now = new Date(),
): boolean {
  if (!nextDrawDate) return true;
  const today = parisDateKey(now);
  if (nextDrawDate !== today) return true;
  const cutoff = parisLocalToUtc(
    nextDrawDate,
    EM_SALES_CUTOFF_HOUR,
    EM_SALES_CUTOFF_MINUTE,
  );
  return now.getTime() < cutoff.getTime();
}
