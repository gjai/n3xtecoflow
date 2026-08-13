import { Link } from "@/i18n/navigation";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";
import { SmartCover } from "@/components/SmartCover";
import type { AffiliateOffer } from "@/lib/affiliates";
import {
  CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG,
  CASINOS_CRYPTO_STAKE_GUIDE_SLUG,
  CASINOS_CRYPTO_VPN_GUIDE_SLUG,
  casinosCryptoGuideCovers,
} from "@/data/casinos-crypto-guides";
import { getEditorialImages } from "@/data/images";
import type { NewsArticle } from "@/lib/news/types";
import type { SiteConfig } from "@/sites/types";

export function CasinosCryptoHome({
  site,
  locale,
  stake,
  nordvpn,
  cryptocom,
  latestNews = [],
}: {
  site: SiteConfig;
  locale: string;
  stake?: AffiliateOffer;
  nordvpn?: AffiliateOffer;
  cryptocom?: AffiliateOffer;
  latestNews?: NewsArticle[];
}) {
  const isEn = locale === "en";
  const brand = site.brand.name;
  const headline = isEn ? site.brand.headlineEn : site.brand.headlineFr;
  const subhead = isEn ? site.brand.subheadEn : site.brand.subheadFr;
  const editorial = getEditorialImages(site.id);
  const stakeCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_STAKE_GUIDE_SLUG];
  const cryptoCover =
    casinosCryptoGuideCovers[CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG];
  const vpnCover = casinosCryptoGuideCovers[CASINOS_CRYPTO_VPN_GUIDE_SLUG];

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${site.heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,var(--hero-from)_0%,color-mix(in_srgb,var(--hero-mid)_78%,transparent)_42%,color-mix(in_srgb,var(--hero-to)_40%,transparent)_100%)]" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-5 pb-8 pt-20 md:min-h-[38vh] md:px-8 md:pb-10">
          <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--heading)] md:text-5xl lg:text-6xl">
            {brand}
          </p>
          <h1 className="mt-2 max-w-2xl font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)] md:text-2xl">
            {headline}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--fog)] md:text-base">
            {subhead}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {stake ? (
              <AffiliateOfferButton
                href={stake.href}
                label={isEn ? stake.labelEn : stake.labelFr}
              />
            ) : null}
            <Link
              href="/guides"
              className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
            >
              {isEn ? "Browse guides" : "Voir les guides"}
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            {isEn
              ? "18+ · Play responsibly · Independent editorial site · Affiliate links"
              : "18+ · Jouez responsable · Site éditorial indépendant · Liens d’affiliation"}
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-2">
          <SmartCover
            src={stakeCover.src}
            fallback={editorial.guides}
            locale={locale}
            credit={stakeCover.credit}
            className="aspect-[4/3] w-full md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 md:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              {isEn ? "Why Stake" : "Pourquoi Stake"}
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              {isEn
                ? "A crypto-first casino experience: speed, game variety, and a clear onboarding path — if you stay within a fixed budget."
                : "Une expérience casino orientée crypto : rapidité, variété de jeux, parcours clair — à condition de rester dans un budget fixe."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_STAKE_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {isEn ? "Stake guide" : "Guide Stake"}
              </Link>
              {stake ? (
                <AffiliateOfferButton
                  href={stake.href}
                  label={isEn ? stake.labelEn : stake.labelFr}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-5 py-14 md:order-1 md:px-10 md:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              {isEn ? "Crypto.com wallet" : "Wallet Crypto.com"}
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              {isEn
                ? "Buy and hold crypto before a Stake deposit. A practical on-ramp — separate from gambling risk."
                : "Achetez et stockez la crypto avant un dépôt Stake. On-ramp pratique — distinct du risque de jeu."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {isEn ? "Crypto.com guide" : "Guide Crypto.com"}
              </Link>
              {cryptocom ? (
                <AffiliateOfferButton
                  href={cryptocom.href}
                  label={isEn ? cryptocom.labelEn : cryptocom.labelFr}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
          <SmartCover
            src={cryptoCover.src}
            fallback={editorial.camping}
            locale={locale}
            credit={cryptoCover.credit}
            className="order-1 aspect-[4/3] w-full md:order-2 md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-2">
          <SmartCover
            src={vpnCover.src}
            fallback={editorial.backup}
            locale={locale}
            credit={vpnCover.credit}
            className="aspect-[4/3] w-full md:aspect-auto md:min-h-[420px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 md:py-16">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              {isEn ? "VPN companion" : "VPN compagnon"}
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              {isEn
                ? "A stable, private connection before you play — kill-switch, stable server, full session."
                : "Connexion stable et privée avant de jouer — kill-switch, serveur stable, session complète."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_VPN_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {isEn ? "VPN guide" : "Guide VPN"}
              </Link>
              {nordvpn ? (
                <AffiliateOfferButton
                  href={nordvpn.href}
                  label={isEn ? nordvpn.labelEn : nordvpn.labelFr}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
            {isEn ? "How to start" : "Comment démarrer"}
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {(isEn
              ? [
                  "Set a leisure budget you can lose",
                  "Create an account + enable 2FA",
                  "Buy crypto via Crypto.com (small test amount)",
                  "Deposit on Stake, then test a withdrawal early",
                ]
              : [
                  "Fixez un budget loisir que vous pouvez perdre",
                  "Créez un compte + activez la 2FA",
                  "Achetez la crypto via Crypto.com (petit montant test)",
                  "Déposez sur Stake, puis testez un retrait tôt",
                ]
            ).map((step, i) => (
              <li
                key={step}
                className="flex gap-4 border-t border-[var(--line)] pt-4"
              >
                <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[var(--heading)]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {latestNews.length ? (
        <section className="border-b border-[var(--line)]">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
                {isEn ? "Latest news" : "Dernières actus"}
              </h2>
              <Link
                href="/actualites"
                className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {isEn ? "All news →" : "Toutes les actus →"}
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {latestNews.slice(0, 3).map((article) => {
                const copy = isEn ? article.en : article.fr;
                return (
                  <li key={article.slug}>
                    <Link
                      href={`/actualites/${article.slug}`}
                      className="group block overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
                    >
                      <SmartCover
                        src={article.imageSrc}
                        fallback={editorial.news}
                        locale={locale}
                        credit={article.imageCredit}
                        className="aspect-[16/9] w-full"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="p-4">
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--heading)] group-hover:text-[var(--accent)]">
                          {copy.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                          {copy.excerpt}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            {isEn
              ? `${brand} is an independent editorial site. Stake, Crypto.com and NordVPN links may be affiliate links. We are not the operator. Gambling involves risk of loss. 18+ only.`
              : `${brand} est un site éditorial indépendant. Les liens Stake, Crypto.com et NordVPN peuvent être affiliés. Nous ne sommes pas l’opérateur. Le jeu comporte un risque de perte. 18+ uniquement.`}
          </p>
        </div>
      </section>
    </>
  );
}
