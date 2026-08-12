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

const ECOFLOW_BRAND =
  /\becoflow\b|\bpowerstream\b|\bpower\s*stream\b/i;
const ECOFLOW_PRODUCT =
  /\bdelta(\s|-)?(2|3|pro|max|ultra)?\b|\briver(\s|-)?(2|3|pro|max|plus)?\b|\bstream(\s|-)?(ultra|pro|max|x)?\b|\bocean\b|\bglacier\b|\bwave(\s|-)?\d?\b|\brapid(\s|-)?pro\b/i;

const TUMBLER_BRAND =
  /\bgourde\b|\btumbler\b|\bmug\s+isotherme\b|\binsulated\s+(bottle|tumbler|mug|flask)\b|\bhydro\s*flask\b|\bstanley\b|\bqwetch\b|\bowala\b|\bthermos\b|\bsuper\s*sparrow\b|\bisotherme\b|\bwater\s*bottle\b/i;

const OFF_TOPIC =
  /\bsegway\b|\bxyber\b|\be-?bike\b|\btesla\b|\biphone\b|\bsamsung\b|\bplaystation\b|\bxbox\b|\bnintendo\b|\bdyson\b|\broborock\b|\becovacs\b|\bbalances?\s+connect|\bmassage\s+(pour\s+)?les\s+pieds\b|\bfoot\s+massager\b|\bchaise\s+de\s+massage\b|\bpressoth[eé]rapie\b|\bbottes?\s+de\s+press|\bcompression\s+boots?\b|\beclipse\b/i;

const MASSAGE_GUN_BRAND =
  /\bpistolet\s+de\s+massage\b|\bmassage\s+gun\b|\btheragun\b|\btherabody\b|\bhypervolt\b|\bhyperice\b|\brenpho\b|\btoloco\b|\bbob\s+and\s*brad\b|\bopove\b|\bbrelley\b|\baerlang\b|\bjolt\b|\bpercussion\s+(massage|massager|therapy)\b|\bmasseur\s+(musculaire|cervical|dos|shiatsu)\b|\bcoussin\s+(de\s+)?massage\b|\bneck\s+massager\b|\bshiatsu\s+massager\b/i;

const OFF_TOPIC_HARD =
  /\bpressoth[eé]rapie\b|\bbottes?\s+de\s+press|\bcompression\s+boots?\b|\bbalances?\s+connect|\bmassage\s+(pour\s+)?les\s+pieds\b|\bfoot\s+massager\b|\bchaise\s+de\s+massage\b/i;

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
  if (siteId === "tumbler") return TUMBLER_BRAND;
  if (siteId === "massage-gun") return MASSAGE_GUN_BRAND;
  return ECOFLOW_BRAND;
}

export function isRelevantItem(item: RssItem, siteId: SiteId = "ecoflow") {
  const brand = topicBrand(siteId);
  const hay = `${item.title} ${item.description}`;
  if (OFF_TOPIC_HARD.test(hay)) return false;
  if (!brand.test(hay)) return false;
  if (!brandPrimary(item.title, brand) && !brandPrimary(hay.slice(0, 160), brand)) {
    return false;
  }
  if (brand.test(item.title)) return brandPrimary(item.title, brand);
  if (siteId === "tumbler" || siteId === "massage-gun") return true;
  return ECOFLOW_PRODUCT.test(hay);
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
  const ua =
    siteId === "tumbler"
      ? "LaGourdeIsothermeBot/1.0 (+https://mon-tumbler.fr; editorial aggregator)"
      : siteId === "massage-gun"
        ? "LePistoletDeMassageBot/1.0 (+https://massage-gun.fr; editorial aggregator)"
        : "EcoFlowStreamBot/1.0 (+https://ecoflow-stream.com; editorial aggregator)";
  const res = await fetch(url, {
    headers: {
      "User-Agent": ua,
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
