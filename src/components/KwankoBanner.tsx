"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/components/ConsentProvider";

const SCRIPT_URL =
  "https://img.metaffiliation.com/na/na/res/trk/script.js";

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
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current || !ref.current) return;
    rendered.current = true;
    const container = ref.current;
    const script1 = document.createElement("script");
    script1.src = SCRIPT_URL;
    script1.async = true;
    container.appendChild(script1);
    script1.onload = () => {
      const script2 = document.createElement("script");
      script2.textContent = `try { new KwankoSDKLoader.getSlot("${slot.id}"); } catch(e) {}`;
      container.appendChild(script2);
    };
  }, [slot.id]);

  return (
    <div
      ref={ref}
      style={{ minHeight: slot.h, width: "100%", maxWidth: slot.w }}
    >
      <noscript>
        <iframe
          src={`https://action.metaffiliation.com/trk.php?maff=N${slot.id.slice(1)}`}
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
