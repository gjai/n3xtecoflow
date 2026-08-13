"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function randomSample(max: number, count: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

type Grid = { numbers: number[]; stars: number[] };

function makeGrid(): Grid {
  return { numbers: randomSample(50, 5), stars: randomSample(12, 2) };
}

export function FlashGridGenerator() {
  const t = useTranslations("generator");
  const [count, setCount] = useState(5);
  const [grids, setGrids] = useState<Grid[]>([]);

  function generate() {
    const n = Math.min(10, Math.max(1, count));
    setGrids(Array.from({ length: n }, () => makeGrid()));
  }

  function reroll(index: number) {
    setGrids((prev) => prev.map((g, i) => (i === index ? makeGrid() : g)));
  }

  return (
    <div className="border border-[var(--line)] bg-[var(--surface)] p-5 md:p-7">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
        {t("eyebrow")}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{t("help")}</p>

      <div className="mt-5 flex flex-wrap items-end gap-3">
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
              key={`${g.numbers.join("-")}-${g.stars.join("-")}-${i}`}
              className="flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                {g.numbers.map((n) => (
                  <span
                    key={`n-${i}-${n}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)]"
                  >
                    {n}
                  </span>
                ))}
                <span className="mx-1 text-[var(--muted)]">+</span>
                {g.stars.map((n) => (
                  <span
                    key={`s-${i}-${n}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)] text-sm font-semibold text-[var(--heading)]"
                  >
                    {n}
                  </span>
                ))}
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
