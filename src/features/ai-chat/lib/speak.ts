// The launcher robot says its line on hover (the first hover, then at most every 3 minutes), in
// the page's language.
// The voice is a recorded file (public/voice, made with `pnpm voice:generate`), so every visitor
// hears the same male voice; the device's own speech voices are a fallback for when the file can't
// play. When the browser blocks all sound (before the first click), the speech bubble does the job.

import type { Locale } from "@/shared/i18n";

const LANG: Record<Locale, string> = { en: "en-US", ru: "ru-RU", uz: "uz-UZ" };

/**
 * The Web Speech API has no voice gender, so a male voice is picked by name from natural-sounding
 * male system voices (macOS and iOS, Windows and Edge, Chrome), best first. Old novelty voices such
 * as macOS "Fred" or "Albert" are left out on purpose. Devices without a match use their default
 * voice for the language, at the same calm, slightly low pitch.
 */
const MALE_VOICES = [
  // English
  "daniel", "eddy", "reed", "rocko", "aaron", "alex", "rishi", "arthur", "oliver", "evan", "nathan",
  "google uk english male", "guy", "andrew", "brian", "christopher", "eric", "roger", "steffan", "ryan", "david", "mark",
  // Russian
  "yuri", "dmitry", "pavel",
  // Uzbek (Microsoft Edge)
  "sardor",
];

/**
 * Most devices have no Uzbek voice (macOS and most Windows and Android setups don't). Nearly all
 * have a Russian one, which reads Uzbek written in Cyrillic as recognisable Uzbek. The letters
 * Russian voices can't say (ҳ қ ў ғ) are swapped for their nearest Russian ones so none are skipped.
 */
const UZBEK_VIA_RUSSIAN = "Ассалому алайкум! Мен хакимда сунъий интеллект ёрдамчимдан сурашингиз мумкин.";


function pickVoice(voices: SpeechSynthesisVoice[], locale: Locale) {
  const forLanguage = voices.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(locale));
  const rank = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    const i = MALE_VOICES.findIndex((m) => new RegExp(`\\b${m}\\b`).test(name));
    return i === -1 ? Infinity : i;
  };
  return [...forLanguage].sort((a, b) => rank(a) - rank(b))[0];
}

/**
 * After greeting, the robot stays quiet for 3 minutes on that page: enough that brushing past it
 * while reading doesn't repeat it. Every page load starts fresh, so opening or reloading the site
 * always greets on the first hover.
 */
export const GREETING_COOLDOWN_MS = 3 * 60_000;
/** How long the device voice gets to start before it counts as blocked (some browsers stay silent). */
export const SPEECH_START_TIMEOUT_MS = 1_500;

/** Whether the robot is talking right now, so its icons can move their mouth and zoom in. */
let speakingNow = false;
const speakingListeners = new Set<() => void>();
const setSpeaking = (value: boolean) => {
  if (speakingNow === value) return;
  speakingNow = value;
  speakingListeners.forEach((listener) => listener());
};

/** For `useSyncExternalStore`: true while a greeting is playing. */
export const speaking = {
  subscribe(listener: () => void) {
    speakingListeners.add(listener);
    return () => {
      speakingListeners.delete(listener);
    };
  },
  get: () => speakingNow,
};

/** When a greeting was last actually heard: the pause counts from real playback, not attempts. */
let lastHeardAt = -Infinity;
/** A greeting is starting (file or device voice); further calls wait for the outcome. */
let attempting = false;
let current: HTMLAudioElement | null = null;

/**
 * Plays the recorded greeting (on hover, and when the chat opens), at most once per
 * GREETING_COOLDOWN_MS after it was actually heard, and never over itself. Browsers block all
 * sound until the visitor clicks, taps or presses a key, so a hover on a fresh visit is often
 * silent: the file is blocked, the device voice is tried, and if that is blocked too nothing
 * counts as heard, so opening the chat (a click, which unlocks sound) greets right away.
 */
export function greet(text: string, locale: Locale) {
  if (typeof Audio === "undefined" || attempting) return;
  if (Date.now() - lastHeardAt < GREETING_COOLDOWN_MS || (current && !current.paused && !current.ended)) return;
  attempting = true;
  const audio = new Audio(`/voice/greeting-${locale}.m4a`);
  current = audio;
  audio.addEventListener?.("playing", () => setSpeaking(true));
  for (const stop of ["ended", "pause", "error"]) audio.addEventListener?.(stop, () => setSpeaking(false));
  const playing = audio.play();
  if (!playing) {
    attempting = false; // environments without media playback
    return;
  }
  playing.then(
    () => {
      lastHeardAt = Date.now();
      attempting = false;
    },
    () => {
      current = null;
      const tried = speak(text, locale, {
        onStart: () => {
          lastHeardAt = Date.now();
        },
        onDone: () => {
          attempting = false;
        },
      });
      if (!tried) attempting = false;
    }
  );
}

type SpeechCallbacks = {
  /** The voice started: the greeting was heard. */
  onStart?: () => void;
  /** Finished, failed, was blocked, or never started within SPEECH_START_TIMEOUT_MS. */
  onDone?: () => void;
};

/** Says `text` with the device's speech voices. Returns whether it tried. */
export function speak(text: string, locale: Locale, { onStart, onDone }: SpeechCallbacks = {}): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  let voice = pickVoice(voices, locale);
  let lang = LANG[locale];
  if (!voice && locale === "uz") {
    voice = pickVoice(voices, "ru");
    lang = LANG.ru;
    text = UZBEK_VIA_RUSSIAN;
  }
  // Voices load late in some browsers: then the browser picks one for the language itself.
  if (!voice && voices.length > 0) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  if (voice) utterance.voice = voice;
  utterance.rate = 0.95;
  utterance.pitch = 0.85;

  let started = false;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timeout);
    setSpeaking(false);
    onDone?.();
  };
  // Some browsers neither start nor report an error when speech is blocked.
  const timeout = setTimeout(() => {
    if (!started) {
      synth.cancel();
      finish();
    }
  }, SPEECH_START_TIMEOUT_MS);
  utterance.onstart = () => {
    started = true;
    setSpeaking(true);
    onStart?.();
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  synth.cancel();
  synth.speak(utterance);
  return true;
}

/** For tests. */
export function resetSpeech() {
  setSpeaking(false);
  lastHeardAt = -Infinity;
  attempting = false;
  current = null;
}
