import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { EuroMillionsOffersBlock } from "@/components/EuroMillionsOffersBlock";
import { DrawBalls } from "@/components/EuroMillionsHome";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import {
  getDrawByDate,
  readEuroMillionsStore,
} from "@/lib/euromillions/store";

export const revalidate = 600;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const t = await getTranslations({ locale, namespace: "draws" });
  return {
    title: t("drawOf", { date }),
    description: t("meta"),
    alternates: await siteLocaleAlternates(locale, `/tirages/${date}`),
  };
}

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function TirageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}) {
  const { locale, date } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("draws");
  const homeT = await getTranslations("home");
  const store = await readEuroMillionsStore();
  const draw = getDrawByDate(store, date);
  if (!draw) notFound();

  const jackpot = formatMoney(draw.jackpotEur, locale);

  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <Link
          href="/tirages"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← {t("back")}
        </Link>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          {t("drawOf", { date: formatDate(draw.date, locale) })}
        </h1>
        {jackpot ? (
          <p className="mt-3 text-[var(--muted)]">
            {t("jackpot")} · {jackpot}
          </p>
        ) : null}

        <div className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <DrawBalls
            draw={draw}
            ballsLabel={homeT("ballsLabel")}
            starsLabel={homeT("starsLabel")}
          />
          {draw.myMillionCode ? (
            <div className="mt-6 border-t border-[var(--line)] pt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                {t("myMillion")}
              </p>
              <p className="mt-2 font-mono text-xl tracking-wide text-[var(--heading)]">
                {draw.myMillionCode}
              </p>
              {draw.myMillionLocation ? (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {t("myMillionLocation")} · {draw.myMillionLocation}
                </p>
              ) : null}
              <p className="mt-3">
                <Link
                  href="/my-million"
                  className="text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  {t("myMillionArchive")} →
                </Link>
              </p>
            </div>
          ) : null}
        </div>

        <p className="mt-6 text-xs text-[var(--muted)]">
          {t("source")} · {draw.source}
          {store.updatedAt
            ? ` · ${t("updated")} ${new Date(store.updatedAt).toLocaleString(locale === "en" ? "en-GB" : "fr-FR")}`
            : ""}
        </p>
      </main>
      <EuroMillionsOffersBlock site={site} locale={locale} variant="compact" />
    </>
  );
}
