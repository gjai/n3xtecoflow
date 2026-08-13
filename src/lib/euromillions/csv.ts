import type { EuroMillionsDraw } from "./types";

function csvCell(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Archive locale → CSV (pas un export FDJ officiel). */
export function euroMillionsDrawsToCsv(draws: EuroMillionsDraw[]): string {
  const header = [
    "date",
    "n1",
    "n2",
    "n3",
    "n4",
    "n5",
    "s1",
    "s2",
    "jackpotEur",
    "myMillion",
    "source",
  ].join(",");
  const rows = [...draws]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((d) => {
      const n = [...(d.numbers || [])].sort((a, b) => a - b);
      const s = [...(d.stars || [])].sort((a, b) => a - b);
      return [
        csvCell(d.date),
        csvCell(n[0]),
        csvCell(n[1]),
        csvCell(n[2]),
        csvCell(n[3]),
        csvCell(n[4]),
        csvCell(s[0]),
        csvCell(s[1]),
        csvCell(d.jackpotEur),
        csvCell(d.myMillionCode),
        csvCell(d.source),
      ].join(",");
    });
  return `${header}\n${rows.join("\n")}\n`;
}
