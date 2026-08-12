import { Link } from "@/i18n/navigation";
import { AmazonButton } from "@/components/AmazonButton";
import { buildAmazonSearchUrl } from "@/lib/amazon";
import type { ArticleSection } from "@/data/articles";

export function ArticleBody({
  sections,
  amazonQuery,
  amazonLabel,
  amazonBadge,
}: {
  sections: ArticleSection[];
  amazonQuery?: string;
  amazonLabel?: string;
  amazonBadge?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 pb-16 pt-28 text-base leading-relaxed text-[var(--fog)] md:px-8">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--heading)]">
            {section.heading}
          </h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 48)} className="mt-3">
              {p}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {amazonQuery && amazonLabel && amazonBadge ? (
        <AmazonButton
          href={buildAmazonSearchUrl(amazonQuery)}
          label={amazonLabel}
          badge={amazonBadge}
        />
      ) : null}
      <p className="text-sm text-[var(--muted)]">
        <Link href="/produits" className="text-[var(--accent)] hover:underline">
          Voir le catalogue produits
        </Link>
      </p>
    </div>
  );
}
