import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { comparisons } from "@/data/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Comparisons" : "Comparatifs",
    description:
      locale === "en"
        ? "EcoFlow comparisons: RIVER vs DELTA, DELTA 2 vs 3, PowerStream vs station."
        : "Comparatifs EcoFlow : RIVER vs DELTA, DELTA 2 vs 3, PowerStream vs station.",
  };
}

export default async function ComparisonsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div className="pt-24">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {isEn ? "Comparisons" : "Comparatifs"}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          {isEn
            ? "Quick decision frameworks between EcoFlow families and generations."
            : "Grilles de décision rapides entre familles et générations EcoFlow."}
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-2 md:px-8">
        {comparisons.map((item) => {
          const copy = isEn ? item.en : item.fr;
          return (
            <Link
              key={item.slug}
              href={`/comparatifs/${item.slug}`}
              className="border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]"
            >
              <h2 className="text-xl font-semibold text-[var(--heading)]">{copy.title}</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">{copy.subtitle}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
