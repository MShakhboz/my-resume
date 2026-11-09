// @vitest-environment node
import { describe, expect, it } from "vitest";
import committed from "../applications.enc.json";
import { decryptJson, encryptJson } from "./crypto";

describe("job log encryption", () => {
  const value = [{ company: "Acme", contact: "hr@acme.test" }];

  it("decrypts with the right password", async () => {
    const payload = await encryptJson(value, "right horse");
    expect(await decryptJson(payload, "right horse")).toEqual(value);
  });

  it("rejects a wrong password", async () => {
    const payload = await encryptJson(value, "right horse");
    await expect(decryptJson(payload, "wrong horse")).rejects.toThrow();
  });

  it("leaves nothing readable in the payload", async () => {
    const payload = await encryptJson(value, "right horse");
    expect(JSON.stringify(payload)).not.toMatch(/Acme|acme\.test/);
  });

  it("ships only ciphertext for the real log", () => {
    expect(Object.keys(committed).sort()).toEqual(["data", "iterations", "iv", "salt", "v"]);
    expect(committed.data).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(committed.iterations).toBeGreaterThanOrEqual(600_000);
  });
});
