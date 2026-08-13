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

function parseNums(raw: string, max: number, count: number): number[] {
  const parts = raw
    .split(/[\s,;./|+-]+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => Number(p))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= max);
  const uniq: number[] = [];
  for (const n of parts) {
    if (!uniq.includes(n)) uniq.push(n);
    if (uniq.length >= count) break;
  }
  return uniq.sort((a, b) => a - b);
}

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
  const [numbersRaw, setNumbersRaw] = useState("");
  const [starsRaw, setStarsRaw] = useState("");
  const [date, setDate] = useState(latestDate || dates[0] || "");
  const [mode, setMode] = useState<"check" | "archive">("check");
  const [submitted, setSubmitted] = useState(false);

  const numbers = parseNums(numbersRaw, 50, 5);
  const stars = parseNums(starsRaw, 12, 2);
  const valid = isValidEuroMillionsPick(numbers, stars);

  const draw = draws.find((d) => d.date === date);
  const check = valid && draw ? checkTicketOnDraw(numbers, stars, draw) : null;
  const archiveHits =
    valid && submitted && mode === "archive"
      ? findExactComboDraws(draws, numbers, stars)
      : [];

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("check");
            setSubmitted(false);
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
            setSubmitted(false);
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

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              {t("numbersLabel")}
            </span>
            <input
              value={numbersRaw}
              onChange={(e) => {
                setNumbersRaw(e.target.value);
                setSubmitted(false);
              }}
              placeholder={t("numbersPlaceholder")}
              inputMode="numeric"
              className="mt-2 w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-[var(--heading)] outline-none focus:border-[var(--accent)]"
            />
            <span className="mt-1 block text-xs text-[var(--muted)]">
              {t("numbersHint")}
            </span>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              {t("starsLabel")}
            </span>
            <input
              value={starsRaw}
              onChange={(e) => {
                setStarsRaw(e.target.value);
                setSubmitted(false);
              }}
              placeholder={t("starsPlaceholder")}
              inputMode="numeric"
              className="mt-2 w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-[var(--heading)] outline-none focus:border-[var(--accent)]"
            />
            <span className="mt-1 block text-xs text-[var(--muted)]">
              {t("starsHint")}
            </span>
          </label>
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
                setSubmitted(false);
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
