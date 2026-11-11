import { describe, expect, it } from "vitest";
import { createLinkifier } from "./linkify";

const linkify = createLinkifier([
  { text: "me@example.com", href: "mailto:me@example.com" },
  { text: "@nornof", href: "https://t.me/nornof" },
  { text: "t.me/nornof", href: "https://t.me/nornof" },
  { text: "hibro.am", href: "https://hibro.am" },
  { text: "admin.hibro.am", href: "https://admin.hibro.am" },
]);

const links = (text: string) => linkify(text).filter((s) => s.href).map((s) => [s.text, s.href]);

describe("linkify", () => {
  it("links the owner's email, Telegram and sites, keeping the rest of the text", () => {
    const text = "Write to me@example.com or Telegram @nornof. See hibro.am.";
    expect(linkify(text).map((s) => s.text).join("")).toBe(text);
    expect(links(text)).toEqual([
      ["me@example.com", "mailto:me@example.com"],
      ["@nornof", "https://t.me/nornof"],
      ["hibro.am", "https://hibro.am"],
    ]);
  });

  it("prefers the longer site and accepts a written-out https:// prefix", () => {
    expect(links("the admin panel (admin.hibro.am)")).toEqual([["admin.hibro.am", "https://admin.hibro.am"]]);
    expect(links("Telegram https://t.me/nornof")).toEqual([["https://t.me/nornof", "https://t.me/nornof"]]);
  });

  it("never links anything else, even when it contains a known name", () => {
    expect(links("Log in at evil-hibro.am or hibro.am.evil.com or x@nornof.com")).toEqual([]);
    expect(links("Visit https://phishing.example/login")).toEqual([]);
  });
});
