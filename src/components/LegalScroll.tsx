"use client";

import { useEffect } from "react";

/** Scroll to ?section= or #hash on the consolidated legal page. */
export function LegalScroll() {
  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get(
      "section",
    );
    const fromHash = window.location.hash.replace(/^#/, "");
    const id = fromQuery || fromHash;
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return null;
}
