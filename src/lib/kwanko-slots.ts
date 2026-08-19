/**
 * Kwanko / Metaffiliation — catalogue des supports FDJ (export 19/08/2026).
 *
 * Source : data/kwanko-supports.csv
 * Format slot : "S" + identifiant (ex. S51261158C3EF2811).
 */

export type SlotDef = { id: string; w: number; h: number };
export type SlotPair = { desktop: SlotDef; mobile: SlotDef };

/** Toutes les bannières par campagne Kwanko et taille WxH. */
export const KWANKO_BANNERS = {
  Bonus_ete26: {
    "320x50": { id: "S51261158C3EF21715", w: 320, h: 50 },
    "320x170": { id: "S51261158C3EF2177", w: 320, h: 170 },
    "728x90": { id: "S51261158C3EF21711", w: 728, h: 90 },
    "120x600": { id: "S51261158C3EF21713", w: 120, h: 600 },
    "300x250": { id: "S51261158C3EF2173", w: 300, h: 250 },
    "160x600": { id: "S51261158C3EF2171", w: 160, h: 600 },
    "300x600": { id: "S51261158C3EF2175", w: 300, h: 600 },
    "640x340": { id: "S51261158C3EF2179", w: 640, h: 340 },
  },
  CRDO: {
    "120x60": { id: "S51261158C3EF2791", w: 120, h: 60 },
    "320x50": { id: "S51261158C3EF27911", w: 320, h: 50 },
    "320x170": { id: "S51261158C3EF27913", w: 320, h: 170 },
    "250x250": { id: "S51261158C3EF2795", w: 250, h: 250 },
    "728x90": { id: "S51261158C3EF27921", w: 728, h: 90 },
    "120x600": { id: "S51261158C3EF2793", w: 120, h: 600 },
    "300x250": { id: "S51261158C3EF2797", w: 300, h: 250 },
    "320x480": { id: "S51261158C3EF27915", w: 320, h: 480 },
    "300x600": { id: "S51261158C3EF2799", w: 300, h: 600 },
    "640x340": { id: "S51261158C3EF27919", w: 640, h: 340 },
    "480x480": { id: "S51261158C3EF27917", w: 480, h: 480 },
    "970x250": { id: "S51261158C3EF27923", w: 970, h: 250 },
  },
  Exclu_Web_Illiko: {
    "320x50": { id: "S51261158C3EF2395", w: 320, h: 50 },
    "320x179": { id: "S51261158C3EF2397", w: 320, h: 179 },
    "728x90": { id: "S51261158C3EF2399", w: 728, h: 90 },
    "300x250": { id: "S51261158C3EF2391", w: 300, h: 250 },
    "300x600": { id: "S51261158C3EF2393", w: 300, h: 600 },
  },
  FilRouge_EUML_2025: {
    "320x50": { id: "S51261158C3EF21319", w: 320, h: 50 },
    "320x100": { id: "S51261158C3EF2137", w: 320, h: 100 },
    "320x170": { id: "S51261158C3EF21325", w: 320, h: 170 },
    "728x90": { id: "S51261158C3EF21313", w: 728, h: 90 },
    "120x600": { id: "S51261158C3EF21317", w: 120, h: 600 },
    "300x250": { id: "S51261158C3EF2135", w: 300, h: 250 },
    "160x600": { id: "S51261158C3EF2133", w: 160, h: 600 },
    "320x480": { id: "S51261158C3EF2139", w: 320, h: 480 },
    "300x600": { id: "S51261158C3EF21315", w: 300, h: 600 },
    "640x340": { id: "S51261158C3EF21323", w: 640, h: 340 },
  },
  FilRouge_LOTO_2025: {
    "320x50": { id: "S51261158C3EF21115", w: 320, h: 50 },
    "320x170": { id: "S51261158C3EF2117", w: 320, h: 170 },
    "728x90": { id: "S51261158C3EF21111", w: 728, h: 90 },
    "120x600": { id: "S51261158C3EF21113", w: 120, h: 600 },
    "300x250": { id: "S51261158C3EF2113", w: 300, h: 250 },
    "160x600": { id: "S51261158C3EF2111", w: 160, h: 600 },
    "300x600": { id: "S51261158C3EF2115", w: 300, h: 600 },
    "640x340": { id: "S51261158C3EF2119", w: 640, h: 340 },
  },
  Fil_Rouge_EDMS: {
    "320x50": { id: "S51261158C3EF2577", w: 320, h: 50 },
    "320x170": { id: "S51261158C3EF2579", w: 320, h: 170 },
    "728x90": { id: "S51261158C3EF25715", w: 728, h: 90 },
    "300x250": { id: "S51261158C3EF2573", w: 300, h: 250 },
    "160x600": { id: "S51261158C3EF2571", w: 160, h: 600 },
    "300x600": { id: "S51261158C3EF2575", w: 300, h: 600 },
    "640x340": { id: "S51261158C3EF25713", w: 640, h: 340 },
  },
  Illiko: {
    "320x50": { id: "S51261158C3EF23D5", w: 320, h: 50 },
    "320x179": { id: "S51261158C3EF23D7", w: 320, h: 179 },
    "728x90": { id: "S51261158C3EF23D9", w: 728, h: 90 },
    "300x250": { id: "S51261158C3EF23D1", w: 300, h: 250 },
    "300x600": { id: "S51261158C3EF23D3", w: 300, h: 600 },
  },
  Valorisation_2025: {
    "320x50": { id: "S51261158C3EF2817", w: 320, h: 50 },
    "320x170": { id: "S51261158C3EF2819", w: 320, h: 170 },
    "250x250": { id: "S51261158C3EF2811", w: 250, h: 250 },
    "728x90": { id: "S51261158C3EF28117", w: 728, h: 90 },
    "300x250": { id: "S51261158C3EF2813", w: 300, h: 250 },
    "320x480": { id: "S51261158C3EF28111", w: 320, h: 480 },
    "480x320": { id: "S51261158C3EF28113", w: 480, h: 320 },
    "300x600": { id: "S51261158C3EF2815", w: 300, h: 600 },
    "640x340": { id: "S51261158C3EF28115", w: 640, h: 340 },
    "970x250": { id: "S51261158C3EF28119", w: 970, h: 250 },
    "1200x760": { id: "S51261158C3EF28121", w: 1200, h: 760 },
    "1270x720": { id: "S51261158C3EF28123", w: 1270, h: 720 },
  },
  "horizontale ANJ": {
    "322x70": { id: "S51261158C3EF22B1", w: 322, h: 70 },
  },
  "verticale ANJ": {
    "982x36": { id: "S51261158C3EF22B3", w: 982, h: 36 },
  },
} as const;

export type KwankoCampaign = keyof typeof KWANKO_BANNERS;

export const KWANKO_TEXT_LINKS = {
  packTirage: {
    id: "S51261158C3EF21515",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF21515",
  },
  loto: {
    id: "S51261158C3EF2231",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF2231",
  },
  euromillions: {
    id: "S51261158C3EF2211",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF2211",
  },
  grattage: {
    id: "S51261158C3EF2157",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF2157",
  },
  crescendo: {
    id: "S51261158C3EF27B1",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF27B1",
  },
  eurodreams: {
    id: "S51261158C3EF2591",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF2591",
  },
  bonusEte26: {
    id: "S51261158C3EF21513",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF21513",
  },
  exclusWeb: {
    id: "S51261158C3EF2153",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF2153",
  },
  fdj: {
    id: "S51261158C3EF2155",
    click: "https://action.metaffiliation.com/trk.php?mclic=P51261158C3EF2155",
  },
} as const;

function pair(
  campaign: KwankoCampaign,
  desktopSize: string,
  mobileSize: string,
): SlotPair {
  const camp = KWANKO_BANNERS[campaign] as Record<string, SlotDef>;
  return { desktop: camp[desktopSize], mobile: camp[mobileSize] };
}

/**
 * Paires desktop/mobile prêtes à l’emploi (rétrocompatibilité).
 * Les formats manquants restent accessibles via KWANKO_BANNERS.
 */
export const KWANKO_SLOTS: Record<string, SlotPair> = {
  bienvenue: pair("Bonus_ete26", "728x90", "320x50"),
  bienvenueLarge: pair("Bonus_ete26", "640x340", "320x170"),
  incontent: pair("Bonus_ete26", "300x250", "300x250"),
  euromillions: pair("FilRouge_EUML_2025", "728x90", "320x50"),
  euromillionsSquare: pair("FilRouge_EUML_2025", "300x250", "320x100"),
  loto: pair("FilRouge_LOTO_2025", "728x90", "320x50"),
  eurodreams: pair("Fil_Rouge_EDMS", "728x90", "320x50"),
  crescendo: pair("CRDO", "728x90", "320x50"),
  illiko: pair("Illiko", "728x90", "320x50"),
  illikoExclu: pair("Exclu_Web_Illiko", "728x90", "320x50"),
  valorisation: pair("Valorisation_2025", "728x90", "320x170"),
  valorisationSquare: pair("Valorisation_2025", "250x250", "250x250"),
  valorisationMrec: pair("Valorisation_2025", "300x250", "300x250"),
  valorisationLarge: pair("Valorisation_2025", "970x250", "320x480"),
  anjHorizontal: {
    desktop: KWANKO_BANNERS["horizontale ANJ"]["322x70"],
    mobile: KWANKO_BANNERS["horizontale ANJ"]["322x70"],
  },
  anjVertical: {
    desktop: KWANKO_BANNERS["verticale ANJ"]["982x36"],
    mobile: KWANKO_BANNERS["verticale ANJ"]["982x36"],
  },
};

export function kwankoSlot(campaign: string): SlotPair | undefined {
  return KWANKO_SLOTS[campaign];
}

export function kwankoBanner(
  campaign: KwankoCampaign,
  size: string,
): SlotDef | undefined {
  const camp = KWANKO_BANNERS[campaign] as Record<string, SlotDef>;
  return camp[size];
}

/**
 * Bannières email : visuel `maff=` + clic `mclic=` du même support (export Kwanko).
 * Les JPEG statiques `mail_37_49_1_2.jpg` mélangeaient EuroDreams et EuroMillions.
 */
type MailBanner = {
  img: string;
  click: string;
  w: number;
  h: number;
  alt: string;
};

function mailBannerFromSlot(slot: SlotDef, alt: string): MailBanner {
  const clickId = slot.id.replace(/^S/, "P");
  return {
    img: `https://action.metaffiliation.com/trk.php?maff=${clickId}`,
    click: `https://action.metaffiliation.com/trk.php?mclic=${clickId}`,
    w: slot.w,
    h: slot.h,
    alt,
  };
}

export const KWANKO_MAIL_BANNERS: Record<string, MailBanner> = {
  euromillions: mailBannerFromSlot(
    KWANKO_BANNERS.FilRouge_EUML_2025["640x340"],
    "Jouez à EuroMillions sur FDJ.fr",
  ),
  loto: mailBannerFromSlot(
    KWANKO_BANNERS.FilRouge_LOTO_2025["640x340"],
    "Jouez au Loto sur FDJ.fr",
  ),
  eurodreams: mailBannerFromSlot(
    KWANKO_BANNERS.Fil_Rouge_EDMS["640x340"],
    "Jouez à EuroDreams sur FDJ.fr",
  ),
  crescendo: mailBannerFromSlot(
    KWANKO_BANNERS.CRDO["640x340"],
    "Jouez à Crescendo sur FDJ.fr",
  ),
  bienvenue: mailBannerFromSlot(
    KWANKO_BANNERS.Bonus_ete26["640x340"],
    "Offre de bienvenue FDJ – 10€ offerts",
  ),
  illiko: mailBannerFromSlot(
    KWANKO_BANNERS.Illiko["300x250"],
    "Jouez à Illiko sur FDJ.fr",
  ),
};
