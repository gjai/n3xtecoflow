"use client";

import { useEffect } from "react";
import { useConsent } from "./ConsentProvider";

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-4733644127583822";

type AdSenseSlotProps = {
  slot?: string;
  label: string;
  className?: string;
};

export function AdSenseSlot({ slot, label, className = "" }: AdSenseSlotProps) {
  const { consent } = useConsent();
  const allowed = consent.decided && consent.advertising;

  useEffect(() => {
    if (!allowed || !slot) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // Ad blocker or script not ready
    }
  }, [allowed, slot]);

  if (!allowed) {
    return (
      <aside
        className={`rounded-sm border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-6 text-center text-sm text-[var(--muted)] ${className}`}
        aria-label={label}
      >
        <p className="mb-1 text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          {label}
        </p>
        <p>Publicité désactivée (cookies refusés)</p>
      </aside>
    );
  }

  return (
    <aside className={`overflow-hidden ${className}`} aria-label={label}>
      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot || "0000000000"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
