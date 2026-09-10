import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SHARE_FEED, euroMillionsShareCard } from "./share-card.ts";
import { lotteryShareSvg, rasterShare, wrapLines } from "./share-render.ts";

describe("lotteryShareSvg", () => {
  it("inclut kicker, date et boules", () => {
    const svg = lotteryShareSvg(
      euroMillionsShareCard({
        date: "2026-09-04",
        numbers: [11, 12, 19, 27, 46],
        stars: [4, 12],
        jackpotEur: null,
        source: "fdj",
        fetchedAt: "2026-09-04T19:49:25.219Z",
      }),
      SHARE_FEED,
    );
    assert.match(svg, /EUROMILLIONS/);
    assert.match(svg, />11</);
    assert.match(svg, />46</);
    assert.match(svg, />4</);
    assert.match(svg, /<polygon /);
    assert.match(svg, /font-family="Inter"/);
  });

  it("carte Loto : kicker, chance en boule, pas d’étoile", async () => {
    const { companionShareCard } = await import("./share-card.ts");
    const { SHARE_STORY } = await import("./share-card.ts");
    const card = companionShareCard({
      gameId: "loto",
      date: "2026-09-10",
      plannedAt: "2026-09-10T18:55:00.000Z",
      jackpotEur: 2_000_000,
      groups: [
        {
          type: "numeros principaux",
          kind: "numbers",
          labelKey: "main",
          values: [4, 5, 18, 22, 35],
        },
        {
          type: "numero chance",
          kind: "bonus",
          labelKey: "chance",
          values: [2],
        },
      ],
      source: "fdj",
      fetchedAt: "2026-09-10T19:00:00.000Z",
    });
    assert.equal(card.bonusLabel, "NUMÉRO CHANCE");
    assert.equal(card.bonusShape, "ball");
    const svg = lotteryShareSvg(card, SHARE_STORY, { t: 0 });
    assert.match(svg, /LOTO/);
    assert.ok(!lotteryShareSvg(card, SHARE_STORY, { t: 1 }).includes("LES ÉTOILES"));
  });

  it("carte EuroDreams : kicker, rêve en boule, pas d’étoile", async () => {
    const { companionShareCard } = await import("./share-card.ts");
    const { SHARE_STORY } = await import("./share-card.ts");
    const card = companionShareCard({
      gameId: "eurodreams",
      date: "2026-09-07",
      plannedAt: "2026-09-07T21:00:00.000+02:00",
      jackpotEur: 20_000,
      groups: [
        {
          type: "numeros principaux",
          kind: "numbers",
          labelKey: "main",
          values: [7, 9, 10, 26, 33, 40],
        },
        {
          type: "numero dream",
          kind: "bonus",
          labelKey: "dream",
          values: [1],
        },
      ],
      source: "fdj",
      fetchedAt: "2026-09-07T21:10:00.000Z",
    });
    assert.equal(card.bonusLabel, "NUMÉRO RÊVE");
    assert.equal(card.bonusShape, "ball");
    const svg = lotteryShareSvg(card, SHARE_STORY, { t: 0 });
    assert.match(svg, /EURODREAMS/);
    assert.ok(!lotteryShareSvg(card, SHARE_STORY, { t: 1 }).includes("LES ÉTOILES"));
    assert.ok(!lotteryShareSvg(card, SHARE_STORY, { t: 1 }).includes("<polygon "));
  });

  it("met le jackpot en M€", async () => {
    const { formatShareJackpot } = await import("./share-card.ts");
    assert.equal(formatShareJackpot(111_000_000), "Jackpot 111 M€");
    assert.equal(formatShareJackpot(14_500_000), "Jackpot 14,5 M€");
  });

  it("rasterise un PNG via resvg (texte réel, pas des tofu)", async () => {
    const svg = lotteryShareSvg(
      {
        kicker: "Test",
        dateLabel: "4 septembre 2026",
        accent: "#f5c542",
        accentInk: "#0b1220",
        rows: [{ values: [1, 2, 3] }],
      },
      { width: 400, height: 200 },
    );
    const png = await rasterShare(svg, "png");
    assert.equal(png[0], 0x89);
    assert.equal(png[1], 0x50);
    assert.ok(png.length > 4000, `png trop léger (${png.length}) — police manquante ?`);
  });
});

describe("wrapLines", () => {
  it("casse un titre long sans déborder", () => {
    const lines = wrapLines(
      "EuroMillions : le jackpot grimpe après un tirage sans grand gagnant",
      28,
      4,
    );
    assert.ok(lines.length >= 2);
    assert.ok(lines.every((l) => l.length <= 28));
  });
});

describe("newsShareSvg", () => {
  it("carte photo : kicker HISTOIRE, logo et nom du site", async () => {
    const { newsShareSvg } = await import("./share-render.ts");
    const { SHARE_STORY } = await import("./share-card.ts");
    const svg = newsShareSvg(
      "Le jackpot grimpe à 111 M€",
      "Aucun grand gagnant mardi soir.",
      SHARE_STORY,
    );
    assert.match(svg, /HISTOIRE/);
    assert.match(svg, /euromillions-resultats\.fr/);
    assert.ok(!svg.includes("ACTUALITÉ"));
    assert.match(svg, /jackpot grimpe/);
    assert.ok(!svg.includes("Abonne-toi"));
  });

  it("Reel : titre invisible au départ, CTA en fin de timeline", async () => {
    const { newsShareSvg, newsShareTimeline } = await import("./share-render.ts");
    const { SHARE_STORY } = await import("./share-card.ts");
    const start = newsShareSvg("Titre actu", "Extrait", SHARE_STORY, { t: 0 });
    assert.match(start, /opacity="0\.000"/);
    assert.ok(!start.includes("Abonne-toi"));
    const tl = newsShareTimeline("Extrait");
    const late = newsShareSvg("Titre actu", "Extrait", SHARE_STORY, {
      t: Math.min(0.99, tl.ctaStart + 0.04),
    });
    assert.match(late, /Abonne-toi/);
    assert.match(late, /d'autres histoires/);
  });

  it("Reel photo : voile + deux blocs de texte", async () => {
    const { newsShareSvg, newsShareTimeline } = await import("./share-render.ts");
    const { SHARE_STORY } = await import("./share-card.ts");
    const body =
      "Tirage du mardi 8 septembre 2026 : 13, 17, 33, 35, 39 — étoiles 7 et 12. Rang 5+1 : 3 joueurs en Europe pour 194 608,60 € chacun, aucun en France. Code My Million : DC 157 3553.";
    const excerpt = "Aucun rang 1 mardi soir en Europe.";
    const tl = newsShareTimeline(excerpt, body);
    const hook = newsShareSvg("Le jackpot grimpe", excerpt, SHARE_STORY, {
      t: (tl.hookStart + tl.hookEnd) / 2,
      overlay: true,
      body,
    });
    assert.match(hook, /newsVeil/);
    assert.match(hook, /rang 1/);
    assert.match(hook, /13,/);
    assert.match(hook, /17, 33/);
    const mid = newsShareSvg("Le jackpot grimpe", excerpt, SHARE_STORY, {
      t: (tl.bodyAStart + tl.hookEnd) / 2,
      overlay: true,
      body,
    });
    assert.match(mid, /13,/);
    assert.match(mid, /33, 35/);
    const late = newsShareSvg("Le jackpot grimpe", excerpt, SHARE_STORY, {
      t: (tl.bodyCStart + tl.storyEnd) / 2,
      overlay: true,
      body,
    });
    assert.match(late, /DC 157/);
    assert.match(late, /3553/);
  });

  it("n’abrège pas le 3e paragraphe", async () => {
    const { newsShareSvg, newsShareTimeline, newsStoryBeats } = await import(
      "./share-render.ts"
    );
    const { SHARE_STORY } = await import("./share-card.ts");
    const excerpt =
      "Marly, Nord-Pas-de-Calais, septembre 2014. Un couple joue les mêmes numéros au Loto depuis dix ans.";
    const body =
      "Pourtant, ce ticket, rempli des numéros fétiches du couple, était le bon. Le mari, dans sa routine, l'a jeté à la poubelle sans vérifier, persuadé que leur attente n'avait pas porté ses fruits cette fois encore. Quelques heures plus tard, la réalité les frappe : ils ont remporté les 3 millions d'euros mis en jeu. La panique s'installe. Le ticket, ce précieux sésame, a disparu, probablement déjà dans le camion de ramassage des ordures. La course contre la montre commence, le doute s'installe : vont-ils retrouver ce ticket avant qu'il ne soit trop tard ? C'est finalement en fouillant dans la poubelle, juste avant qu'elle ne soit vidée, que le mari retrouve le fameux ticket, miraculeusement intact. Le cauchemar se transforme en un immense soulagement, leur patience a été récompensée.";
    const [, , beatC] = newsStoryBeats(body);
    const tl = newsShareTimeline(excerpt, body);
    const svg = newsShareSvg("Le ticket Loto jeté par erreur à Marly", excerpt, SHARE_STORY, {
      t: (tl.bodyCStart + tl.storyEnd) / 2,
      overlay: true,
      body,
    });
    assert.match(svg, /récompensée/);
    assert.match(svg, /intact/);
    assert.ok(!/récompensée…/.test(svg));
    assert.ok(beatC.includes("récompensée"));
  });

  it("le 2e tableau reste en haut, sans sauter depuis le bas", async () => {
    const { newsShareSvg, newsShareTimeline } = await import("./share-render.ts");
    const { SHARE_STORY } = await import("./share-card.ts");
    const excerpt =
      "Marly, septembre 2014. Un couple joue les mêmes numéros depuis dix ans.";
    const body =
      "Le mari jette le ticket sans vérifier le relevé. Quelques heures plus tard, les 3 millions sont tombés. La poubelle n'est pas encore passée. Il retrouve le carton intact. Vous iriez fouiller, vous ?";
    const firstY = (svg: string) => {
      const ys = [...svg.matchAll(/data-news-block="1"[^>]* y="([0-9.]+)"/g)].map(
        (m) => Number(m[1]),
      );
      return Math.min(...ys);
    };
    const tl = newsShareTimeline(excerpt, body);
    const hook = newsShareSvg("Le ticket a disparu", excerpt, SHARE_STORY, {
      t: (tl.hookStart + tl.hookEnd) / 2,
      overlay: true,
      body,
    });
    const story = newsShareSvg("Le ticket a disparu", excerpt, SHARE_STORY, {
      t: (tl.storyStart + tl.bodyCStart) / 2,
      overlay: true,
      body,
    });
    assert.equal(firstY(hook), firstY(story));
  });

  it("cale la durée du Reel sur le volume de texte", async () => {
    const { newsShareTimeline } = await import("./share-render.ts");
    const short = newsShareTimeline("Un lieu, une date.", "Une phrase. Une autre. Surprise. Question ?");
    const long = newsShareTimeline(
      "Marly, Nord-Pas-de-Calais, septembre 2014. Un couple joue les mêmes numéros au Loto depuis dix ans sans jamais rien gagner.",
      "Le mari jette le ticket du mercredi sans regarder le relevé, comme chaque semaine. Le lendemain matin, les 3 millions d'euros sont tombés sur leur grille. Ils fouillent la poubelle avant le passage du camion. Le carton est encore lisible, coincé sous un sachet. Vous iriez jusqu'au bout, vous ?",
    );
    assert.ok(short.seconds >= 16);
    assert.ok(long.seconds > short.seconds);
    assert.ok(long.seconds <= 40);
    assert.ok(long.storyStart < long.hookEnd);
    assert.ok(long.ctaStart >= 0.78);
    assert.ok((1 - long.ctaStart) * long.seconds < 4.2);
    const hookSec = (long.hookEnd - long.hookStart) * long.seconds;
    const storySec = (long.storyEnd - long.storyStart) * long.seconds;
    assert.ok(storySec > hookSec * 0.8);
  });

  it("teinte le voile selon le fond du plan", async () => {
    const { newsShareSvg } = await import("./share-render.ts");
    const { SHARE_STORY } = await import("./share-card.ts");
    const gold = newsShareSvg("Titre actu assez long", "Un extrait assez long pour passer.", SHARE_STORY, {
      t: 0.2,
      overlay: true,
      mood: "tension",
      fond: "gold",
    });
    assert.match(gold, /#1a1408/);
    assert.match(gold, /#ff7a59/);
    const cold = newsShareSvg("Titre actu assez long", "Un extrait assez long pour passer.", SHARE_STORY, {
      t: 0.2,
      overlay: true,
      mood: "mystere",
      fond: "cold",
    });
    assert.match(cold, /#07141c/);
    assert.match(cold, /#c4b5fd/);
  });
});

describe("newsBodyForShare", () => {
  it("écarte le remplissage 18+ / simulateur et garde les faits tirage", async () => {
    const { newsBodyForShare, newsCopyForShare, newsDrawFacts } = await import(
      "./share-render.ts"
    );
    const fluff = [
      "Les rapports de gains France et Europe sont publiés sur la fiche du tirage. Vérifiez votre grille avec le simulateur avant de jeter le reçu.",
      "Le jackpot est reporté : la cagnotte continue de monter pour le prochain tirage. Aucune promesse de gain, le jeu reste du hasard.",
      "Site indépendant : nous ne vendons pas de tickets. 18+ · jeu responsable. Jouez sur FDJ.fr si vous souhaitez miser.",
    ];
    assert.equal(newsBodyForShare(fluff), "");
    const facts = newsDrawFacts(
      {
        date: "2026-09-08",
        numbers: [13, 17, 33, 35, 39],
        stars: [7, 12],
        jackpotEur: 98_000_000,
        hasWinner: false,
        myMillionCode: "DC 157 3553",
        prizeTiers: [
          { rank: "5+2", winners: 0, winnersEurope: 0, amountEur: 0 },
          { rank: "5+1", winners: 0, winnersEurope: 3, amountEur: 194_608.6 },
          { rank: "5", winners: 1, winnersEurope: 12, amountEur: 11_370.8 },
        ],
        source: "fdj",
        fetchedAt: "2026-09-08T21:30:00.000Z",
      },
      { date: "2026-09-11", jackpotEur: 111_000_000 },
    );
    const joined = facts.join(" ");
    assert.match(joined, /13, 17, 33, 35, 39/);
    assert.match(joined, /7 et 12/);
    assert.match(joined, /98 M€/);
    assert.match(joined, /non remporté/);
    assert.match(joined, /5\+1/);
    assert.match(joined, /194\s?608,60/);
    assert.match(joined, /aucun en France/);
    assert.match(joined, /DC 157 3553/);
    assert.match(joined, /111 M€/);
    const copy = newsCopyForShare({
      excerpt: "Revue de presse (FDJ, 8 septembre 2026).",
      body: fluff,
      extraFacts: facts,
    });
    assert.match(copy.excerpt, /13, 17, 33, 35, 39/);
    assert.match(copy.body, /5\+1/);
    assert.match(copy.body, /DC 157 3553/);
    assert.ok(!copy.body.includes("13, 17, 33, 35, 39"));
    assert.match(copy.body, /111 M€/);
    assert.ok(!/cagnotte continue|simulateur|18\+|tickets/.test(copy.excerpt + copy.body));
  });
});
