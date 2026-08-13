import Script from "next/script";

function resolveWebsiteId(host: string | null | undefined): string | null {
  const fallback = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() || "";
  const mapRaw = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_IDS?.trim();
  if (!mapRaw) return fallback || null;
  try {
    const map = JSON.parse(mapRaw) as Record<string, string>;
    const raw = (host || "").toLowerCase().split(":")[0];
    const apex = raw.replace(/^www\./, "");
    return (
      map[raw]?.trim() ||
      map[apex]?.trim() ||
      map[`www.${apex}`]?.trim() ||
      fallback ||
      null
    );
  } catch {
    return fallback || null;
  }
}

/**
 * Umami (self-hosted via Coolify) — cookieless, respect DNT.
 * Env : NEXT_PUBLIC_UMAMI_SCRIPT_URL + NEXT_PUBLIC_UMAMI_WEBSITE_ID
 * Optionnel : NEXT_PUBLIC_UMAMI_WEBSITE_IDS JSON host→id (multi-thèmes).
 */
export function UmamiScript({ host }: { host?: string | null }) {
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim();
  const websiteId = resolveWebsiteId(host);
  if (!scriptUrl || !websiteId) return null;

  return (
    <Script
      src={scriptUrl}
      strategy="afterInteractive"
      defer
      data-website-id={websiteId}
      data-auto-track="true"
      // Audience first-party / cookieless — ne pas bloquer sur DNT navigateur
      // (sinon Safari & co. = 0 vue). Toujours hors AdSense / cookies pubs.
      data-do-not-track="false"
    />
  );
}
