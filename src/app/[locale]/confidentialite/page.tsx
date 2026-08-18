import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { siteLocaleAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("privacyTitle"),
    description: t("hubMeta"),
    alternates: await siteLocaleAlternates(locale, "/confidentialite"),
  };
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <article className="mx-auto max-w-3xl px-5 pb-16 pt-10 md:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)]">
        {t("privacyTitle")}
      </h1>
      <p className="mt-4 leading-relaxed text-[var(--fog)]">{t("privacyBody")}</p>
      <p className="mt-3 leading-relaxed text-[var(--fog)]">{t("adsense")}</p>
      <p className="mt-3 leading-relaxed text-[var(--fog)]">
        {t("privacyConsent")}
      </p>
      <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
        {t("privacyBasisTitle")}
      </h2>
      <p className="mt-4 leading-relaxed text-[var(--fog)]">
        {t("privacyBasisBody")}
      </p>
      <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
        {t("privacyRightsTitle")}
      </h2>
      <p className="mt-4 leading-relaxed text-[var(--fog)]">
        {t("privacyRightsBody")}
      </p>
      <p className="mt-6 text-sm text-[var(--muted)]">
        <Link
          href="/suppression-donnees"
          className="text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {t("deletionTitle")}
        </Link>
        {" · "}
        <Link
          href="/mentions-legales"
          className="text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {t("hubTitle")}
        </Link>
        {" · "}
        <Link
          href="/contact"
          className="text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {t("contactLink")}
        </Link>
      </p>
    </article>
  );
}
