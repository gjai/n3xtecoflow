"use client";

import { intlLocale } from "@/i18n/locales";
import { useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EuroMillionsDraw } from "@/lib/euromillions/types";
import {
  checkTicketOnDraw,
  findExactComboDraws,
  findWinningChecks,
  isValidEuroMillionsPick,
  type TicketCheckResult,
} from "@/lib/euromillions/prize";
import { isEuroMillionsForclos } from "@/lib/euromillions/datetime";

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount < 10 ? 2 : 0,
  }).format(amount);
}

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
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

function DrawnBall({
  n,
  hit,
  variant,
}: {
  n: number;
  hit: boolean;
  variant: "ball" | "star";
}) {
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
        hit
          ? variant === "ball"
            ? "bg-[var(--accent)] text-[var(--accent-ink)]"
            : "border-2 border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]"
          : variant === "ball"
            ? "border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]"
            : "border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]"
      }`}
    >
      {n}
    </span>
  );
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

const MAX_GRIDS = 5;

type GridPick = { id: number; numbers: number[]; stars: number[] };

function emptyGrid(id: number): GridPick {
  return { id, numbers: [], stars: [] };
}

export function EuroMillionsSimulator({
  draws,
  locale,
  latestDate,
  initialDate,
}: {
  draws: EuroMillionsDraw[];
  locale: string;
  latestDate: string | null;
  initialDate?: string | null;
}) {
  const t = useTranslations("simulator");
  const dates = useMemo(
    () => draws.map((d) => d.date).filter(Boolean),
    [draws],
  );
  const [grids, setGrids] = useState<GridPick[]>([emptyGrid(1)]);
  const [nextId, setNextId] = useState(2);
  const [etoilePlus, setEtoilePlus] = useState(false);
  const [date, setDate] = useState(
    (initialDate && dates.includes(initialDate)
      ? initialDate
      : latestDate || dates[0]) || "",
  );
  const [submitted, setSubmitted] = useState(false);

  const draw = draws.find((d) => d.date === date);
  const forclos = date ? isEuroMillionsForclos(date) : false;
  const validGrids = grids.filter((g) =>
    isValidEuroMillionsPick(g.numbers, g.stars),
  );
  const allValid = grids.length > 0 && validGrids.length === grids.length;

  const checks = useMemo(() => {
    if (!submitted || !draw || !allValid) return [];
    return grids.map((g) => ({
      grid: g,
      check: checkTicketOnDraw(g.numbers, g.stars, draw, { etoilePlus }),
    }));
  }, [submitted, draw, allValid, grids, etoilePlus]);

  function resetResult() {
    setSubmitted(false);
  }

  function patchGrid(id: number, patch: Partial<GridPick>) {
    setGrids((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    );
    resetResult();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-[var(--muted)]">{t("checkHelp")}</p>
      <p className="max-w-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
        {t("forclusionBanner")}
      </p>
      {forclos ? (
        <p className="max-w-2xl border border-[var(--accent)] px-4 py-3 text-sm text-[var(--heading)]">
          {t("forclusionAlert")}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-8">
        {grids.map((grid, index) => (
          <div
            key={grid.id}
            className="space-y-8 border border-[var(--line)] bg-[var(--surface)] p-5 md:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                {t("gridLabel", { n: index + 1 })}
              </p>
              {grids.length > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setGrids((prev) => prev.filter((g) => g.id !== grid.id));
                    resetResult();
                  }}
                  className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--heading)]"
                >
                  {t("removeGrid")}
                </button>
              ) : null}
            </div>
            <PickGrid
              max={50}
              selected={grid.numbers}
              variant="ball"
              label={t("numbersLabel")}
              countLabel={t("numbersCount", { count: grid.numbers.length })}
              onToggle={(n) =>
                patchGrid(grid.id, {
                  numbers: togglePick(grid.numbers, n, 5),
                })
              }
            />
            <PickGrid
              max={12}
              selected={grid.stars}
              variant="star"
              label={t("starsLabel")}
              countLabel={t("starsCount", { count: grid.stars.length })}
              onToggle={(n) =>
                patchGrid(grid.id, {
                  stars: togglePick(grid.stars, n, 2),
                })
              }
            />
            <div className="flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-5">
              <div className="flex flex-wrap gap-2">
                {grid.numbers.map((n) => (
                  <span
                    key={`sel-n-${grid.id}-${n}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)]"
                  >
                    {n}
                  </span>
                ))}
                {grid.stars.map((n) => (
                  <span
                    key={`sel-s-${grid.id}-${n}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--bg)] text-sm font-semibold text-[var(--heading)]"
                  >
                    {n}
                  </span>
                ))}
                {grid.numbers.length === 0 && grid.stars.length === 0 ? (
                  <span className="text-sm text-[var(--muted)]">
                    {t("pickEmpty")}
                  </span>
                ) : null}
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    patchGrid(grid.id, {
                      numbers: randomSample(50, 5),
                      stars: randomSample(12, 2),
                    })
                  }
                  className="min-h-10 border border-[var(--line)] px-4 text-sm font-semibold text-[var(--heading)]"
                >
                  {t("randomPick")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    patchGrid(grid.id, { numbers: [], stars: [] })
                  }
                  disabled={
                    grid.numbers.length === 0 && grid.stars.length === 0
                  }
                  className="min-h-10 border border-[var(--line)] px-4 text-sm font-semibold text-[var(--heading)] disabled:opacity-40"
                >
                  {t("clearPick")}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (grids.length >= MAX_GRIDS) return;
              setGrids((prev) => [...prev, emptyGrid(nextId)]);
              setNextId((n) => n + 1);
              resetResult();
            }}
            disabled={grids.length >= MAX_GRIDS}
            className="min-h-10 border border-[var(--line)] px-4 text-sm font-semibold text-[var(--heading)] disabled:opacity-40"
          >
            {t("addGrid")}
          </button>
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm text-[var(--heading)]">
            <input
              type="checkbox"
              checked={etoilePlus}
              onChange={(e) => {
                setEtoilePlus(e.target.checked);
                resetResult();
              }}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            {t("etoilePlusLabel")}
          </label>
        </div>
        <p className="text-xs text-[var(--muted)]">{t("etoilePlusHelp")}</p>

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

        <button
          type="submit"
          disabled={!allValid || !draw}
          className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)] disabled:opacity-40"
        >
          {t("submitCheck")}
        </button>
      </form>

      {submitted && !allValid ? (
        <p className="text-sm text-[var(--muted)]">{t("invalid")}</p>
      ) : null}

      {submitted && checks.length > 0
        ? checks.map(({ grid, check }, index) => (
            <GridResult
              key={grid.id}
              check={check}
              locale={locale}
              numbers={grid.numbers}
              stars={grid.stars}
              etoilePlus={etoilePlus}
              title={
                grids.length > 1
                  ? t("gridResult", { n: index + 1 })
                  : t("resultTitle")
              }
              draws={draws}
              submitted={submitted}
            />
          ))
        : null}

      <p className="text-xs text-[var(--muted)]">{t("disclaimer")}</p>
    </div>
  );
}

function GridResult({
  check,
  locale,
  numbers,
  stars,
  etoilePlus,
  title,
  draws,
  submitted,
}: {
  check: TicketCheckResult;
  locale: string;
  numbers: number[];
  stars: number[];
  etoilePlus: boolean;
  title: string;
  draws: EuroMillionsDraw[];
  submitted: boolean;
}) {
  const t = useTranslations("simulator");
  const pickBallSet = useMemo(() => new Set(numbers), [numbers]);
  const pickStarSet = useMemo(() => new Set(stars), [stars]);
  const archiveAllWins = useMemo(() => {
    if (!submitted) return [];
    return findWinningChecks(draws, numbers, stars, {
      excludeDate: check.date,
      etoilePlus,
    });
  }, [submitted, draws, numbers, stars, check.date, etoilePlus]);
  const archiveWins = archiveAllWins.slice(0, 5);
  const archiveWinTotal = archiveAllWins.length;
  const exactHits = useMemo(
    () =>
      findExactComboDraws(draws, numbers, stars).filter(
        (d) => d.date !== check.date,
      ),
    [draws, numbers, stars, check.date],
  );
  const etoileMoney = formatMoney(check.etoilePlusAmountEur, locale);
  const regularMoney = formatMoney(check.amountEur, locale);
  const total =
    (check.amountEur || 0) + (etoilePlus ? check.etoilePlusAmountEur || 0 : 0);
  const totalMoney = formatMoney(total > 0 ? total : null, locale);

  return (
    <div className="space-y-4">
      <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          {title}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {formatDate(check.date, locale)}
        </p>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {t("drawnLabel")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {check.draw.numbers.map((n) => (
              <DrawnBall
                key={`d-n-${n}`}
                n={n}
                hit={pickBallSet.has(n)}
                variant="ball"
              />
            ))}
            <span className="mx-1 text-[var(--muted)]">+</span>
            {check.draw.stars.map((n) => (
              <DrawnBall
                key={`d-s-${n}`}
                n={n}
                hit={pickStarSet.has(n)}
                variant="star"
              />
            ))}
          </div>
        </div>

        <p className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {check.rank ? t("rankWin", { rank: check.rank }) : t("rankLose")}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("matches", {
            balls: check.matchedBalls,
            stars: check.matchedStars,
          })}
        </p>
        {check.rank ? (
          <div className="mt-4 space-y-1 text-sm">
            {regularMoney ? (
              <p className="text-[var(--heading)]">
                {t("gainLabel")} ·{" "}
                <span className="font-semibold">{regularMoney}</span>
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
        {etoilePlus ? (
          <div className="mt-4 border-t border-[var(--line)] pt-4 text-sm">
            <p className="font-semibold text-[var(--heading)]">
              {check.etoilePlusRank
                ? t("etoilePlusWin", { rank: check.etoilePlusRank })
                : t("etoilePlusLose")}
            </p>
            {etoileMoney ? (
              <p className="mt-1 text-[var(--muted)]">
                {t("etoilePlusGain")} · {etoileMoney}
              </p>
            ) : null}
            {totalMoney && (check.rank || check.etoilePlusRank) ? (
              <p className="mt-2 text-[var(--heading)]">
                {t("gainTotal")} ·{" "}
                <span className="font-semibold">{totalMoney}</span>
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

      <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          {t("archiveAltTitle")}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("archiveAltHelp")}</p>

        {exactHits.length > 0 ? (
          <p className="mt-4 text-sm font-semibold text-[var(--heading)]">
            {t("archiveExactAlt", { count: exactHits.length })}
          </p>
        ) : null}

        {archiveWins.length === 0 ? (
          <p className="mt-4 text-[var(--heading)]">{t("archiveAltNone")}</p>
        ) : (
          <>
            <p className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
              {t("archiveAltBest")}
            </p>
            <ul className="mt-3 space-y-3">
              {archiveWins.map((hit, idx) => {
                const money = formatMoney(
                  (hit.amountEur || 0) +
                    (etoilePlus ? hit.etoilePlusAmountEur || 0 : 0) || null,
                  locale,
                );
                return (
                  <li
                    key={hit.date}
                    className="border border-[var(--line)] px-4 py-3"
                  >
                    {idx === 0 ? (
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                        {t("archiveAltTop")}
                      </p>
                    ) : null}
                    <p
                      className={`font-semibold text-[var(--heading)] ${idx === 0 ? "mt-1" : ""}`}
                    >
                      {formatDate(hit.date, locale)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {t("rankWin", {
                        rank: hit.rank || hit.etoilePlusRank || "—",
                      })}
                      {" · "}
                      {t("matches", {
                        balls: hit.matchedBalls,
                        stars: hit.matchedStars,
                      })}
                      {money ? ` · ${money}` : ""}
                    </p>
                    <Link
                      href={`/tirages/${hit.date}`}
                      className="mt-2 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
                    >
                      {t("seeDraw")} →
                    </Link>
                  </li>
                );
              })}
            </ul>
            {archiveWinTotal > archiveWins.length ? (
              <p className="mt-3 text-xs text-[var(--muted)]">
                {t("archiveAltMore", {
                  shown: archiveWins.length,
                  total: archiveWinTotal,
                })}
              </p>
            ) : null}
          </>
        )}

        <p className="mt-4 text-xs text-[var(--muted)]">
          {t("archiveScope", { count: Math.max(0, draws.length - 1) })}
        </p>
      </div>
    </div>
  );
}
