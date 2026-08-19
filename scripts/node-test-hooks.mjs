/**
 * Résout `@/` et les imports relatifs sans extension pour `npm test`
 * (node:test + strip-types, sans bundler Next).
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = pathToFileURL(
  path.join(fileURLToPath(new URL(".", import.meta.url)), "../src") + "/",
).href;

function withTs(url) {
  return url.endsWith(".ts") || url.endsWith(".json") ? url : `${url}.ts`;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    return nextResolve(withTs(new URL(specifier.slice(2), SRC).href), context);
  }
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (
      err?.code === "ERR_MODULE_NOT_FOUND" &&
      (specifier.startsWith(".") || specifier.startsWith("/")) &&
      !specifier.endsWith(".ts") &&
      !specifier.endsWith(".json")
    ) {
      return nextResolve(`${specifier}.ts`, context);
    }
    throw err;
  }
}
