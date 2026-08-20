/** N° de tirage EuroMillions (~1–2000). Les `external_id` FDJ sont à 5 chiffres. */
export function sequentialDrawId(
  id?: string | number | null,
): number | null {
  const n = Number(id);
  if (!Number.isFinite(n) || n < 1 || n >= 10_000) return null;
  return Math.trunc(n);
}

export function preferredDrawId(
  a?: string | number,
  b?: string | number,
): string | number | undefined {
  const score = (v?: string | number) => {
    if (sequentialDrawId(v) != null) return 2;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? 1 : 0;
  };
  return score(a) >= score(b) ? (a ?? b) : (b ?? a);
}
