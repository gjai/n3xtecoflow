"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

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
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
