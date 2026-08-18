import { getGuideCopy } from "@/data/articles";
import { relatedCasinoGuideSlugs } from "@/data/casinos-crypto-guides-cluster";
import { resolveGuide } from "@/lib/guides/refresh";
import { Link } from "@/i18n/navigation";

export async function CasinosCryptoRelatedGuides({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const related = (
    await Promise.all(
      relatedCasinoGuideSlugs(slug).map((s) => resolveGuide(s, "casinos-crypto")),
    )
  ).filter(Boolean);

  if (!related.length) return null;

  const title =
    locale === "en" ? "Keep reading" : "Lire ensuite";

  return (
    <nav
      aria-label={title}
      className="mx-auto max-w-3xl border-t border-[var(--line)] px-5 py-10 md:px-8"
    >
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--heading)]">
        {title}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((guide) => {
          const copy = getGuideCopy(guide, locale);
          return (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="block h-full border border-[var(--line)] bg-[var(--surface)] p-4 text-sm transition hover:border-[var(--accent)]"
              >
                <span className="font-semibold text-[var(--heading)]">
                  {copy.title}
                </span>
                <span className="mt-1 line-clamp-2 block text-[var(--muted)]">
                  {copy.subtitle}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
