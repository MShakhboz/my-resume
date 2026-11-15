import { ContactLink } from "./types";

// The same in every language.
export const contacts: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    display: "mirzomurotovshaxboz@gmail.com",
    href: "mailto:mirzomurotovshaxboz@gmail.com",
  },
  // A second address, listed in the Contact section and the PDFs; Gmail stays the main one.
  {
    id: "email-yandex",
    label: "Email (Yandex)",
    display: "mir.shahboz@yandex.com",
    href: "mailto:mir.shahboz@yandex.com",
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
];
