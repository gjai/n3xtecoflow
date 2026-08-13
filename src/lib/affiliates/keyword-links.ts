import type { AffiliateOffer } from "@/lib/affiliates";

export type AffiliateKeywordRule = {
  offerId: string;
  /** Longer / more specific patterns first within the global list. */
  pattern: RegExp;
};

/** Casino theme: every Stake / VPN / crypto mention → affiliate. */
export const CASINO_AFFILIATE_KEYWORD_RULES: AffiliateKeywordRule[] = [
  { offerId: "cryptocom", pattern: /Crypto\.com/gi },
  { offerId: "cryptocom", pattern: /CryptoCom/gi },
  { offerId: "nordvpn", pattern: /Nord\s*VPN/gi },
  { offerId: "stake", pattern: /Stake\.com/gi },
  { offerId: "stake", pattern: /\bcrypto\s*casinos?\b/gi },
  { offerId: "stake", pattern: /\bcasinos?\s*crypto\b/gi },
  { offerId: "stake", pattern: /\bStake\b/gi },
  { offerId: "nordvpn", pattern: /\bVPN\b/gi },
  { offerId: "cryptocom", pattern: /\bcrypto\b/gi },
];

type MatchHit = {
  start: number;
  end: number;
  text: string;
  href: string;
};

function collectHits(
  text: string,
  hrefById: Map<string, string>,
  rules: AffiliateKeywordRule[],
): MatchHit[] {
  const hits: MatchHit[] = [];
  for (const rule of rules) {
    const href = hrefById.get(rule.offerId);
    if (!href) continue;
    const re = new RegExp(rule.pattern.source, rule.pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (!m[0]) {
        re.lastIndex += 1;
        continue;
      }
      hits.push({
        start: m.index,
        end: m.index + m[0].length,
        text: m[0],
        href,
      });
    }
  }
  // Same start → longer match wins (Crypto.com before crypto).
  hits.sort(
    (a, b) =>
      a.start - b.start || b.end - b.start - (a.end - a.start),
  );
  const kept: MatchHit[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start < cursor) continue;
    kept.push(hit);
    cursor = hit.end;
  }
  return kept;
}

export type AffiliateTextPart =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string };

/** Split plain text into text / affiliate-link parts (no overlapping links). */
export function splitAffiliateKeywordParts(
  text: string,
  offers: AffiliateOffer[],
  rules: AffiliateKeywordRule[] = CASINO_AFFILIATE_KEYWORD_RULES,
): AffiliateTextPart[] {
  if (!text || !offers.length) return [{ type: "text", value: text }];

  const hrefById = new Map(offers.map((o) => [o.id, o.href]));
  const hits = collectHits(text, hrefById, rules);
  if (!hits.length) return [{ type: "text", value: text }];

  const parts: AffiliateTextPart[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start > cursor) {
      parts.push({ type: "text", value: text.slice(cursor, hit.start) });
    }
    parts.push({ type: "link", value: hit.text, href: hit.href });
    cursor = hit.end;
  }
  if (cursor < text.length) {
    parts.push({ type: "text", value: text.slice(cursor) });
  }
  return parts;
}
