/**
 * Mapping catalogue éditorial → handle Shopify fr.ecoflow.com
 * (JSON public /products/{handle}.json — source officielle, pas Amazon).
 */
export const ECOFLOW_HANDLES: Record<string, string> = {
  "river-2": "river-2-portable-power-station",
  "river-2-max": "river-2-max-portable-power-station",
  "river-2-pro": "river-2-pro-portable-power-station",
  "river-3": "river-3-portable-power-station",
  "river-3-plus": "river-3-plus-portable-power-station",
  "river-3-plus-wireless": "river-3-plus-wireless-portable-power-station",
  "delta-2": "delta-2-portable-power-station",
  "delta-2-max": "delta-2-max-portable-power-station",
  "delta-3-classic": "delta-3-classic-portable-power-station",
  "delta-3-plus": "delta-3-series-portable-power-station",
  "delta-3-1500": "delta-3-1500-portable-power-station",
  "delta-3-max": "delta-3-max-series-portable-power-station",
  "delta-3-max-plus": "delta-3-max-series-portable-power-station",
  "delta-pro": "delta-pro-portable-power-station",
  "delta-pro-3": "delta-pro-3-portable-power-station",
  "delta-pro-ultra": "delta-pro-ultra",
  "panneau-100w": "100w-flexible-solar-panel",
  "panneau-220w-bifacial": "220w-lightweight-solar-panel",
  "panneau-400w": "400w-lightweight-portable-solar-panel",
  "panneau-rvmax-130": "2-130w-rvmax-rigid-solar-panel-combo",
  "batterie-extra-delta": "delta-2-smart-extra-battery",
  "smart-home-panel": "smart-home-panel",
  "stream-ultra-x": "stream-ultra-x",
  "stream-pro": "stream-ultra-pro",
  "stream-micro-onduleur": "micro-onduleur-ecoflow-stream-with-cable-secteur",
  "kit-solaire-stream-800": "stream-balcony-solar-system",
  "glacier-classic": "glacier-classic-portable-fridge-freezer",
  "wave-3": "wave-3-portable-air-conditioner",
  "rapid-pro": "rapid-pro-27k-power-bank",
  "chargeur-alternateur-600": "600w-alternator-charger",
};

/** Produits sans fiche boutique FR claire (pas encore mappés). */
export const ECOFLOW_UNMAPPED = [
  "delta-3-ultra-plus",
  "delta-pro-ultra-x",
  "powerstream",
  "stream-max",
  "ocean-2-plus",
] as const;
