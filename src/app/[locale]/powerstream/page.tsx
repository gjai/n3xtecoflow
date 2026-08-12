import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { AdSenseSlot } from "@/components/AdSenseSlot";
import { AmazonButton } from "@/components/AmazonButton";
import { AMAZON_QUERIES, buildAmazonSearchUrl } from "@/lib/amazon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "powerstream" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function PowerStreamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("powerstream");
  const a = await getTranslations("amazon");

  return (
    <article className="pt-24">
      <header className="hero-grid border-b border-[var(--line)]">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)]">{t("subtitle")}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_280px] md:px-8">
        <div className="space-y-10 text-base leading-relaxed text-[var(--fog)]">
          <p>{t("intro")}</p>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-white">
              {t("whatTitle")}
            </h2>
            <p className="mt-3">{t("whatText")}</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-white">
              {t("forWhoTitle")}
            </h2>
            <p className="mt-3">{t("forWhoText")}</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-white">
              {t("checklistTitle")}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>{t("check1")}</li>
              <li>{t("check2")}</li>
              <li>{t("check3")}</li>
              <li>{t("check4")}</li>
            </ul>
          </section>
          <AmazonButton
            href={buildAmazonSearchUrl(AMAZON_QUERIES.powerstream)}
            label={t("ctaAmazon")}
            badge={a("badge")}
          />
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-white">
              {t("relatedTitle")}
            </h2>
            <Link
              href="/guides/achat"
              className="mt-3 inline-block text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {t("relatedGuide")}
            </Link>
          </section>
        </div>
        <aside>
          <AdSenseSlot label={t("adsLabel")} className="sticky top-8 min-h-[250px]" />
        </aside>
      </div>
    </article>
  );
}
