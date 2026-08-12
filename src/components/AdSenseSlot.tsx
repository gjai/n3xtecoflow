"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-4733644127583822";

type AdSenseSlotProps = {
  slot?: string;
  label: string;
  className?: string;
};

export function AdSenseSlot({ slot, label, className = "" }: AdSenseSlotProps) {
  const client = ADSENSE_CLIENT;

  useEffect(() => {
    if (!slot) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // Ad blocker or script not ready
    }
  }, [slot]);

  return (
    <aside className={`overflow-hidden ${className}`} aria-label={label}>
      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={client}
        data-ad-slot={slot || "0000000000"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
