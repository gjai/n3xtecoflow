"use client";

import { useEffect } from "react";

type AdSenseSlotProps = {
  slot?: string;
  label: string;
  className?: string;
};

export function AdSenseSlot({ slot, label, className = "" }: AdSenseSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

  useEffect(() => {
    if (!client || !slot) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // Ad blocker or script not ready
    }
  }, [client, slot]);

  if (!client) {
    return (
      <aside
        className={`rounded-sm border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-8 text-center text-sm text-[var(--muted)] ${className}`}
        aria-label={label}
      >
        <p className="mb-1 text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          {label}
        </p>
        <p>Emplacement AdSense (configurez NEXT_PUBLIC_ADSENSE_CLIENT)</p>
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
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot || "0000000000"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
