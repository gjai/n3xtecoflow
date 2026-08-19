"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CompanionGridSpec } from "@/lib/lottery/rules";

function randomSample(max: number, count: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

export const EUROMILLIONS_GENERATOR_SPEC: CompanionGridSpec & {
  stars?: { count: number; max: number };
} = {
  mainCount: 5,
  mainMax: 50,
  stars: { count: 2, max: 12 },
};

type GeneratorSpec = CompanionGridSpec & {
  stars?: { count: number; max: number };
};

type Grid = {
  numbers: number[];
  bonus?: number[];
  stars?: number[];
  letter?: string;
};

function makeGrid(spec: GeneratorSpec, pickCount: number): Grid {
  const mainCount = spec.pickMin != null ? pickCount : spec.mainCount;
  const numbers = randomSample(spec.mainMax, mainCount);
  const bonus = spec.bonus
    ? randomSample(spec.bonus.max, spec.bonus.count)
    : undefined;
  const stars = spec.stars
    ? randomSample(spec.stars.max, spec.stars.count)
    : undefined;
  const letter =
    spec.letter && spec.letterPool
      ? spec.letterPool[Math.floor(Math.random() * spec.letterPool.length)]
      : undefined;
  return { numbers, bonus, stars, letter };
}

function Ball({
  n,
  outlined,
}: {
  n: number | string;
  outlined?: boolean;
}) {
  return (
    <span
      className={
        outlined
          ? "lottery-ball lottery-ball--sm lottery-ball--bonus"
          : "lottery-ball lottery-ball--sm lottery-ball--main"
      }
    >
      {n}
    </span>
  );
}

export function FlashGridGenerator({
  spec = EUROMILLIONS_GENERATOR_SPEC,
  help,
}: {
  spec?: GeneratorSpec;
  help?: string;
}) {
  const t = useTranslations("generator");
  const gamesT = useTranslations("games");
  const [count, setCount] = useState(5);
  const [pickCount, setPickCount] = useState(
    spec.pickDefault ?? spec.pickMin ?? spec.mainCount,
  );
  const [grids, setGrids] = useState<Grid[]>([]);

  function generate() {
    const n = Math.min(10, Math.max(1, count));
    const pick = Math.min(
      spec.pickMax ?? pickCount,
      Math.max(spec.pickMin ?? pickCount, pickCount),
    );
    setGrids(Array.from({ length: n }, () => makeGrid(spec, pick)));
  }

  function reroll(index: number) {
    setGrids((prev) =>
      prev.map((g, i) => (i === index ? makeGrid(spec, pickCount) : g)),
    );
  }

  return (
    <div className="border border-[var(--line)] bg-[var(--surface)] p-5 md:p-7">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        {t("eyebrow")}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{help || t("help")}</p>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        {spec.pickMin != null && spec.pickMax != null ? (
          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              {gamesT("genPickLabel")}
            </span>
            <select
              value={pickCount}
              onChange={(e) => setPickCount(Number(e.target.value))}
              className="mt-2 block border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-[var(--heading)] outline-none focus:border-[var(--accent)]"
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
        <label>
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {t("countLabel")}
          </span>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-2 block border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-[var(--heading)] outline-none focus:border-[var(--accent)]"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={generate}
          className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
        >
          {t("submit")}
        </button>
      </div>

      {grids.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {grids.map((g, i) => (
            <li
              key={`${g.numbers.join("-")}-${g.stars?.join("-") || ""}-${g.bonus?.join("-") || ""}-${g.letter || ""}-${i}`}
              className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] px-4 py-3"
            >
              <div className="lottery-balls lottery-balls--compact mt-0">
                {g.numbers.map((n) => (
                  <Ball key={`n-${i}-${n}`} n={n} />
                ))}
                {g.stars?.map((n) => (
                  <Ball key={`s-${i}-${n}`} n={n} outlined />
                ))}
                {g.bonus?.map((n) => (
                  <Ball key={`b-${i}-${n}`} n={n} outlined />
                ))}
                {g.letter ? (
                  <span className="lottery-ball lottery-ball--sm lottery-ball--letter">
                    {g.letter}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => reroll(i)}
                className="min-h-10 border border-[var(--line)] px-3 text-xs font-semibold uppercase tracking-wide text-[var(--heading)]"
              >
                {t("reroll")}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-4 text-xs text-[var(--muted)]">{t("disclaimer")}</p>
    </div>
  );
}
