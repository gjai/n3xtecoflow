import { Link } from "@/i18n/navigation";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";
import type { AffiliateOffer } from "@/lib/affiliates";
import {
  CASINOS_CRYPTO_STAKE_GUIDE_SLUG,
  CASINOS_CRYPTO_VPN_GUIDE_SLUG,
} from "@/data/casinos-crypto-guides";
import type { SiteConfig } from "@/sites/types";

export function CasinosCryptoHome({
  site,
  locale,
  stake,
  nordvpn,
}: {
  site: SiteConfig;
  locale: string;
  stake?: AffiliateOffer;
  nordvpn?: AffiliateOffer;
}) {
  const isEn = locale === "en";
  const brand = site.brand.name;
  const headline = isEn ? site.brand.headlineEn : site.brand.headlineFr;
  const subhead = isEn ? site.brand.subheadEn : site.brand.subheadFr;

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${site.heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,var(--hero-from)_0%,color-mix(in_srgb,var(--hero-mid)_88%,transparent)_45%,color-mix(in_srgb,var(--hero-to)_55%,transparent)_100%)]" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 md:px-8 md:pb-20">
          <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--heading)] md:text-6xl lg:text-7xl">
            {brand}
          </p>
          <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)] md:text-3xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--fog)] md:text-lg">
            {subhead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {stake ? (
              <AffiliateOfferButton
                href={stake.href}
                label={isEn ? stake.labelEn : stake.labelFr}
              />
            ) : null}
            <Link
              href={`/guides/${CASINOS_CRYPTO_STAKE_GUIDE_SLUG}`}
              className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
            >
              {isEn ? "Read the Stake guide" : "Lire le guide Stake"}
            </Link>
          </div>
          <p className="mt-6 text-xs text-[var(--muted)]">
            {isEn
              ? "18+ · Play responsibly · Independent editorial site · Affiliate links"
              : "18+ · Jouez responsable · Site éditorial indépendant · Liens d’affiliation"}
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
            {isEn ? "Why Stake" : "Pourquoi Stake"}
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            {isEn
              ? "A crypto-first casino experience: speed, game variety, and a clear onboarding path — if you stay within a fixed budget."
              : "Une expérience casino orientée crypto : rapidité, variété de jeux, parcours clair — à condition de rester dans un budget fixe."}
          </p>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                t: isEn ? "Crypto-native" : "Orienté crypto",
                d: isEn
                  ? "Deposits and cashouts that fit a crypto wallet workflow."
                  : "Dépôts et retraits pensés pour un workflow wallet crypto.",
              },
              {
                t: isEn ? "Catalogue" : "Catalogue",
                d: isEn
                  ? "Slots, live tables and more — always check local availability."
                  : "Slots, live et plus — vérifiez toujours la disponibilité locale.",
              },
              {
                t: isEn ? "Not magic money" : "Pas d’argent magique",
                d: isEn
                  ? "Bonuses have wagering rules. Read them before you deposit."
                  : "Les bonus ont des conditions de mise. Lisez-les avant de déposer.",
              },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
                  {item.t}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.d}</p>
              </li>
            ))}
          </ul>
          {stake ? (
            <div className="mt-10">
              <AffiliateOfferButton
                href={stake.href}
                label={isEn ? stake.labelEn : stake.labelFr}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
            {isEn ? "How to start" : "Comment démarrer"}
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {(isEn
              ? [
                  "Set a leisure budget you can lose",
                  "Create an account + enable 2FA",
                  "Prepare a small crypto deposit",
                  "Test a withdrawal early",
                ]
              : [
                  "Fixez un budget loisir que vous pouvez perdre",
                  "Créez un compte + activez la 2FA",
                  "Préparez un petit dépôt crypto",
                  "Testez un retrait tôt",
                ]
            ).map((step, i) => (
              <li
                key={step}
                className="flex gap-4 border-t border-[var(--line)] pt-5"
              >
                <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[var(--heading)]">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8">
            <Link
              href={`/guides/${CASINOS_CRYPTO_STAKE_GUIDE_SLUG}`}
              className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {isEn ? "Full Stake guide →" : "Guide Stake complet →"}
            </Link>
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end md:px-8 md:py-20">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)] md:text-4xl">
              {isEn ? "VPN companion guide" : "Petit guide VPN"}
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              {isEn
                ? "A stable, private connection matters before you play. We walk through a cautious NordVPN setup — kill-switch, stable server, full session."
                : "Une connexion stable et privée compte avant de jouer. On détaille un setup NordVPN prudent — kill-switch, serveur stable, session complète."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/guides/${CASINOS_CRYPTO_VPN_GUIDE_SLUG}`}
                className="inline-flex min-h-11 items-center justify-center border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface)]"
              >
                {isEn ? "Read the VPN guide" : "Lire le guide VPN"}
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
          <p className="text-sm text-[var(--muted)]">
            {isEn
              ? "A VPN is a technical tool, not legal advice. Stay 18+ and play responsibly."
              : "Un VPN est un outil technique, pas un conseil juridique. Restez 18+ et jouez responsable."}
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            {isEn
              ? `${brand} is an independent editorial site. Stake and NordVPN links may be affiliate links. We are not the operator. Gambling involves risk of loss. 18+ only.`
              : `${brand} est un site éditorial indépendant. Les liens Stake et NordVPN peuvent être affiliés. Nous ne sommes pas l’opérateur. Le jeu comporte un risque de perte. 18+ uniquement.`}
          </p>
        </div>
      </section>
    </>
  );
}
