import type { Product } from "@/data/products";

/** Extrait une capacité en ml depuis les specs (Capacité / Capacity). */
export function parseCapacityMl(product: Product): number | null {
  const raw =
    product.specs.find((s) => /capacit/i.test(s.label))?.value?.trim() || "";
  if (!raw) return null;

  // Préférer une valeur explicite en ml (ex. "0,89 L (887 ml)" → 887)
  const mlMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);
  if (mlMatch) {
    const n = Number.parseFloat(mlMatch[1].replace(",", "."));
    return Number.isFinite(n) ? Math.round(n) : null;
  }

  // Litres : "1,2 L", "1 L", "0,75 Liter"
  const lMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*l(?:itre)?s?\b/i);
  if (lMatch) {
    const n = Number.parseFloat(lMatch[1].replace(",", "."));
    return Number.isFinite(n) ? Math.round(n * 1000) : null;
  }

  // "~590" ou "500" seuls
  const bare = raw.match(/~?\s*(\d+(?:[.,]\d+)?)/);
  if (bare) {
    const n = Number.parseFloat(bare[1].replace(",", "."));
    if (!Number.isFinite(n)) return null;
    return n <= 20 ? Math.round(n * 1000) : Math.round(n);
  }

  return null;
}

export function formatCapacityMl(ml: number | null, locale: string): string {
  if (ml == null) return "—";
  if (ml >= 1000) {
    const liters = ml / 1000;
    const text =
      Number.isInteger(liters) || liters * 10 === Math.round(liters * 10)
        ? liters.toLocaleString(locale === "en" ? "en-GB" : "fr-FR", {
            maximumFractionDigits: 2,
          })
        : liters.toLocaleString(locale === "en" ? "en-GB" : "fr-FR", {
            maximumFractionDigits: 2,
          });
    return `${text} L`;
  }
  return `${ml} ml`;
}
