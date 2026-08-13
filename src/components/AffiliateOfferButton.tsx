type AffiliateOfferButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  /** True when the URL is a tracked affiliate redirect (Kwanko, etc.). */
  tracked?: boolean;
};

export function AffiliateOfferButton({
  href,
  label,
  variant = "primary",
  className = "",
  tracked = false,
}: AffiliateOfferButtonProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center px-5 py-2.5 text-sm font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-[var(--accent-ink)] hover:opacity-90"
      : "border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface)]";

  return (
    <a
      href={href}
      target="_blank"
      rel={
        tracked
          ? "sponsored noopener noreferrer"
          : "noopener noreferrer"
      }
      className={`${base} ${styles} ${className}`}
    >
      {label}
    </a>
  );
}
