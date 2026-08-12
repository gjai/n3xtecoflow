import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { resolveSiteIdFromHost, SITE_HEADER } from "./sites";

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
  const response = intlMiddleware(request);
  response.headers.set(SITE_HEADER, siteId);
  response.headers.set(
    "Vary",
    [response.headers.get("Vary"), "Host"].filter(Boolean).join(", "),
  );
  return response;
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
