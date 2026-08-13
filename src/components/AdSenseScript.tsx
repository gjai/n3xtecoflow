"use client";

import Script from "next/script";

/**
 * Consent Mode defaults (denied). adsbygoogle.js is in layout <head>
 * (vérification AdSense) ; les unités ne s’affichent qu’après consentement.
 */
export function AdSenseScript() {
  return (
    <Script id="efs-consent-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          wait_for_update: 500
        });
      `}
    </Script>
  );
}
