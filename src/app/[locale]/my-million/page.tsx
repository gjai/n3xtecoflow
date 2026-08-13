import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { EuroMillionsOffersBlock } from "@/components/EuroMillionsOffersBlock";
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
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export default async function MyMillionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("myMillion");
  const store = await readEuroMillionsStore();
  const coded = store.draws
    .filter((d) => d.myMillionCode)
    .slice(0, 80);
  const winners = store.myMillionWinners || [];

  return (
    <>
      <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          My Million
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
        <p className="mt-2 text-xs text-[var(--muted)]">{t("disclaimer")}</p>

        <h2 className="mt-12 text-lg font-semibold text-[var(--heading)]">
          {t("codesTitle")}
        </h2>
        {coded.length === 0 ? (
          <p className="mt-4 text-[var(--muted)]">{t("empty")}</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)]">
            {coded.map((d) => (
              <li key={d.date}>
                <Link
                  href={`/tirages/${d.date}`}
                  className="flex flex-col gap-2 px-4 py-4 transition hover:bg-[var(--surface)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[var(--heading)]">
                      {formatDate(d.date, locale)}
                    </p>
                    <p className="mt-1 font-mono text-sm tracking-wide text-[var(--accent)]">
                      {d.myMillionCode}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    {d.myMillionLocation || t("locationPending")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
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
      <EuroMillionsOffersBlock site={site} locale={locale} variant="compact" />
    </>
  );
}
