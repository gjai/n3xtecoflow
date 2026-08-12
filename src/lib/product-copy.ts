import type { LocaleCopy, Product } from "@/data/products";
import type { EcoflowEditorialEntry } from "@/lib/ecoflow/editorial-types";

export function resolveProductCopy(
  product: Product,
  locale: string,
  editorial: EcoflowEditorialEntry | null | undefined,
): LocaleCopy {
  if (editorial) {
    return locale === "en" ? editorial.en : editorial.fr;
  }
  return locale === "en" ? product.en : product.fr;
}
