import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EuroMillionsOffersBlock } from "@/components/EuroMillionsOffersBlock";
import { EuroMillionsSimulator } from "@/components/EuroMillionsSimulator";
import { EuroMillionsStatsPanel } from "@/components/EuroMillionsStatsPanel";
import { FlashGridGenerator } from "@/components/FlashGridGenerator";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { ResultsLivePoller } from "@/components/ResultsLivePoller";
import { ArchivePagination } from "@/components/ArchivePagination";
import { DrawArchiveRow } from "@/components/DrawArchiveRow";
import { DrawBalls } from "@/components/EuroMillionsHome";
import { GameMark } from "@/components/GameMark";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/components/JsonLd";
import { archivePageHref, ARCHIVE_PAGE_SIZE, paginate, parsePageParam } from "@/lib/pagination";
import { gameScopeStyle } from "@/lib/fdj-games/identity";
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
  searchParams: Promise<{ date?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { date: dateParam, page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("draws");
  const pageT = await getTranslations("pagination");
  const simT = await getTranslations("simulator");
  const statsT = await getTranslations("stats");
  const homeT = await getTranslations("home");
  const store = await readEuroMillionsStore();
  const latest = getLatestDraw(store);
  const listed = paginate(
    store.draws,
    parsePageParam(pageParam),
    ARCHIVE_PAGE_SIZE,
  );
  const draws = listed.items;
  const pending = euroMillionsResultPending({
    latestDate: store.latest?.date || store.draws[0]?.date,
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

  const siteUrl = `https://${site.primaryHost}`;
  const listDraws = draws;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.brand.name, url: `${siteUrl}/${locale}` },
          { name: t("title"), url: `${siteUrl}/${locale}/tirages` },
        ])}
      />
      <JsonLd
        data={itemListJsonLd({
          name: t("title"),
          description: t("meta"),
          url: `${siteUrl}/${locale}/tirages`,
          items: listDraws.map((draw) => ({
            name: formatDate(draw.date, locale),
            url: `${siteUrl}/${locale}/tirages/${draw.date}`,
          })),
        })}
      />
      <main
        className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20"
        style={gameScopeStyle("euromillions")}
      >
        <ResultsLivePoller
          enabled={pending}
          fingerprint={store.latest?.date || store.draws[0]?.date || "none"}
        />
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          EuroMillions
        </p>
        <h1 className="mt-2 flex items-center gap-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          <GameMark gameId="euromillions" size={36} />
          {t("title")}
        </h1>
        <div className="mt-4">
          <GameToolsNav gameId="euromillions" />
        </div>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>

        <section id="archives" className="mt-10 scroll-mt-28">
          {listed.total === 0 ? (
            <p className="text-[var(--muted)]">{t("empty")}</p>
          ) : (
            <>
            <ul className="divide-y divide-[var(--line)] border border-[var(--line)]">
              {draws.map((draw) => (
                <DrawArchiveRow
                  key={draw.date}
                  href={`/tirages/${draw.date}`}
                  title={formatDate(draw.date, locale)}
                  balls={
                    <DrawBalls
                      draw={draw}
                      ballsLabel={homeT("ballsLabel")}
                      starsLabel={homeT("starsLabel")}
                      compact
                    />
                  }
                  extra={
                    draw.myMillionCode ? (
                      <p className="mt-2 font-mono text-sm tracking-wide text-[var(--accent)]">
                        MM {draw.myMillionCode}
                      </p>
                    ) : null
                  }
                  actionHref={`/tirages?date=${draw.date}#simulateur`}
                  actionLabel={t("checkCta")}
                />
              ))}
            </ul>
            <ArchivePagination
              page={listed.page}
              totalPages={listed.totalPages}
              hrefForPage={(p) =>
                archivePageHref("/tirages", p, { date: dateParam })
              }
              prevLabel={pageT("prev")}
              nextLabel={pageT("next")}
              pageOf={pageT("pageOf", {
                page: listed.page,
                total: listed.totalPages,
              })}
              range={pageT("range", {
                from: listed.from,
                to: listed.to,
                total: listed.total,
              })}
            />
            </>
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
