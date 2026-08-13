"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EuroMillionsDraw } from "@/lib/euromillions/types";
import {
  checkTicketOnDraw,
  findExactComboDraws,
  isValidEuroMillionsPick,
} from "@/lib/euromillions/prize";

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount < 10 ? 2 : 0,
  }).format(amount);
}

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function togglePick(
  current: number[],
  value: number,
  maxCount: number,
): number[] {
  if (current.includes(value)) {
    return current.filter((n) => n !== value).sort((a, b) => a - b);
  }
  if (current.length >= maxCount) return current;
  return [...current, value].sort((a, b) => a - b);
}

function randomSample(max: number, count: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

function PickGrid({
  max,
  selected,
  onToggle,
  variant,
  label,
  countLabel,
}: {
  max: number;
  selected: number[];
  onToggle: (n: number) => void;
  variant: "ball" | "star";
  label: string;
  countLabel: string;
}) {
  return (
    <fieldset className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <legend className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {label}
        </legend>
        <span
          className={`text-sm font-semibold tabular-nums ${
            selected.length === (variant === "ball" ? 5 : 2)
              ? "text-[var(--accent)]"
              : "text-[var(--muted)]"
          }`}
        >
          {countLabel}
        </span>
      </div>
      <div
        className={`mt-3 grid gap-1.5 ${
          variant === "ball"
            ? "grid-cols-10 sm:grid-cols-10"
            : "grid-cols-6 sm:grid-cols-6 max-w-sm"
        }`}
        role="group"
        aria-label={label}
      >
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const on = selected.includes(n);
          const full =
            !on && selected.length >= (variant === "ball" ? 5 : 2);
          return (
            <button
              key={`${variant}-${n}`}
              type="button"
              onClick={() => onToggle(n)}
              disabled={full}
              aria-pressed={on}
              className={`inline-flex aspect-square items-center justify-center rounded-full text-xs font-semibold transition sm:text-sm ${
                on
                  ? variant === "ball"
                    ? "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_0_0_1px_var(--accent)]"
                    : "border-2 border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]"
                  : variant === "ball"
                    ? "border border-[var(--line)] bg-[var(--surface)] text-[var(--heading)] hover:border-[var(--accent)]"
                    : "border border-[var(--accent)]/40 bg-[var(--surface)] text-[var(--heading)] hover:border-[var(--accent)]"
              } ${full ? "cursor-not-allowed opacity-35" : ""}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function EuroMillionsSimulator({
  draws,
  locale,
  latestDate,
}: {
  draws: EuroMillionsDraw[];
  locale: string;
  latestDate: string | null;
}) {
  const t = useTranslations("simulator");
  const dates = useMemo(
    () => draws.map((d) => d.date).filter(Boolean),
    [draws],
  );
  const [numbers, setNumbers] = useState<number[]>([]);
  const [stars, setStars] = useState<number[]>([]);
  const [date, setDate] = useState(latestDate || dates[0] || "");
  const [mode, setMode] = useState<"check" | "archive">("check");
  const [submitted, setSubmitted] = useState(false);

  const valid = isValidEuroMillionsPick(numbers, stars);
  const draw = draws.find((d) => d.date === date);
  const check = valid && draw ? checkTicketOnDraw(numbers, stars, draw) : null;
  const archiveHits =
    valid && submitted && mode === "archive"
      ? findExactComboDraws(draws, numbers, stars)
      : [];

  function resetResult() {
    setSubmitted(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function clearPick() {
    setNumbers([]);
    setStars([]);
    resetResult();
  }

  function randomPick() {
    setNumbers(randomSample(50, 5));
    setStars(randomSample(12, 2));
    resetResult();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("check");
            resetResult();
          }}
          className={`min-h-10 px-4 text-sm font-semibold ${
            mode === "check"
              ? "bg-[var(--accent)] text-[var(--accent-ink)]"
              : "border border-[var(--line)] text-[var(--heading)]"
          }`}
        >
          {t("modeCheck")}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("archive");
            resetResult();
          }}
          className={`min-h-10 px-4 text-sm font-semibold ${
            mode === "archive"
              ? "bg-[var(--accent)] text-[var(--accent-ink)]"
              : "border border-[var(--line)] text-[var(--heading)]"
          }`}
        >
          {t("modeArchive")}
        </button>
      </div>

      <p className="max-w-2xl text-sm text-[var(--muted)]">
        {mode === "check" ? t("checkHelp") : t("archiveHelp")}
      </p>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-8 border border-[var(--line)] bg-[var(--surface)] p-5 md:p-7">
          <PickGrid
            max={50}
            selected={numbers}
            variant="ball"
            label={t("numbersLabel")}
            countLabel={t("numbersCount", { count: numbers.length })}
            onToggle={(n) => {
              setNumbers((prev) => togglePick(prev, n, 5));
              resetResult();
            }}
          />

          <PickGrid
            max={12}
            selected={stars}
            variant="star"
            label={t("starsLabel")}
            countLabel={t("starsCount", { count: stars.length })}
            onToggle={(n) => {
              setStars((prev) => togglePick(prev, n, 2));
              resetResult();
            }}
          />

          <div className="flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-5">
            <div className="flex flex-wrap gap-2">
              {numbers.map((n) => (
                <span
                  key={`sel-n-${n}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)]"
                >
                  {n}
                </span>
              ))}
              {stars.map((n) => (
                <span
                  key={`sel-s-${n}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--bg)] text-sm font-semibold text-[var(--heading)]"
                >
                  {n}
                </span>
              ))}
              {numbers.length === 0 && stars.length === 0 ? (
                <span className="text-sm text-[var(--muted)]">
                  {t("pickEmpty")}
                </span>
              ) : null}
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={randomPick}
                className="min-h-10 border border-[var(--line)] px-4 text-sm font-semibold text-[var(--heading)]"
              >
                {t("randomPick")}
              </button>
              <button
                type="button"
                onClick={clearPick}
                disabled={numbers.length === 0 && stars.length === 0}
                className="min-h-10 border border-[var(--line)] px-4 text-sm font-semibold text-[var(--heading)] disabled:opacity-40"
              >
                {t("clearPick")}
              </button>
            </div>
          </div>
        </div>

        {mode === "check" ? (
          <label className="block max-w-md">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              {t("dateLabel")}
            </span>
            <select
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                resetResult();
              }}
              className="mt-2 w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-[var(--heading)] outline-none focus:border-[var(--accent)]"
            >
              {dates.map((d) => (
                <option key={d} value={d}>
                  {formatDate(d, locale)}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <button
          type="submit"
          disabled={!valid || (mode === "check" && !draw)}
          className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)] disabled:opacity-40"
        >
          {mode === "check" ? t("submitCheck") : t("submitArchive")}
        </button>
      </form>

      {submitted && !valid ? (
        <p className="text-sm text-[var(--muted)]">{t("invalid")}</p>
      ) : null}

      {submitted && mode === "check" && check ? (
        <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            {t("resultTitle")}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {formatDate(check.date, locale)}
          </p>
          <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {check.rank
              ? t("rankWin", { rank: check.rank })
              : t("rankLose")}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t("matches", {
              balls: check.matchedBalls,
              stars: check.matchedStars,
            })}
          </p>
          {check.rank ? (
            <div className="mt-4 space-y-1 text-sm">
              {formatMoney(check.amountEur, locale) ? (
                <p className="text-[var(--heading)]">
                  {t("gainLabel")} ·{" "}
                  <span className="font-semibold">
                    {formatMoney(check.amountEur, locale)}
                  </span>
                </p>
              ) : (
                <p className="text-[var(--muted)]">{t("gainUnknown")}</p>
              )}
              {check.winners != null ? (
                <p className="text-[var(--muted)]">
                  {t("winnersLabel", { count: check.winners })}
                </p>
              ) : null}
            </div>
          ) : null}
          <p className="mt-5">
            <Link
              href={`/tirages/${check.date}`}
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {t("seeDraw")} →
            </Link>
          </p>
        </div>
      ) : null}

      {submitted && mode === "archive" && valid ? (
        <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            {t("archiveResultTitle")}
          </p>
          {archiveHits.length === 0 ? (
            <p className="mt-3 text-[var(--heading)]">{t("archiveNever")}</p>
          ) : (
            <>
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
                {t("archiveFound", { count: archiveHits.length })}
              </p>
              <ul className="mt-4 space-y-3">
                {archiveHits.map((d) => {
                  const jackpot = formatMoney(d.jackpotEur, locale);
                  const tier52 = d.prizeTiers?.find((x) => x.rank === "5+2");
                  const gain =
                    formatMoney(tier52?.amountEur, locale) || jackpot;
                  return (
                    <li
                      key={d.date}
                      className="border border-[var(--line)] px-4 py-3"
                    >
                      <p className="font-semibold text-[var(--heading)]">
                        {formatDate(d.date, locale)}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {t("archiveExactWin")}
                        {gain ? ` · ${gain}` : ""}
                      </p>
                      <Link
                        href={`/tirages/${d.date}`}
                        className="mt-2 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
                      >
                        {t("seeDraw")} →
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <p className="mt-4 text-xs text-[var(--muted)]">
            {t("archiveScope", { count: draws.length })}
          </p>
        </div>
      ) : null}

      <p className="text-xs text-[var(--muted)]">{t("disclaimer")}</p>
    </div>
  );
}
