/**
 * Affichage monétaire : toujours en euros (Amazon.fr / audience FR).
 * Les montants USD issus de sources US sont convertis via un taux indicatif.
 */

const DEFAULT_USD_EUR = 0.92;

export function usdEurRate(): number {
  const raw = Number(process.env.USD_EUR_RATE);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_USD_EUR;
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })
    .format(amount)
    .replace(/[\u00a0\u202f]/g, " ");
}

export function usdToEur(amountUsd: number): number {
  return Math.round(amountUsd * usdEurRate() * 100) / 100;
}

function parseLooseAmount(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, "").replace(/,/g, "");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Remplace les mentions $ / USD / dollars dans un texte éditorial par des montants €.
 */
export function pricesToEuroText(input: string): string {
  if (!input || !/[\$]|USD|US\$|dollars?/i.test(input)) return input;

  let s = input;

  // $1,240.50 | $1240 | $23.99
  s = s.replace(
    /\$\s*([\d]{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/g,
    (_, num) => {
      const amount = parseLooseAmount(num);
      if (amount == null) return "prix Amazon.fr";
      return formatEuro(usdToEur(amount));
    },
  );

  // US$23.99
  s = s.replace(/US\$\s*([\d,.]+)/gi, (_, num) => {
    const amount = parseLooseAmount(num);
    if (amount == null) return "prix Amazon.fr";
    return formatEuro(usdToEur(amount));
  });

  // 23.99 USD | 319 dollars | 139$
  s = s.replace(
    /([\d]{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)\s*(?:USD|dollars?|\$)\b/gi,
    (_, num) => {
      const amount = parseLooseAmount(num);
      if (amount == null) return "prix Amazon.fr";
      return formatEuro(usdToEur(amount));
    },
  );

  return s;
}

export type MoneyInput = {
  amount: number | null | undefined;
  currency: string | null | undefined;
  display?: string | null | undefined;
};

/** Normalise un prix API vers un affichage EUR (convertit USD si besoin). */
export function toEuroMoney(input: MoneyInput): {
  amount: number;
  currency: "EUR";
  display: string;
} | null {
  const cur = (input.currency || "").toUpperCase().replace("US$", "USD");
  let amount = input.amount ?? null;

  if (amount == null && input.display) {
    const m = input.display.match(
      /([\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)/,
    );
    if (m) {
      const eu = m[1].includes(",")
        ? Number.parseFloat(
            m[1].replace(/\./g, "").replace(",", ".").replace(/\s/g, ""),
          )
        : Number.parseFloat(m[1].replace(/,/g, ""));
      amount = Number.isFinite(eu) ? eu : null;
    }
  }

  if (amount == null || !Number.isFinite(amount)) return null;

  const isUsd =
    cur === "USD" ||
    (!cur && Boolean(input.display && /\$|USD/i.test(input.display)));

  if (isUsd) {
    amount = usdToEur(amount);
  } else if (cur && cur !== "EUR") {
    return null;
  }

  return {
    amount,
    currency: "EUR",
    display: formatEuro(amount),
  };
}
