import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EuroMillionsSimulator } from "@/components/EuroMillionsSimulator";
import { FlashGridGenerator } from "@/components/FlashGridGenerator";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import {
  getLatestDraw,
  readEuroMillionsStore,
} from "@/lib/euromillions/store";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "simulator" });
  return {
    title: t("title"),
    description: t("meta"),
    alternates: await siteLocaleAlternates(locale, "/simulateur"),
  };
}

export default async function SimulateurPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { locale } = await params;
  const { date: dateParam } = await searchParams;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("simulator");
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  const draws = store.draws.map((d) => ({
    date: d.date,
    numbers: d.numbers,
    stars: d.stars,
    jackpotEur: d.jackpotEur,
    prizeTiers: d.prizeTiers,
    source: d.source,
    fetchedAt: d.fetchedAt,
  }));
  const initialDate =
    dateParam && store.draws.some((d) => d.date === dateParam)
      ? dateParam
      : latest?.date || null;

  return (
    <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
      <div className="mt-10">
        <EuroMillionsSimulator
          draws={draws}
          locale={locale}
          latestDate={latest?.date || null}
          initialDate={initialDate}
        />
      </div>
      <div className="mt-12">
        <FlashGridGenerator />
      </div>
    </main>
  );
}
