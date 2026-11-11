import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { greet, GREETING_COOLDOWN_MS, resetSpeech, speak, speaking, SPEECH_START_TIMEOUT_MS } from "./speak";

class FakeUtterance {
  lang = "";
  voice: unknown = null;
  rate = 1;
  pitch = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
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

let synthSpeak: ReturnType<typeof vi.fn>;
const stubSpeech = (list: unknown[] = voices) => {
  synthSpeak = vi.fn();
  vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
  vi.stubGlobal("speechSynthesis", { getVoices: () => list, speak: synthSpeak, cancel: vi.fn() });
};
const spoken = () => synthSpeak.mock.calls.map((c) => c[0] as FakeUtterance);

describe("speak (the device's speech voices)", () => {
  beforeEach(() => stubSpeech());
  afterEach(() => vi.unstubAllGlobals());

  it("prefers a natural male voice for the page's language, at a calm pitch", () => {
    expect(speak("Hello!", "en")).toBe(true);
    expect(spoken()[0].voice).toEqual(voices[2]); // Daniel, not the robotic novelty voice Fred
    expect(spoken()[0].pitch).toBeLessThan(1);

    speak("Здравствуйте!", "ru");
    expect(spoken()[1].voice).toEqual(voices[5]); // Yuri
    expect(spoken()[1].lang).toBe("ru-RU");
  });

  it("falls back to the language's default voice when no male voice exists", () => {
    stubSpeech([{ lang: "ru-RU", name: "Milena" }]);
    speak("Здравствуйте!", "ru");
    expect(spoken()[0].voice).toEqual({ lang: "ru-RU", name: "Milena" });
  });

  it("says the Uzbek greeting in Cyrillic with a Russian voice when there is no Uzbek voice", () => {
    expect(speak("Assalomu alaykum!", "uz")).toBe(true);
    expect(spoken()[0].lang).toBe("ru-RU");
    expect(spoken()[0].voice).toEqual(voices[5]);
    expect(spoken()[0].text).toMatch(/^Ассалому алайкум!/);
    expect(spoken()[0].text).not.toMatch(/[ҳқўғ]/);
  });

  it("uses an Uzbek voice when the device has one", () => {
    const sardor = { lang: "uz-UZ", name: "Microsoft Sardor Online" };
    stubSpeech([...voices, sardor]);
    speak("Assalomu alaykum!", "uz");
    expect(spoken()[0].voice).toEqual(sardor);
    expect(spoken()[0].text).toBe("Assalomu alaykum!");
  });

  it("stays silent when there is no voice for the language at all, or no speech support", () => {
    stubSpeech([{ lang: "en-US", name: "Daniel" }]);
    expect(speak("Assalomu alaykum!", "uz")).toBe(false);
    vi.unstubAllGlobals();
    expect(speak("Hello!", "en")).toBe(false); // jsdom has no speechSynthesis
  });
});

describe("greet (the recorded male voice)", () => {
  const played: string[] = [];
  let play: ReturnType<typeof vi.fn>;
  let now = 0;
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

  beforeEach(() => {
    resetSpeech();
    stubSpeech();
    played.length = 0;
    now = 1_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
    play = vi.fn(() => Promise.resolve());
    vi.stubGlobal(
      "Audio",
      class {
        paused = false;
        ended = true; // finishes at once, so only the pause limits repeats
        constructor(public src: string) {
          played.push(src);
        }
        play = play;
      }
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("plays the file for the page's language", () => {
    greet("Здравствуйте!", "ru");
    expect(played).toEqual(["/voice/greeting-ru.m4a"]);
    expect(synthSpeak).not.toHaveBeenCalled();
  });

  it("waits 3 minutes after a greeting was heard", async () => {
    expect(GREETING_COOLDOWN_MS).toBe(180_000);
    greet("Hello!", "en");
    await settle();
    now += 60_000;
    greet("Hello!", "en");
    expect(played).toHaveLength(1);
    now += GREETING_COOLDOWN_MS;
    greet("Hello!", "en");
    expect(played).toHaveLength(2);
  });

  it("greets again on the next page load, even within the pause", async () => {
    greet("Hello!", "en");
    await settle();
    resetSpeech(); // a reload or a new page: module state starts fresh
    greet("Hello!", "en");
    expect(played).toHaveLength(2);
  });

  it("never talks over itself", async () => {
    vi.stubGlobal(
      "Audio",
      class {
        paused = false;
        ended = false; // still playing
        constructor(public src: string) {
          played.push(src);
        }
        play = play;
      }
    );
    greet("Hello!", "en");
    greet("Hello!", "en");
    expect(played).toHaveLength(1);
  });

  it("says it with the device voice when the file is blocked, and pauses once that is heard", async () => {
    play.mockReturnValueOnce(Promise.reject(new DOMException("blocked", "NotAllowedError")));
    greet("Hello!", "en");
    await vi.waitFor(() => expect(synthSpeak).toHaveBeenCalledTimes(1));
    expect(spoken()[0].voice).toEqual(voices[2]); // the male device voice
    spoken()[0].onstart?.();
    spoken()[0].onend?.();

    now += 60_000;
    greet("Hello!", "en");
    expect(played).toHaveLength(1);
  });

  it("counts nothing as heard when everything is blocked, so opening the chat greets", async () => {
    play.mockReturnValueOnce(Promise.reject(new DOMException("blocked", "NotAllowedError")));
    greet("Hello!", "en"); // the hover, before any click
    await vi.waitFor(() => expect(synthSpeak).toHaveBeenCalledTimes(1));
    spoken()[0].onerror?.({ error: "not-allowed" });

    greet("Hello!", "en"); // the click that opens the chat
    expect(played).toHaveLength(2);
  });

  it("treats a device voice that never starts as blocked", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    play.mockReturnValueOnce(Promise.reject(new DOMException("blocked", "NotAllowedError")));
    greet("Hello!", "en");
    await vi.waitFor(() => expect(synthSpeak).toHaveBeenCalledTimes(1));
    vi.advanceTimersByTime(SPEECH_START_TIMEOUT_MS);
    greet("Hello!", "en");
    expect(played).toHaveLength(2);
  });
});

describe("speaking (drives the talking mouth and the header zoom)", () => {
  beforeEach(() => resetSpeech());
  afterEach(() => vi.unstubAllGlobals());

  it("is true while the recording plays", () => {
    const handlers: Record<string, () => void> = {};
    vi.stubGlobal(
      "Audio",
      class {
        paused = false;
        ended = false;
        addEventListener(type: string, handler: () => void) {
          handlers[type] = handler;
        }
        play = () => Promise.resolve();
      }
    );
    const changes = vi.fn();
    const unsubscribe = speaking.subscribe(changes);
    greet("Hello!", "en");
    expect(speaking.get()).toBe(false);
    handlers.playing();
    expect(speaking.get()).toBe(true);
    handlers.ended();
    expect(speaking.get()).toBe(false);
    expect(changes).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it("is true while the device voice speaks", () => {
    stubSpeech();
    speak("Hello!", "en");
    spoken()[0].onstart?.();
    expect(speaking.get()).toBe(true);
    spoken()[0].onend?.();
    expect(speaking.get()).toBe(false);
  });
});

