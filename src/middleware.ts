import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { isAppLocale } from "./i18n/locales";
import { getSiteByHost, resolveSiteIdFromHost, SITE_HEADER } from "./sites";
import { siteAllowsLocale, siteLocales } from "./sites/features";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();

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

  const response = intlMiddleware(request);
  response.headers.set(SITE_HEADER, siteId);
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
    "/(fr|en|it|es|pt|de)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
