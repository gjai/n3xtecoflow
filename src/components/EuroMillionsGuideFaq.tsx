import { getTranslations } from "next-intl/server";
import { JsonLd, faqJsonLd } from "@/components/JsonLd";
import { getGuideFaq } from "@/data/euromillions-guide-faq";

export async function EuroMillionsGuideFaq({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const items = getGuideFaq(slug, locale);
  if (items.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "guides" });
  return (
    <>
      <JsonLd data={faqJsonLd(items)} />
      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
          {t("faqTitle")}
        </h2>
        <dl className="mt-6 space-y-5">
          {items.map((item) => (
            <div key={item.question} className="border-b border-[var(--line)] pb-5">
              <dt className="font-semibold text-[var(--heading)]">{item.question}</dt>
              <dd className="mt-2 text-sm text-[var(--muted)]">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
