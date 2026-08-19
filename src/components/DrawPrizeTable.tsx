import { intlLocale } from "@/i18n/locales";
import type { EuroMillionsPrizeTier } from "@/lib/euromillions/types";

function formatMoney(amount: number | null | undefined, locale: string) {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount < 10 ? 2 : 0,
  }).format(amount);
}

function Table({
  tiers,
  extraTiers,
  locale,
  rankLabel,
  amountLabel,
  winnersLabel,
  extraLabel,
}: {
  tiers: EuroMillionsPrizeTier[];
  extraTiers?: EuroMillionsPrizeTier[];
  locale: string;
  rankLabel: string;
  amountLabel: string;
  winnersLabel: string;
  extraLabel?: string;
}) {
  const normalizeRank = (r: string) =>
    r.replace(/^.*?(\d)/, "$1").trim();
  const eplusMap = new Map(
    (extraTiers || []).map((t) => [normalizeRank(t.rank), t]),
  );
  const hasEplus =
    eplusMap.size > 0 &&
    tiers.some((t) => eplusMap.has(normalizeRank(t.rank))) &&
    (extraTiers || []).some((t) => t.amountEur > 0);
  return (
    <div className="max-w-full overflow-hidden border border-[var(--line)]">
      <table className="w-full table-fixed text-left text-[11px] leading-tight sm:text-sm">
        <thead className="bg-[var(--surface)] text-[10px] uppercase tracking-wide text-[var(--muted)] sm:text-xs sm:tracking-[0.08em]">
          <tr>
            <th className="w-[18%] px-1 py-1.5 font-medium sm:px-2 sm:py-2">
              {rankLabel}
            </th>
            <th className="w-[28%] px-1 py-1.5 font-medium sm:px-2 sm:py-2">
              {amountLabel}
            </th>
            <th className="w-[26%] px-1 py-1.5 font-medium sm:px-2 sm:py-2">
              {winnersLabel}
            </th>
            {hasEplus ? (
              <th className="w-[28%] px-1 py-1.5 font-medium sm:px-2 sm:py-2">
                {extraLabel}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => {
            const ep = eplusMap.get(normalizeRank(tier.rank));
            return (
              <tr key={`${tier.rank}-${i}`} className="border-t border-[var(--line)]">
                <td className="px-1 py-1.5 font-semibold text-[var(--heading)] sm:px-2 sm:py-2">
                  {tier.rank}
                </td>
                <td className="px-1 py-1.5 text-[var(--heading)] sm:px-2 sm:py-2">
                  {formatMoney(tier.amountEur, locale) || "—"}
                </td>
                <td className="px-1 py-1.5 text-[var(--muted)] sm:px-2 sm:py-2">
                  {tier.winners}
                </td>
                {hasEplus ? (
                  <td className="px-1 py-1.5 text-[var(--heading)] sm:px-2 sm:py-2">
                    {ep ? formatMoney(ep.amountEur, locale) || "—" : "—"}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function DrawPrizeTable({
  tiers,
  extraTiers,
  locale,
  title,
  extraTitle,
  extraHelp,
  rankLabel,
  amountLabel,
  winnersLabel,
  heading = "h2",
}: {
  tiers?: EuroMillionsPrizeTier[];
  extraTiers?: EuroMillionsPrizeTier[];
  locale: string;
  title: string;
  extraTitle: string;
  extraHelp?: string;
  rankLabel: string;
  amountLabel: string;
  winnersLabel: string;
  heading?: "h2" | "h3";
}) {
  if (!tiers?.length) return null;
  const Heading = heading;
  return (
    <div className="mt-8">
      {title ? (
        <Heading className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
          {title}
        </Heading>
      ) : null}
      <div className={title ? "mt-4" : ""}>
        <Table
          tiers={tiers}
          extraTiers={extraTiers}
          locale={locale}
          rankLabel={rankLabel}
          amountLabel={amountLabel}
          winnersLabel={winnersLabel}
          extraLabel={extraTitle}
        />
      </div>
      {extraTiers && extraTiers.length > 0 && extraHelp?.trim() ? (
        <p className="mt-3 text-sm text-[var(--muted)]">{extraHelp}</p>
      ) : null}
    </div>
  );
}
