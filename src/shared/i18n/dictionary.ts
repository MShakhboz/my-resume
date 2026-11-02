import type { SectionId } from "@/shared/config/site";
import type { Locale } from "./config";

const ruPlural = new Intl.PluralRules("ru");
const projectWords: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: "проект",
  few: "проекта",
  many: "проектов",
};

/** Interface text. Resume content lives in the entities' model files. */
export const dictionaries = {
  en: {
    languageName: "English",
    skipLink: "Skip to content",
    sectionsNav: "Sections",
    languageSwitch: "Language",
    nav: {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      contact: "Contact",
    } satisfies Record<SectionId, string>,
    theme: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
    contactLinks: "Contact links",
    downloadResume: "Download resume",
    pdf: { a4: "PDF (A4)", letter: "PDF (US Letter)", ru: "PDF (Russian)" },
    newTab: "(opens in a new tab)",
    /** Before one live link / several. */
    live: { one: "Live:", many: "Live:" },
    techStack: (name: string) => `${name} tech stack`,
    moreProjects: (count: number) => `View ${count} more projects`,
    fewerProjects: "Show fewer projects",
    languages: "Languages",
    contactLead: "Open to senior React and Next.js roles, remote.",
    basedIn: (location: string) => `Based in ${location}.`,
    emailMe: "Email me",
    messengers: "Telegram / WhatsApp",
    footer:
      "Built with Next.js, TypeScript and Tailwind CSS. Tested with Vitest, React Testing Library and " +
      "Playwright, with an axe accessibility scan in both themes, on GitHub Actions CI.",
  },
  ru: {
    languageName: "Русский",
    skipLink: "Перейти к содержимому",
    sectionsNav: "Разделы",
    languageSwitch: "Язык",
    nav: {
      about: "О себе",
      experience: "Опыт",
      projects: "Проекты",
      skills: "Навыки",
      education: "Образование",
      contact: "Контакты",
    },
    theme: { toLight: "Включить светлую тему", toDark: "Включить тёмную тему" },
    contactLinks: "Контакты",
    downloadResume: "Скачать резюме",
    pdf: { a4: "PDF (A4, англ.)", letter: "PDF (US Letter, англ.)", ru: "PDF (на русском)" },
    newTab: "(откроется в новой вкладке)",
    live: { one: "Сайт:", many: "Сайты:" },
    techStack: (name: string) => `Стек: ${name}`,
    moreProjects: (count: number) => `Ещё ${count} ${projectWords[ruPlural.select(count)] ?? "проекта"}`,
    fewerProjects: "Свернуть проекты",
    languages: "Языки",
    contactLead: "Открыт к senior-позициям по React и Next.js, удалённо.",
    basedIn: (location: string) => `Местоположение: ${location}.`,
    emailMe: "Написать на почту",
    messengers: "Telegram / WhatsApp",
    footer:
      "Сделано на Next.js, TypeScript и Tailwind CSS. Тесты: Vitest, React Testing Library и Playwright, " +
      "включая проверку доступности axe в обеих темах, в CI на GitHub Actions.",
  },
} satisfies Record<Locale, unknown>;

export type Dictionary = (typeof dictionaries)["en"];

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
