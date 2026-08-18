import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import {
  AI_TRAINING_ARCHIVE_BOTS,
  euroMillionsArchiveRobotsDisallow,
} from "@/lib/crawlers/ai-training";
import { getSiteByHost } from "@/sites";
import { siteIsEuroMillions, siteLocales } from "@/sites/features";

/** Sitemap URL follows the request Host (multi-thème / futurs domaines). */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  const site = getSiteByHost(host);
  const base = `https://${site.primaryHost}`;

  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
  ];

  if (siteIsEuroMillions(site)) {
    rules.push({
      userAgent: [...AI_TRAINING_ARCHIVE_BOTS],
      disallow: euroMillionsArchiveRobotsDisallow(siteLocales(site)),
    });
  }

  return {
    rules,
    sitemap: `${base}/sitemap.xml`,
  };
}
