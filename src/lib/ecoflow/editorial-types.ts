import type { LocaleCopy } from "@/data/products";

export type EcoflowEditorialEntry = {
  slug: string;
  fr: LocaleCopy;
  en: LocaleCopy;
  sourceHandle: string | null;
  updatedAt: string;
  model?: string;
  error?: string;
};

export type EcoflowEditorialStore = {
  updatedAt: string;
  entries: Record<string, EcoflowEditorialEntry>;
};
