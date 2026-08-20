import { formatPrizeTierAmount } from "@/lib/lottery/prize-format";
import { intlLocale } from "@/i18n/locales";
import type { EuroMillionsPrizeTier } from "@/lib/euromillions/types";

function formatCount(n: number, locale: string): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(n);
}

function Table({
  tiers,
  extraTiers,
  locale,
  rankLabel,
  amountLabel,
  winnersLabel,
  winnersEuropeLabel,
  extraLabel,
  annuityNote,
}: {
  tiers: EuroMillionsPrizeTier[];
  extraTiers?: EuroMillionsPrizeTier[];
  locale: string;
  rankLabel: string;
  amountLabel: string;
  winnersLabel: string;
  winnersEuropeLabel?: string;
  extraLabel?: string;
  annuityNote?: (vars: { amount: string; years: number }) => string;
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
  const hasEurope =
    Boolean(winnersEuropeLabel) &&
    tiers.some((t) => t.winnersEurope != null);
  return (
    <div className="max-w-full overflow-hidden border border-[var(--line)]">
      <table className="w-full table-fixed text-left text-[11px] leading-tight sm:text-sm">
        <thead className="bg-[var(--surface)] text-[10px] uppercase tracking-wide text-[var(--muted)] sm:text-xs sm:tracking-[0.08em]">
          <tr>
            <th className="w-[16%] px-1 py-1.5 font-medium sm:px-2 sm:py-2">
              {rankLabel}
            </th>
            <th className="w-[24%] px-1 py-1.5 font-medium sm:px-2 sm:py-2">
              {amountLabel}
            </th>
            <th className="px-1 py-1.5 font-medium sm:px-2 sm:py-2">
              {winnersLabel}
            </th>
            {hasEurope ? (
              <th className="px-1 py-1.5 font-medium sm:px-2 sm:py-2">
                {winnersEuropeLabel}
              </th>
            ) : null}
            {hasEplus ? (
              <th className="w-[22%] px-1 py-1.5 font-medium sm:px-2 sm:py-2">
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
                  {formatPrizeTierAmount(tier, locale, annuityNote) || "—"}
                </td>
                <td className="px-1 py-1.5 text-[var(--muted)] sm:px-2 sm:py-2">
                  {formatCount(tier.winners, locale)}
                </td>
                {hasEurope ? (
                  <td className="px-1 py-1.5 text-[var(--muted)] sm:px-2 sm:py-2">
                    {tier.winnersEurope != null
                      ? formatCount(tier.winnersEurope, locale)
                      : "—"}
                  </td>
                ) : null}
                {hasEplus ? (
                  <td className="px-1 py-1.5 text-[var(--heading)] sm:px-2 sm:py-2">
                    {ep
                      ? formatPrizeTierAmount(ep, locale, annuityNote) || "—"
                      : "—"}
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
  winnersEuropeLabel,
  heading = "h2",
  annuityNote,
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
  winnersEuropeLabel?: string;
  heading?: "h2" | "h3";
  annuityNote?: (vars: { amount: string; years: number }) => string;
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
          winnersEuropeLabel={winnersEuropeLabel}
          extraLabel={extraTitle}
          annuityNote={annuityNote}
        />
      </div>
      {extraTiers && extraTiers.length > 0 && extraHelp?.trim() ? (
        <p className="mt-3 text-sm text-[var(--muted)]">{extraHelp}</p>
      ) : null}
    </div>
  );
}
