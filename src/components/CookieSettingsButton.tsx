"use client";

import { useConsent } from "./ConsentProvider";

export function CookieSettingsButton({ label }: { label: string }) {
  const { openPreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="hover:text-[var(--heading)]"
    >
      {label}
    </button>
  );
}
