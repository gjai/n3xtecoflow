import Image from "next/image";
import type { SiteImage } from "@/data/images";

type Props = {
  src?: string | null;
  fallback: SiteImage;
  locale?: string;
  credit?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** News/product cover: prefers scraped/local src, else lifestyle fallback. */
export function SmartCover({
  src,
  fallback,
  locale = "fr",
  credit,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: Props) {
  const alt = locale === "en" ? fallback.altEn : fallback.altFr;
  const useSrc = src?.trim() || fallback.src;
  const isApi = useSrc.startsWith("/api/");

  return (
    <figure className={`relative overflow-hidden bg-[var(--surface)] ${className}`}>
      {isApi ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={useSrc}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <Image
          src={useSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
      {credit ? (
        <figcaption className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white/90">
          {credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
