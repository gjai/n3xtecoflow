"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AmazonButton } from "@/components/AmazonButton";
import { buildAmazonSearchUrl } from "@/lib/amazon";
import type { ArticleSection } from "@/data/articles";

export function ArticleBody({
  sections,
  amazonQuery,
  amazonLabel,
  amazonBadge,
}: {
  sections: ArticleSection[];
  amazonQuery?: string;
  amazonLabel?: string;
  amazonBadge?: string;
}) {
  const t = useTranslations("amazon");
  const tHome = useTranslations("home");
  const locale = useLocale();
  const catalogLabel =
    locale === "en" ? "Browse the product catalog" : "Voir le catalogue produits";

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 pb-16 pt-10 text-base leading-relaxed text-[var(--fog)] md:px-8">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
            {section.heading}
          </h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 48)} className="mt-3">
              {p}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {amazonQuery && amazonLabel && amazonBadge ? (
        <div className="space-y-3">
          <AffiliateDisclosure compact />
          <AmazonButton
            href={buildAmazonSearchUrl(amazonQuery)}
            label={amazonLabel}
            badge={amazonBadge}
          />
        </div>
      ) : null}
      <p className="text-sm text-[var(--muted)]">
        <Link href="/produits" className="text-[var(--accent)] hover:underline">
          {catalogLabel}
        </Link>
        {" · "}
        <Link href="/guides" className="text-[var(--accent)] hover:underline">
          {tHome("ctaPrimary")}
        </Link>
      </p>
      {!amazonQuery ? (
        <p className="text-xs text-[var(--muted)]">{t("disclosureShort")}</p>
      ) : null}
    </div>
  );
}
