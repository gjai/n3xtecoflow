import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { EuroMillionsOffersBlock } from "@/components/EuroMillionsOffersBlock";
import { EuroMillionsSimulator } from "@/components/EuroMillionsSimulator";
import { EuroMillionsStatsPanel } from "@/components/EuroMillionsStatsPanel";
import { FlashGridGenerator } from "@/components/FlashGridGenerator";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { ResultsLivePoller } from "@/components/ResultsLivePoller";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import {
  getLatestDraw,
  readEuroMillionsStore,
} from "@/lib/euromillions/store";
import { euroMillionsResultPending } from "@/lib/euromillions/datetime";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "draws" });
  return {
    title: t("title"),
    description: t("meta"),
    alternates: await siteLocaleAlternates(locale, "/tirages"),
  };
}

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export default async function TiragesPage({
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

  const t = await getTranslations("draws");
  const simT = await getTranslations("simulator");
  const statsT = await getTranslations("stats");
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  const draws = store.draws.slice(0, 120);
  const pending = euroMillionsResultPending({
    latestDate: store.latest?.date || draws[0]?.date,
    nextDrawDate: store.nextDrawDate,
  });
  const simDraws = store.draws.map((d) => ({
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
    <>
      <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <ResultsLivePoller
          enabled={pending}
          fingerprint={store.latest?.date || draws[0]?.date || "none"}
        />
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          EuroMillions
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          {t("title")}
        </h1>
        <div className="mt-4">
          <GameToolsNav gameId="euromillions" />
        </div>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>

        <section id="archives" className="mt-10 scroll-mt-28">
          {draws.length === 0 ? (
            <p className="text-[var(--muted)]">{t("empty")}</p>
          ) : (
            <ul className="divide-y divide-[var(--line)] border border-[var(--line)]">
              {draws.map((draw) => (
                <li
                  key={draw.date}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link
                    href={`/tirages/${draw.date}`}
                    className="min-w-0 flex-1 transition hover:text-[var(--accent)]"
                  >
                    <p className="font-semibold text-[var(--heading)]">
                      {formatDate(draw.date, locale)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {draw.numbers.join(" · ")} · ★ {draw.stars.join(" · ")}
                      {draw.myMillionCode ? ` · MM ${draw.myMillionCode}` : ""}
                    </p>
                  </Link>
                  <Link
                    href={`/tirages?date=${draw.date}#simulateur`}
                    className="shrink-0 text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    {t("checkCta")} →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="simulateur" className="mt-16 max-w-3xl scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {simT("title")}
          </h2>
          <p className="mt-2 text-[var(--muted)]">{simT("subtitle")}</p>
          <div className="mt-8">
            <EuroMillionsSimulator
              draws={simDraws}
              locale={locale}
              latestDate={latest?.date || null}
              initialDate={initialDate}
            />
          </div>
          <div className="mt-12">
            <FlashGridGenerator />
          </div>
        </section>

        <section id="stats" className="mt-16 scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {statsT("title")}
          </h2>
          <EuroMillionsStatsPanel locale={locale} store={store} />
        </section>
      </main>
      <EuroMillionsOffersBlock site={site} locale={locale} variant="compact" />
    </>
  );
}
