"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AffiliateLinkedText } from "@/components/AffiliateLinkedText";
import { AmazonButton } from "@/components/AmazonButton";
import type { AffiliateOffer } from "@/lib/affiliates";
import { buildAmazonSearchUrl } from "@/lib/amazon";
import type { ArticleSection } from "@/data/articles";
import { usesEnglishFallback } from "@/i18n/locales";

export type ArticleProductCard = {
  slug: string;
  name: string;
  href: string;
  imageSrc: string;
  tagline: string;
};

export function ArticleBody({
  sections,
  amazonQuery,
  amazonLabel,
  productCards,
  hideCatalogLink,
  footerActions,
  affiliateKeywordOffers,
}: {
  sections: ArticleSection[];
  amazonQuery?: string;
  amazonLabel?: string;
  /** Packshots résolus côté serveur (clés = product slug) */
  productCards?: Record<string, ArticleProductCard>;
  hideCatalogLink?: boolean;
  footerActions?: ReactNode;
  /** Casino: auto-lien Stake / VPN / crypto dans le corps. */
  affiliateKeywordOffers?: AffiliateOffer[];
}) {
  const t = useTranslations("amazon");
  const tHome = useTranslations("home");
  const locale = useLocale();
  const catalogLabel =
    locale === "en" ? "Browse the product catalog" : "Voir le catalogue produits";
  const ficheLabel = locale === "en" ? "Product sheet →" : "Fiche produit →";
  const linkify = (text: string) =>
    affiliateKeywordOffers?.length ? (
      <AffiliateLinkedText text={text} offers={affiliateKeywordOffers} />
    ) : (
      text
    );

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 pb-16 pt-10 text-base leading-relaxed text-[var(--fog)] md:px-8">
      {sections.map((section) => {
        const cards = (section.productSlugs || [])
          .map((slug) => productCards?.[slug])
          .filter(Boolean) as ArticleProductCard[];

        const sectionImage = section.imageSrc
          ? {
              src: section.imageSrc,
              alt: usesEnglishFallback(locale)
                ? section.imageAltEn ||
                  section.imageAltFr ||
                  section.heading
                : section.imageAltFr || section.heading,
              credit: section.imageCredit,
            }
          : null;

        return (
          <section key={section.heading}>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
              {linkify(section.heading)}
            </h2>
            {sectionImage ? (
              <figure className="mt-5 overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={sectionImage.src}
                    alt={sectionImage.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
                {sectionImage.credit ? (
                  <figcaption className="px-3 py-2 text-xs text-[var(--muted)]">
                    {sectionImage.credit}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 48)} className="mt-3">
                {linkify(p)}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {section.bullets.map((b) => (
                  <li key={b}>{linkify(b)}</li>
                ))}
              </ul>
            ) : null}
            {cards.length > 0 ? (
              <div
                className={`mt-6 grid gap-4 ${
                  cards.length === 1
                    ? "grid-cols-1 sm:max-w-xs"
                    : cards.length === 2
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {cards.map((card) => (
                  <Link
                    key={card.slug}
                    href={card.href}
                    className="group overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
                  >
                    <div className="relative aspect-square packshot-well">
                      <Image
                        src={card.imageSrc}
                        alt={card.name}
                        fill
                        data-packshot-img=""
                        className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 50vw, 200px"
                      />
                    </div>
                    <div className="border-t border-[var(--line)] p-3">
                      <p className="text-sm font-semibold text-[var(--heading)] group-hover:text-[var(--accent)]">
                        {card.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                        {card.tagline}
                      </p>
                      <p className="mt-2 text-xs font-medium text-[var(--accent)]">
                        {ficheLabel}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
      {footerActions ? (
        <div className="space-y-3">{footerActions}</div>
      ) : amazonQuery && amazonLabel ? (
        <div className="space-y-3">
          <AmazonButton
            href={buildAmazonSearchUrl(amazonQuery)}
            label={amazonLabel}
          />
          <AffiliateDisclosure compact />
        </div>
      ) : null}
      <p className="text-sm text-[var(--muted)]">
        {!hideCatalogLink ? (
          <>
            <Link
              href="/produits"
              className="text-[var(--accent)] hover:underline"
            >
              {catalogLabel}
            </Link>
            {" · "}
          </>
        ) : null}
        <Link href="/guides" className="text-[var(--accent)] hover:underline">
          {tHome("ctaPrimary")}
        </Link>
      </p>
      {!amazonQuery && !footerActions ? (
        <p className="text-xs text-[var(--muted)]">{t("disclosureShort")}</p>
      ) : null}
    </div>
  );
}
