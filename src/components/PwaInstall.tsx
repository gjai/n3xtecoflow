"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { siteIsEuroMillions } from "@/sites/features";
import { useSite } from "./SiteProvider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

type DeviceKind = "ios" | "android" | "desktop";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

function detectDevice(): DeviceKind {
  const ua = navigator.userAgent || "";
  const iOS =
    /iPhone|iPod/.test(ua) ||
    /iPad/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (iOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function PwaRegister() {
  const site = useSite();
  useEffect(() => {
    if (!siteIsEuroMillions(site)) return;
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js", { scope: "/" });
  }, [site]);
  return null;
}

export function PwaInstallButton() {
  const t = useTranslations("alerts");
  const site = useSite();
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(false);
  const [device, setDevice] = useState<DeviceKind>("desktop");

  useEffect(() => {
    if (!siteIsEuroMillions(site)) return;
    if (isStandalone()) setInstalled(true);
    setDevice(detectDevice());

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [site]);

  if (!siteIsEuroMillions(site)) return null;
  if (installed) {
    return <p className="text-sm text-[var(--muted)]">{t("pwaInstalled")}</p>;
  }

  const hint =
    device === "ios"
      ? t("pwaIos")
      : device === "android"
        ? t("pwaAndroid")
        : t("pwaDesktop");

  return (
    <div className="space-y-2">
      {promptEvent ? (
        <button
          type="button"
          onClick={() => void promptEvent.prompt()}
          className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
        >
          {t("pwaInstall")}
        </button>
      ) : null}
      <p className="text-sm text-[var(--muted)]">{hint}</p>
    </div>
  );
}
