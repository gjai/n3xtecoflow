import type { MetadataRoute } from "next";
import { getCurrentSite } from "@/sites/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getCurrentSite();
  const { icons, name } = site.brand;
  const iconSrc = icons.apple || icons.favicon;
  return {
    name,
    short_name: name.length > 12 ? name.slice(0, 12) : name,
    description: site.brand.taglineFr,
    start_url: "/",
    display: "standalone",
    background_color: site.theme.dark.bg,
    theme_color: site.theme.accent,
    lang: "fr",
    icons: [
      {
        src: iconSrc,
        sizes: "180x180",
        type: iconSrc.endsWith(".svg") ? "image/svg+xml" : "image/png",
      },
    ],
  };
}
