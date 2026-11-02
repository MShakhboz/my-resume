export type ContactLink = {
  id: "email" | "linkedin" | "github" | "telegram";
  label: string;
  /** Text shown on the page; the PDF resume also shows URLs as text. */
  display: string;
  href: string;
};

export type Highlight = {
  /** Must appear word for word in the summary or a job bullet (see content.test.ts). */
  value: string;
  label: string;
};

export type ProfileType = {
  name: string;
  initials: string;
  headline: string;
  location: string;
  availability: string;
  summary: string;
  highlights: Highlight[];
  contacts: ContactLink[];
  /** Telegram and WhatsApp share one handle; WhatsApp has no handle URL. */
  messengerHandle: string;
  languages: string[];
};
