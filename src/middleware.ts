import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { isAppLocale } from "./i18n/locales";
import {
  isAiTrainingCrawler,
  isEuroMillionsArchivePath,
} from "./lib/crawlers/ai-training";
import { getSiteByHost, resolveSiteIdFromHost, SITE_HEADER } from "./sites";
import { siteAllowsLocale, siteIsEuroMillions, siteLocales } from "./sites/features";
import { offThemeFallbackPath } from "./sites/off-theme";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();

  // powerstream.fr abandonné : tout transférer vers le canonique EcoFlow.
  if (host === "powerstream.fr" || host === "www.powerstream.fr") {
    const url = request.nextUrl.clone();
    url.hostname = "ecoflow-stream.com";
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // Collapse www → apex (same content, cleaner SEO)
  if (host.startsWith("www.")) {
    const apex = host.slice(4);
    const url = request.nextUrl.clone();
    url.hostname = apex;
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const siteId = resolveSiteIdFromHost(host);
  const site = getSiteByHost(host);
  const pathname = request.nextUrl.pathname;
  const seg = pathname.split("/").filter(Boolean)[0];
  request.headers.set("x-pathname", pathname);
  request.headers.set(SITE_HEADER, siteId);

  // robots.txt seul est trop lent : ClaudeBot / Meta saturent déjà les archives.
  if (
    siteIsEuroMillions(site) &&
    isEuroMillionsArchivePath(pathname) &&
    isAiTrainingCrawler(request.headers.get("user-agent"))
  ) {
    return new NextResponse(null, {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Browsers often request /favicon.ico directly — serve the theme mark.
  if (pathname === "/favicon.ico") {
    const url = request.nextUrl.clone();
    url.pathname = site.brand.icons.favicon;
    return NextResponse.rewrite(url);
  }

  // Theme allow-list: /it on ecoflow → /fr/...
  if (seg && isAppLocale(seg) && !siteAllowsLocale(site, seg)) {
    const fallback = siteLocales(site)[0] || "fr";
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/[^/]+/, `/${fallback}`) || `/${fallback}`;
    return NextResponse.redirect(url, 308);
  }

  // Autre thème (même app) : 308 au lieu de 404+noindex (GSC).
  const offTheme = offThemeFallbackPath(site, pathname);
  if (offTheme && offTheme !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = offTheme;
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  // RSS hors next-intl (sinon /en/feed.xml peut être réécrit / 404).
  if (
    pathname === "/feed.xml" ||
    /^\/(fr|en|it|es|pt|de|nl)\/feed\.xml$/.test(pathname)
  ) {
    const response = NextResponse.next();
    response.headers.set(SITE_HEADER, siteId);
    response.headers.set("x-pathname", pathname);
    response.headers.set(
      "Vary",
      [response.headers.get("Vary"), "Host"].filter(Boolean).join(", "),
    );
    return response;
  }

  const response = intlMiddleware(request);
  response.headers.set(SITE_HEADER, siteId);
  response.headers.set("x-pathname", pathname);
  response.headers.set(
    "Vary",
    [response.headers.get("Vary"), "Host"].filter(Boolean).join(", "),
  );
  return response;
}

export const config = {
  matcher: [
    "/",
    "/favicon.ico",
    "/(fr|en|it|es|pt|de|nl)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
