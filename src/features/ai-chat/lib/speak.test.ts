import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetSpeech, speakOnce } from "./speak";

class FakeUtterance {
  lang = "";
  voice: unknown = null;
  rate = 1;
  pitch = 1;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

const voices = [
  { lang: "en-US", name: "English" },
  { lang: "ru-RU", name: "Russian" },
];

describe("speakOnce", () => {
  let speak: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    resetSpeech();
    speak = vi.fn();
    vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
    vi.stubGlobal("speechSynthesis", { getVoices: () => voices, speak, cancel: vi.fn() });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("speaks once per page, with a voice for the page's language", () => {
    expect(speakOnce("Спроси ИИ", "ru")).toBe(true);
    expect(speakOnce("Спроси ИИ", "ru")).toBe(false);
    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toBe("Спроси ИИ");
    expect(utterance.lang).toBe("ru-RU");
    expect(utterance.voice).toEqual(voices[1]);
  });

  it("tries again on a later hover when the browser blocked it before the first click", () => {
    speakOnce("Ask AI about me", "en");
    (speak.mock.calls[0][0] as FakeUtterance).onerror?.({ error: "not-allowed" });
    expect(speakOnce("Ask AI about me", "en")).toBe(true);
    expect(speak).toHaveBeenCalledTimes(2);
  });

  it("stays silent when there is no voice for the language", () => {
    expect(speakOnce("Men haqimda soʻrang", "uz")).toBe(false);
    expect(speak).not.toHaveBeenCalled();
  });

  it("does nothing where speech isn't supported", () => {
    vi.unstubAllGlobals();
    // jsdom has no speechSynthesis
    expect(speakOnce("Ask AI about me", "en")).toBe(false);
  });
});
