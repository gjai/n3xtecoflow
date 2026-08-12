type AmazonButtonProps = {
  href: string;
  label: string;
  /** Optional short note under the button. Omit when AffiliateDisclosure is shown nearby. */
  badge?: string;
  className?: string;
  /** Formatted Amazon price, e.g. "549,00 €" */
  priceDisplay?: string | null;
  priceHint?: string;
  availability?: string | null;
  /** When no live price, still show a strong price CTA line */
  priceFallback?: string;
  /** larger = full-width buy block */
  size?: "default" | "lg";
};

export function AmazonButton({
  href,
  label,
  badge,
  className = "",
  priceDisplay,
  priceHint,
  availability,
  priceFallback,
  size = "default",
}: AmazonButtonProps) {
  const large = size === "lg";

  return (
    <div
      className={`flex flex-col gap-2 ${large ? "w-full" : "inline-flex"} ${className}`}
    >
      {priceDisplay ? (
        <div>
          <p
            className={`font-[family-name:var(--font-display)] font-semibold text-[var(--heading)] ${
              large ? "text-3xl" : "text-2xl"
            }`}
          >
            {priceDisplay}
          </p>
          {priceHint ? (
            <p className="mt-1 text-xs text-[var(--muted)]">{priceHint}</p>
          ) : null}
          {availability ? (
            <p className="mt-1 text-xs text-[var(--fog)]">{availability}</p>
          ) : null}
        </div>
      ) : priceFallback ? (
        <p className="text-sm font-medium text-[var(--heading)]">{priceFallback}</p>
      ) : null}
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className={`inline-flex items-center justify-center bg-[var(--accent)] font-semibold tracking-wide text-[var(--accent-ink)] transition hover:brightness-110 ${
          large
            ? "min-h-12 w-full px-6 py-3.5 text-base"
            : "px-5 py-3 text-sm"
        }`}
      >
        {label}
      </a>
      {badge ? (
        <span className="text-xs text-[var(--muted)]">{badge}</span>
      ) : null}
    </div>
  );
}
