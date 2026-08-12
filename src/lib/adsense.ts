export function getAdsenseClient(): string {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "";
}

export function isAdsenseEnabled(): boolean {
  return Boolean(getAdsenseClient());
}
