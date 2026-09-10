/**
 * Jeton TikTok (Content Posting API — Direct Post). N’imprime jamais le secret.
 *
 * 1. https://developers.tiktok.com → Create app
 * 2. Ajouter Login Kit (Desktop) + Content Posting API
 * 3. Redirect URI : http://127.0.0.1:8766/callback/
 * 4. Scopes : user.info.basic, video.publish
 * 5. TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET dans .env.local
 * 6. npm run tiktok:oauth  → coller TIKTOK_REFRESH_TOKEN dans Coolify
 *
 * Avant l’audit TikTok : compte en privé + TIKTOK_PRIVACY=SELF_ONLY.
 */
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const PORT = 8766;
const REDIRECT = `http://127.0.0.1:${PORT}/callback/`;
const SCOPES = "user.info.basic,video.publish";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq < 1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

const clientKey = process.env.TIKTOK_CLIENT_KEY?.trim() || "";
const clientSecret = process.env.TIKTOK_CLIENT_SECRET?.trim() || "";
if (!clientKey || !clientSecret) {
  console.error(
    "Manque TIKTOK_CLIENT_KEY ou TIKTOK_CLIENT_SECRET (.env.local).",
  );
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const codeVerifier = randomBytes(32)
  .toString("base64url")
  .replace(/[^A-Za-z0-9\-._~]/g, "x")
  .slice(0, 64);
const codeChallenge = createHash("sha256").update(codeVerifier).digest("hex");

const authUrl =
  "https://www.tiktok.com/v2/auth/authorize/?" +
  new URLSearchParams({
    client_key: clientKey,
    response_type: "code",
    scope: SCOPES,
    redirect_uri: REDIRECT,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  }).toString();

function upsertEnv(key, value) {
  const file = ".env.local";
  const raw = existsSync(file) ? readFileSync(file, "utf8") : "";
  const line = `${key}=${value}`;
  const next = raw.includes(`${key}=`)
    ? raw.replace(new RegExp(`^${key}=.*$`, "m"), line)
    : `${raw.trimEnd()}\n${line}\n`;
  writeFileSync(file, next.endsWith("\n") ? next : `${next}\n`);
}

async function exchange(code) {
  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT,
      code_verifier: codeVerifier,
    }),
  });
  return res.json();
}

console.log("Ouvre cette URL, connecte-toi avec le compte TikTok de la chaîne :");
console.log(authUrl);
console.log("");
console.log(`En attente sur ${REDIRECT} …`);

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (url.pathname !== "/callback" && url.pathname !== "/callback/") {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Callback TikTok : /callback/");
    return;
  }
  const err = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  if (err || !code) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Autorisation refusée.");
    console.error("oauth_denied", err || "no_code");
    server.close();
    process.exit(1);
    return;
  }
  if (returnedState !== state) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("State OAuth invalide.");
    console.error("oauth_state_mismatch");
    server.close();
    process.exit(1);
    return;
  }
  try {
    const tokens = await exchange(code);
    if (!tokens.refresh_token) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Pas de refresh_token. Réessaie.");
      console.error(
        tokens.error_description || tokens.error || "no_refresh_token",
      );
      server.close();
      process.exit(1);
      return;
    }
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("OK — reviens au terminal. Tu peux fermer cet onglet.");
    upsertEnv("TIKTOK_REFRESH_TOKEN", tokens.refresh_token);
    console.log("");
    console.log("Jeton écrit dans .env.local (TIKTOK_REFRESH_TOKEN).");
    console.log("À recopier dans Coolify. Test : TIKTOK_PRIVACY=SELF_ONLY");
    console.log("Compte TikTok en privé tant que l’app n’est pas auditée.");
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Échec échange du code.");
    console.error(e instanceof Error ? e.message : e);
    server.close();
    process.exit(1);
    return;
  }
  server.close();
  process.exit(0);
});

server.listen(PORT, "127.0.0.1");
