import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd } from "@/components/JsonLd";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";
import { formatEuroMillionsLongDate } from "@/lib/euromillions/datetime";
import { formatMillionsEur, buildRecordsSnapshot } from "@/lib/euromillions/insights";
import { readEuroMillionsStore } from "@/lib/euromillions/store";
import type { JackpotRow, NumberStat } from "@/lib/euromillions/stats";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "records" });
  return {
    title: t("pageTitle"),
    description: t("pageMeta"),
    alternates: await siteLocaleAlternates(locale, "/records"),
  };
}

function JackpotTable({
  rows,
  locale,
  wonLabel,
  rolloverLabel,
}: {
  rows: JackpotRow[];
  locale: string;
  wonLabel: string;
  rolloverLabel: string;
}) {
  const loc = locale === "en" ? "en" : "fr";
  return (
    <ol className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)]">
      {rows.map((row) => (
        <li
          key={`${row.date}-${row.jackpotEur}`}
          className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm"
        >
          <Link
            href={`/tirages/${row.date}`}
            className="font-semibold text-[var(--heading)] hover:underline"
          >
            {formatEuroMillionsLongDate(row.date, loc)}
          </Link>
          <span className="text-[var(--fog)]">
            {formatMillionsEur(row.jackpotEur, loc)}
            {row.hasWinner === true
              ? ` · ${wonLabel}`
              : row.hasWinner === false
                ? ` · ${rolloverLabel}`
                : ""}
          </span>
        </li>
      ))}
    </ol>
  );
}

function NumberTable({
  rows,
  valueLabel,
  valueOf,
}: {
  rows: NumberStat[];
  valueLabel: string;
  valueOf: (row: NumberStat) => number;
}) {
  return (
    <ol className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)]">
      {rows.map((row) => (
        <li
          key={row.n}
          className="flex items-baseline justify-between gap-3 px-4 py-3 text-sm"
        >
          <span className="font-semibold text-[var(--heading)]">{row.n}</span>
          <span className="text-[var(--fog)]">
            {valueLabel.replace("{n}", String(valueOf(row)))}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default async function RecordsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("records");
  const tStats = await getTranslations("stats");
  const store = await readEuroMillionsStore();
  const rec = buildRecordsSnapshot(store.draws);
  const siteUrl = `https://${site.primaryHost}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.brand.name, url: `${siteUrl}/${locale}` },
          { name: t("title"), url: `${siteUrl}/${locale}/records` },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: t("pageTitle"),
          description: t("pageMeta"),
          url: `${siteUrl}/${locale}/records`,
          csvUrl: `${siteUrl}/api/euromillions/export`,
        })}
      />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">{t("lead")}</p>
        {rec.sampleSize > 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t("sample", {
              count: rec.sampleSize,
              from: rec.fromDate
                ? formatEuroMillionsLongDate(rec.fromDate, locale === "en" ? "en" : "fr")
                : "—",
              to: rec.toDate
                ? formatEuroMillionsLongDate(rec.toDate, locale === "en" ? "en" : "fr")
                : "—",
            })}
          </p>
        ) : null}
        <div className="mt-4">
          <GameToolsNav gameId="euromillions" />
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
              {t("jackpotsTitle")}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("jackpotsLead")}</p>
            {rec.biggestJackpots.length > 0 ? (
              <JackpotTable
                rows={rec.biggestJackpots}
                locale={locale}
                wonLabel={tStats("jackpotWon")}
                rolloverLabel={tStats("jackpotRollover")}
              />
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">{t("empty")}</p>
            )}
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
              {t("winsTitle")}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("winsLead")}</p>
            {rec.biggestWins.length > 0 ? (
              <JackpotTable
                rows={rec.biggestWins}
                locale={locale}
                wonLabel={tStats("jackpotWon")}
                rolloverLabel={tStats("jackpotRollover")}
              />
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">{t("empty")}</p>
            )}
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
              {t("absencesTitle")}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("absencesLead")}</p>
            {rec.longestCurrentAbsences.length > 0 ? (
              <NumberTable
                rows={rec.longestCurrentAbsences}
                valueLabel={t("delayValue")}
                valueOf={(row) => row.delay}
              />
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">{t("empty")}</p>
            )}
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
              {t("gapsTitle")}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("gapsLead")}</p>
            {rec.longestHistoricalGaps.length > 0 ? (
              <NumberTable
                rows={rec.longestHistoricalGaps}
                valueLabel={t("maxDelayValue")}
                valueOf={(row) => row.maxDelay}
              />
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">{t("empty")}</p>
            )}
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
              {t("hotTitle")}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("hotLead")}</p>
            {rec.hottest.length > 0 ? (
              <NumberTable
                rows={rec.hottest}
                valueLabel={t("countValue")}
                valueOf={(row) => row.count}
              />
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">{t("empty")}</p>
            )}
          </section>
        </div>

        <p className="mt-10 max-w-3xl text-sm text-[var(--muted)]">{t("disclaimer")}</p>
        <p className="mt-4 text-sm">
          <Link href="/stats" className="font-semibold text-[var(--accent)] hover:underline">
            {t("statsCta")}
          </Link>
          {" · "}
          <Link href="/presse" className="font-semibold text-[var(--accent)] hover:underline">
            {t("pressCta")}
          </Link>
          {" · "}
          <a
            href="/api/euromillions/export"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            {tStats("csvCta")}
          </a>
        </p>
      </main>
      <KwankoBanner
        desktop={KWANKO_SLOTS.euromillions.desktop}
        mobile={KWANKO_SLOTS.euromillions.mobile}
      />
    </>
  );
}
