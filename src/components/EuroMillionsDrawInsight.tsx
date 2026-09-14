import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { insightForDraw } from "@/lib/euromillions/insights";
import type { EuroMillionsDraw } from "@/lib/euromillions/types";

export async function EuroMillionsDrawInsight({
  locale,
  draws,
  date,
}: {
  locale: string;
  draws: EuroMillionsDraw[];
  date: string;
}) {
  const snap = insightForDraw(draws, date);
  if (!snap || snap.sampleSize < 2) return null;
  const t = await getTranslations({ locale, namespace: "draws" });
  const absences = snap.brokenAbsences.slice(0, 3);

  return (
    <aside className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold text-[var(--heading)]">
        {t("insightTitle")}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{t("insightLead")}</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--fog)]">
        {absences.map((a) => (
          <li key={`${a.kind}-${a.n}`}>
            {a.kind === "star"
              ? t("insightAbsenceStar", { n: a.n, delay: a.delayBefore })
              : t("insightAbsence", { n: a.n, delay: a.delayBefore })}
          </li>
        ))}
        {absences.length === 0 && snap.coldest ? (
          <li>
            {t("insightCold", {
              n: snap.coldest.n,
              delay: snap.coldest.delay,
            })}
          </li>
        ) : null}
        {snap.hottest ? (
          <li>
            {t("insightHot", {
              n: snap.hottest.n,
              count: snap.hottest.count,
            })}
          </li>
        ) : null}
      </ul>
      <p className="mt-4 text-sm">
        <Link href="/stats" className="font-semibold text-[var(--accent)] hover:underline">
          {t("insightStats")}
        </Link>
        {" · "}
        <Link
          href="/records"
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          {t("insightRecords")}
        </Link>
      </p>
    </aside>
  );
}
