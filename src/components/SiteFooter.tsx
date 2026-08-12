"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CookieSettingsButton } from "./CookieSettingsButton";

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)] text-[var(--fog)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg text-[var(--heading)]">
            EcoFlow Stream
          </p>
          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
            {t("independent")}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/a-propos" className="hover:text-[var(--heading)]">
            {t("about")}
          </Link>
          <Link href="/mentions-legales" className="hover:text-[var(--heading)]">
            {t("mentions")}
          </Link>
          <Link href="/confidentialite" className="hover:text-[var(--heading)]">
            {t("privacy")}
          </Link>
          <Link href="/cookies" className="hover:text-[var(--heading)]">
            {t("cookies")}
          </Link>
          <Link href="/affiliation" className="hover:text-[var(--heading)]">
            {t("affiliate")}
          </Link>
          <Link href="/contact" className="hover:text-[var(--heading)]">
            {t("contact")}
          </Link>
          <CookieSettingsButton label={t("manageCookies")} />
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-4 text-center text-xs text-[var(--muted)] md:px-8">
        {t("rights", { year })}
      </div>
    </footer>
  );
}
