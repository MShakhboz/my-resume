import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { greetOnce, resetSpeech, speakOnce } from "./speak";

class FakeUtterance {
  lang = "";
  voice: unknown = null;
  rate = 1;
  pitch = 1;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

const voices = [
  { lang: "en-US", name: "Fred" },
  { lang: "en-US", name: "Samantha" },
  { lang: "en-GB", name: "Daniel" },
  { lang: "en-US", name: "Google US English" },
  { lang: "ru-RU", name: "Milena" },
  { lang: "ru-RU", name: "Yuri" },
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
    expect(utterance.voice).toEqual(voices[5]); // Yuri, a male Russian voice
  });

  it("prefers a male voice and a calm, slightly low pitch", () => {
    speakOnce("Hello!", "en");
    const utterance = speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.voice).toEqual(voices[2]); // Daniel, not the robotic novelty voice Fred
    expect(utterance.pitch).toBeLessThan(1);
  });

  it("falls back to the language's default voice when no male voice exists", () => {
    vi.stubGlobal("speechSynthesis", { getVoices: () => [{ lang: "ru-RU", name: "Milena" }], speak, cancel: vi.fn() });
    speakOnce("Здравствуйте!", "ru");
    expect((speak.mock.calls[0][0] as FakeUtterance).voice).toEqual({ lang: "ru-RU", name: "Milena" });
  });

  it("tries again on a later hover when the browser blocked it before the first click", () => {
    speakOnce("Ask AI about me", "en");
    (speak.mock.calls[0][0] as FakeUtterance).onerror?.({ error: "not-allowed" });
    expect(speakOnce("Ask AI about me", "en")).toBe(true);
    expect(speak).toHaveBeenCalledTimes(2);
  });

  it("says the Uzbek greeting in Cyrillic with a Russian voice when there is no Uzbek voice", () => {
    expect(speakOnce("Assalomu alaykum!", "uz")).toBe(true);
    const utterance = speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.lang).toBe("ru-RU");
    expect(utterance.voice).toEqual(voices[5]); // Yuri
    expect(utterance.text).toMatch(/^Ассалому алайкум!/);
    expect(utterance.text).not.toMatch(/[ҳқўғ]/);
  });

  it("uses an Uzbek voice when the device has one", () => {
    const sardor = { lang: "uz-UZ", name: "Microsoft Sardor Online" };
    vi.stubGlobal("speechSynthesis", { getVoices: () => [...voices, sardor], speak, cancel: vi.fn() });
    speakOnce("Assalomu alaykum!", "uz");
    const utterance = speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.voice).toEqual(sardor);
    expect(utterance.text).toBe("Assalomu alaykum!");
  });

  it("stays silent when there is no voice for the language at all", () => {
    vi.stubGlobal("speechSynthesis", { getVoices: () => [{ lang: "en-US", name: "Daniel" }], speak, cancel: vi.fn() });
    expect(speakOnce("Assalomu alaykum!", "uz")).toBe(false);
    expect(speak).not.toHaveBeenCalled();
  });

  it("does nothing where speech isn't supported", () => {
    vi.unstubAllGlobals();
    // jsdom has no speechSynthesis
    expect(speakOnce("Ask AI about me", "en")).toBe(false);
  });
});

describe("greetOnce", () => {
  const played: string[] = [];
  let play: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    resetSpeech();
    played.length = 0;
    play = vi.fn(() => Promise.resolve());
    vi.stubGlobal(
      "Audio",
      class {
        constructor(public src: string) {
          played.push(src);
        }
        play = play;
      }
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("plays the recorded male-voice greeting for the page's language, once", () => {
    greetOnce("Здравствуйте!", "ru");
    greetOnce("Здравствуйте!", "ru");
    expect(played).toEqual(["/voice/greeting-ru.m4a"]);
  });

  it("tries again on a later hover when the browser blocks sound before the first click", async () => {
    play.mockReturnValueOnce(Promise.reject(new DOMException("blocked", "NotAllowedError")));
    greetOnce("Hello!", "en");
    await Promise.resolve();
    await Promise.resolve();
    greetOnce("Hello!", "en");
    expect(played).toEqual(["/voice/greeting-en.m4a", "/voice/greeting-en.m4a"]);
  });

  it("falls back to the device voice when the file can't play", async () => {
    const speak = vi.fn();
    vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
    vi.stubGlobal("speechSynthesis", { getVoices: () => voices, speak, cancel: vi.fn() });
    play.mockReturnValueOnce(Promise.reject(new DOMException("missing", "NotSupportedError")));
    greetOnce("Hello!", "en");
    await vi.waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    expect((speak.mock.calls[0][0] as FakeUtterance).text).toBe("Hello!");
  });
});
