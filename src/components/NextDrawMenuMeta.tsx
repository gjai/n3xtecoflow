"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/i18n/locales";
import type { LotteryGameId } from "@/lib/fdj-games/nav";
import { useNextDrawSnapshot } from "./NextDrawProvider";

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

export function formatCountdown(ms: number): string {
  const p = splitRemaining(ms);
  const clock = `${pad(p.hours)}:${pad(p.minutes)}:${pad(p.seconds)}`;
  return p.days > 0 ? `${p.days}j ${clock}` : clock;
}

export function NextDrawMenuMeta({
  gameId,
  compact = false,
  inverted = false,
  variant = "menu",
}: {
  gameId: LotteryGameId;
  compact?: boolean;
  inverted?: boolean;
  variant?: "menu" | "block";
}) {
  const locale = useLocale();
  const t = useTranslations("nextDraw");
  const gamesT = useTranslations("games");
  const snapshot = useNextDrawSnapshot();
  const slot = snapshot?.[gameId];
  const target = useMemo(
    () => (slot?.at ? new Date(slot.at) : null),
    [slot?.at],
  );
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!target || Number.isNaN(target.getTime())) return null;

  const pending = Boolean(slot?.pending) || target.getTime() <= now;
  const when = new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: compact ? "short" : "long",
    day: "numeric",
    month: compact ? "short" : "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(target);
  const slotLabel =
    slot?.kenoSlot === "midi"
      ? gamesT("kenoMidi")
      : slot?.kenoSlot === "soir"
        ? gamesT("kenoSoir")
        : null;
  const remain = formatCountdown(target.getTime() - now);

  const block = variant === "block";
  return (
    <span
      className={
        block
          ? "mt-1 block leading-snug"
          : "mt-0.5 block text-[11px] font-normal leading-snug"
      }
    >
      <span
        className={
          inverted
            ? "opacity-80"
            : block
              ? "text-[var(--heading)]"
              : "text-[var(--muted)]"
        }
      >
        {slotLabel ? `${when} · ${slotLabel}` : when}
      </span>
      <span
        className={`mt-0.5 block font-mono tabular-nums ${
          inverted
            ? ""
            : block
              ? "mt-2 text-xl text-[var(--heading)]"
              : "text-[var(--heading)]"
        }`}
        aria-label={t("countdownLabel")}
      >
        {pending ? t("pendingTitle") : remain}
      </span>
    </span>
  );
}
