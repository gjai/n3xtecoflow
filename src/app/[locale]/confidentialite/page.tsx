import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacyTitle") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <article className="mx-auto max-w-3xl px-5 pb-16 pt-28 md:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold">
        {t("privacyTitle")}
      </h1>
      <div className="mt-8 space-y-4 leading-relaxed text-[var(--fog)]">
        <p>{t("privacyBody")}</p>
        <p>{t("adsense")}</p>
        <p>{t("privacyConsent")}</p>
        <p>
          {t("contactViaForm")}{" "}
          <Link
            href="/contact"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {t("contactLink")}
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
