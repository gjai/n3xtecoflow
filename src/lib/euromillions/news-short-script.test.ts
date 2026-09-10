import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  composeNewsShortScript,
  fallbackNewsShortScript,
  NEWS_SHORT_SYSTEM_PROMPT,
  parseNewsShortAiJson,
} from "./news-short-script.ts";

describe("parseNewsShortAiJson", () => {
  it("accepte un scénario libre de l’IA", () => {
    const ok = parseNewsShortAiJson(
      JSON.stringify({
        game: "euromillions",
        fact: "Un gagnant EuroMillions a acheté 200 montres après son gain, ticket dans la chaussette deux jours.",
        title: "Il s’offre 200 montres d’un coup",
        accroche:
          "À Glasgow, un millionnaire EuroMillions vide la bijouterie. Deux cents montres, une après-midi.",
        corps: [
          "200 montres en une après-midi, dit la presse locale.",
          "Le ticket, lui, a passé deux jours dans sa chaussette.",
          "Il a payé cash, sans négocier.",
          "La boutique n’avait plus de vitrine.",
        ],
        chute: "Vous auriez tout misé sur les montres ?",
        voix: true,
        voixOff:
          "Deux cents montres. Une après-midi. Un gagnant EuroMillions à Glasgow vide la bijouterie et paie cash. Le ticket, lui, a passé deux jours dans une chaussette. L’histoire est absurde, et elle est vraie. Vous auriez tout misé sur les montres ?",
        musique: "ironie",
        sfx: ["whoosh", "sting"],
        visuels: [
          {
            at: "accroche",
            plan: "vitrine bijouterie",
            fond: "gold",
            imagePrompt: "luxury watch shop window glasgow night",
          },
          { at: "corps", plan: "ticket dans une chaussette", fond: "warm" },
          { at: "chute", plan: "close-up montres", fond: "navy" },
        ],
      }),
    );
    assert.ok(ok);
    assert.equal(ok?.source, "ai");
    assert.equal(ok?.voix, true);
    assert.equal(ok?.music, "ironie");
    assert.equal(ok?.visuels?.[0]?.fond, "gold");
    assert.match(ok?.visuels?.[0]?.imagePrompt || "", /watch shop/i);
  });

  it("refuse un scénario trop court, et retire un CTA abonnement sans jeter le script", () => {
    assert.equal(
      parseNewsShortAiJson(
        JSON.stringify({
          game: "loto",
          fact: "x",
          title: "Trop court",
          accroche: "Hey.",
          corps: ["Non."],
        }),
      ),
      null,
    );
    const kept = parseNewsShortAiJson(
      JSON.stringify({
        game: "loto",
        fact: "Un joueur jette son ticket gagnant de 12 millions par erreur.",
        title: "Le ticket à 12 millions à la poubelle",
        accroche:
          "Imaginez gagner 12 millions. Puis jeter le ticket avec les ordures ménagères.",
        corps: [
          "Au Royaume-Uni, l’enquête a été ouverte.",
          "Le gain n’a pas été réclamé à temps.",
          "Le jackpot est resté sans maître.",
          "La loterie a cherché le joueur.",
        ],
        chute: "Abonne-toi pour la suite.",
      }),
    );
    assert.ok(kept);
    assert.ok(!/abonne[- ]toi/i.test(`${kept?.excerpt} ${kept?.body}`));
  });

  it("refuse de recaser le fact de la veille", () => {
    const json = JSON.stringify({
      game: "loto",
      fact: "Ticket Loto gagnant d'environ 13 millions jeté par erreur, enquête ouverte, gain non réclamé.",
      title: "Le ticket à 13 millions à la poubelle",
      accroche:
        "Un ticket à 13 millions d'euros. Validé. Puis jeté avec les ordures.",
      corps: [
        "L'opérateur a ouvert une recherche.",
        "Personne n'est venu réclamer le jackpot.",
        "La fortune est restée sans maître.",
        "Le délai légal a expiré.",
      ],
      chute: "Vous vérifieriez vos poubelles ?",
    });
    assert.ok(parseNewsShortAiJson(json));
    assert.equal(
      parseNewsShortAiJson(json, {
        today: "2026-09-10",
        avoidFacts: [
          "Ticket Loto gagnant d'environ 13 millions jeté par erreur, enquête ouverte, gain non réclamé.",
        ],
      }),
      null,
    );
  });
});

describe("fallbackNewsShortScript", () => {
  it("fournit une anecdote autonome, pas un récap de tirage", () => {
    const script = fallbackNewsShortScript({
      today: "2026-09-10",
      avoidFacts: [],
    });
    assert.equal(script.source, "fallback");
    assert.ok(script.title.length > 8);
    assert.ok(!/13, 17, 33/.test(script.body));
  });
});

describe("composeNewsShortScript", () => {
  it("skipAi renvoie le fallback", async () => {
    const script = await composeNewsShortScript({ skipAi: true });
    assert.equal(script.source, "fallback");
    assert.ok(script.title.length > 8);
  });
});

describe("prompt Short", () => {
  it("laisse l’IA fournir anecdote et scénario ; l’abonnement est ajouté à l’écran", () => {
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /system_role/);
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /imagePrompt/);
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /voix/);
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /faits_a_eviter/);
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /abonnement/);
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /whoosh/);
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /suspense/);
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /SURPRISE/);
    assert.match(NEWS_SHORT_SYSTEM_PROMPT, /SPOILENT PAS/);
    assert.ok(!/anecdotes_source/.test(NEWS_SHORT_SYSTEM_PROMPT));
  });
});
