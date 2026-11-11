// The launcher robot says its line once per page visit, in the page's language, when the browser
// allows it. Browsers block speech until the visitor has clicked or tapped the page, and many
// devices have no Uzbek voice; in both cases nothing is said and the speech bubble does the job.

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

let spoken = false;

function pickVoice(voices: SpeechSynthesisVoice[], locale: Locale) {
  const forLanguage = voices.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(locale));
  const rank = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    const i = MALE_VOICES.findIndex((m) => new RegExp(`\\b${m}\\b`).test(name));
    return i === -1 ? Infinity : i;
  };
  return [...forLanguage].sort((a, b) => rank(a) - rank(b))[0];
}

/** Speaks `text` once per page load. Returns whether it tried. */
export function speakOnce(text: string, locale: Locale): boolean {
  if (spoken || typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const voice = pickVoice(voices, locale);
  // Voices load late in some browsers; English and Russian then fall back to the browser's choice
  // for the language, but Uzbek never gets read by some other language's voice.
  if (!voice && (voices.length > 0 || locale === "uz")) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG[locale];
  if (voice) utterance.voice = voice;
  utterance.rate = 0.95;
  utterance.pitch = 0.85;
  // Blocked before the first click: let a later hover try again.
  utterance.onerror = (event) => {
    if (event.error === "not-allowed") spoken = false;
  };
  spoken = true;
  synth.cancel();
  synth.speak(utterance);
  return true;
}

/** For tests. */
export function resetSpeech() {
  spoken = false;
}
