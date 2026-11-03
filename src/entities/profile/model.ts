import { contacts } from "./contacts";
import { ProfileType } from "./types";

// Source of truth: ../build_resume.py. Keep wording in sync with the PDF.
export const profile: ProfileType = {
  name: "Shaxboz Mirzomurotov",
  initials: "SM",
  headline: "Senior Frontend Developer | React, Next.js, TypeScript",
  location: "Tashkent, Uzbekistan (UTC+5)",
  availability: "Open to remote",
  summary:
    "Senior frontend developer with 6+ years building React and Next.js apps in TypeScript for fintech, " +
    "fleet-management and agency clients in the USA, UK, Russia and Central Asia. Sole frontend developer on a " +
    "taxi-fleet CRM with a browser-style multi-tab workspace and virtualized tables for 37,000+ drivers. " +
    "Led teams of up to 3 frontend developers.",
  // Website only: headline numbers pulled from the summary and job bullets.
  highlights: [
    { value: "20+", label: "projects across 6 companies", source: "project-count" },
    { value: "6+", label: "years building React and Next.js apps" },
    { value: "95–100%", label: "accessibility scores, up from 70–\u206080%" },
  ],
  contacts,
  messengerHandle: "@nornof",
  languages: [
    "Uzbek (native)",
    "English (advanced)",
    "Russian (advanced)",
    "German (beginner)",
  ],
};
