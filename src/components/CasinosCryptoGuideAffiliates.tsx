import { getTranslations } from "next-intl/server";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AffiliateLinkedText } from "@/components/AffiliateLinkedText";
import { AffiliateOfferButton } from "@/components/AffiliateOfferButton";
import { GamblingDisclaimer } from "@/components/GamblingDisclaimer";
import {
  affiliateOffer,
  resolveAffiliateOffers,
  type AffiliateOffer,
} from "@/lib/affiliates";
import type { SiteConfig } from "@/sites/types";
import {
  CASINOS_CRYPTO_CRYPTOCOM_GUIDE_SLUG,
  CASINOS_CRYPTO_CRYPTO_GUIDE_SLUG,
  CASINOS_CRYPTO_STAKE_GUIDE_SLUG,
  CASINOS_CRYPTO_VPN_GUIDE_SLUG,
} from "@/data/casinos-crypto-guides";

type GuideAngle = "stake" | "cryptocom" | "crypto" | "vpn";

function angleForSlug(slug: string): GuideAngle {
  if (
    slug.includes("cryptomonnaie") ||
    slug === CASINOS_CRYPTO_CRYPTO_GUIDE_SLUG
  ) {
    return "crypto";
  }
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

function copyForAngle(
  angle: GuideAngle,
  t: Awaited<ReturnType<typeof getTranslations>>,
): OfferCopy {
  const prefix =
    angle === "crypto"
      ? "crypto"
      : angle === "cryptocom"
        ? "wallet"
        : angle === "vpn"
          ? "vpn"
          : "stake";

  if (prefix === "crypto") {
    return {
      eyebrow: t("cryptoEyebrow"),
      title: t("cryptoTitle"),
      lead: t("cryptoLead"),
      stakeHint: t("cryptoStakeHint"),
      cryptocomHint: t("cryptoCryptocomHint"),
      nordvpnHint: t("cryptoNordvpnHint"),
      stakeLabel: t("cryptoStakeCta"),
      cryptocomLabel: t("cryptoCryptocomCta"),
      nordvpnLabel: t("cryptoNordvpnCta"),
    };
  }
  if (prefix === "wallet") {
    return {
      eyebrow: t("walletEyebrow"),
      title: t("walletTitle"),
      lead: t("walletLead"),
      stakeHint: t("walletStakeHint"),
      cryptocomHint: t("walletCryptocomHint"),
      nordvpnHint: t("walletNordvpnHint"),
      stakeLabel: t("walletStakeCta"),
      cryptocomLabel: t("walletCryptocomCta"),
      nordvpnLabel: t("walletNordvpnCta"),
    };
  }
  if (prefix === "vpn") {
    return {
      eyebrow: t("vpnEyebrow"),
      title: t("vpnTitle"),
      lead: t("vpnLead"),
      stakeHint: t("vpnStakeHint"),
      cryptocomHint: t("vpnCryptocomHint"),
      nordvpnHint: t("vpnNordvpnHint"),
      stakeLabel: t("vpnStakeCta"),
      cryptocomLabel: t("vpnCryptocomCta"),
      nordvpnLabel: t("vpnNordvpnCta"),
    };
  }
  return {
    eyebrow: t("stakeEyebrow"),
    title: t("stakeTitle"),
    lead: t("stakeLead"),
    stakeHint: t("stakeHint"),
    cryptocomHint: t("stakeCryptocomHint"),
    nordvpnHint: t("stakeNordvpnHint"),
    stakeLabel: t("stakeCta"),
    cryptocomLabel: t("stakeCryptocomCta"),
    nordvpnLabel: t("stakeNordvpnCta"),
  };
}

function OfferRow({
  offer,
  hint,
  label,
  primary,
  offers,
}: {
  offer: AffiliateOffer;
  hint: string;
  label: string;
  primary?: boolean;
  offers: AffiliateOffer[];
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
        <AffiliateLinkedText text={hint} offers={offers} />
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
export async function CasinosCryptoGuideAffiliates({
  site,
  slug,
}: {
  site: SiteConfig;
  slug: string;
  locale: string;
}) {
  const offers = resolveAffiliateOffers(site);
  if (!offers.length) return null;

  const t = await getTranslations("affiliates");
  const angle = angleForSlug(slug);
  const copy = copyForAngle(angle, t);
  const stake = affiliateOffer(site, "stake");
  const cryptocom = affiliateOffer(site, "cryptocom");
  const nordvpn = affiliateOffer(site, "nordvpn");
  const L = ({ text }: { text: string }) => (
    <AffiliateLinkedText text={text} offers={offers} />
  );
  const cryptoPrimary = angle === "crypto" || angle === "cryptocom";

  if (!stake && !cryptocom && !nordvpn) return null;

  return (
    <aside className="space-y-5 border border-[var(--line)] bg-[var(--surface)] p-5 md:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          {copy.eyebrow}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)] md:text-2xl">
          <L text={copy.title} />
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <L text={copy.lead} />
        </p>
      </div>

      <div className="space-y-3">
        {cryptoPrimary && cryptocom ? (
          <OfferRow
            offer={cryptocom}
            hint={copy.cryptocomHint}
            label={copy.cryptocomLabel}
            primary
            offers={offers}
          />
        ) : null}
        {!cryptoPrimary && stake ? (
          <OfferRow
            offer={stake}
            hint={copy.stakeHint}
            label={copy.stakeLabel}
            primary
            offers={offers}
          />
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {cryptoPrimary && stake ? (
            <OfferRow
              offer={stake}
              hint={copy.stakeHint}
              label={copy.stakeLabel}
              offers={offers}
            />
          ) : null}
          {!cryptoPrimary && cryptocom ? (
            <OfferRow
              offer={cryptocom}
              hint={copy.cryptocomHint}
              label={copy.cryptocomLabel}
              offers={offers}
            />
          ) : null}
          {nordvpn ? (
            <OfferRow
              offer={nordvpn}
              hint={copy.nordvpnHint}
              label={copy.nordvpnLabel}
              offers={offers}
            />
          ) : null}
        </div>
      </div>

      <AffiliateDisclosure compact />
      <GamblingDisclaimer compact />
    </aside>
  );
}
