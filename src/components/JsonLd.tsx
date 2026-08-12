import type { SiteConfig } from "@/sites/types";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function siteUrlOf(site: SiteConfig | string) {
  return typeof site === "string" ? site : `https://${site.primaryHost}`;
}

export function organizationJsonLd(siteOrUrl: SiteConfig | string) {
  const isConfig = typeof siteOrUrl !== "string";
  const site = isConfig ? siteOrUrl : null;
  const siteUrl = siteUrlOf(siteOrUrl);
  const name = site?.brand.name || "EcoFlow Stream";
  const description =
    site?.brand.taglineFr ||
    "Site éditorial indépendant de guides et fiches techniques EcoFlow (affiliation Amazon).";
  const knowsAbout =
    site?.id === "tumbler"
      ? [
          "gourde isotherme",
          "tumbler",
          "mug isotherme",
          "bouteille inox",
          "isolation thermique",
        ]
      : [
          "EcoFlow",
          "portable power stations",
          "balcony solar",
          "PowerStream",
          "STREAM",
        ];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: siteUrl,
    description,
    foundingDate: "2026",
    knowsAbout,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      url: `${siteUrl}/fr/contact`,
      availableLanguage: ["French", "English"],
    },
  };
}

export function websiteJsonLd(siteOrUrl: SiteConfig | string) {
  const isConfig = typeof siteOrUrl !== "string";
  const site = isConfig ? siteOrUrl : null;
  const siteUrl = siteUrlOf(siteOrUrl);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site?.brand.name || "EcoFlow Stream",
    url: siteUrl,
    inLanguage: ["fr-FR", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/fr/produits`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(args: {
  siteUrl: string;
  locale: string;
  name: string;
  description: string;
  category: string;
  url: string;
  brandName?: string;
  capacityWh?: number;
  outputW?: number;
  priceAmount?: number | null;
  priceCurrency?: string | null;
  offerUrl?: string | null;
}) {
  const offers =
    args.priceAmount != null && args.priceCurrency
      ? {
          "@type": "Offer",
          price: args.priceAmount,
          priceCurrency: args.priceCurrency,
          availability: "https://schema.org/InStock",
          url: args.offerUrl || args.url,
          seller: { "@type": "Organization", name: "Amazon.fr" },
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    category: args.category,
    brand: args.brandName
      ? { "@type": "Brand", name: args.brandName }
      : undefined,
    url: args.url,
    ...(offers ? { offers } : {}),
    additionalProperty: [
      args.capacityWh
        ? { "@type": "PropertyValue", name: "capacityWh", value: args.capacityWh }
        : null,
      args.outputW
        ? { "@type": "PropertyValue", name: "outputW", value: args.outputW }
        : null,
    ].filter(Boolean),
  };
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  url: string;
  locale: string;
  datePublished?: string;
  image?: string;
  publisherName?: string;
}) {
  const publisher = args.publisherName || "EcoFlow Stream";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    inLanguage: args.locale,
    mainEntityOfPage: args.url,
    datePublished: args.datePublished,
    image: args.image ? [args.image] : undefined,
    author: { "@type": "Organization", name: publisher },
    publisher: { "@type": "Organization", name: publisher },
  };
}
