import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { AffiliateLinkedText } from "@/components/AffiliateLinkedText";
import { LegalScroll } from "@/components/LegalScroll";
import { resolveAffiliateOffers } from "@/lib/affiliates";
import { siteLocaleAlternates } from "@/lib/seo";
import { siteNeedsGamblingDisclaimer } from "@/sites/features";
import { getCurrentSite } from "@/sites/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("hubTitle"),
    description: t("hubMeta"),
    alternates: await siteLocaleAlternates(locale, "/mentions-legales"),
  };
}

export default async function MentionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const site = await getCurrentSite();
  const showResponsible =
    siteNeedsGamblingDisclaimer(site) && Boolean(t("responsibleBody").trim());
  const keywordOffers =
    site.id === "casinos-crypto" ? resolveAffiliateOffers(site) : undefined;
  const L = ({ text }: { text: string }) =>
    keywordOffers ? (
      <AffiliateLinkedText text={text} offers={keywordOffers} />
    ) : (
      <>{text}</>
    );

  const toc = [
    { id: "editeur", label: t("publisherTitle") },
    { id: "hebergeur", label: t("hostTitle") },
    { id: "confidentialite", label: t("privacyTitle") },
    { id: "droits", label: t("privacyRightsTitle") },
    { id: "cookies", label: t("cookiesTitle") },
    { id: "affiliation", label: t("affiliateTitle") },
    ...(showResponsible
      ? [{ id: "jeu-responsable", label: t("responsibleTitle") }]
      : []),
  ] as const;

  return (
    <article className="mx-auto max-w-3xl px-5 pb-16 pt-10 md:px-8">
      <LegalScroll />
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)]">
        {t("hubTitle")}
      </h1>
      <p className="mt-4 text-[var(--muted)]">{t("hubIntro")}</p>

      <nav
        aria-label={t.has("tocAria") ? t("tocAria") : t("hubTitle")}
        className="mt-8 border border-[var(--line)] bg-[var(--surface)] p-4"
      >
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 space-y-14 leading-relaxed text-[var(--fog)]">
        <section id="editeur" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("publisherTitle")}
          </h2>
          <p className="mt-4">
            <L text={t("independent")} />
          </p>
          {t("publisherName").trim() ? (
            <p className="mt-2 font-medium text-[var(--heading)]">
              {t("publisherName")}
            </p>
          ) : null}
          {t("publisherAddress").trim() ? (
            <p className="mt-2">
              <a
                href={t("publisherAddress").trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {t("publisherAddress")
                  .trim()
                  .replace(/^https?:\/\//, "")}
              </a>
            </p>
          ) : null}
          {t("publisherDirector").trim() ? (
            <p className="mt-2">{t("publisherDirector")}</p>
          ) : null}
          {t("siren").trim() ? <p className="mt-2">{t("siren")}</p> : null}
          {t("publisherTva").trim() ? (
            <p className="mt-2">{t("publisherTva")}</p>
          ) : null}
          <p className="mt-2">
            <Link
              href="/a-propos"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {t("aboutLink")}
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

        <section id="hebergeur" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("hostTitle")}
          </h2>
          <p className="mt-4 whitespace-pre-line">{t("hostBody")}</p>
        </section>

        <section id="confidentialite" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("privacyTitle")}
          </h2>
          <p className="mt-4">{t("privacyBody")}</p>
          <p className="mt-3">{t("adsense")}</p>
          <p className="mt-3">{t("privacyConsent")}</p>
          <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
            {t("privacyBasisTitle")}
          </h3>
          <p className="mt-2">{t("privacyBasisBody")}</p>
        </section>

        <section id="droits" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("privacyRightsTitle")}
          </h2>
          <p className="mt-4">{t("privacyRightsBody")}</p>
          <p className="mt-3">
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

        <section id="cookies" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("cookiesTitle")}
          </h2>
          <p className="mt-4">{t("cookiesIntro")}</p>
          <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
            {t("cookiesNecessaryTitle")}
          </h3>
          <p className="mt-2">{t("cookiesNecessaryBody")}</p>
          <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)]">
            {t("cookiesAdsTitle")}
          </h3>
          <p className="mt-2">{t("cookiesAdsBody")}</p>
          <p className="mt-3">{t("adsense")}</p>
        </section>

        <section id="affiliation" className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {t("affiliateTitle")}
          </h2>
          <p className="mt-4">
            <L text={t("independent")} />
          </p>
          <p className="mt-3">
            <L text={t("amazon")} />
          </p>
          <p className="mt-3">
            <L text={t("affiliateBody")} />
          </p>
          <p className="mt-3">{t("adsense")}</p>
        </section>

        {showResponsible ? (
          <section id="jeu-responsable" className="scroll-mt-28">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
              {t("responsibleTitle")}
            </h2>
            <p className="mt-4">
              <L text={t("responsibleBody")} />
            </p>
            <p className="mt-3">
              {t("responsibleHelp")}{" "}
              <a
                href="https://www.joueurs-info-service.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] underline-offset-2 hover:underline"
              >
                joueurs-info-service.fr
              </a>
              {" · "}
              <a
                href="tel:0974751313"
                className="text-[var(--accent)] underline-offset-2 hover:underline"
              >
                09 74 75 13 13
              </a>
            </p>
          </section>
        ) : null}

        <p className="border-t border-[var(--line)] pt-8 text-sm text-[var(--muted)]">
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
