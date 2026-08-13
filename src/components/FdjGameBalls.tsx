import type { FdjGameDraw, FdjResultGroup } from "@/lib/fdj-games/types";

function Ball({
  value,
  variant,
}: {
  value: number | string;
  variant: "main" | "bonus" | "letter" | "code";
}) {
  if (variant === "code") {
    return (
      <span className="inline-flex min-h-9 items-center bg-[var(--surface)] px-3 font-mono text-sm font-semibold tracking-wide text-[var(--heading)] border border-[var(--line)]">
        {value}
      </span>
    );
  }
  if (variant === "letter") {
    return (
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--surface)] text-sm font-semibold text-[var(--heading)]">
        {value}
      </span>
    );
  }
  if (variant === "bonus") {
    return (
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--surface)] text-sm font-semibold text-[var(--heading)]">
        {value}
      </span>
    );
  }
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)]">
      {value}
    </span>
  );
}

function groupVariant(
  g: FdjResultGroup,
): "main" | "bonus" | "letter" | "code" {
  if (g.kind === "letter") return "letter";
  if (g.kind === "code") return "code";
  if (g.kind === "bonus") return "bonus";
  return "main";
}

export function FdjGameBalls({
  draw,
  labels,
}: {
  draw: FdjGameDraw;
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      {draw.groups.map((g) => (
        <div key={`${g.type}-${g.labelKey}`}>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {labels[g.labelKey] || g.type}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {g.values.map((v, i) => (
              <Ball
                key={`${g.labelKey}-${v}-${i}`}
                value={v}
                variant={groupVariant(g)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
