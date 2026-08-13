import type { FdjGameDraw, FdjResultGroup } from "@/lib/fdj-games/types";

function Ball({
  value,
  variant,
  size = "md",
}: {
  value: number | string;
  variant: "main" | "bonus" | "letter" | "code";
  size?: "sm" | "md" | "lg";
}) {
  if (variant === "code") {
    return <span className="lottery-code">{value}</span>;
  }
  const sizeClass =
    size === "lg"
      ? "lottery-ball--lg"
      : size === "sm"
        ? "lottery-ball--sm"
        : "";
  if (variant === "letter") {
    return (
      <span className={`lottery-ball lottery-ball--letter ${sizeClass}`}>
        {value}
      </span>
    );
  }
  if (variant === "bonus") {
    return (
      <span className={`lottery-ball lottery-ball--bonus ${sizeClass}`}>
        {value}
      </span>
    );
  }
  return (
    <span className={`lottery-ball lottery-ball--main ${sizeClass}`}>
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
  compact = false,
}: {
  draw: FdjGameDraw;
  labels: Record<string, string>;
  /** Une seule rangée (listes d’archives) — mêmes boules que le détail. */
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="lottery-balls lottery-balls--compact">
        {draw.groups.flatMap((g) =>
          g.values.map((v, i) => (
            <Ball
              key={`${g.labelKey}-${v}-${i}`}
              value={v}
              variant={groupVariant(g)}
              size="sm"
            />
          )),
        )}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {draw.groups.map((g) => (
        <div key={`${g.type}-${g.labelKey}`}>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {labels[g.labelKey] || g.type}
          </p>
          <div className="lottery-balls">
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
