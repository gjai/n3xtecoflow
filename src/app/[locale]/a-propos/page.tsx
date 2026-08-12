import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { JsonLd, organizationJsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("meta"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com";

  return (
    <article className="mx-auto max-w-3xl px-5 pb-16 pt-28 md:px-8">
      <JsonLd
        data={{
          ...organizationJsonLd(siteUrl),
          "@type": ["Organization", "NewsMediaOrganization"],
          url: `${siteUrl}/${locale}/a-propos`,
          publishingPrinciples: `${siteUrl}/${locale}/a-propos`,
        }}
      />

      <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[var(--fog)]">
        {t("lead")}
      </p>

      <div className="mt-10 space-y-8 leading-relaxed text-[var(--fog)]">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("missionTitle")}
          </h2>
          <p className="mt-3">{t("missionBody")}</p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("methodTitle")}
          </h2>
          <p className="mt-3">{t("methodBody")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>{t("method1")}</li>
            <li>{t("method2")}</li>
            <li>{t("method3")}</li>
            <li>{t("method4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("independenceTitle")}
          </h2>
          <p className="mt-3">{t("independenceBody")}</p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("monetizationTitle")}
          </h2>
          <p className="mt-3">{t("monetizationBody")}</p>
          <p className="mt-3">
            {t("seeAlso")}{" "}
            <Link
              href="/affiliation"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("affiliateLink")}
            </Link>
            {" · "}
            <Link
              href="/cookies"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("cookiesLink")}
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("contactTitle")}
          </h2>
          <p className="mt-3">
            {t("contactBody")}{" "}
            <Link
              href="/contact"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("contactLink")}
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
