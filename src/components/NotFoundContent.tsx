export function NotFoundContent({
  brand,
  title,
  body,
  links,
}: {
  brand: string;
  title: string;
  body: string;
  links: Array<{ href: string; label: string; primary?: boolean }>;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-20 md:px-8">
      <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.28em] text-[var(--accent)]">
        {brand}
      </p>
      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
        404
      </p>
      <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--heading)] md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-xl text-base text-[var(--muted)] md:text-lg">
        {body}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        {links.map((link) =>
          link.primary ? (
            <a
              key={link.href}
              href={link.href}
              className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] transition hover:brightness-110"
            >
              {link.label}
            </a>
          ) : (
            <a
              key={link.href}
              href={link.href}
              className="border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]"
            >
              {link.label}
            </a>
          ),
        )}
      </div>
    </main>
  );
}
