import Image from "next/image";
import type { SiteImage } from "@/data/images";

export function isUnoptimizedSrc(src: string) {
  return src.startsWith("/api/") || /\.svg(?:[?#]|$)/i.test(src);
}

/** Local SVG / API media: native img. Photos: next/image fill. */
export function FillMedia({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (isUnoptimizedSrc(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

type CoverImageProps = {
  image: SiteImage;
  locale?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  showCredit?: boolean;
  /** Prefer contain + inset for product packshots */
  packshot?: boolean;
};

export function CoverImage({
  image,
  locale = "fr",
  className = "",
  imgClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  showCredit = false,
  packshot = false,
}: CoverImageProps) {
  const alt = locale === "en" ? image.altEn : image.altFr;
  const fitClass =
    imgClassName || (packshot ? "object-contain" : "object-cover");

  return (
    <figure
      className={`relative overflow-hidden ${packshot ? "packshot-well" : ""} ${className}`}
    >
      <div
        className={
          packshot ? "absolute inset-3 md:inset-5" : "absolute inset-0"
        }
      >
        <FillMedia
          src={image.src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className={fitClass}
        />
      </div>
      {showCredit ? (
        <figcaption className="absolute bottom-2 right-2 z-10 rounded bg-black/45 px-2 py-0.5 text-[10px] text-white/90">
          <a
            href={image.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {image.credit}
          </a>
        </figcaption>
      ) : null}
    </figure>
  );
}
