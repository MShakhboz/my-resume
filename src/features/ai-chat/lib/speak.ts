// The launcher robot says its line once per page visit, in the page's language, when the browser
// allows it. Browsers block speech until the visitor has clicked or tapped the page, and many
// devices have no Uzbek voice; in both cases nothing is said and the speech bubble does the job.

import type { Locale } from "@/shared/i18n";

const LANG: Record<Locale, string> = { en: "en-US", ru: "ru-RU", uz: "uz-UZ" };

let spoken = false;

/** Speaks `text` once per page load. Returns whether it tried. */
export function speakOnce(text: string, locale: Locale): boolean {
  if (spoken || typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  const lang = LANG[locale];
  const voices = synth.getVoices();
  const voice = voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(locale));
  // Voices load late in some browsers; English and Russian then fall back to the browser's choice
  // for the language, but Uzbek never gets read by some other language's voice.
  if (!voice && (voices.length > 0 || locale === "uz")) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  if (voice) utterance.voice = voice;
  utterance.rate = 1.05;
  utterance.pitch = 1.25;
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
