import { promises as fs } from "fs";
import path from "path";
import type {
  EcoflowEditorialEntry,
  EcoflowEditorialStore,
} from "./editorial-types";

const EMPTY: EcoflowEditorialStore = {
  updatedAt: new Date(0).toISOString(),
  entries: {},
};

function dataPath() {
  return (
    process.env.ECOFLOW_EDITORIAL_PATH?.trim() ||
    path.join(process.cwd(), "data", "ecoflow-editorial.json")
  );
}

export async function readEcoflowEditorialStore(): Promise<EcoflowEditorialStore> {
  const file = dataPath();
  try {
    const raw = await fs.readFile(/*turbopackIgnore: true*/ file, "utf8");
    const parsed = JSON.parse(raw) as EcoflowEditorialStore;
    if (!parsed?.entries || typeof parsed.entries !== "object") return EMPTY;
    return parsed;
  } catch {
    try {
      const bundled = path.join(process.cwd(), "data", "ecoflow-editorial.json");
      if (bundled !== file) {
        const raw = await fs.readFile(
          /*turbopackIgnore: true*/ bundled,
          "utf8",
        );
        return JSON.parse(raw) as EcoflowEditorialStore;
      }
    } catch {
      /* empty */
    }
    return { ...EMPTY, entries: {} };
  }
}

export async function writeEcoflowEditorialStore(
  store: EcoflowEditorialStore,
): Promise<void> {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const next: EcoflowEditorialStore = {
    ...store,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    /*turbopackIgnore: true*/ file,
    JSON.stringify(next, null, 2) + "\n",
    "utf8",
  );
}

export async function getEcoflowEditorial(
  slug: string,
): Promise<EcoflowEditorialEntry | null> {
  const store = await readEcoflowEditorialStore();
  return store.entries[slug] ?? null;
}
