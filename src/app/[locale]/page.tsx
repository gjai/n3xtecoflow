import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AdSenseSlot } from "@/components/AdSenseSlot";
import { AmazonButton } from "@/components/AmazonButton";
import { AMAZON_QUERIES, buildAmazonSearchUrl } from "@/lib/amazon";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const a = await getTranslations("amazon");

  return (
    <>
      <section className="hero-grid relative min-h-[100svh] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='160' height='160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 120 L80 20 L160 120' fill='none' stroke='%23c8f04d' stroke-opacity='0.08' stroke-width='1'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-20 pt-28 md:justify-center md:px-8 md:pb-24">
          <p className="reveal font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.28em] text-[var(--accent)]">
            {t("brand")}
          </p>
          <h1 className="reveal-delay mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-7xl">
            {t("headline")}
          </h1>
          <p className="reveal-delay-2 mt-6 max-w-xl text-base text-white/80 md:text-lg">
            {t("subhead")}
          </p>
          <div className="reveal-delay-2 mt-10 flex flex-wrap gap-4">
            <Link
              href="/powerstream"
              className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold tracking-wide text-[var(--accent-ink)] transition hover:brightness-110"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/comparatifs"
              className="border border-white/30 px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:border-white"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold md:text-3xl">
          {t("featuresTitle")}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border-t border-[var(--line)] pt-5">
              <h3 className="text-lg font-semibold text-[var(--accent)]">
                {t(`feature${n}Title`)}
              </h3>
              <p className="mt-3 text-[var(--muted)]">{t(`feature${n}Text`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--solar)]">
              {t("spotlightTitle")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
              {t("spotlightName")}
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">{t("spotlightText")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/powerstream"
                className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {t("spotlightCta")}
              </Link>
              <AmazonButton
                href={buildAmazonSearchUrl(AMAZON_QUERIES.powerstream)}
                label={a("cta")}
                badge={a("badge")}
              />
            </div>
          </div>
          <AdSenseSlot label={t("adsLabel")} className="min-h-[180px]" />
        </div>
      </section>
    </>
  );
}
