"use client";

import { useEffect } from "react";
import { useConsent } from "@/components/ConsentProvider";

type AdSenseUnitProps = {
  /** AdSense ad unit slot id */
  slot?: string;
  className?: string;
  label?: string;
};

/**
 * Renders only when:
 * - NEXT_PUBLIC_ADSENSE_SLOTS=1
 * - a slot id is provided (prop or NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT)
 * - user accepted advertising cookies
 */
export function AdSenseUnit({
  slot,
  className = "",
  label = "Publicité",
}: AdSenseUnitProps) {
  const { consent } = useConsent();
  const slotsEnabled = process.env.NEXT_PUBLIC_ADSENSE_SLOTS === "1";
  const client =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
    "ca-pub-4733644127583822";
  const adSlot =
    slot?.trim() ||
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT?.trim() ||
    "";

  useEffect(() => {
    if (!slotsEnabled || !consent.advertising || !adSlot) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, [slotsEnabled, consent.advertising, adSlot]);

  if (!slotsEnabled || !consent.advertising || !adSlot) {
    return null;
  }

  return (
    <aside
      className={`border border-[var(--line)] bg-[var(--surface)] p-3 ${className}`}
      aria-label={label}
    >
      <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
