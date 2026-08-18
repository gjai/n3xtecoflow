import type { MetadataRoute } from "next";
import { getCurrentSite } from "@/sites/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getCurrentSite();
  const { icons, name } = site.brand;
  const png192 = icons.icon192;
  const png512 = icons.icon512;
  const apple = icons.apple || icons.favicon;
  const iconList: MetadataRoute.Manifest["icons"] = [];
  if (png192) {
    iconList.push({
      src: png192,
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    });
    iconList.push({
      src: png192,
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    });
  }
  if (png512) {
    iconList.push({
      src: png512,
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    });
    iconList.push({
      src: png512,
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    });
  }
  if (iconList.length === 0) {
    iconList.push({
      src: apple,
      sizes: "180x180",
      type: apple.endsWith(".svg") ? "image/svg+xml" : "image/png",
    });
  }
  const em = site.id === "euromillions";
  return {
    name,
    short_name: em ? "EuroMillions" : name.length > 12 ? name.slice(0, 12) : name,
    description: site.brand.taglineFr,
    start_url: em ? "/fr?source=pwa" : "/",
    scope: "/",
    id: `https://${site.primaryHost}/`,
    display: "standalone",
    background_color: site.theme.dark.bg,
    theme_color: site.theme.accent,
    lang: "fr",
    icons: iconList,
  };
}
