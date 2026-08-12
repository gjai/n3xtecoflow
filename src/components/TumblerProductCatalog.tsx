"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { CoverImage } from "@/components/CoverImage";

export type TumblerCatalogItem = {
  slug: string;
  href: string;
  name: string;
  tagline: string;
  summary: string;
  category: string;
  categoryLabel: string;
  priceAmount: number | null;
  priceDisplay: string | null;
  capacityMl: number | null;
  capacityLabel: string;
  weightKg: number | null;
  media: {
    src: string;
    altFr: string;
    altEn: string;
    credit: string;
    creditUrl: string;
    packshot: boolean;
  };
};

type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "capacity-asc"
  | "capacity-desc"
  | "name-asc"
  | "name-desc"
  | "weight-asc";

type CategoryFilter = "all" | string;

function sortItems(items: TumblerCatalogItem[], sort: SortKey) {
  const list = [...items];
  const byName = (a: TumblerCatalogItem, b: TumblerCatalogItem) =>
    a.name.localeCompare(b.name, "fr", { sensitivity: "base" });

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => {
        if (a.priceAmount == null && b.priceAmount == null) return byName(a, b);
        if (a.priceAmount == null) return 1;
        if (b.priceAmount == null) return -1;
        return a.priceAmount - b.priceAmount || byName(a, b);
      });
    case "price-desc":
      return list.sort((a, b) => {
        if (a.priceAmount == null && b.priceAmount == null) return byName(a, b);
        if (a.priceAmount == null) return 1;
        if (b.priceAmount == null) return -1;
        return b.priceAmount - a.priceAmount || byName(a, b);
      });
    case "capacity-asc":
      return list.sort((a, b) => {
        if (a.capacityMl == null && b.capacityMl == null) return byName(a, b);
        if (a.capacityMl == null) return 1;
        if (b.capacityMl == null) return -1;
        return a.capacityMl - b.capacityMl || byName(a, b);
      });
    case "capacity-desc":
      return list.sort((a, b) => {
        if (a.capacityMl == null && b.capacityMl == null) return byName(a, b);
        if (a.capacityMl == null) return 1;
        if (b.capacityMl == null) return -1;
        return b.capacityMl - a.capacityMl || byName(a, b);
      });
    case "name-asc":
      return list.sort(byName);
    case "name-desc":
      return list.sort((a, b) => byName(b, a));
    case "weight-asc":
      return list.sort((a, b) => {
        if (a.weightKg == null && b.weightKg == null) return byName(a, b);
        if (a.weightKg == null) return 1;
        if (b.weightKg == null) return -1;
        return a.weightKg - b.weightKg || byName(a, b);
      });
    case "featured":
    default:
      return list;
  }
}

export function TumblerProductCatalog({
  locale,
  items,
}: {
  locale: string;
  items: TumblerCatalogItem[];
}) {
  const isEn = locale === "en";
  const [sort, setSort] = useState<SortKey>("featured");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) {
      if (!map.has(item.category)) {
        map.set(item.category, item.categoryLabel || item.category);
      }
    }
    return [...map.entries()];
  }, [items]);

  const visible = useMemo(() => {
    const filtered =
      category === "all"
        ? items
        : items.filter((i) => i.category === category);
    return sortItems(filtered, sort);
  }, [items, sort, category]);

  const selectClass =
    "border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--heading)]";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
      <div className="mb-6 flex flex-col gap-3 border border-[var(--line)] bg-[var(--surface)] p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">
              {isEn ? "Sort by" : "Trier par"}
            </span>
            <select
              className={`mt-1 block w-full min-w-[12rem] ${selectClass}`}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="featured">
                {isEn ? "Featured order" : "Ordre éditorial"}
              </option>
              <option value="price-asc">
                {isEn ? "Price · low to high" : "Prix · croissant"}
              </option>
              <option value="price-desc">
                {isEn ? "Price · high to low" : "Prix · décroissant"}
              </option>
              <option value="capacity-asc">
                {isEn ? "Capacity · small → large" : "Capacité · petite → grande"}
              </option>
              <option value="capacity-desc">
                {isEn ? "Capacity · large → small" : "Capacité · grande → petite"}
              </option>
              <option value="name-asc">
                {isEn ? "Name · A–Z" : "Nom · A–Z"}
              </option>
              <option value="name-desc">
                {isEn ? "Name · Z–A" : "Nom · Z–A"}
              </option>
              <option value="weight-asc">
                {isEn ? "Weight · lightest" : "Poids · plus léger"}
              </option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">
              {isEn ? "Format" : "Format"}
            </span>
            <select
              className={`mt-1 block w-full min-w-[10rem] ${selectClass}`}
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
            >
              <option value="all">{isEn ? "All" : "Tous"}</option>
              {categoryOptions.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {visible.length}{" "}
          {isEn
            ? visible.length === 1
              ? "product"
              : "products"
            : visible.length === 1
              ? "produit"
              : "produits"}
        </p>
      </div>

      <div className="grid gap-4">
        {visible.length === 0 ? (
          <p className="text-[var(--muted)]">
            {isEn
              ? "No products match this filter."
              : "Aucun produit pour ce filtre."}
          </p>
        ) : (
          visible.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="grid gap-4 border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)] md:grid-cols-[140px_1fr_auto] md:items-center"
            >
              <CoverImage
                image={{
                  src: item.media.src,
                  altFr: item.media.altFr,
                  altEn: item.media.altEn,
                  credit: item.media.credit,
                  creditUrl: item.media.creditUrl,
                }}
                locale={locale}
                className="aspect-square w-full border border-[var(--line)] md:aspect-[4/3]"
                packshot={item.media.packshot}
                sizes="140px"
              />
              <div>
                <h2 className="text-lg font-semibold text-[var(--heading)]">
                  {item.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.tagline}</p>
                <p className="mt-2 text-sm text-[var(--fog)]">{item.summary}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {isEn ? "Capacity" : "Capacité"} · {item.capacityLabel}
                  {item.categoryLabel
                    ? ` · ${item.categoryLabel}`
                    : ""}
                </p>
              </div>
              <div className="text-sm md:text-right">
                {item.priceDisplay ? (
                  <>
                    <p className="font-semibold text-[var(--heading)]">
                      {item.priceDisplay}
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--muted)]">
                      Amazon.fr
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-medium text-[var(--accent)]">
                    {isEn ? "Price on Amazon →" : "Prix sur Amazon →"}
                  </p>
                )}
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--heading)]">
                  {isEn ? "View sheet" : "Voir la fiche"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
