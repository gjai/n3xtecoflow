import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CopyBlock } from "@/components/CopyBlock";
import { GameToolsNav } from "@/components/EuroMillionsNav";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { siteLocaleAlternates } from "@/lib/seo";
import { getCurrentSite } from "@/sites/server";
import { siteIsEuroMillions } from "@/sites/features";
import { readEuroMillionsStore } from "@/lib/euromillions/store";
import { buildCiteSnapshot, buildPressPitch } from "@/lib/euromillions/insights";
import { buildEmbedPayload } from "@/lib/news/embed";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "press" });
  return {
    title: t("title"),
    description: t("meta"),
    alternates: await siteLocaleAlternates(locale, "/presse"),
  };
}

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getCurrentSite();
  if (!siteIsEuroMillions(site)) notFound();

  const t = await getTranslations("press");
  const store = await readEuroMillionsStore();
  const snap = buildCiteSnapshot(store.draws);
  const pitch = buildPressPitch(store.draws);
  const embed = buildEmbedPayload(store.draws);
  const siteUrl = `https://${site.primaryHost}`;
  const pitchText = locale === "en" ? pitch.en : pitch.fr;

  return (
    <article className="mx-auto max-w-3xl px-5 pb-16 pt-10 md:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.brand.name, url: `${siteUrl}/${locale}` },
          { name: t("title"), url: `${siteUrl}/${locale}/presse` },
        ])}
      />
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-5xl">
        {t("title")}
      </h1>
      <div className="mt-4">
        <GameToolsNav gameId="euromillions" />
      </div>
      <p className="mt-6 text-lg leading-relaxed text-[var(--fog)]">{t("lead")}</p>

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("citeTitle")}
        </h2>
        <p className="mt-3 text-[var(--fog)]">{t("citeBody")}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--fog)]">
          <li>
            <Link href="/stats" className="font-semibold text-[var(--accent)] hover:underline">
              {t("statsLink")}
            </Link>
          </li>
          {snap.latestDate ? (
            <li>
              <Link
                href={`/tirages/${snap.latestDate}`}
                className="font-semibold text-[var(--accent)] hover:underline"
              >
                {t("drawLink")}
              </Link>
            </li>
          ) : null}
          <li>
            <a
              href="/api/euromillions/export"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {t("csvLink")}
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("pitchTitle")}
        </h2>
        <p className="mt-3 text-[var(--fog)]">{t("pitchLead")}</p>
        <CopyBlock text={pitchText} label={t("copy")} copiedLabel={t("copied")} />
      </section>

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("embedTitle")}
        </h2>
        <p className="mt-3 text-[var(--fog)]">{t("embedLead")}</p>
        <div
          className="mt-6"
          dangerouslySetInnerHTML={{ __html: embed.html }}
        />
        <CopyBlock text={embed.snippet} label={t("copy")} copiedLabel={t("copied")} />
      </section>

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
          {t("contactTitle")}
        </h2>
        <p className="mt-3 text-[var(--fog)]">
          {t("contactBody")}{" "}
          <Link href="/contact" className="font-semibold text-[var(--accent)] hover:underline">
            {t("contactCta")}
          </Link>
        </p>
      </section>
    </article>
  );
}
