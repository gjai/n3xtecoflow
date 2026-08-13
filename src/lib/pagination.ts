export type PageResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  from: number;
  to: number;
};

export const ARCHIVE_PAGE_SIZE = 20;

export function parsePageParam(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(value || "1", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PageResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    items: slice,
    page: safePage,
    pageSize,
    total,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
    from: total === 0 ? 0 : start + 1,
    to: start + slice.length,
  };
}

/** Compact page number list with ellipsis markers (0). */
export function pageWindow(
  current: number,
  totalPages: number,
  radius = 1,
): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, current]);
  for (let i = current - radius; i <= current + radius; i += 1) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: number[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const n = sorted[i];
    if (i > 0 && n - sorted[i - 1] > 1) out.push(0);
    out.push(n);
  }
  return out;
}

/** `?page=` omitted on page 1. Hash `#archives` for in-page lists. */
export function archivePageHref(
  pathname: string,
  page: number,
  extra?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const q = params.toString();
  return `${pathname}${q ? `?${q}` : ""}#archives`;
}
