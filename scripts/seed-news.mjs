#!/usr/bin/env node
/**
 * Local / CI seed: fetch EcoFlow RSS and write data/news.json (template rewrite).
 * AI rewrite happens on the server ingest endpoint when OPENAI_API_KEY is set.
 */
import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outFile = path.join(root, "data", "news.json");

const FEEDS = [
  "https://news.google.com/rss/search?q=EcoFlow&hl=fr&gl=FR&ceid=FR:fr",
  "https://news.google.com/rss/search?q=EcoFlow+(power+OR+solar+OR+DELTA+OR+STREAM)&hl=en-US&gl=US&ceid=US:en",
];

const KEYWORDS =
  /ecoflow|delta\s?\d|river\s?\d|powerstream|stream\s(ultra|pro|max)|ocean\s?\d|glacier|wave\s?\d|rapid\s?pro|station\s(électrique|electrique|portable)|power\sstation/i;

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decodeXml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}([^>]*)>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeXml(m[2].trim()) : "";
}

function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function cleanTitle(title) {
  return title.replace(/\s+-\s+[^-]+$/, "").trim();
}

async function fetchItems(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "EcoFlowStreamBot/1.0 (+https://ecoflow-stream.com)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  });
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  const xml = await res.text();
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return blocks
    .map((block) => {
      const title = stripTags(tag(block, "title"));
      const link = stripTags(tag(block, "link"));
      const guid = stripTags(tag(block, "guid")) || link;
      const pubDate = stripTags(tag(block, "pubDate"));
      const description = stripTags(tag(block, "description"));
      const sourceName = stripTags(tag(block, "source")) || "Source";
      return {
        title,
        link,
        guid,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        sourceName,
        description,
      };
    })
    .filter((i) => i.title && i.link && KEYWORDS.test(`${i.title} ${i.description}`));
}

function articleFrom(item) {
  const title = cleanTitle(item.title);
  const day = item.publishedAt.slice(0, 10);
  const short = createHash("sha1").update(item.guid).digest("hex").slice(0, 6);
  const whenFr = new Date(item.publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const whenEn = new Date(item.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    slug: `${day}-${slugify(title) || "actu-ecoflow"}-${short}`,
    sourceUrl: item.link,
    sourceName: item.sourceName,
    sourceGuid: item.guid,
    publishedAt: item.publishedAt,
    ingestedAt: new Date().toISOString(),
    rewrittenBy: "template",
    tags: ["ecoflow", "actualite"],
    fr: {
      title,
      excerpt: `Revue de presse (${item.sourceName}, ${whenFr}).`,
      body: [
        `Une information relayée par ${item.sourceName} le ${whenFr} concerne l’écosystème EcoFlow.`,
        item.description
          ? `Contexte source : ${item.description.slice(0, 320)}`
          : `Titre mis en avant : « ${title} ».`,
        `Lecture EcoFlow Stream : comparez Wh/W, usage (camping, backup, solaire balcon) et le prix du jour avant d’acheter.`,
        `Synthèse indépendante — consultez la source pour l’article d’origine.`,
      ],
    },
    en: {
      title,
      excerpt: `Press roundup (${item.sourceName}, ${whenEn}).`,
      body: [
        `Coverage from ${item.sourceName} on ${whenEn} relates to the EcoFlow ecosystem.`,
        item.description
          ? `Source context: ${item.description.slice(0, 320)}`
          : `Headline: “${title}”.`,
        `EcoFlow Stream takeaway: compare Wh/W, use case (camping, backup, balcony solar) and live pricing before buying.`,
        `Independent summary — see the source for the original article.`,
      ],
    },
  };
}

const all = [];
for (const url of FEEDS) {
  try {
    all.push(...(await fetchItems(url)));
  } catch (e) {
    console.error(e);
  }
}

const byGuid = new Map();
for (const item of all) {
  if (!byGuid.has(item.guid)) byGuid.set(item.guid, item);
}

const articles = [...byGuid.values()]
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  .slice(0, 12)
  .map(articleFrom);

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(
  outFile,
  JSON.stringify({ updatedAt: new Date().toISOString(), articles }, null, 2) + "\n",
);
console.log(`Wrote ${articles.length} articles -> ${outFile}`);
