import { Link } from "@/i18n/navigation";
import type { RelatedLink } from "@/lib/product-related";

const KIND_META = {
  news: {
    fr: "Actualités",
    en: "News",
    accent: "var(--solar)",
  },
  guide: {
    fr: "Guides",
    en: "Guides",
    accent: "var(--accent)",
  },
  comparison: {
    fr: "Comparatifs",
    en: "Comparisons",
    accent: "var(--heading)",
  },
} as const;

type GroupKey = "news" | "guide" | "comparison";

export function RelatedReading({
  locale,
  guides,
  comparisons,
  news,
}: {
  locale: string;
  guides: RelatedLink[];
  comparisons: RelatedLink[];
  news: RelatedLink[];
}) {
  const isEn = locale === "en";
  const groups: { key: GroupKey; items: RelatedLink[] }[] = (
    [
      { key: "news" as const, items: news },
      { key: "guide" as const, items: guides },
      { key: "comparison" as const, items: comparisons },
    ] as const
  ).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] pt-8">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
        {isEn ? "Related reading" : "À lire aussi"}
      </h2>
      <div
        className={`mt-6 grid gap-4 ${
          groups.length === 1
            ? "md:grid-cols-1"
            : groups.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-3"
        }`}
      >
        {groups.map(({ key, items }) => {
          const meta = KIND_META[key];
          return (
            <div
              key={key}
              className="border border-[var(--line)] bg-[var(--surface)] p-5"
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: meta.accent }}
              >
                {isEn ? meta.en : meta.fr}
              </p>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block text-sm font-medium leading-snug text-[var(--heading)] underline-offset-2 transition hover:text-[var(--accent)] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
