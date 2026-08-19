import { KWANKO_MAIL_BANNERS } from "@/lib/kwanko-slots";

const ORIGIN = "https://euromillions-resultats.fr";
const LOGO = `${ORIGIN}/brands/euromillions/icon-192.png`;
const NAVY = "#0b1220";
const GOLD = "#f5c542";
const MUTED = "#8494ad";
const FG = "#e8eef8";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function mailBannerHtml(campaign: string): string {
  const b = KWANKO_MAIL_BANNERS[campaign];
  if (!b) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0;width:100%">
  <tr>
    <td align="center">
      <a href="${esc(b.click)}" target="_blank" rel="sponsored noopener noreferrer" style="display:block;text-decoration:none">
        <img src="${esc(b.img)}" width="${b.w}" height="${b.h}" alt="${esc(b.alt)}" style="display:block;border:0;max-width:100%;height:auto">
      </a>
    </td>
  </tr>
  <tr>
    <td style="padding:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:${MUTED};text-align:center">Publicité · 18+ · Jeu responsable</td>
  </tr>
</table>`;
}

function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px">
  <tr>
    <td style="border-radius:2px;background:${GOLD}">
      <a href="${esc(href)}" style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:${NAVY};text-decoration:none">${esc(label)}</a>
    </td>
  </tr>
</table>`;
}

export function wrapEuroMillionsEmail(args: {
  preview: string;
  heading: string;
  bodyHtml: string;
  footerHtml: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(args.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${NAVY}">
  <div style="display:none;max-height:0;overflow:hidden">${esc(args.preview)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};padding:24px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
          <tr>
            <td style="padding:8px 8px 20px">
              <img src="${LOGO}" width="40" height="40" alt="" style="display:block;border:0;width:40px;height:40px">
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:${GOLD}">EuroMillions Résultats</p>
            </td>
          </tr>
          <tr>
            <td style="background:#141e30;border:1px solid rgba(184,196,216,0.16);padding:28px 24px">
              <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700">${esc(args.heading)}</h1>
              ${args.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 8px 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${MUTED}">
              ${args.footerHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function confirmAlertHtml(args: {
  confirmUrl: string;
  locale: string;
  gameLabels?: string[];
}): {
  html: string;
  text: string;
  subject: string;
} {
  const en = args.locale === "en";
  const games =
    args.gameLabels?.length ? args.gameLabels.join(", ") : "EuroMillions";
  const subject = en
    ? "Confirm your result alerts"
    : "Confirmez l’alerte résultats";
  const heading = en ? "Confirm your alert" : "Confirmez l’alerte";
  const lead = en
    ? `One click to get an email when the numbers are published (${games}). Not a newsletter. Not an invitation to play.`
    : `Un clic pour recevoir un e-mail lorsque les numéros sont en ligne (${games}). Pas de newsletter. Pas une invitation à jouer.`;
  const button = en ? "Confirm the alert" : "Confirmer l’alerte";
  const ignore = en
    ? "If you did not request this, ignore this message."
    : "Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.";
  const footer = en
    ? "Independent site · 18+ · Play responsibly. We do not sell tickets."
    : "Site indépendant · 18+ · Jeu responsable. Nous ne vendons pas de tickets.";
  const html = wrapEuroMillionsEmail({
    preview: lead,
    heading,
    bodyHtml: `<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:${FG}">${esc(lead)}</p>
      ${ctaButton(args.confirmUrl, button)}
      ${mailBannerHtml("euromillions")}
      <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED}">${esc(ignore)}</p>`,
    footerHtml: footer,
  });
  const text = en
    ? [
        `Confirm to get one email when numbers are published (${games}).`,
        "Not a newsletter. Not an invitation to play. 18+.",
        "",
        args.confirmUrl,
        "",
        "If you did not request this, ignore this message.",
      ].join("\n")
    : [
        `Confirmez pour recevoir un e-mail lorsque les numéros sont en ligne (${games}).`,
        "Pas de newsletter. Pas une invitation à jouer. 18+.",
        "",
        args.confirmUrl,
        "",
        "Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.",
      ].join("\n");
  return { html, text, subject };
}

function ballCell(n: number, star: boolean): string {
  const bg = star ? NAVY : GOLD;
  const color = star ? GOLD : NAVY;
  const border = star ? `border:2px solid ${GOLD};` : "";
  return `<td style="padding:4px">
    <div style="width:36px;height:36px;line-height:36px;text-align:center;border-radius:18px;background:${bg};${border}font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:${color}">${n}</div>
  </td>`;
}

function ballsTable(nums: number[], star: boolean): string {
  const cells = nums.map((n) => ballCell(n, star));
  const rows: string[] = [];
  for (let i = 0; i < cells.length; i += 8) {
    rows.push(`<tr>${cells.slice(i, i + 8).join("")}</tr>`);
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0">${rows.join("")}</table>`;
}

export function resultAlertHtml(args: {
  locale: string;
  dateLabel: string;
  numbers: number[];
  stars: number[];
  url: string;
  unsubUrl: string;
}): { html: string; text: string; subject: string } {
  const en = args.locale === "en";
  const subject = en
    ? `EuroMillions results for ${args.dateLabel}`
    : `Résultats EuroMillions du ${args.dateLabel}`;
  const heading = en
    ? `Results for ${args.dateLabel}`
    : `Résultats du ${args.dateLabel}`;
  const ballsLabel = en ? "Numbers" : "Boules";
  const starsLabel = en ? "Stars" : "Étoiles";
  const button = en ? "Check your winnings" : "Vérifier vos gains";
  const legal = en
    ? "Independent site, 18+. Play responsibly. This is not an invitation to buy a ticket."
    : "Site indépendant, 18+. Jeu responsable. Ceci n’est pas une invitation à jouer.";
  const unsub = en ? "Unsubscribe" : "Désinscription";
  const ballsRow = args.numbers.map((n) => ballCell(n, false)).join("");
  const starsRow = args.stars.map((n) => ballCell(n, true)).join("");
  const html = wrapEuroMillionsEmail({
    preview: `${ballsLabel} ${args.numbers.join(", ")} — ${starsLabel} ${args.stars.join(", ")}`,
    heading,
    bodyHtml: `<p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${GOLD}">${esc(ballsLabel)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>${ballsRow}</tr></table>
      <p style="margin:16px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${GOLD}">${esc(starsLabel)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>${starsRow}</tr></table>
      ${ctaButton(args.url, button)}
      ${mailBannerHtml("euromillions")}`,
    footerHtml: `${esc(legal)}<br><a href="${esc(args.unsubUrl)}" style="color:${GOLD}">${esc(unsub)}</a>`,
  });
  const text = en
    ? [
        `Numbers ${args.numbers.join(", ")} — stars ${args.stars.join(", ")}.`,
        `${button} : ${args.url}`,
        "",
        legal,
        `Unsubscribe: ${args.unsubUrl}`,
      ].join("\n")
    : [
        `Boules ${args.numbers.join(", ")} — étoiles ${args.stars.join(", ")}.`,
        `${button} : ${args.url}`,
        "",
        legal,
        `Désinscription : ${args.unsubUrl}`,
      ].join("\n");
  return { html, text, subject };
}

export type CompanionMailGroup = {
  label: string;
  numbers?: number[];
  text?: string;
};

export function companionResultAlertHtml(args: {
  locale: string;
  gameLabel: string;
  dateLabel: string;
  slotLabel: string | null;
  groups: CompanionMailGroup[];
  url: string;
  unsubUrl: string;
  banner: string;
}): { html: string; text: string; subject: string } {
  const en = args.locale === "en";
  const when = args.slotLabel
    ? `${args.dateLabel} — ${args.slotLabel}`
    : args.dateLabel;
  const subject = en
    ? `${args.gameLabel} results for ${when}`
    : `Résultats ${args.gameLabel} du ${when}`;
  const heading = `${args.gameLabel} · ${when}`;
  const button = en ? "Check your grid" : "Vérifier votre grille";
  const legal = en
    ? "Independent site, 18+. Play responsibly. This is not an invitation to buy a ticket."
    : "Site indépendant, 18+. Jeu responsable. Ceci n’est pas une invitation à jouer.";
  const unsub = en ? "Unsubscribe" : "Désinscription";
  const preview = args.groups
    .map((g) =>
      g.numbers?.length
        ? `${g.label} ${g.numbers.join(", ")}`
        : `${g.label} ${g.text || ""}`,
    )
    .join(" — ");
  const bodyParts: string[] = [];
  const textParts: string[] = [];
  for (const g of args.groups) {
    bodyParts.push(
      `<p style="margin:16px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${GOLD}">${esc(g.label)}</p>`,
    );
    if (g.numbers?.length) {
      bodyParts.push(ballsTable(g.numbers, false));
      textParts.push(`${g.label} ${g.numbers.join(" · ")}`);
    } else if (g.text) {
      bodyParts.push(
        `<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#ffffff">${esc(g.text)}</p>`,
      );
      textParts.push(`${g.label} ${g.text}`);
    }
  }
  const html = wrapEuroMillionsEmail({
    preview: preview || heading,
    heading,
    bodyHtml: `${bodyParts.join("")}
      ${ctaButton(args.url, button)}
      ${mailBannerHtml(args.banner)}`,
    footerHtml: `${esc(legal)}<br><a href="${esc(args.unsubUrl)}" style="color:${GOLD}">${esc(unsub)}</a>`,
  });
  const text = [
    ...textParts,
    `${button} : ${args.url}`,
    "",
    legal,
    en ? `Unsubscribe: ${args.unsubUrl}` : `Désinscription : ${args.unsubUrl}`,
  ].join("\n");
  return { html, text, subject };
}
