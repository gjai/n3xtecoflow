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
 * Native <script defer> (not next/script): Umami needs document.currentScript
 * to read data-website-id. CSP must allow the Umami origin (see next.config.ts).
 */
export function UmamiScript({ host }: { host?: string | null }) {
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim();
  const websiteId = resolveWebsiteId(host);
  if (!scriptUrl || !websiteId) return null;

  return (
    <script
      defer
      src={scriptUrl}
      data-website-id={websiteId}
      data-auto-track="true"
    />
  );
}
