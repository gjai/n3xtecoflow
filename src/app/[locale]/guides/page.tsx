import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { AdSenseSlot } from "@/components/AdSenseSlot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guides" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");

  const cards = [
    { href: "/guides/achat", title: t("buyersTitle"), text: t("buyersText") },
    { href: "/guides/camping", title: t("campingTitle"), text: t("campingText") },
    { href: "/powerstream", title: t("backupTitle"), text: t("backupText") },
  ];

  return (
    <div className="pt-24">
      <header className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">{t("subtitle")}</p>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-3 md:px-8">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)]"
          >
            <h2 className="text-xl font-semibold text-white">{card.title}</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">{card.text}</p>
            <span className="mt-6 inline-block text-sm font-semibold text-[var(--accent)]">
              {t("cta")} →
            </span>
          </Link>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <AdSenseSlot label={t("adsLabel")} />
      </div>
    </div>
  );
}
