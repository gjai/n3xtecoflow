#!/usr/bin/env node
/**
 * Fetch real Google News RSS for casinos-crypto and merge template articles
 * into a news.json store (preserves other themes).
 *
 * Usage:
 *   node scripts/seed-casinos-news.mjs [path/to/news.json]
 *   NEWS_OUT=/tmp/news.json node scripts/seed-casinos-news.mjs
 */
import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outFile =
  process.env.NEWS_OUT?.trim() ||
  process.argv[2] ||
  path.join(root, "data", "news.json");

const LIMIT = Number(process.env.SEED_LIMIT || 10);

const FEEDS = [
  {
    brand: "crypto",
    url: "https://news.google.com/rss/search?q=(Bitcoin+OR+Ethereum+OR+cryptomonnaie)+(march%C3%A9+OR+prix+OR+BTC+OR+ETH)+when:14d&hl=fr&gl=FR&ceid=FR:fr",
  },
  {
    brand: "crypto",
    url: "https://news.google.com/rss/search?q=(Bitcoin+OR+Ethereum+OR+cryptocurrency)+(market+OR+price+OR+BTC+OR+ETH)+when:14d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    brand: "nordvpn",
    url: "https://news.google.com/rss/search?q=NordVPN+(security+OR+privacy+OR+breach+OR+update+OR+feature)+-coupon+-deal+-%25+when:30d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    brand: "stake",
    url: "https://news.google.com/rss/search?q=(Stake.com+OR+%22Stake+casino%22)+(crypto+OR+casino)+-promo+-coupon+-sportsbook+-Drake+when:45d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    brand: "cryptocom",
    url: "https://news.google.com/rss/search?q=%22Crypto.com%22+(app+OR+exchange+OR+wallet+OR+Bitcoin)+when:30d&hl=en-US&gl=US&ceid=US:en",
  },
];

const TOPIC =
  /\b(bitcoin|ethereum|btc|eth|cryptomonnaie|cryptocurrency|crypto\.com|cryptocom|nordvpn|nord\s*vpn|stake(\.com)?|casino\s*crypto|crypto\s*casino|stablecoin|usdt)\b/i;

const REJECT =
  /\b(coupon|code\s*promo|%\s*off|75%\s*off|free\s*sip|drake|sportsbook|pariant|betting\s*odds|machines?\s*[àa]\s*sous)\b/i;

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

function guessTags(title, brand) {
  const tags = new Set(["actualite", brand]);
  const t = title.toLowerCase();
  if (/bitcoin|\bbtc\b/.test(t)) tags.add("bitcoin");
  if (/ethereum|\beth\b/.test(t)) tags.add("ethereum");
  if (/stake/.test(t)) tags.add("stake");
  if (/nordvpn|vpn/.test(t)) tags.add("vpn");
  if (/crypto\.com/.test(t)) tags.add("cryptocom");
  if (/casino/.test(t)) tags.add("casino-crypto");
  return [...tags];
}

async function fetchItems(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "CasinosCryptoBot/1.0 (+https://casinos-crypto.fr; editorial)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  });
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  const xml = await res.text();
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return blocks.map((block) => {
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
      publishedAt: pubDate
        ? new Date(pubDate).toISOString()
        : new Date().toISOString(),
      sourceName,
      description,
    };
  });
}

function articleFrom(item, brand) {
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
  const excerptSrc = (item.description || title).slice(0, 220);

  return {
    slug: `${day}-${slugify(title) || "actu-casino"}-${short}`,
    siteId: "casinos-crypto",
    sourceUrl: item.link,
    sourceName: item.sourceName,
    sourceGuid: item.guid,
    publishedAt: item.publishedAt,
    ingestedAt: new Date().toISOString(),
    rewrittenBy: "template",
    tags: guessTags(title, brand),
    fr: {
      title,
      excerpt: excerptSrc,
      body: [
        `Selon ${item.sourceName} (${whenFr}), l’actualité porte sur : ${title}.`,
        item.description
          ? `Contexte source : ${item.description.slice(0, 480)}`
          : `Titre mis en avant : « ${title} ».`,
        `Lecture Casinos Crypto : pour le marché crypto, gardez un budget loisir clair ; Crypto.com peut servir d’on-ramp. Si vous jouez ensuite sur un casino crypto (ex. Stake), restez 18+ et jeu responsable.`,
        `Pour une connexion plus stable / privée, un VPN (ex. NordVPN) peut accompagner le parcours — sans promesse de gains.`,
        `Synthèse indépendante — consultez la source pour l’article d’origine.`,
      ],
    },
    en: {
      title,
      excerpt: excerptSrc,
      body: [
        `According to ${item.sourceName} (${whenEn}), the story focuses on: ${title}.`,
        item.description
          ? `Source context: ${item.description.slice(0, 480)}`
          : `Headline: “${title}”.`,
        `Casinos Crypto takeaway: for crypto markets, keep a clear leisure budget; Crypto.com can be an on-ramp. If you later play on a crypto casino (e.g. Stake), stay 18+ and play responsibly.`,
        `For a more stable / private connection, a VPN (e.g. NordVPN) can accompany the path — with no promise of winnings.`,
        `Independent summary — see the source for the original article.`,
      ],
    },
  };
}

const collected = [];
for (const feed of FEEDS) {
  try {
    const items = await fetchItems(feed.url);
    for (const item of items) {
      const hay = `${item.title} ${item.description}`;
      if (!TOPIC.test(hay) || REJECT.test(hay)) continue;
      if (!TOPIC.test(item.title) && !TOPIC.test(hay.slice(0, 180))) continue;
      collected.push({ ...item, brand: feed.brand });
    }
    console.log(`feed ${feed.brand}: kept from ${items.length}`);
  } catch (e) {
    console.error(feed.url, e.message || e);
  }
}

const byGuid = new Map();
for (const item of collected) {
  if (!byGuid.has(item.guid)) byGuid.set(item.guid, item);
}

const brandSeen = new Map();
const ranked = [...byGuid.values()].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
);

const picked = [];
for (const item of ranked) {
  const n = brandSeen.get(item.brand) || 0;
  if (n >= 3) continue;
  brandSeen.set(item.brand, n + 1);
  picked.push(item);
  if (picked.length >= LIMIT) break;
}

const fresh = picked.map((i) => articleFrom(i, i.brand));

let store = { updatedAt: new Date().toISOString(), articles: [] };
try {
  store = JSON.parse(await fs.readFile(outFile, "utf8"));
  if (!Array.isArray(store.articles)) store.articles = [];
} catch {
  /* new file */
}

const known = new Set(store.articles.map((a) => a.sourceGuid));
const knownSlugs = new Set(store.articles.map((a) => a.slug));
const added = [];
for (const article of fresh) {
  if (known.has(article.sourceGuid) || knownSlugs.has(article.slug)) continue;
  store.articles.unshift(article);
  added.push(article.slug);
}

store.updatedAt = new Date().toISOString();
store.articles = store.articles.slice(0, 80);

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, JSON.stringify(store, null, 2) + "\n");
console.log(`Added ${added.length} casinos-crypto articles -> ${outFile}`);
added.forEach((s) => console.log(" +", s));
