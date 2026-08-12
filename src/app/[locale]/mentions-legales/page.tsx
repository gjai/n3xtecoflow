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
  return { title: t("mentionsTitle") };
}

export default async function MentionsPage({
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
        {t("mentionsTitle")}
      </h1>
      <div className="mt-8 space-y-8 leading-relaxed text-[var(--fog)]">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--heading)]">
            {t("publisherTitle")}
          </h2>
          <p className="mt-3">{t("independent")}</p>
          <p className="mt-2">{t("siren")}</p>
          <p className="mt-2">
            <Link
              href="/a-propos"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {locale === "en" ? "About this editorial site" : "À propos de ce site éditorial"}
            </Link>
          </p>
          <p className="mt-2">
            {t("contactViaForm")}{" "}
            <Link
              href="/contact"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("contactLink")}
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--heading)]">
            {t("hostTitle")}
          </h2>
          <p className="mt-3 whitespace-pre-line">{t("hostBody")}</p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--heading)]">
            {t("affiliateTitle")}
          </h2>
          <p className="mt-3">{t("amazon")}</p>
          <p className="mt-2">{t("adsense")}</p>
        </section>
      </div>
    </article>
  );
}
