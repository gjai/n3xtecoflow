import { completeChat } from "@/lib/ai/chat";
import { generateGeminiImage } from "@/lib/ai/image-gen";
import { parisDateKey } from "./datetime";

const SITE = "https://euromillions-resultats.fr";
const GAMES = [
  "euromillions",
  "loto",
  "eurodreams",
  "keno",
  "crescendo",
  "mymillion",
] as const;

export type NewsShortGame = (typeof GAMES)[number];
export type NewsShortMusic = "ironie" | "tension" | "mystere" | "chaleur";
export type NewsShortFond = "navy" | "gold" | "cold" | "warm";

export type NewsShortVisuel = {
  at: "accroche" | "corps" | "chute";
  plan: string;
  fond: NewsShortFond;
  imagePrompt?: string;
};

export type NewsShortScript = {
  title: string;
  excerpt: string;
  body: string;
  game: NewsShortGame;
  fact: string;
  permalink: string;
  imageSrc: string | null;
  source: "ai" | "fallback";
  voix: boolean;
  voixOff?: string;
  music?: NewsShortMusic;
  sfx?: string[];
  visuels?: NewsShortVisuel[];
};

export type NewsShortBriefing = {
  today: string;
  avoidFacts: string[];
};

function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(8, max - 1)).trimEnd()}…`;
}

function isGame(value: string): value is NewsShortGame {
  return (GAMES as readonly string[]).includes(value);
}

function asMusic(value: unknown): NewsShortMusic {
  const v = String(value || "").toLowerCase();
  return v === "tension" || v === "mystere" || v === "chaleur" || v === "ironie"
    ? v
    : "ironie";
}

function asFond(value: unknown): NewsShortFond {
  const v = String(value || "").toLowerCase();
  return v === "gold" || v === "cold" || v === "warm" || v === "navy" ? v : "navy";
}

function cleanLine(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function isFluffLine(s: string): boolean {
  return /18\s*\+|jeu responsable|nous ne vendons|simulateur|salut tout le monde|aujourd.hui on va parler/i.test(
    s,
  );
}

/** Le bandeau abonnement est à nous : on retire la mention, on ne jette pas le script. */
function stripSubscribeCta(s: string): string {
  return s
    .replace(/[^.!?]*abonne[- ]toi[^.!?]*[.!?]*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function repeatsAvoided(fact: string, avoidFacts: string[]): boolean {
  const f = fact.toLowerCase();
  return avoidFacts.some((a) => {
    const t = a.replace(/\s+/g, " ").trim().toLowerCase();
    if (t.length < 24) return false;
    return f.includes(t.slice(0, 48)) || t.includes(f.slice(0, 48));
  });
}

const SYSTEM = JSON.stringify(
  {
    system_role:
      "Tu es un conteur. Tu écris des histoires de loterie pour YouTube Shorts : UNE anecdote qui tient debout, avec du suspense et un effet de surprise. Tu fournis TOUT le scénario : récit, texte écran, visuels, couleurs, musique, bruits, voix oui/non.",
    objective:
      "Choisir UNE anecdote réelle, connue, de loterie (EuroMillions, Loto FDJ, EuroDreams, My Million, Keno, Crescendo — Europe / France de préférence). Tu es la seule source : pas de briefing tirage, pas d'actus d'un site.",
    anecdote_must_hold: {
      ancrage:
        "Ville ou région + mois/année + nom du jeu + montant (ou enjeu) : sans ça, change d'anecdote. Pas « un Américain », « quelqu'un », « un gagnant ». Si le gagnant s'est montré, tu peux le nommer.",
      arc:
        "L'histoire a une cause et un effet : situation → obstacle → tension (on croit que c'est trop tard / perdu / impossible) → RETOURNEMENT. La surprise arrive à la chute, pas avant.",
      interdits:
        "Titre et accroche NE SPOILENT PAS la chute. Interdit d'inventer un jackpot record fantaisiste. Ne mélange pas Loto FDJ et loteries US. Si tu n'as pas le lieu et la date, prends une autre histoire. Varie chaque jour. Ne reprends pas les faits_a_eviter.",
    },
    constraints: {
      word_count_voix_off:
        "Si voix=true : voixOff 180 à 220 mots, récit complet avec dates, lieux, tension, puis révélation. Si voix=false : voixOff vide, l'écran raconte quand même toute l'histoire.",
      duration_target: "Durée calée sur le texte à l'écran (environ 20 à 40 s), sans temps mort.",
      cta:
        "L'incitation à l'abonnement est ajoutée à l'écran par nous (bandeau final). Inutile de l'écrire. Si tu la mentionnes, on l'enlèvera du texte, le reste du scénario est conservé.",
    },
    structure_rules: {
      title:
        "≤ 68 caractères. Intrigue, pas spoiler. Mauvais : « Sa femme retrouve le ticket dans la voiture ». Bon : « Le jackpot a disparu à Quimper ».",
      accroche:
        "Ouverture : exactement 2 phrases. Lieu + date + enjeu. Pose une question dans la tête du spectateur. Interdit Salut / Aujourd'hui on va parler de. Interdit de dire comment ça finit.",
      corps:
        "Milieu : exactement 4 phrases développées (2 blocs de 2). Bloc 1 : qui, où, ce qui a basculé. Bloc 2 : la quête, le doute, le temps qui passe — on serre. Détails concrets (tabac, village, délai, objet).",
      chute:
        "Fin : exactement 2 phrases. Phrase 1 = la SURPRISE (le retournement). Phrase 2 = question ouverte pour commenter. Sans la surprise, le scénario est refusé.",
      texte_ecran:
        "Phrases longues et parlées, pas télégraphique. Chaque phrase avance l'histoire (pas de remplissage émotionnel vide).",
      voix:
        "voix = true (recommandé : le récit gagne à être dit).",
      visuels:
        "Exactement 3 plans. accroche = le LIEU / la situation, pas le twist. corps = la TENSION (recherche, attente, doute). chute = l'image de la SURPRISE. Chaque plan : at, plan (B-roll FR), fond (navy|gold|cold|warm), imagePrompt (EN 9:16 photoreal, no text in image).",
      musique:
        "tension ou mystere par défaut. chaleur si fin émue. ironie seulement si la surprise est absurde.",
      sfx: "tick (tension) + sting (révélation). whoosh optionnel au changement de tableau.",
    },
    output_format:
      'JSON only: {"game":"euromillions"|"loto"|"eurodreams"|"keno"|"crescendo"|"mymillion","fact":"année, ville, jeu, montant, ce qui s\'est passé, la surprise","title":"...","accroche":"...","corps":["...","...","...","..."],"chute":"...","voix":true,"voixOff":"...","visuels":[{"at":"accroche","plan":"...","fond":"navy","imagePrompt":"..."}],"musique":"tension","sfx":["tick","sting"],"newsSlug":null}',
  },
  null,
  2,
);

export const NEWS_SHORT_SYSTEM_PROMPT = SYSTEM;

export function newsShortUserPrompt(briefing: NewsShortBriefing): string {
  return JSON.stringify(
    {
      date_actuelle: briefing.today,
      faits_a_eviter: briefing.avoidFacts,
      consigne:
        "Une anecdote DIFFÉRENTE, vérifiable (ville, date, montant). Suspense : ne spoile pas la chute dans le titre ni l'accroche. Surprise nette à la fin. Tout le scénario (texte, voix, 3 imagePrompt, musique, sfx). Pas d'actus site, pas de boules de tirage.",
    },
    null,
    2,
  );
}

export function parseNewsShortAiJson(
  raw: string,
  briefing?: NewsShortBriefing,
): NewsShortScript | null {
  let parsed: {
    game?: string;
    fact?: string;
    title?: string;
    titre?: string;
    excerpt?: string;
    accroche?: string;
    beats?: unknown;
    corps?: unknown;
    chute?: string;
    voix?: unknown;
    voixOff?: string;
    musique?: string;
    sfx?: unknown;
    visuels?: unknown;
  };
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    parsed = JSON.parse(start >= 0 ? raw.slice(start, end + 1) : raw);
  } catch {
    return null;
  }
  const rawGame = String(parsed.game || "");
  const game: NewsShortGame = isGame(rawGame) ? rawGame : "euromillions";
  const fact = clip(String(parsed.fact || ""), 360);
  const title = clip(stripSubscribeCta(String(parsed.title || parsed.titre || "")), 88);
  const excerpt = clip(
    stripSubscribeCta(String(parsed.accroche || parsed.excerpt || "")),
    420,
  );
  const corps = Array.isArray(parsed.corps) ? parsed.corps : parsed.beats;
  const beats = Array.isArray(corps)
    ? corps
        .map((b) => stripSubscribeCta(cleanLine(String(b))))
        .filter((s) => s.length > 12 && !isFluffLine(s))
        .slice(0, 8)
    : [];
  const chute = stripSubscribeCta(cleanLine(String(parsed.chute || "")));
  if (chute && !isFluffLine(chute)) beats.push(chute);
  const body = beats.join(" ");
  const storySentences = `${excerpt} ${body}`
    .split(/(?<=[.!?…])\s+/)
    .filter((s) => s.replace(/\s+/g, " ").trim().length > 12);
  if (title.length < 12 || excerpt.length < 18 || !body || fact.length < 20) {
    return null;
  }
  if (storySentences.length < 5) return null;
  const voixOff = clip(stripSubscribeCta(String(parsed.voixOff || "")), 1800);
  const voixRaw = parsed.voix;
  const voix =
    voixRaw === true ||
    voixRaw === "true" ||
    voixRaw === "oui" ||
    (voixRaw !== false && voixOff.length > 80);
  const sfx = Array.isArray(parsed.sfx)
    ? parsed.sfx.map((s) => cleanLine(String(s)).toLowerCase()).filter(Boolean).slice(0, 4)
    : [];
  const visuels: NewsShortVisuel[] = Array.isArray(parsed.visuels)
    ? parsed.visuels.slice(0, 3).map((row) => {
        const r = row as {
          at?: string;
          plan?: string;
          fond?: string;
          imagePrompt?: string;
        };
        const at = r.at === "corps" || r.at === "chute" ? r.at : "accroche";
        const imagePrompt = clip(String(r.imagePrompt || r.plan || ""), 280);
        return {
          at,
          plan: clip(String(r.plan || "ticket"), 80),
          fond: asFond(r.fond),
          ...(imagePrompt.length > 8 ? { imagePrompt } : {}),
        };
      })
    : [];
  if (isFluffLine(`${title} ${excerpt} ${body}`)) return null;
  if (repeatsAvoided(fact, briefing?.avoidFacts || [])) return null;
  return {
    title,
    excerpt,
    body,
    game,
    fact,
    permalink: SITE + "/fr",
    imageSrc: null,
    source: "ai",
    voix,
    ...(voix && voixOff.length > 40 ? { voixOff } : {}),
    music: asMusic(parsed.musique),
    ...(sfx.length ? { sfx } : {}),
    ...(visuels.length ? { visuels } : {}),
  };
}

export function fallbackNewsShortScript(
  briefing?: NewsShortBriefing,
): NewsShortScript {
  const day = briefing?.today || parisDateKey();
  const n = Number(day.replace(/\D/g, "").slice(-2)) || 0;
  const variants: NewsShortScript[] = [
    {
      title: "13 millions disparaissent à Glasgow",
      excerpt:
        "Mars 2011, près de Glasgow. Un ticket National Lottery à 13 millions de livres est validé — puis introuvable.",
      body: "Le joueur jure l'avoir gardé à la maison. Les jours passent, Camelot ouvre une enquête, les sacs poubelle du quartier sont fouillés. Le délai pour réclamer le jackpot touche à sa fin, personne ne se présente. Le ticket avait fini dans les ordures ménagères, jamais réclamé. Vous iriez jusqu'à la décharge, vous ?",
      game: "loto",
      fact: "Ticket Loto gagnant d'environ 13 millions jeté par erreur, enquête ouverte, gain non réclamé.",
      permalink: `${SITE}/fr`,
      imageSrc: null,
      source: "fallback",
      voix: false,
      music: "mystere",
      sfx: ["whoosh", "tick"],
      visuels: [
        { at: "accroche", plan: "ticket froissé au bord d'une poubelle", fond: "cold" },
        { at: "corps", plan: "enquête, entrepôt, sacs poubelle", fond: "navy" },
        { at: "chute", plan: "close-up ticket sous une loupe", fond: "gold" },
      ],
    },
    {
      title: "À Glasgow, le jackpot tient dans une chaussette",
      excerpt:
        "Écosse, 2011. Un gagnant EuroMillions cache son ticket deux jours — personne ne sait encore où.",
      body: "Le lendemain du tirage, il entre dans une bijouterie du centre de Glasgow et paie cash. Deux cents montres, une après-midi, sans négocier. La boutique n'a plus de vitrine. Le sésame, lui, était plié dans une chaussette depuis le vendredi soir. Vous auriez tout misé sur les montres ?",
      game: "euromillions",
      fact: "Gagnant EuroMillions achète environ 200 montres après son gain, ticket gardé dans une chaussette.",
      permalink: `${SITE}/fr`,
      imageSrc: null,
      source: "fallback",
      voix: false,
      music: "ironie",
      sfx: ["whoosh", "sting"],
      visuels: [
        { at: "accroche", plan: "vitrine de montres de luxe", fond: "gold" },
        { at: "corps", plan: "ticket plié dans une chaussette", fond: "warm" },
        { at: "chute", plan: "poignet couvert de montres", fond: "navy" },
      ],
    },
  ];
  const pick = variants[n % variants.length]!;
  if (repeatsAvoided(pick.fact, briefing?.avoidFacts || [])) {
    return variants[(n + 1) % variants.length]!;
  }
  return pick;
}

export async function composeNewsShortScript(options?: {
  avoidFacts?: string[];
  skipAi?: boolean;
  briefing?: NewsShortBriefing;
}): Promise<NewsShortScript> {
  const briefing: NewsShortBriefing = options?.briefing || {
    today: parisDateKey(),
    avoidFacts: (options?.avoidFacts || []).map((s) => s.trim()).filter(Boolean),
  };

  if (!options?.skipAi) {
    const result = await completeChat({
      job: "news-short-script",
      siteId: "euromillions",
      logTag: "ai_news_short_failed",
      temperature: 0.7,
      maxTokens: 2200,
      timeoutMs: 45_000,
      system: SYSTEM,
      user: newsShortUserPrompt(briefing),
    });
    if (result?.content) {
      const parsed = parseNewsShortAiJson(result.content, briefing);
      if (parsed) return parsed;
    }
  }
  return fallbackNewsShortScript(briefing);
}

function sceneImagePrompt(visuel: NewsShortVisuel, script: NewsShortScript): string {
  const mood =
    visuel.fond === "gold"
      ? "warm gold lighting"
      : visuel.fond === "cold"
        ? "cold blue cinematic light"
        : visuel.fond === "warm"
          ? "warm indoor tungsten light"
          : "dark navy cinematic light";
  const custom = visuel.imagePrompt?.trim();
  const scene = custom || visuel.plan;
  return `Vertical 9:16 photoreal cinematic still, no text, no letters, no logo, no watermark. Subject: ${scene}. Story: ${clip(script.fact, 120)}. Lighting: ${mood}. Shallow depth of field, film still, lottery ticket atmosphere, Europe.`;
}

export async function generateNewsShortPhotos(
  script: NewsShortScript,
): Promise<Buffer[]> {
  const visuels = script.visuels?.length
    ? script.visuels
    : [
        { at: "accroche" as const, plan: "crumpled lottery ticket", fond: "navy" as const },
        { at: "corps" as const, plan: "hands holding cash and a ticket", fond: "warm" as const },
        { at: "chute" as const, plan: "empty chair under a spotlight", fond: "gold" as const },
      ];
  const shots = await Promise.all(
    visuels.slice(0, 3).map((v) =>
      generateGeminiImage({
        prompt: sceneImagePrompt(v, script),
        job: "news-short-image",
        aspectRatio: "9:16",
      }),
    ),
  );
  return shots.map((s) => s?.buf).filter((b): b is Buffer => Boolean(b));
}
