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

/** Brand must appear — generic "power station" / "DELTA 2" alone are too noisy. */
const BRAND =
  /\becoflow\b|\bpowerstream\b|\bpower\s*stream\b/i;

/** Optional product lines (only accepted WITH brand). */
const PRODUCT_LINE =
  /\bdelta(\s|-)?(2|3|pro|max|ultra)?\b|\briver(\s|-)?(2|3|pro|max|plus)?\b|\bstream(\s|-)?(ultra|pro|max|x)?\b|\bocean\b|\bglacier\b|\bwave(\s|-)?\d?\b|\brapid(\s|-)?pro\b/i;

/** Hard rejects when these lead the story (EcoFlow only as side mention). */
const OFF_TOPIC =
  /\bsegway\b|\bxyber\b|\be-?bike\b|\btesla\b|\biphone\b|\bsamsung\b|\bplaystation\b|\bxbox\b|\bnintendo\b|\bdyson\b|\broborock\b|\becovacs\b|\broborock\b/i;

function brandIsPrimary(title: string) {
  const t = title.trim();
  if (!t) return false;
  if (!BRAND.test(t)) return false;
  if (OFF_TOPIC.test(t)) {
    const offIdx = t.search(OFF_TOPIC);
    const brandIdx = t.search(BRAND);
    // Off-topic brand appears first → roundup / wrong story
    if (offIdx >= 0 && (brandIdx < 0 || offIdx < brandIdx)) return false;
  }
  // Mega deal roundups ending with ", more"
  if (/,\s*more\s*$/i.test(t) && OFF_TOPIC.test(t)) return false;
  return true;
}

export function isRelevantItem(item: RssItem) {
  const hay = `${item.title} ${item.description}`;
  if (!BRAND.test(hay)) return false;
  if (!brandIsPrimary(item.title) && !brandIsPrimary(hay.slice(0, 160))) {
    return false;
  }
  if (BRAND.test(item.title)) return brandIsPrimary(item.title);
  return PRODUCT_LINE.test(hay);
}

/** Post-rewrite / store guard — article must stay on EcoFlow ecosystem. */
export function isOnTopicArticle(input: {
  titleFr?: string;
  titleEn?: string;
  excerptFr?: string;
  excerptEn?: string;
  sourceTitle?: string;
}): boolean {
  const titles = `${input.titleFr || ""} ${input.titleEn || ""} ${input.sourceTitle || ""}`;
  if (!BRAND.test(titles) && !BRAND.test(`${input.excerptFr || ""} ${input.excerptEn || ""}`)) {
    return false;
  }
  // Prefer checking each title independently
  const fr = input.titleFr || "";
  const en = input.titleEn || "";
  const src = input.sourceTitle || "";
  if (fr && !brandIsPrimary(fr) && en && !brandIsPrimary(en)) return false;
  if (src && OFF_TOPIC.test(src) && !brandIsPrimary(src)) return false;
  if (fr && OFF_TOPIC.test(fr) && !brandIsPrimary(fr)) return false;
  if (en && OFF_TOPIC.test(en) && !brandIsPrimary(en)) return false;
  return BRAND.test(titles) || BRAND.test(`${input.excerptFr || ""}`);
}

export async function fetchFeedItems(url: string): Promise<RssItem[]> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "EcoFlowStreamBot/1.0 (+https://ecoflow-stream.com; editorial aggregator)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`feed_fetch_failed:${res.status}`);
  }
  const xml = await res.text();
  return parseRssItems(xml).filter(isRelevantItem);
}
