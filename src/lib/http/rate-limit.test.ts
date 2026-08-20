import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clientIp } from "./rate-limit.ts";

describe("clientIp", () => {
  it("préfère X-Real-IP (hop Traefik)", () => {
    const req = new Request("https://example.test/", {
      headers: {
        "x-forwarded-for": "1.2.3.4, 10.0.0.1",
        "x-real-ip": "10.0.0.9",
      },
    });
    assert.equal(clientIp(req), "10.0.0.9");
  });

  it("prend le dernier hop XFF si pas de X-Real-IP", () => {
    const req = new Request("https://example.test/", {
      headers: { "x-forwarded-for": "8.8.8.8, 10.0.0.1" },
    });
    assert.equal(clientIp(req), "10.0.0.1");
  });
});
