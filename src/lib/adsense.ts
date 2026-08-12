export function getAdsenseClient(): string {
  return (
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-4733644127583822"
  );
}

export function isAdsenseEnabled(): boolean {
  return Boolean(getAdsenseClient());
}
