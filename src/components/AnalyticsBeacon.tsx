"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useRef } from "react";

/**
 * Cookieless first-party pageview beacon (no user id, no IP stored).
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();
  const last = useRef<string>("");

  useEffect(() => {
    const fullPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    if (!fullPath || fullPath === last.current) return;
    last.current = fullPath;

    const payload = JSON.stringify({
      path: fullPath,
      host: window.location.hostname,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/collect", blob);
        return;
      }
    } catch {
      /* fall through */
    }

    void fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
