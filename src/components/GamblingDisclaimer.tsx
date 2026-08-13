"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveAffiliateOffers } from "@/lib/affiliates";
import { siteNeedsGamblingDisclaimer } from "@/sites/features";
import { AffiliateLinkedText } from "./AffiliateLinkedText";
import { useSite } from "./SiteProvider";

/** Site-wide 18+ / responsible gambling / affiliate strip (casinos-crypto). */
export function GamblingDisclaimer({
  compact = false,
}: {
  compact?: boolean;
}) {
  const site = useSite();
  const locale = useLocale();
  const t = useTranslations("responsible");

  if (!siteNeedsGamblingDisclaimer(site)) return null;

  const helpUrl = t("helpUrl");
  const showFrHelp = locale === "fr" || t("showHelp") === "1";
  const offers = resolveAffiliateOffers(site);
  const L = ({ text }: { text: string }) => (
    <AffiliateLinkedText text={text} offers={offers} />
  );

  if (compact) {
    return (
      <p className="text-xs leading-relaxed text-[var(--muted)]">
        <span className="mr-2 inline-flex min-h-6 min-w-8 items-center justify-center border border-[var(--accent)] px-1.5 font-semibold text-[var(--accent)]">
          {t("badge18")}
        </span>
        <L text={t("bodyShort")} />{" "}
        <L text={t("affiliateShort")} />{" "}
        {showFrHelp ? (
          <>
            {t("helpLabel")}{" "}
            <a
              href={`tel:${t("helpPhone").replace(/\s/g, "")}`}
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("helpPhone")}
            </a>
            {" · "}
            <a
              href={helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("helpLink")}
            </a>
          </>
        ) : null}
      </p>
    );
  }

  return (
    <aside
      className="border-t border-[var(--line)] bg-[var(--surface)] px-5 py-6 md:px-8"
      aria-label={t("title")}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-start md:gap-8">
        <p className="inline-flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[var(--accent)] font-[family-name:var(--font-display)] text-lg font-bold text-[var(--accent)]">
          {t("badge18")}
        </p>
        <div className="min-w-0 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          <p className="font-semibold text-[var(--heading)]">{t("title")}</p>
          <p>
            <L text={t("body")} />
          </p>
          <p>
            <L text={t("affiliate")} />
          </p>
          {showFrHelp ? (
            <p>
              {t("helpLabel")}{" "}
              <a
                href={`tel:${t("helpPhone").replace(/\s/g, "")}`}
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {t("helpPhone")}
              </a>
              {" · "}
              <a
                href={helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {t("helpLink")}
              </a>
            </p>
          ) : null}
          <p>
            <Link
              href="/mentions-legales#affiliation"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("legalLink")}
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
