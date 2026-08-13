import {
  getEditorial,
  topicBrandRegex,
  topicProductRegex,
} from "@/sites/editorial";
import type { SiteId } from "@/sites/types";

export type RssItem = {
  title: string;
  link: string;
  guid: string;
  publishedAt: string;
  sourceName: string;
  /** Publisher homepage from <source url="..."> when present (Google News). */
  sourceHomepage?: string;
  description: string;
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string) {
  return decodeXml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string) {
  const re = new RegExp(`<${name}([^>]*)>([\\s\\S]*?)</${name}>`, "i");
  const m = block.match(re);
  return m ? decodeXml(m[2].trim()) : "";
}

function attr(block: string, name: string, attrName: string) {
  const re = new RegExp(`<${name}[^>]*${attrName}="([^"]+)"[^>]*>`, "i");
  const m = block.match(re);
  return m ? decodeXml(m[1]) : "";
}

export function parseRssItems(xml: string): RssItem[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items
    .map((block) => {
      const title = stripTags(tag(block, "title"));
      const link = stripTags(tag(block, "link"));
      const guid = stripTags(tag(block, "guid")) || link;
      const pubDate = stripTags(tag(block, "pubDate"));
      const description = stripTags(tag(block, "description"));
      const sourceName =
        stripTags(tag(block, "source")) ||
        attr(block, "source", "url") ||
        "Source";
      const sourceHomepage = attr(block, "source", "url") || undefined;
      const publishedAt = pubDate
        ? new Date(pubDate).toISOString()
        : new Date().toISOString();
      return {
        title,
        link,
        guid,
        publishedAt,
        sourceName,
        sourceHomepage,
        description,
      };
    })
    .filter((i) => i.title && i.link && i.guid);
}

const OFF_TOPIC =
  /\bsegway\b|\bxyber\b|\be-?bike\b|\btesla\b|\biphone\b|\bsamsung\b|\bplaystation\b|\bxbox\b|\bnintendo\b|\bdyson\b|\broborock\b|\becovacs\b|\bbalances?\s+connect|\bmassage\s+(pour\s+)?les\s+pieds\b|\bfoot\s+massager\b|\bchaise\s+de\s+massage\b|\bpressoth[eé]rapie\b|\bbottes?\s+de\s+press|\bcompression\s+boots?\b|\beclipse\b/i;

const OFF_TOPIC_HARD =
  /\bpressoth[eé]rapie\b|\bbottes?\s+de\s+press|\bcompression\s+boots?\b|\bbalances?\s+connect|\bmassage\s+(pour\s+)?les\s+pieds\b|\bfoot\s+massager\b|\bchaise\s+de\s+massage\b|\bthermo[-\s]?pad\b|\bpad\s+chaud\b|\bchaud[-\s]?froid\b/i;

/** Casino / US lottery / sports betting — hors périmètre EuroMillions-résultats. */
const EUROMILLIONS_OFF_TOPIC =
  /\bstake\.com\b|\bcrypto\s*casino\b|\bpowerball\b|\bmega\s*millions\b|\bsportsbook\b|\bparions\s*sport\b|\bbet365\b|\bwinamax\b/i;

const BLOCKED_LOTTERY_SOURCE =
  /tirage[-\s.]?gagnant/i;

export function isBlockedLotteryNewsSource(item: {
  sourceName?: string;
  sourceUrl?: string;
  sourceHomepage?: string;
  title?: string;
  link?: string;
}): boolean {
  const hay = `${item.sourceName || ""} ${item.sourceUrl || ""} ${item.sourceHomepage || ""} ${item.title || ""} ${item.link || ""}`;
  return BLOCKED_LOTTERY_SOURCE.test(hay);
}

function brandPrimary(title: string, brand: RegExp) {
  const t = title.trim();
  if (!t || !brand.test(t)) return false;
  if (OFF_TOPIC_HARD.test(t)) return false;
  if (OFF_TOPIC.test(t)) {
    const offIdx = t.search(OFF_TOPIC);
    const brandIdx = t.search(brand);
    if (offIdx >= 0 && (brandIdx < 0 || offIdx < brandIdx)) return false;
  }
  if (/,\s*more\s*$/i.test(t) && OFF_TOPIC.test(t)) return false;
  return true;
}

function topicBrand(siteId: SiteId) {
  return topicBrandRegex(siteId);
}

export function isRelevantItem(item: RssItem, siteId: SiteId = "ecoflow") {
  const ed = getEditorial(siteId);
  const brand = topicBrand(siteId);
  const hay = `${item.title} ${item.description}`;
  if (OFF_TOPIC_HARD.test(hay)) return false;
  if (siteId === "euromillions" && EUROMILLIONS_OFF_TOPIC.test(hay)) return false;
  if (siteId === "euromillions" && isBlockedLotteryNewsSource(item)) return false;
  if (!brand.test(hay)) return false;
  if (!brandPrimary(item.title, brand) && !brandPrimary(hay.slice(0, 160), brand)) {
    return false;
  }
  if (brand.test(item.title)) return brandPrimary(item.title, brand);
  if (ed.rssLenientAfterBrand) return true;
  return topicProductRegex(siteId)?.test(hay) ?? false;
}

/** Post-rewrite / store guard — article must stay on the site topic. */
export function isOnTopicArticle(
  input: {
    titleFr?: string;
    titleEn?: string;
    excerptFr?: string;
    excerptEn?: string;
    sourceTitle?: string;
  },
  siteId: SiteId = "ecoflow",
): boolean {
  const brand = topicBrand(siteId);
  const titles = `${input.titleFr || ""} ${input.titleEn || ""} ${input.sourceTitle || ""}`;
  const excerpts = `${input.excerptFr || ""} ${input.excerptEn || ""}`;
  if (OFF_TOPIC_HARD.test(titles) || OFF_TOPIC_HARD.test(excerpts)) return false;
  if (siteId === "euromillions" && EUROMILLIONS_OFF_TOPIC.test(`${titles} ${excerpts}`)) {
    return false;
  }
  if (
    siteId === "euromillions" &&
    isBlockedLotteryNewsSource({
      title: titles,
      sourceName: input.sourceTitle,
    })
  ) {
    return false;
  }
  if (!brand.test(titles) && !brand.test(excerpts)) return false;

  const fr = input.titleFr || "";
  const en = input.titleEn || "";
  const src = input.sourceTitle || "";
  if (fr && !brandPrimary(fr, brand) && en && !brandPrimary(en, brand)) {
    return false;
  }
  if (src && OFF_TOPIC.test(src) && !brandPrimary(src, brand)) return false;
  if (fr && OFF_TOPIC.test(fr) && !brandPrimary(fr, brand)) return false;
  if (en && OFF_TOPIC.test(en) && !brandPrimary(en, brand)) return false;
  return brand.test(titles) || brand.test(excerpts);
}

export async function fetchFeedItems(
  url: string,
  siteId: SiteId = "ecoflow",
): Promise<RssItem[]> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": getEditorial(siteId).feedUserAgent,
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`feed_fetch_failed:${res.status}`);
  }
  const xml = await res.text();
  return parseRssItems(xml).filter((item) => isRelevantItem(item, siteId));
}
