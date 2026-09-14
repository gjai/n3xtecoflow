"use client";

import { useState } from "react";

export function CopyBlock({
  text,
  label,
  copiedLabel,
}: {
  text: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4">
      <pre className="overflow-x-auto whitespace-pre-wrap border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--heading)]">
        {text}
      </pre>
      <button
        type="button"
        className="mt-3 border border-[var(--line)] px-3 py-1.5 text-sm font-semibold text-[var(--heading)] hover:border-[var(--accent)]"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? copiedLabel : label}
      </button>
    </div>
  );
}
