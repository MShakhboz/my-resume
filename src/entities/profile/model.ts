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
    { value: "6+", label: "years building React and Next.js apps" },
    { value: "12", label: "client websites delivered for a US agency" },
    { value: "37,822", label: "drivers managed in the TradeTaxi fleet CRM" },
    { value: "95–100%", label: "accessibility scores, up from 70–80%" },
  ],
  contacts: [
    {
      id: "email",
      label: "Email",
      display: "mirzomurotovshaxboz@gmail.com",
      href: "mailto:mirzomurotovshaxboz@gmail.com",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      display: "linkedin.com/in/shaxboz-mirzomurotov",
      href: "https://linkedin.com/in/shaxboz-mirzomurotov",
    },
    {
      id: "github",
      label: "GitHub",
      display: "github.com/MShakhboz",
      href: "https://github.com/MShakhboz",
    },
    {
      id: "telegram",
      label: "Telegram",
      display: "@nornof",
      href: "https://t.me/nornof",
    },
  ],
  messengerHandle: "@nornof",
  languages: [
    "Uzbek (native)",
    "English (advanced)",
    "Russian (advanced)",
    "German (beginner)",
  ],
};
