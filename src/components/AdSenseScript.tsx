"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-4733644127583822";

export function AdSenseScript() {
  const { consent } = useConsent();
  if (!consent.decided || !consent.advertising) return null;

  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
