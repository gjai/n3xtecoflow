import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AmazonButton } from "@/components/AmazonButton";
import { AMAZON_QUERIES, buildAmazonSearchUrl } from "@/lib/amazon";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "powerstream" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates(locale, "/powerstream"),
  };
}

export default async function PowerStreamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("powerstream");
  const isEn = locale === "en";

  return (
    <article>
      <header className="hero-grid border-b border-[var(--line)]">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">{t("subtitle")}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-10 px-5 py-14 text-base leading-relaxed text-[var(--fog)] md:px-8">
        <p>{t("intro")}</p>
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
            {t("whatTitle")}
          </h2>
          <p className="mt-3">{t("whatText")}</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
            {t("forWhoTitle")}
          </h2>
          <p className="mt-3">{t("forWhoText")}</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
            {t("checklistTitle")}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>{t("check1")}</li>
            <li>{t("check2")}</li>
            <li>{t("check3")}</li>
            <li>{t("check4")}</li>
          </ul>
        </section>
        <div className="space-y-3">
          <AmazonButton
            href={buildAmazonSearchUrl(AMAZON_QUERIES.powerstream)}
            label={t("ctaAmazon")}
          />
          <AffiliateDisclosure compact />
        </div>
        <section className="space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
            {t("relatedTitle")}
          </h2>
          <Link
            href="/produits/powerstream/powerstream"
            className="block text-[var(--accent)] underline-offset-4 hover:underline"
          >
            {isEn ? "PowerStream product sheet" : "Fiche technique PowerStream"}
          </Link>
          <Link
            href="/comparatifs/powerstream-vs-station"
            className="block text-[var(--accent)] underline-offset-4 hover:underline"
          >
            {t("relatedGuide")}
          </Link>
          <Link
            href="/guides/solaire-portable"
            className="block text-[var(--accent)] underline-offset-4 hover:underline"
          >
            {isEn ? "Portable solar guide" : "Guide solaire portable"}
          </Link>
        </section>
      </div>
    </article>
  );
}
