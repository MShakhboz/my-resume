import { contacts } from "./contacts";
import { ProfileType } from "./types";

const NB = " "; // keeps "898 868" on one line

// Website only: translated from ../build_resume.py (there is no Uzbek PDF). Technology names stay in English.
export const profile: ProfileType = {
  name: "Shaxboz Mirzomurotov",
  initials: "SM",
  headline: "Senior Frontend dasturchi | JavaScript, TypeScript, React, Next.js",
  location: "Toshkent, Oʻzbekiston (UTC+5)",
  availability: "Masofaviy ishga ochiq",
  summary:
    "React va Next.js’da TypeScript bilan 6+ yillik tajribaga ega senior frontend dasturchi: AQSh, " +
    "Buyuk Britaniya, Rossiya va Markaziy Osiyodagi fintech, avtopark boshqaruvi va agentlik mijozlari " +
    "uchun. Taksi avtoparki CRM tizimining yagona frontend dasturchisi: brauzer uslubidagi koʻp tabli ish " +
    `maydoni va 900${NB}000 ga yaqin yozuvli virtualizatsiyalangan jadvallar. 3 nafargacha frontend ` +
    "dasturchidan iborat jamoalarga rahbarlik qilgan.",
  highlights: [
    { value: "20+", label: "6 ta kompaniyadagi loyihalar", source: "project-count" },
    { value: "6+", label: "yillik React va Next.js tajribasi" },
    { value: "95–100%", label: "foydalanish qulayligi bahosi, avval 70–\u206080%" },
  ],
  contacts,
  messengerHandle: "@nornof",
  languages: [
    "Oʻzbek tili (ona tili)",
    "Ingliz tili (yuqori daraja)",
    "Rus tili (yuqori daraja)",
    "Nemis tili (boshlangʻich)",
  ],
};
