import { Link } from "@/i18n/navigation";
import { pageWindow } from "@/lib/pagination";

type PaginationProps = {
  pathname: string;
  page: number;
  totalPages: number;
  prevLabel: string;
  nextLabel: string;
  pageLabel: string;
};

function hrefFor(pathname: string, page: number) {
  if (page <= 1) return pathname;
  return `${pathname}?page=${page}`;
}

export function Pagination({
  pathname,
  page,
  totalPages,
  prevLabel,
  nextLabel,
  pageLabel,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);

  return (
    <nav
      className="mt-12 flex flex-col items-center gap-4 border-t border-[var(--line)] pt-8"
      aria-label={pageLabel}
    >
      <p className="text-sm text-[var(--muted)]">
        {pageLabel
          .replace("{page}", String(page))
          .replace("{total}", String(totalPages))}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 ? (
          <Link
            href={hrefFor(pathname, page - 1)}
            className="border border-[var(--line)] px-3 py-2 text-sm text-[var(--heading)] hover:border-[var(--accent)]"
            rel="prev"
          >
            {prevLabel}
          </Link>
        ) : (
          <span className="border border-transparent px-3 py-2 text-sm text-[var(--muted)] opacity-40">
            {prevLabel}
          </span>
        )}

        {pages.map((n, idx) =>
          n === 0 ? (
            <span
              key={`e-${idx}`}
              className="px-1 text-sm text-[var(--muted)]"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Link
              key={n}
              href={hrefFor(pathname, n)}
              aria-current={n === page ? "page" : undefined}
              className={
                n === page
                  ? "bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--accent-ink)]"
                  : "border border-[var(--line)] px-3 py-2 text-sm text-[var(--heading)] hover:border-[var(--accent)]"
              }
            >
              {n}
            </Link>
          ),
        )}

        {page < totalPages ? (
          <Link
            href={hrefFor(pathname, page + 1)}
            className="border border-[var(--line)] px-3 py-2 text-sm text-[var(--heading)] hover:border-[var(--accent)]"
            rel="next"
          >
            {nextLabel}
          </Link>
        ) : (
          <span className="border border-transparent px-3 py-2 text-sm text-[var(--muted)] opacity-40">
            {nextLabel}
          </span>
        )}
      </div>
    </nav>
  );
}
