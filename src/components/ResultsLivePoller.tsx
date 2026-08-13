"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useRef } from "react";

const INTERVAL_MS = 20_000;

/**
 * Dès qu’un tirage est en attente, interroge l’API FDJ via /api/euromillions/live
 * et rafraîchit la page dès que les boules sont là.
 */
export function ResultsLivePoller({
  enabled,
  fingerprint,
}: {
  enabled: boolean;
  fingerprint: string;
}) {
  const router = useRouter();
  const fp = useRef(fingerprint);
  fp.current = fingerprint;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const tick = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const res = await fetch("/api/euromillions/live", {
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { fingerprint?: string };
        if (
          data.fingerprint &&
          data.fingerprint !== fp.current &&
          !cancelled
        ) {
          router.refresh();
        }
      } catch {
        /* réseau : on réessaie au tick suivant */
      }
    };

    const id = window.setInterval(tick, INTERVAL_MS);
    const delay = window.setTimeout(tick, 2_500);
    const onVisible = () => {
      if (document.visibilityState === "visible") void tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.clearTimeout(delay);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, router]);

  return null;
}
