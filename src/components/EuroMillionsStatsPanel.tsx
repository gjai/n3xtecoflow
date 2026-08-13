import { intlLocale } from "@/i18n/locales";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JackpotBars, StatBoard } from "@/components/EuroMillionsStatCharts";
import type { EuroMillionsStore } from "@/lib/euromillions/types";
import {
  euroMillionsNumberStats,
  jackpotHistory,
  type NumberStat,
} from "@/lib/euromillions/stats";

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

export async function EuroMillionsStatsPanel({
  locale,
  store,
}: {
  locale: string;
  store: EuroMillionsStore;
}) {
  const t = await getTranslations({ locale, namespace: "stats" });
  const draws = store.draws;
  const { numbers, stars } = euroMillionsNumberStats(draws);
  const hotNumbers = [...numbers].sort((a, b) => b.count - a.count).slice(0, 10);
  const coldNumbers = [...numbers].sort((a, b) => b.delay - a.delay).slice(0, 10);
  const hotStars = [...stars].sort((a, b) => b.count - a.count).slice(0, 10);
  const coldStars = [...stars].sort((a, b) => b.delay - a.delay).slice(0, 10);
  const jackpots = jackpotHistory(draws, 12);

  return (
    <>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
      <p className="mt-2 text-sm text-[var(--accent)]">
        {t("sample", { count: draws.length })}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {t("expectedLine", {
          expected: Math.round((draws.length * 5) / 50),
        })}
      </p>
      <section className="mt-8 max-w-3xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h3 className="text-lg font-semibold text-[var(--heading)]">
          {t("howTitle")}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("howBody")}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("howExpected")}</p>
        <Link
          href="/guides/probabilites-euromillions"
          className="mt-3 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          {t("oddsCta")} →
        </Link>
      </section>

      <section className="mt-12">
        <h3 className="text-lg font-semibold text-[var(--heading)]">
          {t("freqTitle")}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("freqLead")}</p>
        <div className="mt-6">
          <StatBoard
            items={numbers}
            mode="count"
            caption={t("freqCaption")}
          />
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-lg font-semibold text-[var(--heading)]">
          {t("delayTitle")}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("delayLead")}</p>
        <div className="mt-6">
          <StatBoard
            items={numbers}
            mode="delay"
            caption={t("delayCaption")}
          />
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-lg font-semibold text-[var(--heading)]">
          {t("starsBoardTitle")}
        </h3>
        <div className="mt-6 max-w-3xl">
          <StatBoard
            items={stars}
            mode="count"
            caption={t("starsFreqCaption")}
          />
        </div>
      </section>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            {t("hotNumbers")}
          </h3>
          <StatList
            items={hotNumbers}
            countLabel={(count) => t("countLabel", { count })}
            delayLabel={(delay) => t("delayLabel", { delay })}
          />
        </section>
        <section>
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            {t("coldNumbers")}
          </h3>
          <StatList
            items={coldNumbers}
            countLabel={(count) => t("countLabel", { count })}
            delayLabel={(delay) => t("delayLabel", { delay })}
          />
        </section>
        <section>
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            {t("hotStars")}
          </h3>
          <StatList
            items={hotStars}
            countLabel={(count) => t("countLabel", { count })}
            delayLabel={(delay) => t("delayLabel", { delay })}
          />
        </section>
        <section>
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            {t("coldStars")}
          </h3>
          <StatList
            items={coldStars}
            countLabel={(count) => t("countLabel", { count })}
            delayLabel={(delay) => t("delayLabel", { delay })}
          />
        </section>
      </div>

      <section className="mt-14">
        <h3 className="text-lg font-semibold text-[var(--heading)]">
          {t("allNumbers")}
        </h3>
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

      <section className="mt-14">
        <h3 className="text-lg font-semibold text-[var(--heading)]">
          {t("allStars")}
        </h3>
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
              {stars.map((s) => (
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
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            {t("jackpotsTitle")}
          </h3>
          <div className="mt-6 max-w-3xl">
            <JackpotBars
              rows={jackpots}
              formatMoney={(n) => formatMoney(n, locale)}
              wonLabel={t("jackpotWon")}
              rolloverLabel={t("jackpotRollover")}
            />
          </div>
          <ul className="mt-8 divide-y divide-[var(--line)] border border-[var(--line)]">
            {jackpots.map((j) => (
              <li
                key={j.date}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
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
    </>
  );
}
