import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getSiteByHost } from "@/sites";

/** Sitemap URL follows the request Host (multi-thème / futurs domaines). */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  const site = getSiteByHost(host);
  const base = `https://${site.primaryHost}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
