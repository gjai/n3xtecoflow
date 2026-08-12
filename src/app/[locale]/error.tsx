"use client";

import { useEffect } from "react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col justify-center px-5 py-24 md:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--heading)]">
        Une erreur est survenue
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        Impossible d’afficher cette page pour le moment. Réessayez, ou revenez à
        l’accueil.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)]"
        >
          Réessayer
        </button>
        <a
          href="/fr"
          className="border border-[var(--line)] px-4 py-2 text-sm text-[var(--heading)]"
        >
          Accueil
        </a>
      </div>
    </div>
  );
}
