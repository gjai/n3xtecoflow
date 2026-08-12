import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Outfit, Sora } from "next/font/google";
import { routing } from "@/i18n/routing";
import { AdSenseScript } from "@/components/AdSenseScript";
import { ConsentProvider } from "@/components/ConsentProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  ThemeProvider,
  themeInitScript,
} from "@/components/ThemeProvider";
import "../globals.css";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const adsenseClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
    "ca-pub-4733644127583822";

  return {
    title: {
      default: t("siteName"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("tagline"),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://ecoflow-stream.com",
    ),
    alternates: {
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    other: {
      "google-adsense-account": adsenseClient,
    },
    openGraph: {
      title: t("siteName"),
      description: t("tagline"),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
      siteName: t("siteName"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("tagline"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("meta");

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Raw tag so AdSense crawler always finds the in-page code */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
            "ca-pub-4733644127583822"
          }`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ConsentProvider>
              <AdSenseScript />
              <div className="flex min-h-full flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <CookieBanner />
              <p className="sr-only">{t("disclaimerShort")}</p>
            </ConsentProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
