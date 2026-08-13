"use client";

import { useTranslations } from "next-intl";
import { usesEnglishFallback } from "@/i18n/locales";
import { useTheme, type ThemeMode } from "./ThemeProvider";

const FALLBACK: Record<ThemeMode, { fr: string; en: string }> = {
  system: { fr: "Auto", en: "Auto" },
  light: { fr: "Clair", en: "Light" },
  dark: { fr: "Sombre", en: "Dark" },
};

export function ThemeToggle({ locale }: { locale?: string }) {
  const t = useTranslations("theme");
  const { mode, cycle } = useTheme();
  const short = t.has(mode)
    ? t(mode)
    : usesEnglishFallback(locale || "fr")
      ? FALLBACK[mode].en
      : FALLBACK[mode].fr;

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--fg)] transition hover:border-[var(--accent)]"
      aria-label={t("aria")}
      title={t("title", { mode: short })}
    >
      <ThemeIcon mode={mode} />
      <span className="hidden sm:inline">{short}</span>
    </button>
  );
}

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === "light") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (mode === "dark") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M20 13.5A7.5 7.5 0 1 1 10.5 4 6 6 0 0 0 20 13.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 4a8 8 0 0 1 0 16" fill="currentColor" opacity="0.35" />
    </svg>
  );
}
