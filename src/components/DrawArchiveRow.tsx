import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

/** Ligne d’archive commune à tous les jeux (date + boules + action). */
export function DrawArchiveRow({
  href,
  title,
  balls,
  extra,
  actionHref,
  actionLabel,
}: {
  href: string;
  title: string;
  balls: ReactNode;
  extra?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={href}
        className="min-w-0 flex-1 transition hover:text-[var(--accent)]"
      >
        <p className="font-semibold text-[var(--heading)]">{title}</p>
        <div className="mt-1">{balls}</div>
        {extra}
      </Link>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="shrink-0 text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          {actionLabel} →
        </Link>
      ) : null}
    </li>
  );
}
