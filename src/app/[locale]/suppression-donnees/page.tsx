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
    title: t("deletionTitle"),
    description: t("deletionMeta"),
    alternates: await siteLocaleAlternates(locale, "/suppression-donnees"),
  };
}

export default async function SuppressionDonneesPage({
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
        {t("deletionTitle")}
      </h1>
      <p className="mt-4 leading-relaxed text-[var(--fog)]">{t("deletionIntro")}</p>
      <p className="mt-3 leading-relaxed text-[var(--fog)]">{t("deletionHow")}</p>
      <p className="mt-3 leading-relaxed text-[var(--fog)]">
        {t("deletionFacebook")}
      </p>
      <p className="mt-8">
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
        >
          {t("contactLink")}
        </Link>
      </p>
      <p className="mt-8 text-sm text-[var(--muted)]">
        <Link
          href="/confidentialite"
          className="text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {t("privacyTitle")}
        </Link>
        {" · "}
        <Link
          href="/mentions-legales"
          className="text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {t("hubTitle")}
        </Link>
      </p>
    </article>
  );
}
