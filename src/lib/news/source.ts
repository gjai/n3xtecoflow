/** Fetch publisher page content (resolve Google News redirects when needed). */

const UA =
  "Mozilla/5.0 (compatible; EcoFlowStreamBot/1.1; +https://ecoflow-stream.com; editorial research)";

export type SourcePage = {
  finalUrl: string;
  title: string;
  text: string;
  ogImage: string | null;
  sourceHint: string | null;
};

function extractMeta(html: string, prop: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHtml(m[1].trim());
  }
  return null;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripNoise(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

function extractTitle(html: string) {
  return (
    extractMeta(html, "og:title") ||
    extractMeta(html, "twitter:title") ||
    (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "")
      .replace(/\s+/g, " ")
      .trim() ||
    ""
  );
}

function extractOgImage(html: string, baseUrl: string): string | null {
  const metas = [
    extractMeta(html, "og:image"),
    extractMeta(html, "og:image:secure_url"),
    extractMeta(html, "og:image:url"),
    extractMeta(html, "twitter:image"),
    extractMeta(html, "twitter:image:src"),
    extractMeta(html, "thumbnail"),
  ];

  const linkImage = html.match(
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
  )?.[1];
  if (linkImage) metas.push(linkImage);

  const jsonLdImages = [
    ...html.matchAll(
      /"image"\s*:\s*(?:\[\s*")?https?:\/\/[^"\\]+/gi,
    ),
  ].map((m) => m[0].replace(/^"image"\s*:\s*(?:\[\s*")?/i, "").replace(/^"/, ""));
  metas.push(...jsonLdImages);

  // Largest-looking <img> in content as last resort
  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  for (const m of imgs) {
    const src = m[1];
    if (/logo|icon|sprite|pixel|1x1|avatar|emoji/i.test(src)) continue;
    if (!/\.(jpe?g|png|webp|avif)(\?|$)/i.test(src) && !/\/images?\//i.test(src)) {
      continue;
    }
    metas.push(src);
  }

  for (const raw of metas) {
    if (!raw) continue;
    try {
      const absolute = new URL(raw, baseUrl).toString();
      if (!/^https?:\/\//i.test(absolute)) continue;
      if (/logo|favicon|sprite|1x1/i.test(absolute)) continue;
      return absolute;
    } catch {
      /* skip */
    }
  }
  return null;
}

/** Best-effort main text extraction without a full HTML parser. */
function extractArticleText(html: string): string {
  const clean = stripNoise(html);
  const chunks: string[] = [];

  const articleMatch = clean.match(/<article[\s\S]*?<\/article>/i);
  const scope = articleMatch?.[0] || clean;

  const paras = scope.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  for (const p of paras) {
    const text = decodeHtml(p.replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    if (text.length < 60) continue;
    if (/cookie|newsletter|subscribe|javascript|publicit/i.test(text)) continue;
    chunks.push(text);
    if (chunks.join(" ").length > 6500) break;
  }

  if (chunks.length < 2) {
    const text = decodeHtml(scope.replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 6500);
  }

  return chunks.join("\n\n").slice(0, 6500);
}

function isLikelyArticleUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!/^https?:$/i.test(u.protocol)) return false;
    if (
      /googleusercontent|gstatic|googleapis|google-analytics|googletagmanager|schema\.org|doubleclick|facebook\.com\/tr|fonts\.google/i.test(
        u.hostname,
      )
    ) {
      return false;
    }
    if (/google\./i.test(u.hostname) && !/news\.google\.com/i.test(u.hostname)) {
      return false;
    }
    if (
      /\.(jpe?g|png|webp|gif|svg|ico|avif|js|css|woff2?)(\?|$)/i.test(u.pathname)
    ) {
      return false;
    }
    if (/=w\d+$/i.test(u.href) || /=s\d+$/i.test(u.href)) return false;
    if (u.pathname.length < 2) return false;
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

function pickPublisherFromGoogleHtml(html: string, pageUrl: string): string | null {
  const candidates = [
    ...html.matchAll(
      /https?:\/\/(?!(?:[\w.-]+\.)?google\.com|news\.google)[^\s"'<>]+/gi,
    ),
  ].map((m) => m[0].replace(/[),.;]+$/, ""));

  for (const c of candidates) {
    if (isLikelyArticleUrl(c)) return c;
  }

  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const href of hrefs) {
    try {
      const u = new URL(href, pageUrl).toString();
      if (/news\.google\.com/i.test(u)) continue;
      if (isLikelyArticleUrl(u)) return u;
    } catch {
      /* skip */
    }
  }
  return null;
}

async function fetchHtml(url: string): Promise<{ html: string; finalUrl: string } | null> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return { html, finalUrl: res.url || url };
  } catch {
    return null;
  }
}

// silence unused if cleanTitle referenced wrong - use inline
function cleanTitle(title: string) {
  return title.replace(/\s+-\s+[^-]+$/, "").trim();
}

/** Find article URL on publisher site via ?s= search (WordPress-style). */
export async function resolveViaPublisherSearch(
  homepage: string,
  title: string,
): Promise<string | null> {
  try {
    const base = new URL(homepage);
    const query = cleanTitle(title)
      .split(/[:|–—]/)[0]
      .trim()
      .slice(0, 90);
    if (query.length < 8) return null;

    const search = new URL(base.origin);
    search.pathname = base.pathname.replace(/\/$/, "") || "/";
    search.searchParams.set("s", query);

    const page = await fetchHtml(search.toString());
    if (!page) return null;

    const host = base.hostname.replace(/^www\./, "");
    const hrefs = [...page.html.matchAll(/href=["']([^"']+)["']/gi)].map(
      (m) => m[1],
    );
    const keywords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 6);

    for (const href of hrefs) {
      try {
        const abs = new URL(href, page.finalUrl);
        if (!abs.hostname.replace(/^www\./, "").endsWith(host)) continue;
        if (!isLikelyArticleUrl(abs.toString())) continue;
        if (/\/(tag|category|author|page|search)\b/i.test(abs.pathname)) continue;
        const path = abs.pathname.toLowerCase();
        const hit = keywords.filter((k) => path.includes(k.replace(/[^a-z0-9]/gi, "")) || path.includes(k)).length;
        // slug match OR path looks like a post
        if (hit >= 2 || /\/(post|article|20\d{2})\//i.test(abs.pathname)) {
          return abs.toString();
        }
        if (keywords.some((k) => path.includes(k.toLowerCase().slice(0, 6)))) {
          return abs.toString();
        }
      } catch {
        /* skip */
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function resolvePublisherUrl(url: string): Promise<string> {
  if (!/news\.google\.com/i.test(url)) return url;

  const first = await fetchHtml(url);
  if (!first) return url;

  if (!/news\.google\.com/i.test(first.finalUrl)) {
    return isLikelyArticleUrl(first.finalUrl) ? first.finalUrl : url;
  }

  const hopped = pickPublisherFromGoogleHtml(first.html, first.finalUrl);
  return hopped || url;
}

export async function fetchSourcePage(
  url: string,
  opts?: { title?: string; sourceHomepage?: string },
): Promise<SourcePage | null> {
  let target = url;

  if (/news\.google\.com/i.test(url) && opts?.sourceHomepage && opts?.title) {
    const found = await resolveViaPublisherSearch(
      opts.sourceHomepage,
      opts.title,
    );
    if (found) target = found;
  } else {
    target = await resolvePublisherUrl(url);
  }

  // Still on Google? try publisher search as last resort
  if (/news\.google\.com/i.test(target) && opts?.sourceHomepage && opts?.title) {
    const found = await resolveViaPublisherSearch(
      opts.sourceHomepage,
      opts.title,
    );
    if (found) target = found;
  }

  if (/news\.google\.com/i.test(target) || !isLikelyArticleUrl(target)) {
    // Cannot resolve a readable publisher article
    if (opts?.sourceHomepage && opts?.title) {
      const found = await resolveViaPublisherSearch(
        opts.sourceHomepage,
        opts.title,
      );
      if (found) target = found;
    }
  }

  if (!isLikelyArticleUrl(target)) return null;

  const page = await fetchHtml(target);
  if (!page) return null;

  let { html, finalUrl } = page;
  if (!isLikelyArticleUrl(finalUrl)) finalUrl = target;

  const title = decodeHtml(extractTitle(html)).slice(0, 220);
  const text = extractArticleText(html);
  const ogImage = extractOgImage(html, finalUrl);
  const siteName =
    extractMeta(html, "og:site_name") ||
    extractMeta(html, "application-name");

  return {
    finalUrl,
    title,
    text: text || title,
    ogImage,
    sourceHint: siteName,
  };
}
