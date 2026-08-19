"use client";

import { useState } from "react";
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

function normalizeRank(r: string) {
  return r.replace(/^.*?(\d)/, "$1").trim();
}

function hasEtoilePlusData(
  tiers: EuroMillionsPrizeTier[],
  extraTiers?: EuroMillionsPrizeTier[],
) {
  const eplusMap = new Map(
    (extraTiers || []).map((t) => [normalizeRank(t.rank), t]),
  );
  return (
    eplusMap.size > 0 &&
    tiers.some((t) => eplusMap.has(normalizeRank(t.rank))) &&
    (extraTiers || []).some((t) => t.amountEur > 0)
  );
}

function Table({
  tiers,
  extraTiers,
  locale,
  rankLabel,
  amountLabel,
  winnersLabel,
  extraLabel,
  showExtraColumn,
}: {
  tiers: EuroMillionsPrizeTier[];
  extraTiers?: EuroMillionsPrizeTier[];
  locale: string;
  rankLabel: string;
  amountLabel: string;
  winnersLabel: string;
  extraLabel?: string;
  showExtraColumn: boolean;
}) {
  const eplusMap = new Map(
    (extraTiers || []).map((t) => [normalizeRank(t.rank), t]),
  );
  const showEplus = showExtraColumn && hasEtoilePlusData(tiers, extraTiers);
  return (
    <div className="overflow-x-auto border border-[var(--line)]">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
          <tr>
            <th className="px-3 py-2 font-medium">{rankLabel}</th>
            <th className="px-3 py-2 font-medium">{amountLabel}</th>
            <th className="px-3 py-2 font-medium">{winnersLabel}</th>
            {showEplus ? (
              <th className="px-3 py-2 font-medium">{extraLabel}</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => {
            const ep = eplusMap.get(normalizeRank(tier.rank));
            return (
              <tr key={`${tier.rank}-${i}`} className="border-t border-[var(--line)]">
                <td className="px-3 py-2 font-semibold text-[var(--heading)]">
                  {tier.rank}
                </td>
                <td className="px-3 py-2 text-[var(--heading)]">
                  {formatMoney(tier.amountEur, locale) || "—"}
                </td>
                <td className="px-3 py-2 text-[var(--muted)]">{tier.winners}</td>
                {showEplus ? (
                  <td className="px-3 py-2 text-[var(--heading)]">
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
  extraShowLabel,
  extraHideLabel,
  extraHiddenByDefault = false,
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
  extraShowLabel: string;
  extraHideLabel: string;
  extraHiddenByDefault?: boolean;
  rankLabel: string;
  amountLabel: string;
  winnersLabel: string;
  heading?: "h2" | "h3";
}) {
  const [showExtra, setShowExtra] = useState(!extraHiddenByDefault);
  if (!tiers?.length) return null;
  const Heading = heading;
  const canToggleEplus = hasEtoilePlusData(tiers, extraTiers);
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <Heading className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
          {title}
        </Heading>
        {canToggleEplus ? (
          <button
            type="button"
            onClick={() => setShowExtra((open) => !open)}
            className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--accent)] hover:underline"
            aria-expanded={showExtra}
          >
            {showExtra ? extraHideLabel : extraShowLabel}
          </button>
        ) : null}
      </div>
      <div className="mt-4">
        <Table
          tiers={tiers}
          extraTiers={extraTiers}
          locale={locale}
          rankLabel={rankLabel}
          amountLabel={amountLabel}
          winnersLabel={winnersLabel}
          extraLabel={extraTitle}
          showExtraColumn={showExtra}
        />
      </div>
      {showExtra && extraTiers && extraTiers.length > 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">{extraHelp}</p>
      ) : null}
    </div>
  );
}
