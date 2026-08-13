import type { SiteImage } from "@/data/images";
import type { ArticleCoverImage } from "@/lib/article-images";
import { FillMedia } from "./CoverImage";

type ArticleCoverProps = {
  images: ArticleCoverImage[];
  fallback: SiteImage;
  locale?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** object-contain for packshots on surface bg */
  packshot?: boolean;
};

/**
 * 1 image = plein cadre ; 2+ = grille packshots produits côte à côte.
 */
export function ArticleCover({
  images,
  fallback,
  locale = "fr",
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  packshot = true,
}: ArticleCoverProps) {
  const list: ArticleCoverImage[] =
    images.length > 0 ? images : [{ ...fallback }];
  const dual = list.length >= 2;

  if (!dual) {
    const image = list[0];
    const alt = locale === "en" ? image.altEn : image.altFr;
    return (
      <figure
        className={`relative overflow-hidden ${
          packshot ? "packshot-well" : "bg-[var(--surface)]"
        } ${className}`}
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
            className={packshot ? "object-contain" : "object-cover"}
          />
        </div>
      </figure>
    );
  }

  return (
    <figure
      className={`grid grid-cols-2 overflow-hidden ${
        packshot ? "packshot-well" : "bg-[var(--surface)]"
      } ${className}`}
    >
      {list.slice(0, 2).map((image, idx) => {
        const alt = locale === "en" ? image.altEn : image.altFr;
        return (
          <div
            key={`${image.productSlug || image.src}-${idx}`}
            className="relative h-full min-h-[10rem] border-r border-[var(--line)] last:border-r-0"
          >
            <div className="absolute inset-3 md:inset-5">
              <FillMedia
                src={image.src}
                alt={alt}
                sizes={sizes}
                priority={priority}
                className="object-contain"
              />
            </div>
          </div>
        );
      })}
    </figure>
  );
}
