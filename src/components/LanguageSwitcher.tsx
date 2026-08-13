"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_LABELS, type AppLocale } from "@/i18n/locales";
import type { Locale } from "@/i18n/routing";
import { siteLocales } from "@/sites/features";
import { useSite } from "./SiteProvider";

export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const site = useSite();
  const options = siteLocales(site);

  return (
    <label className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
      <span className="sr-only">{label}</span>
      <select
        className="border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[var(--fg)] outline-none"
        value={locale}
        onChange={(e) => {
          router.replace(pathname, { locale: e.target.value as Locale });
        }}
        aria-label={label}
      >
        {options.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code as AppLocale] || code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
