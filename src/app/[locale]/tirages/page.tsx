import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
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
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export default async function TiragesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("draws");
  const store = await readEuroMillionsStore();
  const draws = store.draws.slice(0, 120);

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
        EuroMillions
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>

      {draws.length === 0 ? (
        <p className="mt-10 text-[var(--muted)]">{t("empty")}</p>
      ) : (
        <ul className="mt-10 divide-y divide-[var(--line)] border border-[var(--line)]">
          {draws.map((draw) => (
            <li key={draw.date}>
              <Link
                href={`/tirages/${draw.date}`}
                className="flex flex-col gap-3 px-4 py-4 transition hover:bg-[var(--surface)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--heading)]">
                    {formatDate(draw.date, locale)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {draw.numbers.join(" · ")} · ★ {draw.stars.join(" · ")}
                  </p>
                </div>
                <span className="text-sm text-[var(--accent)]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
