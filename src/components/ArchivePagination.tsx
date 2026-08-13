import { Link } from "@/i18n/navigation";
import { pageWindow } from "@/lib/pagination";

export function ArchivePagination({
  page,
  totalPages,
  hrefForPage,
  prevLabel,
  nextLabel,
  pageOf,
  range,
}: {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  prevLabel: string;
  nextLabel: string;
  pageOf: string;
  range: string;
}) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);

  return (
    <nav
      className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label={pageOf}
    >
      <p className="text-sm text-[var(--muted)]">
        {range}
        <span className="sr-only"> · {pageOf}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {page > 1 ? (
          <Link
            href={hrefForPage(page - 1)}
            className="border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
          >
            ← {prevLabel}
          </Link>
        ) : (
          <span className="border border-transparent px-3 py-2 text-sm text-[var(--muted)]">
            ← {prevLabel}
          </span>
        )}
        {pages.map((item, i) =>
          item === 0 ? (
            <span key={`gap-${i}`} className="px-1 text-[var(--muted)]">
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefForPage(item)}
              aria-current={item === page ? "page" : undefined}
              className={
                item === page
                  ? "bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--accent-ink)]"
                  : "border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
              }
            >
              {item}
            </Link>
          ),
        )}
        {page < totalPages ? (
          <Link
            href={hrefForPage(page + 1)}
            className="border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
          >
            {nextLabel} →
          </Link>
        ) : (
          <span className="border border-transparent px-3 py-2 text-sm text-[var(--muted)]">
            {nextLabel} →
          </span>
        )}
      </div>
    </nav>
  );
}
