"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("amazon");

  if (compact) {
    return (
      <p className="text-xs text-[var(--muted)]">
        {t("disclosureShort")}{" "}
        <Link href="/mentions-legales#affiliation" className="underline-offset-2 hover:underline">
          {t("disclosureLink")}
        </Link>
      </p>
    );
  }

  return (
    <aside className="border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
      {t("disclosure")}{" "}
      <Link
        href="/mentions-legales#affiliation"
        className="text-[var(--accent)] underline-offset-2 hover:underline"
      >
        {t("disclosureLink")}
      </Link>
    </aside>
  );
}
