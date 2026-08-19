/**
 * Kwanko / Metaffiliation — slot IDs par campagne et taille.
 *
 * Format ID : "S" + identifiant (ex: "S51261158C3EF2111").
 * Récupérer les IDs depuis l'interface Kwanko > Outils > Codes d'intégration.
 */

type SlotDef = { id: string; w: number; h: number };
type SlotPair = { desktop: SlotDef; mobile: SlotDef };

export const KWANKO_SLOTS: Record<string, SlotPair> = {
  // Offre de bienvenue (Bonus_ete26) — pages génériques
  bienvenue: {
    desktop: { id: "S51261158C3EF21711", w: 728, h: 90 },
    mobile: { id: "S51261158C3EF21715", w: 320, h: 50 },
  },
  // EuroMillions fil rouge
  euromillions: {
    desktop: { id: "S51261158C3EF21313", w: 728, h: 90 },
    mobile: { id: "S51261158C3EF21319", w: 320, h: 50 },
  },
  // Loto fil rouge
  loto: {
    desktop: { id: "S51261158C3EF21111", w: 728, h: 90 },
    mobile: { id: "S51261158C3EF21115", w: 320, h: 50 },
  },
  // EuroDreams fil rouge
  eurodreams: {
    desktop: { id: "S51261158C3EF25715", w: 728, h: 90 },
    mobile: { id: "S51261158C3EF2577", w: 320, h: 50 },
  },
  // Crescendo (CRDO)
  crescendo: {
    desktop: { id: "S51261158C3EF27921", w: 728, h: 90 },
    mobile: { id: "S51261158C3EF27911", w: 320, h: 50 },
  },
  // In-content 300x250 (Bonus_ete26 — guides / actus)
  incontent: {
    desktop: { id: "S51261158C3EF2173", w: 300, h: 250 },
    mobile: { id: "S51261158C3EF2173", w: 300, h: 250 },
  },
};

export function kwankoSlot(campaign: string): SlotPair | undefined {
  return KWANKO_SLOTS[campaign];
}

/**
 * Bannières email (image statique hébergée Kwanko + lien mclic).
 * Les clients mail bloquent JS → on utilise une image + <a>.
 */
type MailBanner = {
  img: string;
  click: string;
  w: number;
  h: number;
  alt: string;
};

export const KWANKO_MAIL_BANNERS: Record<string, MailBanner> = {
  euromillions: {
    img: "https://img.metaffiliation.com/11/75281/mail_37_49_1_2.jpg",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF21323",
    w: 560,
    h: 298,
    alt: "Jouez à EuroMillions sur FDJ.fr",
  },
  loto: {
    img: "https://img.metaffiliation.com/11/75281/mail_37_107_1_4.png",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF2119",
    w: 560,
    h: 298,
    alt: "Jouez au Loto sur FDJ.fr",
  },
  eurodreams: {
    img: "https://img.metaffiliation.com/11/75281/mail_37_49_1_2.jpg",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF22549",
    w: 560,
    h: 298,
    alt: "Jouez à EuroDreams sur FDJ.fr",
  },
  crescendo: {
    img: "https://img.metaffiliation.com/11/75281/mail_37_107_1_4.png",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF225184549483",
    w: 560,
    h: 298,
    alt: "Jouez à Crescendo sur FDJ.fr",
  },
  bienvenue: {
    img: "https://img.metaffiliation.com/11/75281/mail_37_107_1_4.png",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF2179",
    w: 560,
    h: 298,
    alt: "Offre de bienvenue FDJ – 10€ offerts",
  },
};
