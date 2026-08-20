import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { issueContactGuard } from "@/lib/http/form-guard";
import { siteLocaleAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: await siteLocaleAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <article className="mx-auto max-w-2xl px-5 pb-16 pt-10 md:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">{t("subtitle")}</p>
      <ContactForm guard={issueContactGuard()} />
    </article>
  );
}
