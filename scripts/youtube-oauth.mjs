/**
 * Jeton YouTube (upload Shorts + playlists). N’imprime jamais le secret client.
 *
 * 1. Google Cloud → activer « YouTube Data API v3 »
 * 2. Écran de consentement (externe, test) + ton Gmail testeur
 * 3. Identifiants → ID client OAuth « Application de bureau »
 *    URI de redirection : http://127.0.0.1:8765 (client « installed »)
 * 4. YOUTUBE_CLIENT_ID + YOUTUBE_CLIENT_SECRET dans .env.local
 * 5. npm run youtube:oauth  → coller YOUTUBE_REFRESH_TOKEN dans Coolify
 *
 * Relancer ce script après un changement de scopes (playlists).
 */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PORT = 8765;
const REDIRECT = `http://127.0.0.1:${PORT}`;
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.force-ssl",
].join(" ");

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

const clientId = process.env.YOUTUBE_CLIENT_ID?.trim() || "";
const clientSecret = process.env.YOUTUBE_CLIENT_SECRET?.trim() || "";
if (!clientId || !clientSecret) {
  console.error(
    "Manque YOUTUBE_CLIENT_ID ou YOUTUBE_CLIENT_SECRET (.env.local).",
  );
  process.exit(1);
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
  }).toString();

async function exchange(code) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT,
      grant_type: "authorization_code",
    }),
  });
  return res.json();
}

async function channelHint(accessToken) {
  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,id&mine=true",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const json = await res.json();
  const item = json.items?.[0];
  if (!item) return null;
  const custom = item.snippet?.customUrl;
  return {
    title: item.snippet?.title || "",
    url: custom
      ? `https://www.youtube.com/${custom}`
      : `https://www.youtube.com/channel/${item.id}`,
  };
}

console.log("Ouvre cette URL, connecte-toi avec le compte de la chaîne :");
console.log(authUrl);
console.log("");
console.log(`En attente sur ${REDIRECT} …`);

function upsertEnv(key, value) {
  const file = ".env.local";
  const raw = existsSync(file) ? readFileSync(file, "utf8") : "";
  const line = `${key}=${value}`;
  const next = raw.includes(`${key}=`)
    ? raw.replace(new RegExp(`^${key}=.*$`, "m"), line)
    : `${raw.trimEnd()}\n${line}\n`;
  writeFileSync(file, next.endsWith("\n") ? next : `${next}\n`);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }
  const err = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  if (!err && !code) {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("En attente de Google… ouvre l’URL affichée dans le terminal.");
    return;
  }
  if (err || !code) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Autorisation refusée.");
    console.error("oauth_denied", err || "no_code");
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
        "Pas de refresh_token (compte déjà autorisé ?). Relance le script.",
      );
      server.close();
      process.exit(1);
      return;
    }
    const ch = tokens.access_token
      ? await channelHint(tokens.access_token)
      : null;
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("OK — reviens au terminal. Tu peux fermer cet onglet.");
    upsertEnv("YOUTUBE_REFRESH_TOKEN", tokens.refresh_token);
    console.log("");
    console.log("Jeton écrit dans .env.local (YOUTUBE_REFRESH_TOKEN).");
    if (ch) console.log(`Chaîne : ${ch.title} ${ch.url}`);
    console.log("À recopier dans Coolify au déploiement. Option test : YOUTUBE_PRIVACY=unlisted");
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
