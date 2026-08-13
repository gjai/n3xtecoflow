/** Normalize a My Million code: letters+digits only, uppercase. */
export function normalizeMyMillionCode(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function parseMyMillionCodes(blob: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of blob.split(/[\n,;]+/)) {
    const n = normalizeMyMillionCode(line);
    if (n.length < 6) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

export function codesMatch(a: string | null | undefined, b: string): boolean {
  if (!a) return false;
  return normalizeMyMillionCode(a) === normalizeMyMillionCode(b);
}
