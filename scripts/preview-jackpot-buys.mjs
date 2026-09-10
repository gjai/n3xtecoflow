/**
 * Preview local du Reel « 3 achats fous avec le jackpot ».
 * N’envoie rien sur les réseaux. Pas de cron.
 *
 *   node --experimental-strip-types --import ./scripts/node-test-register.mjs \
 *     scripts/preview-jackpot-buys.mjs --server-ai
 *
 * Flags : --server-ai  --reuse  --skip-images
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { mkdir as mkdirP, writeFile as writeFileP } from "node:fs/promises";
import path from "node:path";

const SERVER_AI = process.argv.includes("--server-ai");
const REUSE = process.argv.includes("--reuse");
const SKIP_IMAGES = process.argv.includes("--skip-images");
const SSH_KEY = "/Users/gjai/.ssh/id_rsa";
const SSH_HOST = "ubuntu@51.254.142.58";
const APP_UUID = "5vfqqtuutewouqw8psiknl8q";

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

const { newsShareMp4 } = await import("../src/lib/euromillions/share-video.ts");
const { generateNewsShortPhotos } = await import(
  "../src/lib/euromillions/news-short-script.ts"
);
const {
  JACKPOT_BUYS_CTA,
  JACKPOT_BUYS_KICKER,
  JACKPOT_BUYS_SYSTEM_PROMPT,
  composeJackpotBuysScript,
  jackpotBuysUserPrompt,
  parseJackpotBuysAiJson,
  pickNextJackpot,
} = await import("../src/lib/euromillions/jackpot-buys.ts");

const root = path.join(process.cwd(), "tmp-preview");
await mkdirP(root, { recursive: true });

function sshBase() {
  return [
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=20",
    "-i",
    SSH_KEY,
    "-o",
    "IdentitiesOnly=yes",
    SSH_HOST,
  ];
}

function dockerContainer() {
  const nameRun = spawnSync(
    "ssh",
    [...sshBase(), `sudo docker ps --format '{{.Names}}' | grep '^${APP_UUID}-' | head -1`],
    { encoding: "utf8" },
  );
  const container = (nameRun.stdout || "").trim();
  if (nameRun.status !== 0 || !container) {
    throw new Error(
      `container_introuvable: ${(nameRun.stderr || nameRun.stdout || "").slice(0, 300)}`,
    );
  }
  return container;
}

function dockerTee(container, remote, bytes) {
  const putRun = spawnSync(
    "ssh",
    [...sshBase(), `sudo docker exec -i ${container} tee ${remote} >/dev/null`],
    { input: bytes, maxBuffer: 4_000_000 },
  );
  if (putRun.status !== 0) {
    throw new Error(
      `docker_tee_fail ${remote}: ${String(putRun.stderr || "").slice(0, 300)}`,
    );
  }
}

function dockerExec(container, cmd, timeout = 90_000) {
  return spawnSync("ssh", [...sshBase(), `sudo docker exec ${container} ${cmd}`], {
    encoding: "utf8",
    timeout,
    maxBuffer: 4_000_000,
  });
}

async function fetchProdJackpot() {
  const container = dockerContainer();
  dockerTee(
    container,
    "/tmp/read-jackpots.mjs",
    Buffer.from(
      `import { readFileSync } from "node:fs";
const e = JSON.parse(readFileSync("data/euromillions.json", "utf8"));
let loto = null;
try {
  const f = JSON.parse(readFileSync("data/fdj-games.json", "utf8"));
  loto = f.games && f.games.loto && f.games.loto.latest;
} catch {}
process.stdout.write(
  JSON.stringify({
    em: { date: e.nextDrawDate || null, jackpotEur: e.nextJackpotEur ?? null },
    loto: { date: (loto && loto.date) || null, jackpotEur: (loto && loto.jackpotEur) ?? null },
  }),
);
`,
      "utf8",
    ),
  );
  const run = dockerExec(container, "node /tmp/read-jackpots.mjs", 20_000);
  if (run.status !== 0) {
    throw new Error(`jackpot_prod_fail: ${(run.stderr || run.stdout || "").slice(0, 400)}`);
  }
  const raw = JSON.parse(run.stdout || "{}");
  const pick = pickNextJackpot(raw);
  if (!pick) {
    throw new Error(`jackpot_prod_vide: ${run.stdout}`);
  }
  pick._container = container;
  pick._raw = raw;
  return pick;
}

async function composeViaServerAi(target, container) {
  const systemPath = path.join(root, "jackpot-buys-system.txt");
  const userPath = path.join(root, "jackpot-buys-user.txt");
  await writeFileP(systemPath, JACKPOT_BUYS_SYSTEM_PROMPT);
  await writeFileP(userPath, jackpotBuysUserPrompt(target));
  dockerTee(container, "/tmp/news-short-system.txt", readFileSync(systemPath));
  dockerTee(container, "/tmp/news-short-user.txt", readFileSync(userPath));
  dockerTee(
    container,
    "/tmp/run-news-short-ai.mjs",
    readFileSync(path.join(process.cwd(), "scripts/run-news-short-ai.mjs")),
  );
  const aiRun = dockerExec(container, "node /tmp/run-news-short-ai.mjs", 90_000);
  await writeFileP(
    path.join(root, "jackpot-buys.ai-raw.txt"),
    `${aiRun.stdout || ""}\n--- stderr ---\n${aiRun.stderr || ""}`,
  );
  if (aiRun.status !== 0) {
    throw new Error(`ia_serveur_fail: ${(aiRun.stderr || aiRun.stdout || "").slice(0, 500)}`);
  }
  const parsed = parseJackpotBuysAiJson(aiRun.stdout || "", target);
  if (!parsed) {
    throw new Error(`ia_json_invalide: ${(aiRun.stdout || "").slice(0, 800)}`);
  }
  return parsed;
}

async function generatePhotosOnServer(script, container) {
  dockerTee(
    container,
    "/tmp/actu-short.json",
    Buffer.from(JSON.stringify(script, null, 2), "utf8"),
  );
  dockerTee(
    container,
    "/tmp/run-news-short-images.mjs",
    readFileSync(path.join(process.cwd(), "scripts/run-news-short-images.mjs")),
  );
  const imgRun = dockerExec(container, "node /tmp/run-news-short-images.mjs", 360_000);
  await writeFileP(
    path.join(root, "jackpot-buys.images-log.txt"),
    `${imgRun.stdout || ""}\n--- stderr ---\n${imgRun.stderr || ""}`,
  );
  if (imgRun.status !== 0) {
    throw new Error(`img_serveur_fail: ${(imgRun.stderr || imgRun.stdout || "").slice(0, 500)}`);
  }
  const bufs = [];
  for (let i = 0; i < 3; i += 1) {
    const b64 = spawnSync(
      "ssh",
      [...sshBase(), `sudo docker exec ${container} base64 -w0 /tmp/news-short-scene-${i}.jpg`],
      { encoding: "utf8", timeout: 30_000, maxBuffer: 8_000_000 },
    );
    if (b64.status !== 0 || !(b64.stdout || "").trim()) {
      console.warn("img_pull_fail", i, (b64.stderr || "").slice(0, 200));
      continue;
    }
    const buf = Buffer.from(b64.stdout.trim(), "base64");
    const dest = path.join(root, `jackpot-buys-scene-${i}.jpg`);
    writeFileSync(dest, buf);
    bufs.push(buf);
  }
  if (!bufs.length) throw new Error("img_aucune_scene");
  return bufs;
}

const target = REUSE
  ? JSON.parse(readFileSync(path.join(root, "jackpot-buys-target.json"), "utf8"))
  : await fetchProdJackpot();
if (!REUSE) {
  await writeFileP(
    path.join(root, "jackpot-buys-target.json"),
    JSON.stringify(
      {
        game: target.game,
        jackpotEur: target.jackpotEur,
        drawDate: target.drawDate,
        label: target.label,
        raw: target._raw || null,
      },
      null,
      2,
    ) + "\n",
  );
}

function loadLocalPhotos() {
  const bufs = [];
  for (let i = 0; i < 3; i += 1) {
    const file = path.join(root, `jackpot-buys-scene-${i}.jpg`);
    if (!existsSync(file)) return null;
    bufs.push(readFileSync(file));
  }
  return bufs;
}

const container =
  REUSE && !SERVER_AI
    ? null
    : target._container || dockerContainer();

const script = REUSE
  ? JSON.parse(readFileSync(path.join(root, "jackpot-buys.json"), "utf8"))
  : SERVER_AI
    ? await composeViaServerAi(target, container)
    : await composeJackpotBuysScript({
        target,
        skipAi: !process.env.GEMINI_API_KEY,
      });
if (!REUSE) {
  await writeFileP(
    path.join(root, "jackpot-buys.json"),
    JSON.stringify(script, null, 2) + "\n",
  );
}

let photoBufs;
const localPhotos = loadLocalPhotos();
if (SKIP_IMAGES) {
  photoBufs = await generateNewsShortPhotos(script);
} else if (REUSE && localPhotos) {
  photoBufs = localPhotos;
} else {
  try {
    photoBufs = await generatePhotosOnServer(script, container);
  } catch (err) {
    console.warn("images_ia_fail_stock", String(err).slice(0, 240));
    photoBufs = localPhotos || (await generateNewsShortPhotos(script));
  }
}

const mp4 = await newsShareMp4(script.title, script.excerpt, {
  body: script.body,
  mood: "rock",
  sfx: script.sfx || ["whoosh", "sting"],
  fond: script.visuels?.[0]?.fond,
  visuelSeed: script.fact,
  visuels: script.visuels,
  photoBufs,
  kicker: JACKPOT_BUYS_KICKER,
  ctaLine: JACKPOT_BUYS_CTA,
});
await writeFileP(path.join(root, "jackpot-buys.mp4"), mp4);

console.log("target:", target.game, target.jackpotEur, target.drawDate, target.label);
console.log("source:", script.source);
console.log("fact:", script.fact);
console.log("title:", script.title);
console.log("excerpt:", script.excerpt);
console.log("body:", script.body);
console.log("kicker:", JACKPOT_BUYS_KICKER);
console.log("cta:", JACKPOT_BUYS_CTA);
console.log("mood: rock");
console.log("sfx:", script.sfx);
console.log("visuels:", JSON.stringify(script.visuels || []));
console.log("photos:", photoBufs.length);
console.log("wrote tmp-preview/jackpot-buys.mp4", mp4.length);
console.log("pas de publication — valider le modèle avant de programmer");
