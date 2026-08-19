"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { FdjCompanionGameId, FdjGameDraw } from "@/lib/fdj-games/types";
import { companionDrawKey } from "@/lib/fdj-games/keys";
import { checkCompanionTicket } from "@/lib/lottery/companion-prize";
import { formatMoneyEur } from "@/lib/lottery/prize-format";
import {
  countMatches,
  groupLetter,
  groupNumbers,
  type CompanionGridSpec,
} from "@/lib/lottery/rules";

function togglePick(current: number[], value: number, maxCount: number): number[] {
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
  pickCount,
  onToggle,
  label,
}: {
  max: number;
  selected: number[];
  pickCount: number;
  onToggle: (n: number) => void;
  label: string;
}) {
  const cols = max > 40 ? "grid-cols-10" : max > 20 ? "grid-cols-10" : "grid-cols-5 sm:grid-cols-10";
  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}{" "}
        <span className="tabular-nums text-[var(--heading)]">
          {selected.length}/{pickCount}
        </span>
      </legend>
      <div className={`mt-3 grid gap-1.5 ${cols}`}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const on = selected.includes(n);
          const full = !on && selected.length >= pickCount;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onToggle(n)}
              disabled={full}
              aria-pressed={on}
              className={`inline-flex aspect-square items-center justify-center rounded-full text-xs font-semibold sm:text-sm ${
                on
                  ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                  : "border border-[var(--line)] bg-[var(--surface)] text-[var(--heading)] hover:border-[var(--accent)]"
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

export function FdjCompanionSimulator({
  draws,
  spec,
  gameId,
  gameSlug,
  initialKey,
}: {
  draws: FdjGameDraw[];
  spec: CompanionGridSpec;
  gameId: FdjCompanionGameId;
  gameSlug: string;
  initialKey?: string | null;
}) {
  const t = useTranslations("gameSim");
  const locale = useLocale();
  const keys = useMemo(() => draws.map(companionDrawKey), [draws]);
  const [main, setMain] = useState<number[]>([]);
  const [bonus, setBonus] = useState<number[]>([]);
  const [letter, setLetter] = useState("");
  const [pickCount, setPickCount] = useState(
    spec.pickDefault || spec.mainCount,
  );
  const [drawKey, setDrawKey] = useState(
    (initialKey && keys.includes(initialKey) ? initialKey : keys[0]) || "",
  );
  const [submitted, setSubmitted] = useState(false);

  const mainNeed = spec.pickMin ? pickCount : spec.mainCount;
  const validMain = main.length === mainNeed;
  const validBonus = spec.bonus ? bonus.length === spec.bonus.count : true;
  const validLetter = spec.letter ? letter.length === 1 : true;
  const valid = validMain && validBonus && validLetter;

  const draw = draws.find((d) => companionDrawKey(d) === drawKey);
  const drawnMain = draw ? groupNumbers(draw, "main") : [];
  const drawnBonus =
    draw && spec.bonus ? groupNumbers(draw, spec.bonus.labelKey) : [];
  const drawnLetter = draw ? groupLetter(draw) : null;

  const mainHits = valid && draw ? countMatches(main, drawnMain) : 0;
  const bonusHit =
    valid && spec.bonus && bonus[0] != null
      ? drawnBonus.includes(bonus[0])
      : false;
  const letterHit = spec.letter && letter ? letter === drawnLetter : false;

  const prize =
    submitted && valid && draw
      ? checkCompanionTicket(
          gameId,
          draw,
          main,
          bonusHit,
          Boolean(letterHit),
          mainNeed,
        )
      : null;

  const archiveHits = useMemo(() => {
    if (!submitted || !valid) return 0;
    return draws.filter((d) => {
      if (companionDrawKey(d) === drawKey) return false;
      const m = countMatches(main, groupNumbers(d, "main"));
      return m >= Math.min(3, mainNeed);
    }).length;
  }, [submitted, valid, draws, main, drawKey, mainNeed]);

  function reset() {
    setSubmitted(false);
  }

  function randomPick() {
    setMain(randomSample(spec.mainMax, mainNeed));
    if (spec.bonus) setBonus(randomSample(spec.bonus.max, spec.bonus.count));
    if (spec.letter && spec.letterPool) {
      const i = Math.floor(Math.random() * spec.letterPool.length);
      setLetter(spec.letterPool[i] || "");
    }
    reset();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {spec.pickMin && spec.pickMax ? (
        <label className="block text-sm text-[var(--muted)]">
          {t("kenoPick")}
          <select
            className="ml-2 border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[var(--heading)]"
            value={pickCount}
            onChange={(e) => {
              const n = Number(e.target.value);
              setPickCount(n);
              setMain((prev) => prev.slice(0, n));
              reset();
            }}
          >
            {Array.from(
              { length: spec.pickMax - spec.pickMin + 1 },
              (_, i) => spec.pickMin! + i,
            ).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <PickGrid
        max={spec.mainMax}
        selected={main}
        pickCount={mainNeed}
        label={t("mainLabel")}
        onToggle={(n) => {
          setMain((prev) => togglePick(prev, n, mainNeed));
          reset();
        }}
      />

      {spec.bonus ? (
        <PickGrid
          max={spec.bonus.max}
          selected={bonus}
          pickCount={spec.bonus.count}
          label={t(`bonus.${spec.bonus.labelKey}`)}
          onToggle={(n) => {
            setBonus((prev) => togglePick(prev, n, spec.bonus!.count));
            reset();
          }}
        />
      ) : null}

      {spec.letter && spec.letterPool ? (
        <fieldset>
          <legend className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {t("letterLabel")}
          </legend>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {spec.letterPool.split("").map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => {
                  setLetter(ch);
                  reset();
                }}
                aria-pressed={letter === ch}
                className={`inline-flex h-9 w-9 items-center justify-center text-sm font-semibold ${
                  letter === ch
                    ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                    : "border border-[var(--line)] bg-[var(--surface)] text-[var(--heading)]"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {keys.length > 0 ? (
        <label className="block text-sm text-[var(--muted)]">
          {t("dateLabel")}
          <select
            className="mt-1 block w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--heading)]"
            value={drawKey}
            onChange={(e) => {
              setDrawKey(e.target.value);
              reset();
            }}
          >
            {draws.map((d) => (
              <option key={companionDrawKey(d)} value={companionDrawKey(d)}>
                {companionDrawKey(d)}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={randomPick}
          className="min-h-10 border border-[var(--line)] px-4 text-sm font-semibold text-[var(--heading)]"
        >
          {t("randomPick")}
        </button>
        <button
          type="button"
          onClick={() => {
            setMain([]);
            setBonus([]);
            setLetter("");
            reset();
          }}
          className="min-h-10 border border-[var(--line)] px-4 text-sm font-semibold text-[var(--heading)]"
        >
          {t("clearPick")}
        </button>
        <button
          type="submit"
          disabled={!valid}
          className="min-h-10 bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)] disabled:opacity-40"
        >
          {t("submit")}
        </button>
      </div>

      {submitted && draw ? (
        <div className="border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--heading)]">
          <p>
            {t("hitsMain", { count: mainHits })}
            {spec.bonus
              ? ` · ${bonusHit ? t("bonusHit") : t("bonusMiss")}`
              : ""}
            {spec.letter
              ? ` · ${letterHit ? t("letterHit") : t("letterMiss")}`
              : ""}
          </p>
          {prize?.rank ? (
            <p className="mt-2 font-semibold">
              {t("rankWin", { rank: prize.rank })}
              {prize.amountEur != null && prize.amountEur > 0
                ? ` · ${t("gain", { amount: formatMoneyEur(prize.amountEur, locale) || "—" })}`
                : prize.annuityMonthlyEur
                  ? ` · ${t("gainAnnuity", {
                      amount:
                        formatMoneyEur(prize.annuityMonthlyEur, locale) || "—",
                      years: Math.max(
                        1,
                        Math.round((prize.annuityMonths || 12) / 12),
                      ),
                    })}`
                  : prize.hasTable
                    ? ""
                    : ""}
            </p>
          ) : (
            <p className="mt-2">{t("rankLose")}</p>
          )}
          {!prize?.hasTable ? (
            <p className="mt-1 text-[var(--muted)]">{t("noTable")}</p>
          ) : null}
          {gameId === "loto" && groupNumbers(draw, "secondDraw").length ? (
            <p className="mt-2 text-[var(--muted)]">
              {prize?.extraRank
                ? t("secondDrawWin", {
                    rank: prize.extraRank,
                    amount:
                      prize.extraAmountEur != null
                        ? formatMoneyEur(prize.extraAmountEur, locale) || "—"
                        : "—",
                  })
                : t("secondDrawLose")}
            </p>
          ) : null}
          <p className="mt-2 text-[var(--muted)]">
            {t("archiveNear", { count: archiveHits })}
          </p>
          <p className="mt-3">
            <Link
              href={`/jeux/${gameSlug}/${companionDrawKey(draw)}`}
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {t("seeDraw")} →
            </Link>
          </p>
        </div>
      ) : null}
      <p className="text-xs text-[var(--muted)]">{t("disclaimer")}</p>
    </form>
  );
}
