import { Link } from "@/i18n/navigation";
import { intlLocale } from "@/i18n/locales";
import { isEuroMillionsDrawPublished } from "@/lib/euromillions/store";
import type { EuroMillionsDraw } from "@/lib/euromillions/types";

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
}

export function RecentEuroMillionsDraws({
  draws,
  locale,
  title,
}: {
  draws: EuroMillionsDraw[];
  locale: string;
  title: string;
}) {
  const rows = draws.filter(isEuroMillionsDrawPublished).slice(0, 5);
  if (rows.length < 2) return null;
  return (
    <div className="mt-8">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
        {title}
      </h2>
      <ul className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)]">
        {rows.map((draw) => (
          <li key={draw.date}>
            <Link
              href={`/tirages/${draw.date}`}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 py-2.5 hover:bg-[var(--surface)]"
            >
              <span className="text-sm font-semibold text-[var(--heading)]">
                {formatDate(draw.date, locale)}
              </span>
              <span className="font-mono text-sm tabular-nums text-[var(--muted)]">
                {draw.numbers.join(" ")}
                <span className="text-[var(--accent)]">
                  {" + "}
                  {draw.stars.join(" ")}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
