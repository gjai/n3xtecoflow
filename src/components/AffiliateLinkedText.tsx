import type { AffiliateOffer } from "@/lib/affiliates";
import {
  CASINO_AFFILIATE_KEYWORD_RULES,
  splitAffiliateKeywordParts,
  type AffiliateKeywordRule,
} from "@/lib/affiliates/keyword-links";

const LINK_CLASS =
  "font-medium text-[var(--accent)] underline-offset-2 hover:underline";

/** Inline affiliate links on Stake / VPN / crypto keywords (casino theme). */
export function AffiliateLinkedText({
  text,
  offers,
  rules = CASINO_AFFILIATE_KEYWORD_RULES,
}: {
  text: string;
  offers?: AffiliateOffer[] | null;
  rules?: AffiliateKeywordRule[];
}) {
  if (!offers?.length) return <>{text}</>;

  const parts = splitAffiliateKeywordParts(text, offers, rules);
  return (
    <>
      {parts.map((part, i) =>
        part.type === "link" ? (
          <a
            key={`${part.href}-${i}-${part.value}`}
            href={part.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className={LINK_CLASS}
          >
            {part.value}
          </a>
        ) : (
          <span key={`t-${i}`}>{part.value}</span>
        ),
      )}
    </>
  );
}
