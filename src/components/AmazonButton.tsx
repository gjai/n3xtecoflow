type AmazonButtonProps = {
  href: string;
  label: string;
  badge: string;
  className?: string;
  /** Formatted Amazon price, e.g. "549,00 €" */
  priceDisplay?: string | null;
  priceHint?: string;
  availability?: string | null;
};

export function AmazonButton({
  href,
  label,
  badge,
  className = "",
  priceDisplay,
  priceHint,
  availability,
}: AmazonButtonProps) {
  return (
    <div className={`inline-flex flex-col gap-2 ${className}`}>
      {priceDisplay ? (
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--heading)]">
            {priceDisplay}
          </p>
          {priceHint ? (
            <p className="mt-1 text-xs text-[var(--muted)]">{priceHint}</p>
          ) : null}
          {availability ? (
            <p className="mt-1 text-xs text-[var(--fog)]">{availability}</p>
          ) : null}
        </div>
      ) : null}
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="inline-flex items-center justify-center bg-[var(--accent)] px-5 py-3 text-sm font-semibold tracking-wide text-[var(--accent-ink)] transition hover:brightness-110"
      >
        {label}
      </a>
      <span className="text-xs text-[var(--muted)]">{badge}</span>
    </div>
  );
}
