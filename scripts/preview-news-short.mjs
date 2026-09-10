import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { mkdir as mkdirP, writeFile as writeFileP } from "node:fs/promises";
import path from "node:path";

const SERVER_AI = process.argv.includes("--server-ai");
const REUSE = process.argv.includes("--reuse");
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
const {
  composeNewsShortScript,
  generateNewsShortPhotos,
  newsShortUserPrompt,
  NEWS_SHORT_SYSTEM_PROMPT,
  parseNewsShortAiJson,
} = await import("../src/lib/euromillions/news-short-script.ts");
const { parisDateKey } = await import("../src/lib/euromillions/datetime.ts");

const briefing = {
  today: parisDateKey(),
  avoidFacts: [],
};
if (existsSync(path.join(process.cwd(), "tmp-preview", "actu-short.json"))) {
  try {
    const prev = JSON.parse(
      readFileSync(path.join(process.cwd(), "tmp-preview", "actu-short.json"), "utf8"),
    );
    if (prev?.fact) briefing.avoidFacts.push(String(prev.fact));
  } catch {
    /* ignore */
  }
}
const root = path.join(process.cwd(), "tmp-preview");
await mkdirP(root, { recursive: true });

async function composeViaServerAi() {
  const systemPath = path.join(root, "news-short-system.txt");
  const userPath = path.join(root, "news-short-user.txt");
  await writeFileP(systemPath, NEWS_SHORT_SYSTEM_PROMPT);
  await writeFileP(userPath, newsShortUserPrompt(briefing));
  const sshBase = [
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
  const nameRun = spawnSync(
    "ssh",
    [
      ...sshBase,
      `sudo docker ps --format '{{.Names}}' | grep '^${APP_UUID}-' | head -1`,
    ],
    { encoding: "utf8" },
  );
  const container = (nameRun.stdout || "").trim();
  if (nameRun.status !== 0 || !container) {
    throw new Error(
      `container_introuvable: ${(nameRun.stderr || nameRun.stdout || "").slice(0, 300)}`,
    );
  }
  const put = (remote, localPath) => {
    const putRun = spawnSync(
      "ssh",
      [...sshBase, `sudo docker exec -i ${container} tee ${remote} >/dev/null`],
      { input: readFileSync(localPath), maxBuffer: 2_000_000 },
    );
    if (putRun.status !== 0) {
      throw new Error(
        `docker_tee_fail ${remote}: ${String(putRun.stderr || "").slice(0, 300)}`,
      );
    }
  };
  put("/tmp/news-short-system.txt", systemPath);
  put("/tmp/news-short-user.txt", userPath);
  put(
    "/tmp/run-news-short-ai.mjs",
    path.join(process.cwd(), "scripts/run-news-short-ai.mjs"),
  );
  const aiRun = spawnSync(
    "ssh",
    [
      ...sshBase,
      `sudo docker exec ${container} node /tmp/run-news-short-ai.mjs`,
    ],
    { encoding: "utf8", timeout: 90_000, maxBuffer: 2_000_000 },
  );
  await writeFileP(
    path.join(root, "actu-short.ai-raw.txt"),
    `${aiRun.stdout || ""}\n--- stderr ---\n${aiRun.stderr || ""}`,
  );
  if (aiRun.status !== 0) {
    throw new Error(
      `ia_serveur_fail: ${(aiRun.stderr || aiRun.stdout || "").slice(0, 500)}`,
    );
  }
  const parsed = parseNewsShortAiJson(aiRun.stdout || "", briefing);
  if (!parsed) {
    throw new Error(`ia_json_invalide: ${(aiRun.stdout || "").slice(0, 500)}`);
  }
  parsed._container = container;
  parsed._sshBase = sshBase;
  return parsed;
}

async function photosViaServer(script) {
  const sshBase = script._sshBase;
  const container = script._container;
  if (!sshBase || !container) return [];
  const put = (remote, localPath) => {
    const putRun = spawnSync(
      "ssh",
      [...sshBase, `sudo docker exec -i ${container} tee ${remote} >/dev/null`],
      { input: readFileSync(localPath), maxBuffer: 4_000_000 },
    );
    if (putRun.status !== 0) {
      throw new Error(
        `docker_tee_fail ${remote}: ${String(putRun.stderr || "").slice(0, 300)}`,
      );
    }
  };
  const jsonPath = path.join(root, "actu-short.json");
  put("/tmp/actu-short.json", jsonPath);
  put(
    "/tmp/run-news-short-images.mjs",
    path.join(process.cwd(), "scripts/run-news-short-images.mjs"),
  );
  const imgRun = spawnSync(
    "ssh",
    [
      ...sshBase,
      `sudo docker exec ${container} node /tmp/run-news-short-images.mjs`,
    ],
    { encoding: "utf8", timeout: 240_000, maxBuffer: 2_000_000 },
  );
  await writeFileP(
    path.join(root, "actu-short.images-log.txt"),
    `${imgRun.stdout || ""}\n--- stderr ---\n${imgRun.stderr || ""}`,
  );
  if (imgRun.status !== 0) {
    console.error("images_serveur_fail", (imgRun.stderr || "").slice(0, 400));
    return [];
  }
  const bufs = [];
  for (let i = 0; i < 3; i += 1) {
    const pull = spawnSync(
      "ssh",
      [
        ...sshBase,
        `sudo docker exec ${container} cat /tmp/news-short-scene-${i}.jpg`,
      ],
      { encoding: "buffer", maxBuffer: 8_000_000 },
    );
    if (pull.status === 0 && pull.stdout && pull.stdout.length > 4000) {
      const file = path.join(root, `scene-${i}.jpg`);
      await writeFileP(file, pull.stdout);
      bufs.push(pull.stdout);
    }
  }
  return bufs;
}

const script = REUSE
  ? JSON.parse(readFileSync(path.join(root, "actu-short.json"), "utf8"))
  : SERVER_AI
    ? await composeViaServerAi()
    : await composeNewsShortScript({ briefing, skipAi: !process.env.GEMINI_API_KEY });
if (!REUSE) {
  await writeFileP(
    path.join(root, "actu-short.json"),
    JSON.stringify(script, null, 2) + "\n",
  );
}

const photoBufs = REUSE
  ? [0, 1, 2]
      .map((i) => path.join(root, `scene-${i}.jpg`))
      .filter((f) => existsSync(f))
      .map((f) => readFileSync(f))
  : SERVER_AI
    ? await photosViaServer(script)
    : await generateNewsShortPhotos(script);
const mp4 = await newsShareMp4(script.title, script.excerpt, {
  body: script.body,
  mood: script.music,
  sfx: script.sfx,
  fond: script.visuels?.[0]?.fond,
  visuelSeed: script.fact,
  visuels: script.visuels,
  photoBufs,
});
await writeFileP(path.join(root, "actu-short.mp4"), mp4);
await writeFileP(path.join(process.cwd(), "public", "preview-actu.mp4"), mp4);
console.log("source:", script.source);
console.log("game:", script.game);
console.log("fact:", script.fact);
console.log("title:", script.title);
console.log("excerpt:", script.excerpt);
console.log("body:", script.body);
console.log("voix:", script.voix);
console.log("music:", script.music);
console.log("sfx:", script.sfx);
console.log("visuels:", JSON.stringify(script.visuels || []));
console.log("photos:", photoBufs.length);
console.log("voixOff:", script.voixOff || "");
console.log(
  "voixOffMots:",
  (script.voixOff || "").trim().split(/\s+/).filter(Boolean).length,
);
console.log("wrote actu-short.mp4", mp4.length);
