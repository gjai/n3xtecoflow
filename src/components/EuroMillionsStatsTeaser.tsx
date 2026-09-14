import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { EuroMillionsStore } from "@/lib/euromillions/types";
import {
  euroMillionsNumberStats,
  type NumberStat,
} from "@/lib/euromillions/stats";

function StatMini({ items }: { items: NumberStat[] }) {
  return (
    <ol className="mt-3 space-y-1 text-sm">
      {items.map((s) => (
        <li
          key={s.n}
          className="flex justify-between border-b border-[var(--line)] py-1.5"
        >
          <span className="font-semibold text-[var(--heading)]">{s.n}</span>
          <span className="text-[var(--muted)]">
            {s.count} · écart {s.delay}
          </span>
        </li>
      ))}
    </ol>
  );
}

export async function EuroMillionsStatsTeaser({
  locale,
  store,
}: {
  locale: string;
  store: EuroMillionsStore;
}) {
  const t = await getTranslations({ locale, namespace: "stats" });
  const { numbers } = euroMillionsNumberStats(store.draws);
  const hot = [...numbers].sort((a, b) => b.count - a.count).slice(0, 5);
  const cold = [...numbers].sort((a, b) => b.delay - a.delay).slice(0, 5);

  return (
    <div className="max-w-3xl">
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{t("teaserLead")}</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            {t("hotNumbers")}
          </h3>
          <StatMini items={hot} />
        </section>
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            {t("coldNumbers")}
          </h3>
          <StatMini items={cold} />
        </section>
      </div>
      <Link
        href="/stats"
        className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        {t("fullPageCta")} →
      </Link>
      {" "}
      <Link
        href="/records"
        className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        {t("recordsCta")} →
      </Link>
    </div>
  );
}
