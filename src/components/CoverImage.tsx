import Image from "next/image";
import type { SiteImage } from "@/data/images";

type CoverImageProps = {
  image: SiteImage;
  locale?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  showCredit?: boolean;
};

export function CoverImage({
  image,
  locale = "fr",
  className = "",
  imgClassName = "object-cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  showCredit = false,
}: CoverImageProps) {
  const alt = locale === "en" ? image.altEn : image.altFr;

  return (
    <figure className={`relative overflow-hidden ${className}`}>
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={imgClassName}
      />
      {showCredit ? (
        <figcaption className="absolute bottom-2 right-2 rounded bg-black/45 px-2 py-0.5 text-[10px] text-white/90">
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
