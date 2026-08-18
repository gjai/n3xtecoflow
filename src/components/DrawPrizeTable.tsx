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
  locale,
  rankLabel,
  amountLabel,
  winnersLabel,
}: {
  tiers: EuroMillionsPrizeTier[];
  locale: string;
  rankLabel: string;
  amountLabel: string;
  winnersLabel: string;
}) {
  return (
    <div className="overflow-x-auto border border-[var(--line)]">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
          <tr>
            <th className="px-3 py-2 font-medium">{rankLabel}</th>
            <th className="px-3 py-2 font-medium">{amountLabel}</th>
            <th className="px-3 py-2 font-medium">{winnersLabel}</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => (
            <tr key={`${tier.rank}-${i}`} className="border-t border-[var(--line)]">
              <td className="px-3 py-2 font-semibold text-[var(--heading)]">
                {tier.rank}
              </td>
              <td className="px-3 py-2 text-[var(--heading)]">
                {formatMoney(tier.amountEur, locale) || "—"}
              </td>
              <td className="px-3 py-2 text-[var(--muted)]">{tier.winners}</td>
            </tr>
          ))}
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
  extraHelp: string;
  rankLabel: string;
  amountLabel: string;
  winnersLabel: string;
  heading?: "h2" | "h3";
}) {
  if (!tiers?.length) return null;
  const Heading = heading;
  return (
    <div className="mt-8">
      <Heading className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
        {title}
      </Heading>
      <div className="mt-4">
        <Table
          tiers={tiers}
          locale={locale}
          rankLabel={rankLabel}
          amountLabel={amountLabel}
          winnersLabel={winnersLabel}
        />
      </div>
      {extraTiers && extraTiers.length > 0 ? (
        <>
          <Heading className="mt-8 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
            {extraTitle}
          </Heading>
          <p className="mt-2 text-sm text-[var(--muted)]">{extraHelp}</p>
          <div className="mt-4">
            <Table
              tiers={extraTiers}
              locale={locale}
              rankLabel={rankLabel}
              amountLabel={amountLabel}
              winnersLabel={winnersLabel}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
