"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { siteIsEuroMillions } from "@/sites/features";
import { useSite } from "./SiteProvider";

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
  const [promptEvent, setPromptEvent] = useState<{
    prompt: () => Promise<void>;
  } | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (!siteIsEuroMillions(site)) return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    if (standalone) setInstalled(true);
    const ua = window.navigator.userAgent;
    setIos(/iPad|iPhone|iPod/.test(ua) && !("MSStream" in window));
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as Event & { prompt: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [site]);

  if (!siteIsEuroMillions(site) || installed) {
    return installed ? (
      <p className="text-sm text-[var(--muted)]">{t("pwaInstalled")}</p>
    ) : null;
  }

  return (
    <div>
      {promptEvent ? (
        <button
          type="button"
          onClick={() => void promptEvent.prompt()}
          className="inline-flex min-h-11 items-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
        >
          {t("pwaInstall")}
        </button>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          {ios ? t("pwaIos") : t("pwaHint")}
        </p>
      )}
    </div>
  );
}
