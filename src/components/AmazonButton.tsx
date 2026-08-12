type AmazonButtonProps = {
  href: string;
  label: string;
  badge: string;
  className?: string;
};

export function AmazonButton({
  href,
  label,
  badge,
  className = "",
}: AmazonButtonProps) {
  return (
    <div className={`inline-flex flex-col gap-2 ${className}`}>
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
