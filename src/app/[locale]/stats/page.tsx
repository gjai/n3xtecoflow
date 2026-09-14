import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { EuroMillionsStatsPanel } from "@/components/EuroMillionsStatsPanel";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd } from "@/components/JsonLd";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { readEuroMillionsStore } from "@/lib/euromillions/store";
import { buildCiteSnapshot } from "@/lib/euromillions/insights";
import { KwankoBanner } from "@/components/KwankoBanner";
import { KWANKO_SLOTS } from "@/lib/kwanko-slots";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stats" });
  return {
    title: t("pageTitle"),
    description: t("pageMeta"),
    alternates: await siteLocaleAlternates(locale, "/stats"),
  };
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
  const snap = buildCiteSnapshot(store.draws);
  const siteUrl = `https://${site.primaryHost}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.brand.name, url: `${siteUrl}/${locale}` },
          { name: t("title"), url: `${siteUrl}/${locale}/stats` },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: t("pageTitle"),
          description: t("pageMeta"),
          url: `${siteUrl}/${locale}/stats`,
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
        <div className="mt-4">
          <GameToolsNav gameId="euromillions" />
        </div>

        <section className="mt-10 max-w-3xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {t("citeTitle")}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{t("citeLead")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--fog)]">
            {snap.sampleSize > 0 ? (
              <li>{t("citeSample", { count: snap.sampleSize })}</li>
            ) : null}
            {snap.hottest ? (
              <li>
                {t("citeHot", {
                  n: snap.hottest.n,
                  count: snap.hottest.count,
                })}
              </li>
            ) : null}
            {snap.coldest ? (
              <li>
                {t("citeCold", {
                  n: snap.coldest.n,
                  delay: snap.coldest.delay,
                })}
              </li>
            ) : null}
            {snap.brokenAbsences[0] ? (
              <li>
                {t("citeAbsence", {
                  n: snap.brokenAbsences[0].n,
                  delay: snap.brokenAbsences[0].delayBefore,
                })}
              </li>
            ) : null}
          </ul>
          <p className="mt-4 text-sm">
            <Link href="/presse" className="font-semibold text-[var(--accent)] hover:underline">
              {t("pressCta")}
            </Link>
            {" · "}
            <Link href="/records" className="font-semibold text-[var(--accent)] hover:underline">
              {t("recordsCta")}
            </Link>
            {" · "}
            <a
              href="/api/euromillions/export"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {t("csvCta")}
            </a>
          </p>
        </section>

        <EuroMillionsStatsPanel locale={locale} store={store} />
      </main>
      <KwankoBanner
        desktop={KWANKO_SLOTS.euromillions.desktop}
        mobile={KWANKO_SLOTS.euromillions.mobile}
      />
    </>
  );
}
