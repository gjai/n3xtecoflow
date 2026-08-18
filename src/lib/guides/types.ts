import type { ArticleSection } from "@/data/articles";
import type { SiteId } from "@/sites/types";

export type GuideLocaleCopy = {
  title: string;
  subtitle: string;
  sections: ArticleSection[];
};

export type GuideEntry = {
  slug: string;
  /** Theme that owns this guide. Defaults to ecoflow when omitted. */
  siteId?: SiteId;
  fr: GuideLocaleCopy;
  en: GuideLocaleCopy;
  it?: GuideLocaleCopy;
  es?: GuideLocaleCopy;
  pt?: GuideLocaleCopy;
  de?: GuideLocaleCopy;
  nl?: GuideLocaleCopy;
  imageSrc?: string;
  imageCredit?: string;
  model?: string;
  updatedAt: string;
};

export type GuidesStore = {
  updatedAt: string;
  entries: Record<string, GuideEntry>;
};

export type GuideTopic = {
  slug: string;
  siteId?: SiteId;
  topicFr: string;
  topicEn: string;
  angleFr: string;
  angleEn: string;
};

export function guideSiteId(
  entry: { siteId?: SiteId } | null | undefined,
): SiteId {
  return entry?.siteId || "ecoflow";
}

export function guidesForSite(topics: GuideTopic[], siteId: SiteId) {
  return topics.filter((t) => guideSiteId(t) === siteId);
}

/** Seed topics for AI generation / enrichment. */
export const GUIDE_TOPICS: GuideTopic[] = [
  {
    slug: "choisir-station",
    topicFr: "Choisir une station électrique EcoFlow",
    topicEn: "Choosing an EcoFlow power station",
    angleFr: "Méthode Wh/W, familles RIVER/DELTA/Pro, erreurs d’achat",
    angleEn: "Wh/W method, RIVER/DELTA/Pro families, buying mistakes",
  },
  {
    slug: "dimensionnement-wh",
    topicFr: "Dimensionner Wh et watts pour son besoin",
    topicEn: "Sizing Wh and watts for your needs",
    angleFr: "Calcul conso, marge, pic de démarrage, exemples concrets",
    angleEn: "Load calc, margin, startup surge, concrete examples",
  },
  {
    slug: "solaire-portable",
    topicFr: "Solaire portable EcoFlow : panneaux et recharge",
    topicEn: "EcoFlow portable solar: panels and charging",
    angleFr: "MPPT, bifacial, puissance adaptée à la station",
    angleEn: "MPPT, bifacial, matching panel wattage to stations",
  },
  {
    slug: "backup-maison",
    topicFr: "Backup maison avec EcoFlow DELTA / Pro",
    topicEn: "Home backup with EcoFlow DELTA / Pro",
    angleFr: "Charges critiques, UPS, Smart Home Panel, autonomie",
    angleEn: "Critical loads, UPS, Smart Home Panel, runtime",
  },
  {
    slug: "camping-van",
    topicFr: "Camping / vanlife : quelle station EcoFlow",
    topicEn: "Camping / vanlife: which EcoFlow station",
    angleFr: "Frigo 12V/230V, poids, solaire toit, GLACIER",
    angleEn: "12V/230V fridge, weight, roof solar, GLACIER",
  },
  {
    slug: "stream-balcon",
    topicFr: "STREAM solaire balcon plug-in en France",
    topicEn: "STREAM plug-in balcony solar in France",
    angleFr: "Kits Ultra X/Pro/Max, micro-onduleur, règles FR",
    angleEn: "Ultra X/Pro/Max kits, micro-inverter, FR rules",
  },
  {
    slug: "delta-pro-autonomie",
    topicFr: "DELTA Pro : autonomie longue et intégration maison",
    topicEn: "DELTA Pro: long runtime and home integration",
    angleFr: "DELTA Pro 3 / Ultra, expansion, panneaux maison",
    angleEn: "DELTA Pro 3 / Ultra, expansion, home panels",
  },
  {
    slug: "glacier-froid",
    topicFr: "EcoFlow GLACIER : frigo portable et autonomie",
    topicEn: "EcoFlow GLACIER: portable fridge and runtime",
    angleFr: "Couplage station, batterie enfichable, usage camping",
    angleEn: "Station pairing, plug-in battery, camping use",
  },
  {
    slug: "wave-clim",
    topicFr: "EcoFlow WAVE : clim portable hors réseau",
    topicEn: "EcoFlow WAVE: off-grid portable AC",
    angleFr: "Puissance, batterie, usage van / tente",
    angleEn: "Power draw, battery, van / tent use",
  },
  {
    slug: "recharge-rapide",
    topicFr: "Recharge rapide EcoFlow : secteur, solaire, voiture",
    topicEn: "EcoFlow fast charging: AC, solar, car",
    angleFr: "Temps de charge, X-Stream, alternateur",
    angleEn: "Charge times, X-Stream, alternator",
  },
  {
    slug: "ups-coupures",
    topicFr: "UPS et coupures : brancher sans interruption",
    topicEn: "UPS and outages: seamless switchover",
    angleFr: "EPS/UPS ms, appareils sensibles, limites",
    angleEn: "EPS/UPS ms, sensitive devices, limits",
  },
  {
    slug: "premier-achat",
    topicFr: "Premier achat EcoFlow : checklist avant de commander",
    topicEn: "First EcoFlow purchase: checklist before ordering",
    angleFr: "Budget, usage, ASIN Amazon, accessoires utiles",
    angleEn: "Budget, use case, Amazon listing, useful accessories",
  },
  // — tumbler / La gourde isotherme (un seul guide long) —
  {
    slug: "choisir-gourde-isotherme",
    siteId: "tumbler",
    topicFr: "Guide complet gourde & tumbler isotherme",
    topicEn: "Complete insulated bottle & tumbler guide",
    angleFr:
      "Usage, volume, isolation, bouchon, entretien, sélections produits Amazon",
    angleEn:
      "Use case, capacity, insulation, lid, care, Amazon product picks",
  },
  {
    slug: "choisir-pistolet-massage",
    siteId: "massage-gun",
    topicFr: "Guide complet pistolet de massage musculaire",
    topicEn: "Complete percussion massage gun guide",
    angleFr:
      "Amplitude, force, bruit, embouts, autonomie, sélections produits Amazon",
    angleEn:
      "Amplitude, force, noise, heads, battery, Amazon product picks",
  },
  {
    slug: "guide-stake-casino-crypto",
    siteId: "casinos-crypto",
    topicFr: "Stake casino en ligne crypto : guide complet",
    topicEn: "Stake online crypto casino: complete guide",
    angleFr:
      "Casino en ligne Stake, accès France, dépôt crypto, KYC, jeu responsable",
    angleEn:
      "Stake online casino, access, crypto deposit, KYC, responsible play",
  },
  {
    slug: "guide-cryptocom-wallet",
    siteId: "casinos-crypto",
    topicFr: "Crypto.com : acheter de la crypto pour Stake",
    topicEn: "Crypto.com: buy crypto for Stake",
    angleFr: "Wallet, dépôt casino en ligne, KYC, envoi vers Stake",
    angleEn: "Wallet, online casino deposit, KYC, send to Stake",
  },
  {
    slug: "guide-cryptomonnaies",
    siteId: "casinos-crypto",
    topicFr: "Cryptomonnaies : guide pour démarrer",
    topicEn: "Cryptocurrencies: starter guide",
    angleFr:
      "BTC, ETH, wallet, risques, on-ramp Crypto.com, lien éventuel vers Stake",
    angleEn:
      "BTC, ETH, wallet, risks, Crypto.com on-ramp, optional path to Stake",
  },
  {
    slug: "vpn-acces-casino",
    siteId: "casinos-crypto",
    topicFr: "VPN pour accéder à un casino crypto (Stake)",
    topicEn: "VPN to access a crypto casino (Stake)",
    angleFr: "Accès Stake, connexion stable, NordVPN, kill-switch",
    angleEn: "Stake access, stable connection, NordVPN, kill-switch",
  },
  {
    slug: "casino-en-ligne-crypto",
    siteId: "casinos-crypto",
    topicFr: "Casino en ligne crypto : comment ça marche",
    topicEn: "Online crypto casino: how it works",
    angleFr: "Définition, wallet, Stake, limites ANJ, 18+",
    angleEn: "Definition, wallet, Stake, ANJ limits, 18+",
  },
  {
    slug: "casino-bitcoin",
    siteId: "casinos-crypto",
    topicFr: "Casino Bitcoin : dépôt BTC, frais, volatilité",
    topicEn: "Bitcoin casino: BTC deposit, fees, volatility",
    angleFr: "Réseau Bitcoin, confirmations, bankroll vs cours",
    angleEn: "Bitcoin network, confirmations, bankroll vs price",
  },
  {
    slug: "casino-usdt",
    siteId: "casinos-crypto",
    topicFr: "Casino USDT : stablecoin et réseaux",
    topicEn: "USDT casino: stablecoin and networks",
    angleFr: "TRC-20 vs ERC-20, risque émetteur, Stake",
    angleEn: "TRC-20 vs ERC-20, issuer risk, Stake",
  },
  {
    slug: "depot-crypto-casino",
    siteId: "casinos-crypto",
    topicFr: "Dépôt crypto casino : checklist",
    topicEn: "Crypto casino deposit: checklist",
    angleFr: "Réseau, montant test, retrait, Crypto.com",
    angleEn: "Network, test amount, withdrawal, Crypto.com",
  },
  {
    slug: "stake-france",
    siteId: "casinos-crypto",
    topicFr: "Stake France : ANJ, accès, limites",
    topicEn: "Stake France: ANJ, access, limits",
    angleFr: "Pas de licence ANJ, pas de conseil de contournement",
    angleEn: "No ANJ licence, no circumvention advice",
  },
  {
    slug: "kyc-casino-crypto",
    siteId: "casinos-crypto",
    topicFr: "KYC casino crypto",
    topicEn: "Crypto casino KYC",
    angleFr: "Identité au retrait, documents, pas de fraude",
    angleEn: "ID at withdrawal, documents, no fraud how-to",
  },
  {
    slug: "bonus-wagering-casino-crypto",
    siteId: "casinos-crypto",
    topicFr: "Bonus casino crypto et wagering",
    topicEn: "Crypto casino bonuses and wagering",
    angleFr: "Mise à valider, plafonds, rakeback — lire Stake",
    angleEn: "Wagering, caps, rakeback — read Stake terms",
  },
  {
    slug: "provably-fair",
    siteId: "casinos-crypto",
    topicFr: "Provably fair : vérifier un tirage",
    topicEn: "Provably fair: verifying a result",
    angleFr: "Seeds, Originals Stake, ça n’annule pas la maison",
    angleEn: "Seeds, Stake Originals, does not cancel house edge",
  },
  {
    slug: "jeux-stake-crash-mines",
    siteId: "casinos-crypto",
    topicFr: "Jeux Stake : Crash, Mines, Originals",
    topicEn: "Stake games: Crash, Mines, Originals",
    angleFr: "Règles, rythme, bankroll — pas de martingale",
    angleEn: "Rules, pace, bankroll — no martingale",
  },
  {
    slug: "jeu-responsable-casino-crypto",
    siteId: "casinos-crypto",
    topicFr: "Jeu responsable & casino crypto",
    topicEn: "Responsible play & crypto casinos",
    angleFr: "Budget, limites, Joueurs Info Service, 18+",
    angleEn: "Budget, limits, player helpline, 18+",
  },
  {
    slug: "arnaques-casino-crypto",
    siteId: "casinos-crypto",
    topicFr: "Arnaques casino crypto",
    topicEn: "Crypto casino scams",
    angleFr: "Clones Stake, phishing, faux support, seed phrase",
    angleEn: "Stake clones, phishing, fake support, seed phrases",
  },
  {
    slug: "btc-vs-usdt-pour-jouer",
    siteId: "casinos-crypto",
    topicFr: "BTC vs USDT pour jouer au casino",
    topicEn: "BTC vs USDT for casino play",
    angleFr: "Volatilité vs lisibilité, Crypto.com, bankroll",
    angleEn: "Volatility vs readability, Crypto.com, bankroll",
  },
  {
    slug: "changer-dns-operateur",
    siteId: "casinos-crypto",
    topicFr: "Changer de DNS contre les blocages FAI",
    topicEn: "Change DNS against ISP blocks",
    angleFr:
      "IPv4 vs IPv6, page SFR, 1.1.1.1 insuffisant, DNS vs VPN, pas un contournement ANJ",
    angleEn:
      "IPv4 vs IPv6, SFR page, 1.1.1.1 not enough, DNS vs VPN, not an ANJ workaround",
  },
  {
    slug: "comprendre-euromillions",
    siteId: "euromillions",
    topicFr: "Comprendre l’EuroMillions",
    topicEn: "Understanding EuroMillions",
    angleFr: "Boules, étoiles, rangs, lecture des résultats",
    angleEn: "Numbers, stars, prize tiers, reading results",
  },
  {
    slug: "probabilites-euromillions",
    siteId: "euromillions",
    topicFr: "Probabilités EuroMillions",
    topicEn: "EuroMillions odds",
    angleFr: "Ordres de grandeur, mythes des méthodes",
    angleEn: "Orders of magnitude, myths about systems",
  },
  {
    slug: "jeu-responsable-euromillions",
    siteId: "euromillions",
    topicFr: "Jeu responsable & EuroMillions",
    topicEn: "Responsible play & EuroMillions",
    angleFr: "Budget loisir, 18+, aide Joueurs Info Service",
    angleEn: "Leisure budget, 18+, player support resources",
  },
  {
    slug: "comprendre-my-million",
    siteId: "euromillions",
    topicFr: "Comprendre My Million",
    topicEn: "Understanding My Million",
    angleFr: "Code, archives, distinction avec le jackpot",
    angleEn: "Code, archives, distinct from the jackpot",
  },
  {
    slug: "rangs-gains-euromillions",
    siteId: "euromillions",
    topicFr: "Les 13 rangs de gains EuroMillions",
    topicEn: "The 13 EuroMillions prize tiers",
    angleFr: "Barème 5+2 jusqu’à 2+0, simulateur",
    angleEn: "Tiers from 5+2 to 2+0, simulator",
  },
  {
    slug: "euromillions-et-autres-tirages",
    siteId: "euromillions",
    topicFr: "EuroMillions et autres tirages FDJ",
    topicEn: "EuroMillions and other FDJ draws",
    angleFr: "Loto, EuroDreams, Crescendo, Keno — différences",
    angleEn: "Loto, EuroDreams, Crescendo, Keno — differences",
  },
  {
    slug: "comprendre-loto",
    siteId: "euromillions",
    topicFr: "Comprendre le Loto",
    topicEn: "Understanding Loto",
    angleFr: "5/49, numéro Chance, lecture d’un résultat, simulateur",
    angleEn: "5/49, Chance number, reading a result, simulator",
  },
  {
    slug: "comprendre-eurodreams",
    siteId: "euromillions",
    topicFr: "Comprendre EuroDreams",
    topicEn: "Understanding EuroDreams",
    angleFr: "6/40, numéro Dream, rente, archives",
    angleEn: "6/40, Dream number, annuity, archives",
  },
  {
    slug: "comprendre-keno",
    siteId: "euromillions",
    topicFr: "Comprendre le Keno",
    topicEn: "Understanding Keno",
    angleFr: "Tirages midi/soir, 20/70, nombre de numéros joués",
    angleEn: "Lunchtime/evening draws, 20/70, player pick size",
  },
  {
    slug: "comprendre-crescendo",
    siteId: "euromillions",
    topicFr: "Comprendre Crescendo",
    topicEn: "Understanding Crescendo",
    angleFr: "10/25, lettre, plusieurs tirages le samedi",
    angleEn: "10/25, letter, several Saturday draws",
  },
  {
    slug: "lire-resultats-tirages",
    siteId: "euromillions",
    topicFr: "Lire un résultat de tirage",
    topicEn: "How to read a draw result",
    angleFr: "Fiches, archives, simulateur — méthode commune à tous les jeux",
    angleEn: "Draw pages, archives, simulator — shared method for all games",
  },
  {
    slug: "horaires-tirages-fdj",
    siteId: "euromillions",
    topicFr: "Horaires des tirages FDJ",
    topicEn: "FDJ draw schedules",
    angleFr: "EuroMillions, Loto, EuroDreams, Keno, Crescendo — repères horaires",
    angleEn: "EuroMillions, Loto, EuroDreams, Keno, Crescendo — schedule landmarks",
  },
  {
    slug: "toucher-un-gain-euromillions",
    siteId: "euromillions",
    topicFr: "Toucher un gain EuroMillions",
    topicEn: "Claiming an EuroMillions prize",
    angleFr: "Forclusion 60 jours, FDJ, ce que le site ne paie pas",
    angleEn: "60-day time limit, FDJ, this site does not pay prizes",
  },
];
