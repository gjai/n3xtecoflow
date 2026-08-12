"use client";

import { createContext, useContext } from "react";
import type { SiteConfig } from "@/sites/types";
import { ecoflowSite } from "@/sites/ecoflow";

const SiteContext = createContext<SiteConfig>(ecoflowSite);

export function SiteProvider({
  site,
  children,
}: {
  site: SiteConfig;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
