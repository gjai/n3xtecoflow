"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ConsentState = {
  necessary: true;
  advertising: boolean;
  decided: boolean;
};

type ConsentContextValue = {
  consent: ConsentState;
  acceptAll: () => void;
  rejectAds: () => void;
  openPreferences: () => void;
  preferencesOpen: boolean;
  setPreferencesOpen: (open: boolean) => void;
};

const STORAGE_KEY = "efs-cookie-consent-v2";

const defaultConsent: ConsentState = {
  necessary: true,
  advertising: false,
  decided: false,
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function readStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      advertising: Boolean(parsed.advertising),
      decided: true,
    };
  } catch {
    return null;
  }
}

function persistConsent(consent: ConsentState) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      advertising: consent.advertising,
      decided: true,
      ts: Date.now(),
    }),
  );
}

function pushConsentUpdate(advertising: boolean) {
  if (typeof window === "undefined") return;
  const state = advertising ? "granted" : "denied";
  const payload = {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  };
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", payload);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["consent", "update", payload]);
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setConsent(stored);
      pushConsentUpdate(stored.advertising);
    }
    setHydrated(true);
  }, []);

  const acceptAll = useCallback(() => {
    const next: ConsentState = {
      necessary: true,
      advertising: true,
      decided: true,
    };
    setConsent(next);
    persistConsent(next);
    pushConsentUpdate(true);
    setPreferencesOpen(false);
  }, []);

  const rejectAds = useCallback(() => {
    const next: ConsentState = {
      necessary: true,
      advertising: false,
      decided: true,
    };
    setConsent(next);
    persistConsent(next);
    pushConsentUpdate(false);
    setPreferencesOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      consent: hydrated ? consent : defaultConsent,
      acceptAll,
      rejectAds,
      openPreferences: () => setPreferencesOpen(true),
      preferencesOpen,
      setPreferencesOpen,
    }),
    [hydrated, consent, acceptAll, rejectAds, preferencesOpen],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}
