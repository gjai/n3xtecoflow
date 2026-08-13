"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveAffiliateOffers } from "@/lib/affiliates";
import { AffiliateLinkedText } from "./AffiliateLinkedText";
import { useSite } from "./SiteProvider";

export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("amazon");
  const site = useSite();
  const offers =
    site.id === "casinos-crypto" ? resolveAffiliateOffers(site) : null;
  const text = (value: string) =>
    offers?.length ? (
      <AffiliateLinkedText text={value} offers={offers} />
    ) : (
      value
    );

  if (compact) {
    return (
      <p className="text-xs text-[var(--muted)]">
        {text(t("disclosureShort"))}{" "}
        <Link href="/mentions-legales#affiliation" className="underline-offset-2 hover:underline">
          {t("disclosureLink")}
        </Link>
      </p>
    );
  }

  return (
    <aside className="border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
      {text(t("disclosure"))}{" "}
      <Link
        href="/mentions-legales#affiliation"
        className="text-[var(--accent)] underline-offset-2 hover:underline"
      >
        {t("disclosureLink")}
      </Link>
    </aside>
  );
}
