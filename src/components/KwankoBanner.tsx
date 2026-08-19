"use client";

import { useEffect, useId, useRef } from "react";
import { useConsent } from "@/components/ConsentProvider";

const SCRIPT_URL =
  "https://img.metaffiliation.com/na/na/res/trk/script.js";

let scriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

function loadKwankoScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error("kwanko_script_failed"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

type SlotDef = {
  id: string;
  w: number;
  h: number;
};

export type KwankoBannerProps = {
  desktop: SlotDef;
  mobile?: SlotDef;
  label?: string;
  className?: string;
};

function SlotRenderer({ slot }: { slot: SlotDef }) {
  const uid = useId().replace(/:/g, "_");
  const containerId = `kwanko_${uid}`;
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;
    loadKwankoScript().then(() => {
      try {
        // @ts-expect-error Kwanko global
        new KwankoSDKLoader.getSlot(slot.id);
      } catch {
        /* slot may already exist */
      }
    });
  }, [slot.id]);

  const noscriptSrc = `https://action.metaffiliation.com/trk.php?maff=N${slot.id.slice(1)}`;

  return (
    <div id={containerId}>
      <noscript>
        <iframe
          src={noscriptSrc}
          width={slot.w}
          height={slot.h}
          frameBorder={0}
          scrolling="no"
          title="FDJ"
        />
      </noscript>
    </div>
  );
}

export function KwankoBanner({
  desktop,
  mobile,
  label = "Publicité",
  className = "",
}: KwankoBannerProps) {
  const { consent } = useConsent();

  if (!consent.advertising) return null;

  return (
    <aside
      className={`flex justify-center py-4 ${className}`}
      aria-label={label}
    >
      {mobile ? (
        <>
          <div className="hidden md:block">
            <SlotRenderer slot={desktop} />
          </div>
          <div className="md:hidden">
            <SlotRenderer slot={mobile} />
          </div>
        </>
      ) : (
        <SlotRenderer slot={desktop} />
      )}
    </aside>
  );
}
