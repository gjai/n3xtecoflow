import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentSite } from "@/sites/server";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: true },
};

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  const site = await getCurrentSite();

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-20 md:px-8">
      <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.28em] text-[var(--accent)]">
        {site.brand.name}
      </p>
      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
        404
      </p>
      <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--heading)] md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-xl text-base text-[var(--muted)] md:text-lg">
        {t("body")}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] transition hover:brightness-110"
        >
          {t("home")}
        </Link>
        <Link
          href="/produits"
          className="border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
        >
          {t("products")}
        </Link>
        <Link
          href="/guides"
          className="border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
        >
          {t("guides")}
        </Link>
      </div>
    </section>
  );
}
