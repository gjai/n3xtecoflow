import { products, type Product } from "@/data/products";
import { amazonHrefForProduct, buildAmazonSearchUrl } from "@/lib/amazon";
import type { NewsArticle } from "@/lib/news/types";

function scoreProduct(haystack: string, product: Product): number {
  const h = haystack
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const tokens = [
    product.slug,
    product.name,
    product.amazonQuery,
    product.category,
    ...product.slug.split("-"),
    ...product.name.split(/\s+/),
  ];
  let score = 0;
  for (const raw of tokens) {
    const t = raw
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
    if (t.length < 3 || t === "ecoflow") continue;
    if (h.includes(t)) score += t.length >= 5 ? 3 : 1;
  }
  return score;
}

/** Pick best catalog product for a news piece, else generic EcoFlow search. */
export function amazonCtaForNews(article: NewsArticle): {
  href: string;
  queryLabel: string;
  product: Product | null;
} {
  const hay = [
    article.fr?.title,
    article.en?.title,
    article.fr?.excerpt,
    ...(article.tags || []),
  ]
    .filter(Boolean)
    .join(" ");

  const ranked = products
    .map((p) => ({ p, s: scoreProduct(hay, p) }))
    .filter((x) => x.s >= 3)
    .sort((a, b) => b.s - a.s);

  const best = ranked[0]?.p || null;
  if (best) {
    return {
      href: amazonHrefForProduct(best),
      queryLabel: best.name,
      product: best,
    };
  }

  const query = "EcoFlow station électrique";
  return {
    href: buildAmazonSearchUrl(query),
    queryLabel: query,
    product: null,
  };
}
