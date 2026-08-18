import { normalizeHost } from "@/sites";

/**
 * Jetons HTML Search Console (publics, pas des secrets).
 * Surcharge Coolify : GSC_CASINOS_CRYPTO_FR=… etc.
 */
const GSC_BY_HOST: Record<string, string> = {
  "casinos-crypto.fr": "FnVESwCvBBXlZctXyzKjS_2dv0OYJWdAqZT-QvGNz68",
  "www.casinos-crypto.fr": "FnVESwCvBBXlZctXyzKjS_2dv0OYJWdAqZT-QvGNz68",
  "ecoflow-stream.com": "VRiYY6231DlRK0OXRP5FFv54y4AMnuQAoKoBD7z2dak",
  "www.ecoflow-stream.com": "VRiYY6231DlRK0OXRP5FFv54y4AMnuQAoKoBD7z2dak",
  "mon-tumbler.fr": "KRG1-sJbfqRYEtBdZdjNKXvlorbBrSrLn39-y5MvsXE",
  "www.mon-tumbler.fr": "KRG1-sJbfqRYEtBdZdjNKXvlorbBrSrLn39-y5MvsXE",
  "massage-gun.fr": "9COh9SG4Fc5XlbtfHz6ZTDF854HDSb1uu0p6cUAmbRI",
  "www.massage-gun.fr": "9COh9SG4Fc5XlbtfHz6ZTDF854HDSb1uu0p6cUAmbRI",
  "euromillions-resultats.fr": "sNzj1FYeWdUX_VK11_R75U8GBR14AuzTxTgqrz046PI",
  "www.euromillions-resultats.fr": "sNzj1FYeWdUX_VK11_R75U8GBR14AuzTxTgqrz046PI",
};

export function googleSiteVerificationToken(
  host: string | null | undefined,
): string | undefined {
  const h = normalizeHost(host);
  if (!h) return undefined;
  const envKey = `GSC_${h.replace(/[^a-z0-9]/gi, "_").toUpperCase()}`;
  return process.env[envKey]?.trim() || GSC_BY_HOST[h];
}
