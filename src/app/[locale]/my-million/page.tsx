import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EuroMillionsOffersBlock } from "@/components/EuroMillionsOffersBlock";
import { GameMark } from "@/components/GameMark";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { ResultsLivePoller } from "@/components/ResultsLivePoller";
import { MyMillionChecker } from "@/components/MyMillionChecker";
import { ArchivePagination } from "@/components/ArchivePagination";
import { DrawArchiveRow } from "@/components/DrawArchiveRow";
import { archivePageHref, ARCHIVE_PAGE_SIZE, paginate, parsePageParam } from "@/lib/pagination";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { gameScopeStyle } from "@/lib/fdj-games/identity";
import { euroMillionsResultPending } from "@/lib/euromillions/datetime";
import { readEuroMillionsStore } from "@/lib/euromillions/store";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "myMillion" });
  return {
    title: t("title"),
    description: t("meta"),
    alternates: await siteLocaleAlternates(locale, "/my-million"),
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

export default async function MyMillionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("myMillion");
  const pageT = await getTranslations("pagination");
  const store = await readEuroMillionsStore();
  const allCoded = store.draws.filter((d) => d.myMillionCode);
  const listed = paginate(
    allCoded,
    parsePageParam(pageParam),
    ARCHIVE_PAGE_SIZE,
  );
  const coded = listed.items;
  const winners = store.myMillionWinners || [];
  const pending = euroMillionsResultPending({
    latestDate: store.latest?.date || store.draws[0]?.date,
    nextDrawDate: store.nextDrawDate,
  });

  return (
    <>
      <ResultsLivePoller
        enabled={pending}
        fingerprint={store.draws.find((d) => d.myMillionCode)?.date || "none"}
      />
      <main
        className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20"
        style={gameScopeStyle("my-million")}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          My Million
        </p>
        <h1 className="mt-2 flex items-center gap-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          <GameMark gameId="my-million" size={36} />
          {t("title")}
        </h1>
        <div className="mt-4">
          <GameToolsNav gameId="my-million" />
        </div>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
        <p className="mt-2 text-xs text-[var(--muted)]">{t("disclaimer")}</p>

        <div className="mt-10">
          <MyMillionChecker
            locale={locale}
            draws={allCoded.map((d) => ({
              date: d.date,
              code: d.myMillionCode as string,
              location: d.myMillionLocation,
            }))}
          />
        </div>

        <h2
          id="archives"
          className="mt-12 scroll-mt-28 text-lg font-semibold text-[var(--heading)]"
        >
          {t("codesTitle")}
        </h2>
        {listed.total === 0 ? (
          <p className="mt-4 text-[var(--muted)]">{t("empty")}</p>
        ) : (
          <>
          <ul className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)]">
            {coded.map((d) => (
              <DrawArchiveRow
                key={d.date}
                href={`/tirages/${d.date}`}
                title={formatDate(d.date, locale)}
                balls={
                  <span className="lottery-code">{d.myMillionCode}</span>
                }
                extra={
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {d.myMillionLocation || t("locationPending")}
                  </p>
                }
              />
            ))}
          </ul>
          <ArchivePagination
            page={listed.page}
            totalPages={listed.totalPages}
            hrefForPage={(p) => archivePageHref("/my-million", p)}
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

        <h2 className="mt-12 text-lg font-semibold text-[var(--heading)]">
          {t("winnersTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("winnersSubtitle")}</p>
        {winners.length === 0 ? (
          <p className="mt-4 text-[var(--muted)]">{t("emptyWinners")}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {winners.slice(0, 40).map((w) => (
              <li
                key={w.sourceUrl}
                className="border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
              >
                <p className="font-semibold text-[var(--heading)]">
                  {w.location || t("locationUnknown")}
                  {w.date ? (
                    <span className="ml-2 text-sm font-normal text-[var(--muted)]">
                      · {formatDate(w.date, locale)}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{w.title}</p>
                <a
                  href={w.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  {t("sourceLink")} →
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
      <KwankoBanner
        desktop={KWANKO_SLOTS.euromillions.desktop}
        mobile={KWANKO_SLOTS.euromillions.mobile}
      />
      <EuroMillionsOffersBlock site={site} locale={locale} variant="compact" />
    </>
  );
}
