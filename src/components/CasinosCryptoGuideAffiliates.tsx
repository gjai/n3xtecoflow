import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";
import {
  affiliateOffer,
  resolveAffiliateOffers,
  type AffiliateOffer,
} from "@/lib/affiliates";
import type { SiteConfig } from "@/sites/types";
import {
  CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG,
  CASINOS_CRYPTO_STAKE_GUIDE_SLUG,
  CASINOS_CRYPTO_VPN_GUIDE_SLUG,
} from "@/data/casinos-crypto-guides";

type GuideAngle = "stake" | "cryptocom" | "vpn";

function angleForSlug(slug: string): GuideAngle {
  if (slug.includes("cryptocom") || slug === CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG) {
    return "cryptocom";
  }
  if (slug.includes("vpn") || slug === CASINOS_CRYPTO_VPN_GUIDE_SLUG) {
    return "vpn";
  }
  if (slug === CASINOS_CRYPTO_STAKE_GUIDE_SLUG || slug.includes("stake")) {
    return "stake";
  }
  return "stake";
}

type OfferCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  stakeHint: string;
  cryptocomHint: string;
  nordvpnHint: string;
  stakeLabel: string;
  cryptocomLabel: string;
  nordvpnLabel: string;
};

function copyForAngle(angle: GuideAngle, isEn: boolean): OfferCopy {
  if (angle === "cryptocom") {
    return isEn
      ? {
          eyebrow: "Next step",
          title: "Wallet ready — the casino comes first",
          lead: "Crypto.com prepares the deposit. Stake remains the main destination. NordVPN secures the session.",
          stakeHint: "Play on Stake once your wallet is funded (18+).",
          cryptocomHint: "Buy / hold crypto before sending to Stake.",
          nordvpnHint: "Stable private connection for the whole session.",
          stakeLabel: "Open Stake (main)",
          cryptocomLabel: "Open Crypto.com",
          nordvpnLabel: "Try NordVPN",
        }
      : {
          eyebrow: "Étape suivante",
          title: "Wallet prêt — le casino reste la priorité",
          lead: "Crypto.com prépare le dépôt. Stake reste la destination principale. NordVPN sécurise la session.",
          stakeHint: "Jouer sur Stake une fois le wallet alimenté (18+).",
          cryptocomHint: "Acheter / détenir la crypto avant l’envoi vers Stake.",
          nordvpnHint: "Connexion stable et privée pendant toute la session.",
          stakeLabel: "Ouvrir Stake (principal)",
          cryptocomLabel: "Ouvrir Crypto.com",
          nordvpnLabel: "Essayer NordVPN",
        };
  }

  if (angle === "vpn") {
    return isEn
      ? {
          eyebrow: "After the VPN",
          title: "Secure connection — then the crypto casino",
          lead: "NordVPN is the companion. Stake is still the headline destination. Crypto.com helps fund the deposit.",
          stakeHint: "Open Stake when your setup is ready (18+).",
          cryptocomHint: "On-ramp wallet before a first deposit.",
          nordvpnHint: "Keep kill-switch on for the full session.",
          stakeLabel: "Open Stake (main)",
          cryptocomLabel: "Open Crypto.com",
          nordvpnLabel: "Try NordVPN",
        }
      : {
          eyebrow: "Après le VPN",
          title: "Connexion sécurisée — puis le casino crypto",
          lead: "NordVPN est le compagnon. Stake reste la destination principale. Crypto.com aide à préparer le dépôt.",
          stakeHint: "Ouvrir Stake quand le setup est prêt (18+).",
          cryptocomHint: "Wallet on-ramp avant un premier dépôt.",
          nordvpnHint: "Garder le kill-switch pendant toute la session.",
          stakeLabel: "Ouvrir Stake (principal)",
          cryptocomLabel: "Ouvrir Crypto.com",
          nordvpnLabel: "Essayer NordVPN",
        };
  }

  // stake (default) — casino angle front and center
  return isEn
    ? {
        eyebrow: "Start here",
        title: "Stake first — wallet & VPN as companions",
        lead: "This guide is about the crypto casino. Crypto.com and NordVPN support the path — they are not the main destination.",
        stakeHint: "Primary: create your Stake account and play within a fixed budget (18+).",
        cryptocomHint: "Companion: buy crypto before depositing.",
        nordvpnHint: "Companion: stable private connection.",
        stakeLabel: "Open Stake",
        cryptocomLabel: "Crypto.com wallet",
        nordvpnLabel: "NordVPN setup",
      }
    : {
        eyebrow: "Commencer ici",
        title: "Stake d’abord — wallet & VPN en compagnons",
        lead: "Ce guide porte sur le casino crypto. Crypto.com et NordVPN accompagnent le parcours — ce ne sont pas la destination principale.",
        stakeHint: "Principal : créer votre compte Stake et jouer avec un budget fixe (18+).",
        cryptocomHint: "Compagnon : acheter la crypto avant de déposer.",
        nordvpnHint: "Compagnon : connexion stable et privée.",
        stakeLabel: "Ouvrir Stake",
        cryptocomLabel: "Wallet Crypto.com",
        nordvpnLabel: "Setup NordVPN",
      };
}

function OfferRow({
  offer,
  hint,
  label,
  primary,
}: {
  offer: AffiliateOffer;
  hint: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <div
      className={
        primary
          ? "space-y-3 border border-[var(--accent)] bg-[var(--surface)] p-5"
          : "space-y-2 border border-[var(--line)] p-4"
      }
    >
      <p
        className={
          primary
            ? "text-sm font-medium text-[var(--heading)]"
            : "text-xs text-[var(--muted)]"
        }
      >
        {hint}
      </p>
      <AffiliateOfferButton
        href={offer.href}
        label={label}
        variant={primary ? "primary" : "secondary"}
        className={primary ? "w-full sm:w-auto" : undefined}
      />
    </div>
  );
}

/** Three affiliate CTAs on every casino guide — Stake always most prominent, angle varies by slug. */
export function CasinosCryptoGuideAffiliates({
  site,
  slug,
  locale,
}: {
  site: SiteConfig;
  slug: string;
  locale: string;
}) {
  if (!resolveAffiliateOffers(site).length) return null;

  const isEn = locale === "en";
  const angle = angleForSlug(slug);
  const copy = copyForAngle(angle, isEn);
  const stake = affiliateOffer(site, "stake");
  const cryptocom = affiliateOffer(site, "cryptocom");
  const nordvpn = affiliateOffer(site, "nordvpn");

  if (!stake && !cryptocom && !nordvpn) return null;

  return (
    <aside className="space-y-5 border border-[var(--line)] bg-[var(--surface)] p-5 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          {copy.eyebrow}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)] md:text-2xl">
          {copy.title}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{copy.lead}</p>
      </div>

      <div className="space-y-3">
        {stake ? (
          <OfferRow
            offer={stake}
            hint={copy.stakeHint}
            label={copy.stakeLabel}
            primary
          />
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {cryptocom ? (
            <OfferRow
              offer={cryptocom}
              hint={copy.cryptocomHint}
              label={copy.cryptocomLabel}
            />
          ) : null}
          {nordvpn ? (
            <OfferRow
              offer={nordvpn}
              hint={copy.nordvpnHint}
              label={copy.nordvpnLabel}
            />
          ) : null}
        </div>
      </div>

      <AffiliateDisclosure compact />
      <p className="text-xs text-[var(--muted)]">
        {isEn
          ? "Affiliate links · 18+ · Play responsibly · We are not the operator"
          : "Liens d’affiliation · 18+ · Jouez responsable · Nous ne sommes pas l’opérateur"}
      </p>
    </aside>
  );
}
