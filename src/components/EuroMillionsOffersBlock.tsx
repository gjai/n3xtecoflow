import { getTranslations } from "next-intl/server";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";
import { AmazonButton } from "@/components/AmazonButton";
import {
  affiliateOffer,
} from "@/lib/affiliates";
import {
  amazonProductImageUrl,
  buildAmazonProductUrl,
} from "@/lib/amazon";
import { formatEuro } from "@/lib/money";
import { siteAllowsAmazon } from "@/sites/features";
import type { SiteConfig } from "@/sites/types";

type AmazonOfferCard = {
  id: string;
  asin: string;
  imageSrc?: string;
  labelFr: string;
  labelEn: string;
  blurbFr: string;
  blurbEn: string;
  /** Prix Amazon.fr relevé éditorialement (fallback UI, pas Creators). */
  indicativePriceEur: number;
};

export const EUROMILLIONS_AMAZON_OFFERS: readonly AmazonOfferCard[] = [
  {
    id: "pochette",
    asin: "B0F8J7R2J1",
    imageSrc: "/images/products/euromillions/pochette-tickets.svg",
    labelFr: "Pochette protège-tickets",
    labelEn: "Ticket sleeve",
    blurbFr: "Étui pour tickets Loto / EuroMillions.",
    blurbEn: "Sleeve for Loto / EuroMillions tickets.",
    indicativePriceEur: 7.9,
  },
  {
    id: "carnet",
    asin: "B0BPR6YM8P",
    imageSrc: "/images/products/euromillions/carnet-euromillions.svg",
    labelFr: "Carnet EuroMillions",
    labelEn: "EuroMillions notebook",
    blurbFr: "Noter vos grilles — sans illusion de méthode.",
    blurbEn: "Track your grids — with no promised system.",
    indicativePriceEur: 21.6,
  },
  {
    id: "journal",
    asin: "B0FJ7H6QL7",
    imageSrc: "/images/products/euromillions/journal-grille.svg",
    labelFr: "Journal « Et si ma grille… »",
    labelEn: "“What if my grid…” journal",
    blurbFr: "Cahier loisir pour joueurs occasionnels.",
    blurbEn: "Leisure journal for casual players.",
    indicativePriceEur: 12.9,
  },
];

export async function EuroMillionsOffersBlock({
  site,
  locale,
  variant = "home",
}: {
  site: SiteConfig;
  locale: string;
  variant?: "home" | "compact" | "guide-carnet" | "guide-pochette";
}) {
  const t = await getTranslations({ locale, namespace: "offersBlock" });
  const a = await getTranslations({ locale, namespace: "amazon" });
  const isEn = locale === "en";
  const allowAmazon = siteAllowsAmazon(site);
  const fdj = affiliateOffer(site, "fdj");

  const amazonIds: string[] =
    variant === "guide-carnet"
      ? ["carnet", "journal"]
      : variant === "guide-pochette"
        ? ["pochette"]
        : variant === "compact"
          ? ["pochette", "carnet"]
          : ["pochette", "carnet", "journal"];

  const amazonItems = EUROMILLIONS_AMAZON_OFFERS.filter((o) =>
    amazonIds.includes(o.id),
  );

  if (!allowAmazon && !fdj) return null;

  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("title")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{t("subtitle")}</p>

        {allowAmazon ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {amazonItems.map((item) => (
              <div
                key={item.asin}
                className="border border-[var(--line)] bg-[var(--bg)] p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageSrc || amazonProductImageUrl(item.asin, 300)}
                  alt={isEn ? item.labelEn : item.labelFr}
                  className="mx-auto h-28 w-auto object-contain"
                  loading="lazy"
                />
                <h3 className="mt-3 text-sm font-semibold text-[var(--heading)]">
                  {isEn ? item.labelEn : item.labelFr}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {isEn ? item.blurbEn : item.blurbFr}
                </p>
                <div className="mt-4">
                  <AmazonButton
                    href={buildAmazonProductUrl(item.asin)}
                    label={a("cta")}
                    badge={a("disclosureShort")}
                    priceDisplay={formatEuro(item.indicativePriceEur)}
                    priceHint={t("priceHint")}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {fdj ? (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AffiliateOfferButton href={fdj.href} label={isEn ? fdj.labelEn : fdj.labelFr} />
            <p className="max-w-md text-xs text-[var(--muted)]">{t("fdjNote")}</p>
          </div>
        ) : null}

        {allowAmazon ? (
          <div className="mt-6">
            <AffiliateDisclosure />
          </div>
        ) : null}
      </div>
    </section>
  );
}
