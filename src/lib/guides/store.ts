import { promises as fs } from "fs";
import path from "path";
import type { GuideEntry, GuidesStore } from "./types";

const EMPTY: GuidesStore = {
  updatedAt: new Date(0).toISOString(),
  entries: {},
};

function dataPath() {
  return (
    process.env.GUIDES_STORE_PATH?.trim() ||
    path.join(process.cwd(), "data", "guides-store.json")
  );
}

export async function readGuidesStore(): Promise<GuidesStore> {
  const file = dataPath();
  try {
    const raw = await fs.readFile(/*turbopackIgnore: true*/ file, "utf8");
    const parsed = JSON.parse(raw) as GuidesStore;
    if (!parsed?.entries || typeof parsed.entries !== "object") return EMPTY;
    return parsed;
  } catch {
    try {
      const bundled = path.join(process.cwd(), "data", "guides-store.json");
      if (bundled !== file) {
        const raw = await fs.readFile(
          /*turbopackIgnore: true*/ bundled,
          "utf8",
        );
        return JSON.parse(raw) as GuidesStore;
      }
    } catch {
      /* empty */
    }
    return { ...EMPTY, entries: {} };
  }
}

export async function writeGuidesStore(store: GuidesStore): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const next: GuidesStore = {
    ...store,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    /*turbopackIgnore: true*/ file,
    JSON.stringify(next, null, 2) + "\n",
    "utf8",
  );
}

export async function getGuideEntry(
  slug: string,
): Promise<GuideEntry | null> {
  const store = await readGuidesStore();
  return store.entries[slug] ?? null;
}

export async function listGuideEntries(): Promise<GuideEntry[]> {
  const store = await readGuidesStore();
  return Object.values(store.entries).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
}
