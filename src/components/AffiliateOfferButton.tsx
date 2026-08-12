type AffiliateOfferButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function AffiliateOfferButton({
  href,
  label,
  variant = "primary",
  className = "",
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
      rel="sponsored noopener noreferrer"
      className={`${base} ${styles} ${className}`}
    >
      {label}
    </a>
  );
}
