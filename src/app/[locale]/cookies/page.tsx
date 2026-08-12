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
  return {
    title: t("cookiesTitle"),
    description: t("cookiesMeta"),
  };
}

export default async function CookiesPage({
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
        {t("cookiesTitle")}
      </h1>
      <div className="mt-8 space-y-4 leading-relaxed text-[var(--fog)]">
        <p>{t("cookiesIntro")}</p>
        <h2 className="pt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("cookiesNecessaryTitle")}
        </h2>
        <p>{t("cookiesNecessaryBody")}</p>
        <h2 className="pt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("cookiesAdsTitle")}
        </h2>
        <p>{t("cookiesAdsBody")}</p>
        <p>{t("adsense")}</p>
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
