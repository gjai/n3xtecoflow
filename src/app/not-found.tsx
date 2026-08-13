import type { Metadata } from "next";
import { headers } from "next/headers";
import { NotFoundContent } from "@/components/NotFoundContent";
import { getSiteByHost } from "@/sites";
import {
  ctaLabel,
  localeFromHeaders,
  siteNotFoundCopy,
  siteNotFoundCtas,
  withLocalePrefix,
} from "@/sites/not-found";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const site = getSiteByHost(h.get("host"));
  return {
    title: `404 · ${site.brand.name}`,
    robots: { index: false, follow: true },
  };
}

/** Root slot — même logique Host que global-not-found. */
export default async function RootNotFound() {
  const h = await headers();
  const site = getSiteByHost(h.get("host"));
  const locale = localeFromHeaders(h, site);
  const copy = siteNotFoundCopy(site, locale);

  return (
    <NotFoundContent
      brand={site.brand.name}
      title={copy.title}
      body={copy.body}
      links={siteNotFoundCtas(site).map((cta) => ({
        href: withLocalePrefix(locale, cta.href),
        label: ctaLabel(cta.labelKey, locale, undefined, site),
        primary: cta.primary,
      }))}
    />
  );
}
