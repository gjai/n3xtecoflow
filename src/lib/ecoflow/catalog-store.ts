import { promises as fs } from "fs";
import path from "path";
import type { EcoflowCatalogEntry, EcoflowCatalogStore } from "./types";

const EMPTY: EcoflowCatalogStore = {
  updatedAt: new Date(0).toISOString(),
  source: "https://fr.ecoflow.com",
  entries: {},
};

function dataPath() {
  return (
    process.env.ECOFLOW_CATALOG_PATH?.trim() ||
    path.join(process.cwd(), "data", "ecoflow-catalog.json")
  );
}

export async function readEcoflowCatalogStore(): Promise<EcoflowCatalogStore> {
  const file = dataPath();
  try {
    const raw = await fs.readFile(/*turbopackIgnore: true*/ file, "utf8");
    const parsed = JSON.parse(raw) as EcoflowCatalogStore;
    if (!parsed?.entries || typeof parsed.entries !== "object") return EMPTY;
    return parsed;
  } catch {
    try {
      const bundled = path.join(process.cwd(), "data", "ecoflow-catalog.json");
      if (bundled !== file) {
        const raw = await fs.readFile(
          /*turbopackIgnore: true*/ bundled,
          "utf8",
        );
        return JSON.parse(raw) as EcoflowCatalogStore;
      }
    } catch {
      /* empty */
    }
    return { ...EMPTY, entries: {} };
  }
}

export async function writeEcoflowCatalogStore(
  store: EcoflowCatalogStore,
): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const next: EcoflowCatalogStore = {
    ...store,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    /*turbopackIgnore: true*/ file,
    JSON.stringify(next, null, 2) + "\n",
    "utf8",
  );
}

export async function getEcoflowEntry(
  slug: string,
): Promise<EcoflowCatalogEntry | null> {
  const store = await readEcoflowCatalogStore();
  return store.entries[slug] ?? null;
}

export async function getEcoflowEntriesMap(): Promise<
  Record<string, EcoflowCatalogEntry>
> {
  const store = await readEcoflowCatalogStore();
  return store.entries;
}
