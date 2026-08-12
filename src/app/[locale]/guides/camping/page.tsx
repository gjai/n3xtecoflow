import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AdSenseSlot } from "@/components/AdSenseSlot";
import { AmazonButton } from "@/components/AmazonButton";
import { AMAZON_QUERIES, buildAmazonSearchUrl } from "@/lib/amazon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guideCamping" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function CampingGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guideCamping");
  const a = await getTranslations("amazon");

  return (
    <article className="mx-auto max-w-3xl px-5 pb-16 pt-28 md:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">{t("subtitle")}</p>
      <div className="mt-10 space-y-6 leading-relaxed text-[var(--fog)]">
        <p>{t("body1")}</p>
        <p>{t("body2")}</p>
      </div>
      <div className="mt-10">
        <AmazonButton
          href={buildAmazonSearchUrl(AMAZON_QUERIES.camping)}
          label={t("ctaAmazon")}
          badge={a("badge")}
        />
      </div>
      <div className="mt-12">
        <AdSenseSlot label={t("adsLabel")} />
      </div>
    </article>
  );
}
