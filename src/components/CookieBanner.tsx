"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsent } from "./ConsentProvider";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const {
    consent,
    acceptAll,
    rejectAds,
    preferencesOpen,
    setPreferencesOpen,
  } = useConsent();

  if (consent.decided && !preferencesOpen) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--ink)]/95 p-4 text-[var(--fog)] backdrop-blur md:p-6"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2
            id="cookie-title"
            className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--heading)]"
          >
            {t("title")}
          </h2>
          <p id="cookie-desc" className="mt-2 text-sm text-[var(--muted)]">
            {t("body")}{" "}
            <Link
              href="/cookies"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("privacyLink")}
            </Link>
            .
          </p>
          {preferencesOpen ? (
            <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
              <li>{t("necessary")}</li>
              <li>{t("advertising")}</li>
            </ul>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={rejectAds}
            className="border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
          >
            {t("reject")}
          </button>
          {!preferencesOpen ? (
            <button
              type="button"
              onClick={() => setPreferencesOpen(true)}
              className="border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
            >
              {t("customize")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={acceptAll}
            className="bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)] transition hover:brightness-110"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
