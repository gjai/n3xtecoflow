"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { intlLocale } from "@/i18n/locales";
import {
  EM_DRAW_HOUR,
  EM_DRAW_MINUTE,
  parisLocalToUtc,
} from "@/lib/euromillions/datetime";

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function splitRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds, done: total <= 0 };
}

export function NextJackpotBanner({
  nextDrawDate,
  nextJackpot,
  pending,
  locale,
  showPageLink = true,
}: {
  nextDrawDate: string | null;
  nextJackpot: string | null;
  pending: boolean;
  locale: string;
  showPageLink?: boolean;
}) {
  const t = useTranslations("nextDraw");
  const target = useMemo(() => {
    if (!nextDrawDate) return null;
    return parisLocalToUtc(nextDrawDate, EM_DRAW_HOUR, EM_DRAW_MINUTE);
  }, [nextDrawDate]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!nextDrawDate && !nextJackpot) return null;

  const parts = target ? splitRemaining(target.getTime() - now) : null;
  const dateLabel = target
    ? new Intl.DateTimeFormat(intlLocale(locale), {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      }).format(target)
    : nextDrawDate;

  return (
    <section className="border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            {pending ? t("pendingEyebrow") : t("eyebrow")}
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)] md:text-xl">
            {pending ? t("pendingTitle") : t("title")}
            {nextJackpot ? (
              <span className="text-[var(--accent)]"> · {nextJackpot}</span>
            ) : null}
          </p>
          {dateLabel ? (
            <p className="mt-1 text-sm text-[var(--muted)]">{dateLabel}</p>
          ) : null}
          {pending ? (
            <p className="mt-2 text-sm text-[var(--muted)]">{t("pendingHelp")}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {parts && !parts.done && !pending ? (
            <p
              className="font-mono text-sm tabular-nums text-[var(--heading)]"
              aria-label={t("countdownLabel")}
            >
              {parts.days > 0 ? `${parts.days}j ` : ""}
              {pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
            </p>
          ) : null}
          {showPageLink ? (
            <Link
              href="/prochain-tirage"
              className="inline-flex min-h-10 items-center border border-[var(--accent)] px-4 text-sm font-semibold text-[var(--heading)]"
            >
              {t("pageCta")} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
