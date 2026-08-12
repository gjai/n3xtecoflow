export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EcoFlow Stream",
    url: siteUrl,
    description:
      "Site éditorial indépendant de guides et fiches techniques EcoFlow (affiliation Amazon).",
    disclaimer:
      "Non affilié officiellement à EcoFlow Inc. Contenu indépendant.",
  };
}

export function websiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EcoFlow Stream",
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
  capacityWh?: number;
  outputW?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    category: args.category,
    brand: { "@type": "Brand", name: "EcoFlow" },
    url: args.url,
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    inLanguage: args.locale,
    mainEntityOfPage: args.url,
    author: { "@type": "Organization", name: "EcoFlow Stream" },
    publisher: { "@type": "Organization", name: "EcoFlow Stream" },
  };
}
