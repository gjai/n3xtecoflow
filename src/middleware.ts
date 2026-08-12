import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { resolveSiteIdFromHost, SITE_HEADER } from "./sites";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const siteId = resolveSiteIdFromHost(request.headers.get("host"));
  const response = intlMiddleware(request);
  response.headers.set(SITE_HEADER, siteId);
  // Help caching CDNs vary by host
  response.headers.set(
    "Vary",
    [response.headers.get("Vary"), "Host"].filter(Boolean).join(", "),
  );
  return response;
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
