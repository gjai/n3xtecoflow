import { intlLocale } from "@/i18n/locales";
import type { EuroMillionsPrizeTier } from "@/lib/euromillions/types";

export function formatMoneyEur(
  amount: number | null | undefined,
  locale: string,
): string | null {
  if (amount == null || !Number.isFinite(amount)) return null;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount < 10 ? 2 : 0,
  }).format(amount);
}

export function formatPrizeTierAmount(
  tier: Pick<
    EuroMillionsPrizeTier,
    "amountEur" | "annuityMonthlyEur" | "annuityMonths"
  >,
  locale: string,
  annuityNote?: (vars: { amount: string; years: number }) => string,
): string | null {
  if (tier.amountEur > 0) return formatMoneyEur(tier.amountEur, locale);
  if (tier.annuityMonthlyEur) {
    const monthly = formatMoneyEur(tier.annuityMonthlyEur, locale);
    if (!monthly) return null;
    const years = Math.max(
      1,
      Math.round((tier.annuityMonths || 12) / 12),
    );
    if (annuityNote) return annuityNote({ amount: monthly, years });
    return `${monthly} / ${years}`;
  }
  if (tier.amountEur === 0) return formatMoneyEur(0, locale);
  return null;
}
