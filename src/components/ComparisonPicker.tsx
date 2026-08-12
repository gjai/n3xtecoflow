"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AmazonButton } from "@/components/AmazonButton";
import type { CompareProductView, CompareRow } from "@/lib/comparisons/hub";

type Option = { slug: string; name: string };

export function ComparisonPicker({
  locale,
  options,
  initialLeft,
  initialRight,
  products,
}: {
  locale: string;
  options: Option[];
  initialLeft: string;
  initialRight: string;
  products: Record<string, CompareProductView>;
}) {
  const isEn = locale === "en";
  const [leftSlug, setLeftSlug] = useState(initialLeft);
  const [rightSlug, setRightSlug] = useState(initialRight);

  const left = products[leftSlug] || products[initialLeft];
  const right = products[rightSlug] || products[initialRight];

  const rows: CompareRow[] = useMemo(() => {
    if (!left || !right) return [];
    const base: CompareRow[] = [];
    if (left.capacityWh || right.capacityWh) {
      base.push({
        key: "capacity",
        labelFr: "Capacité",
        labelEn: "Capacity",
        left: left.capacityWh ? `${left.capacityWh} Wh` : "—",
        right: right.capacityWh ? `${right.capacityWh} Wh` : "—",
      });
    }
    if (left.outputW || right.outputW) {
      base.push({
        key: "output",
        labelFr: "Sortie AC",
        labelEn: "AC output",
        left: left.outputW ? `${left.outputW} W` : "—",
        right: right.outputW ? `${right.outputW} W` : "—",
      });
    }
    if (left.weightKg != null || right.weightKg != null) {
      base.push({
        key: "weight",
        labelFr: "Poids",
        labelEn: "Weight",
        left: left.weightKg != null ? `${left.weightKg} kg` : "—",
        right: right.weightKg != null ? `${right.weightKg} kg` : "—",
      });
    }
    base.push({
      key: "battery",
      labelFr: "Batterie / matière",
      labelEn: "Battery / material",
      left: left.battery,
      right: right.battery,
    });
    base.push({
      key: "price",
      labelFr: "Prix indicatif",
      labelEn: "Indicative price",
      left: left.priceDisplay || (isEn ? "See Amazon" : "Voir Amazon"),
      right: right.priceDisplay || (isEn ? "See Amazon" : "Voir Amazon"),
    });
    const labels = new Set<string>();
    for (const s of [...left.specs, ...right.specs]) labels.add(s.label);
    for (const label of labels) {
      base.push({
        key: `spec-${label}`,
        labelFr: label,
        labelEn: label,
        left: left.specs.find((s) => s.label === label)?.value || "—",
        right: right.specs.find((s) => s.label === label)?.value || "—",
      });
    }
    return base;
  }, [left, right, isEn]);

  if (!left || !right) return null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--muted)]">
            {isEn ? "Product A" : "Produit A"}
          </span>
          <select
            className="mt-2 w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-3 text-[var(--heading)]"
            value={leftSlug}
            onChange={(e) => setLeftSlug(e.target.value)}
          >
            {options.map((o) => (
              <option key={o.slug} value={o.slug} disabled={o.slug === rightSlug}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-[var(--muted)]">
            {isEn ? "Product B" : "Produit B"}
          </span>
          <select
            className="mt-2 w-full border border-[var(--line)] bg-[var(--surface)] px-3 py-3 text-[var(--heading)]"
            value={rightSlug}
            onChange={(e) => setRightSlug(e.target.value)}
          >
            {options.map((o) => (
              <option key={o.slug} value={o.slug} disabled={o.slug === leftSlug}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[left, right].map((p) => (
          <div
            key={p.slug}
            className="border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.imageSrc}
              alt={p.name}
              className="mx-auto h-40 w-full object-contain"
            />
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl text-[var(--heading)]">
              {p.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{p.tagline}</p>
            {p.priceDisplay ? (
              <p className="mt-2 font-semibold text-[var(--heading)]">
                {p.priceDisplay}
              </p>
            ) : null}
            <div className="mt-4 space-y-3">
              <AmazonButton
                href={p.amazonHref}
                label={isEn ? "Buy on Amazon.fr" : "Acheter sur Amazon.fr"}
                size="lg"
              />
              <Link
                href={p.href}
                className="block text-sm text-[var(--accent)] hover:underline"
              >
                {isEn ? "View product sheet →" : "Voir la fiche produit →"}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto border border-[var(--line)]">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-[var(--surface)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">
                {isEn ? "Spec" : "Caractéristique"}
              </th>
              <th className="px-4 py-3 font-medium">{left.name}</th>
              <th className="px-4 py-3 font-medium">{right.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-[var(--line)]">
                <td className="px-4 py-3 text-[var(--muted)]">
                  {isEn ? row.labelEn : row.labelFr}
                </td>
                <td className="px-4 py-3 text-[var(--heading)]">{row.left}</td>
                <td className="px-4 py-3 text-[var(--heading)]">{row.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AffiliateDisclosure compact />
    </div>
  );
}
