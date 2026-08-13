import type { NumberStat } from "@/lib/euromillions/stats";

function pct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(2, Math.round((value / max) * 100));
}

export function StatBoard({
  items,
  mode,
  caption,
}: {
  items: NumberStat[];
  mode: "count" | "delay";
  caption: string;
}) {
  const max = Math.max(
    1,
    ...items.map((s) => (mode === "count" ? s.count : s.delay)),
  );
  const cols =
    items.length <= 12
      ? "grid-cols-6 sm:grid-cols-12"
      : "grid-cols-5 sm:grid-cols-10";
  return (
    <figure>
      <div className={`grid gap-2 ${cols}`}>
        {items.map((s) => {
          const value = mode === "count" ? s.count : s.delay;
          const h = pct(value, max);
          return (
            <div key={s.n} className="flex flex-col items-center gap-1">
              <div
                className="flex h-16 w-full items-end border border-[var(--line)] bg-[var(--surface)]"
                title={`${s.n} · ${value}`}
              >
                <div
                  className="w-full bg-[var(--accent)]"
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold tabular-nums text-[var(--heading)]">
                {s.n}
              </span>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-3 text-xs text-[var(--muted)]">{caption}</figcaption>
    </figure>
  );
}

export function JackpotBars({
  rows,
  formatMoney,
  wonLabel,
  rolloverLabel,
}: {
  rows: { date: string; jackpotEur: number; hasWinner: boolean | null }[];
  formatMoney: (n: number) => string;
  wonLabel: string;
  rolloverLabel: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.jackpotEur));
  const chronological = [...rows].reverse();
  return (
    <ul className="space-y-2">
      {chronological.map((r) => (
        <li key={r.date}>
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="font-semibold text-[var(--heading)]">{r.date}</span>
            <span>
              {formatMoney(r.jackpotEur)}
              {r.hasWinner === true
                ? ` · ${wonLabel}`
                : r.hasWinner === false
                  ? ` · ${rolloverLabel}`
                  : ""}
            </span>
          </div>
          <div className="mt-1 h-2 w-full bg-[var(--surface)]">
            <div
              className="h-2 bg-[var(--accent)]"
              style={{ width: `${pct(r.jackpotEur, max)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
