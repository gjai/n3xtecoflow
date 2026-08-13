import type { FdjGameDraw, FdjResultGroup } from "@/lib/fdj-games/types";

function Ball({
  value,
  variant,
}: {
  value: number | string;
  variant: "main" | "bonus" | "letter" | "code";
}) {
  if (variant === "code") {
    return <span className="lottery-code">{value}</span>;
  }
  if (variant === "letter") {
    return (
      <span className="lottery-ball lottery-ball--letter">{value}</span>
    );
  }
  if (variant === "bonus") {
    return (
      <span className="lottery-ball lottery-ball--bonus">{value}</span>
    );
  }
  return <span className="lottery-ball lottery-ball--main">{value}</span>;
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
