import { intlLocale } from "@/i18n/locales";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { readEuroMillionsStore } from "@/lib/euromillions/store";
import {
  euroMillionsNumberStats,
  jackpotHistory,
  type NumberStat,
} from "@/lib/euromillions/stats";

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

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function formatMoney(amount: number, locale: string) {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatList({
  items,
  countLabel,
  delayLabel,
}: {
  items: NumberStat[];
  countLabel: (count: number) => string;
  delayLabel: (delay: number) => string;
}) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((s) => (
        <li
          key={s.n}
          className="flex items-center justify-between border-b border-[var(--line)] py-2 text-sm"
        >
          <span className="font-semibold text-[var(--heading)]">{s.n}</span>
          <span className="text-[var(--muted)]">
            {countLabel(s.count)} · {delayLabel(s.delay)}
          </span>
        </li>
      ))}
    </ul>
  );
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
  const { numbers, stars } = euroMillionsNumberStats(draws);
  const hotNumbers = [...numbers].sort((a, b) => b.count - a.count).slice(0, 10);
  const coldNumbers = [...numbers].sort((a, b) => b.delay - a.delay).slice(0, 10);
  const hotStars = [...stars].sort((a, b) => b.count - a.count).slice(0, 10);
  const coldStars = [...stars].sort((a, b) => b.delay - a.delay).slice(0, 10);
  const jackpots = jackpotHistory(draws, 12);

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
        {t("title")}
      </h1>
      <div className="mt-4">
        <GameToolsNav gameId="euromillions" />
      </div>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
      <p className="mt-2 text-sm text-[var(--accent)]">
        {t("sample", { count: draws.length })}
      </p>
      <section className="mt-8 max-w-3xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold text-[var(--heading)]">
          {t("howTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("howBody")}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("howExpected")}</p>
        <Link
          href="/guides/probabilites-euromillions"
          className="mt-3 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          {t("oddsCta")} →
        </Link>
      </section>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {t("hotNumbers")}
          </h2>
          <StatList
            items={hotNumbers}
            countLabel={(count) => t("countLabel", { count })}
            delayLabel={(delay) => t("delayLabel", { delay })}
          />
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {t("coldNumbers")}
          </h2>
          <StatList
            items={coldNumbers}
            countLabel={(count) => t("countLabel", { count })}
            delayLabel={(delay) => t("delayLabel", { delay })}
          />
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {t("hotStars")}
          </h2>
          <StatList
            items={hotStars}
            countLabel={(count) => t("countLabel", { count })}
            delayLabel={(delay) => t("delayLabel", { delay })}
          />
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {t("coldStars")}
          </h2>
          <StatList
            items={coldStars}
            countLabel={(count) => t("countLabel", { count })}
            delayLabel={(delay) => t("delayLabel", { delay })}
          />
        </section>
      </div>

      <section className="mt-14">
        <h2 className="text-lg font-semibold text-[var(--heading)]">
          {t("allNumbers")}
        </h2>
        <div className="mt-4 overflow-x-auto border border-[var(--line)]">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2 font-medium">{t("colNumber")}</th>
                <th className="px-3 py-2 font-medium">{t("colCount")}</th>
                <th className="px-3 py-2 font-medium">{t("colDelay")}</th>
                <th className="px-3 py-2 font-medium">{t("colMaxDelay")}</th>
              </tr>
            </thead>
            <tbody>
              {numbers.map((s) => (
                <tr key={s.n} className="border-t border-[var(--line)]">
                  <td className="px-3 py-2 font-semibold text-[var(--heading)]">
                    {s.n}
                  </td>
                  <td className="px-3 py-2 text-[var(--muted)]">{s.count}</td>
                  <td className="px-3 py-2 text-[var(--muted)]">{s.delay}</td>
                  <td className="px-3 py-2 text-[var(--muted)]">{s.maxDelay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {jackpots.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {t("jackpotsTitle")}
          </h2>
          <ul className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)]">
            {jackpots.map((j) => (
              <li key={j.date} className="flex items-center justify-between px-4 py-3 text-sm">
                <Link
                  href={`/tirages/${j.date}`}
                  className="font-semibold text-[var(--heading)] hover:text-[var(--accent)]"
                >
                  {formatDate(j.date, locale)}
                </Link>
                <span className="text-[var(--muted)]">
                  {formatMoney(j.jackpotEur, locale)}
                  {j.hasWinner === true
                    ? ` · ${t("jackpotWon")}`
                    : j.hasWinner === false
                      ? ` · ${t("jackpotRollover")}`
                      : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-10 max-w-2xl text-xs text-[var(--muted)]">
        {t("disclaimer")}
      </p>
    </main>
  );
}
