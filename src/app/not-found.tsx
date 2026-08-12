import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 · EcoFlow Stream",
  robots: { index: false, follow: true },
};

/** Root fallback (replaces default Next.js not-found UI in the root slot). */
export default function RootNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-20 md:px-8">
      <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent)]">
        EcoFlow Stream
      </p>
      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
        404
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--heading)] md:text-5xl">
        Page introuvable
      </h1>
      <p className="mt-5 max-w-xl text-[var(--muted)]">
        Cette adresse n’existe pas — ou le contenu a été déplacé.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href="/fr"
          className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)]"
        >
          Retour à l’accueil
        </a>
        <a
          href="/fr/produits"
          className="border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--heading)]"
        >
          Produits
        </a>
      </div>
    </main>
  );
}
