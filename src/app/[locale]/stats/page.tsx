import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { readEuroMillionsStore } from "@/lib/euromillions/store";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stats" });
  return {
    title: t("title"),
    description: t("meta"),
    alternates: await siteLocaleAlternates(locale, "/stats"),
  };
}

function topCounts(values: number[], limit = 10) {
  const map = new Map<number, number>();
  for (const v of values) map.set(v, (map.get(v) || 0) + 1);
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, limit);
}

export default async function StatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("stats");
  const store = await readEuroMillionsStore();
  const draws = store.draws;
  const numbers = draws.flatMap((d) => d.numbers);
  const stars = draws.flatMap((d) => d.stars);
  const hotNumbers = topCounts(numbers);
  const hotStars = topCounts(stars);

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
      <p className="mt-2 text-sm text-[var(--accent)]">
        {t("sample", { count: draws.length })}
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {t("hotNumbers")}
          </h2>
          <ul className="mt-4 space-y-2">
            {hotNumbers.map(([n, c]) => (
              <li
                key={`n-${n}`}
                className="flex items-center justify-between border-b border-[var(--line)] py-2 text-sm"
              >
                <span className="font-semibold text-[var(--heading)]">{n}</span>
                <span className="text-[var(--muted)]">{c}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {t("hotStars")}
          </h2>
          <ul className="mt-4 space-y-2">
            {hotStars.map(([n, c]) => (
              <li
                key={`s-${n}`}
                className="flex items-center justify-between border-b border-[var(--line)] py-2 text-sm"
              >
                <span className="font-semibold text-[var(--heading)]">{n}</span>
                <span className="text-[var(--muted)]">{c}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-10 max-w-2xl text-xs text-[var(--muted)]">
        {t("disclaimer")}
      </p>
    </main>
  );
}
