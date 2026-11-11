// @vitest-environment node
import { existsSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { locales } from "@/shared/i18n";

describe("recorded greetings", () => {
  it.each(locales)("has a voice file for %s", (locale) => {
    const file = `public/voice/greeting-${locale}.m4a`;
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(10_000);
  });
});
