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

const KEYWORDS =
  /ecoflow|delta\s?\d|river\s?\d|powerstream|stream\s(ultra|pro|max)|ocean\s?\d|glacier|wave\s?\d|rapid\s?pro|powerocean|station\s(électrique|electrique|portable)|power\sstation/i;

export function isRelevantItem(item: RssItem) {
  const hay = `${item.title} ${item.description} ${item.sourceName}`;
  return KEYWORDS.test(hay);
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
