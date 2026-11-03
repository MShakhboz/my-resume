import type { SectionId } from "@/shared/config/site";
import type { Locale } from "./config";

const ruPlural = new Intl.PluralRules("ru");
const projectWords: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: "проект",
  few: "проекта",
  many: "проектов",
};
const ruProjects = (count: number) => `${count} ${projectWords[ruPlural.select(count)] ?? "проекта"}`;

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
    archive: {
      title: "All projects",
      intro: (count: number, companies: number) =>
        `Every project behind the resume, newest first: ${count} projects across ${companies} companies. ` +
        "Live sites are linked; some older ones are offline or were never public.",
      back: "Back to resume",
      caption: "All projects, newest first",
      columns: { year: "Year", project: "Project", madeAt: "Made at", builtWith: "Built with", link: "Link" },
      status: { offline: "Offline", internal: "Internal" },
      viewAll: (count: number) => `View all ${count} projects`,
    },
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
    moreProjects: (count: number) => `Ещё ${ruProjects(count)}`,
    fewerProjects: "Свернуть проекты",
    languages: "Языки",
    contactLead: "Открыт к senior-позициям по React и Next.js, удалённо.",
    basedIn: (location: string) => `Местоположение: ${location}.`,
    emailMe: "Написать на почту",
    messengers: "Telegram / WhatsApp",
    footer:
      "Сделано на Next.js, TypeScript и Tailwind CSS. Тесты: Vitest, React Testing Library и Playwright, " +
      "включая проверку доступности axe в обеих темах, в CI на GitHub Actions.",
    archive: {
      title: "Все проекты",
      intro: (count: number, companies: number) =>
        `Все проекты из резюме, сначала новые: ${ruProjects(count)} в ${companies} компаниях. ` +
        "Работающие сайты со ссылками; часть старых уже не работает или никогда не была публичной.",
      back: "Назад к резюме",
      caption: "Все проекты, сначала новые",
      columns: { year: "Год", project: "Проект", madeAt: "Компания", builtWith: "Стек", link: "Ссылка" },
      status: { offline: "Не работает", internal: "Внутренний" },
      viewAll: (count: number) => `Все ${ruProjects(count)}`,
    },
  },
  // Uzbek (Latin script): oʻ/gʻ use U+02BB, the tutuq belgisi uses U+02BC. Technology names stay in English.
  uz: {
    languageName: "Oʻzbekcha",
    skipLink: "Asosiy mazmunga oʻtish",
    sectionsNav: "Boʻlimlar",
    languageSwitch: "Til",
    nav: {
      about: "Men haqimda",
      experience: "Tajriba",
      projects: "Loyihalar",
      skills: "Koʻnikmalar",
      education: "Taʼlim",
      contact: "Aloqa",
    },
    theme: { toLight: "Yorugʻ mavzuga oʻtish", toDark: "Qorongʻi mavzuga oʻtish" },
    contactLinks: "Aloqa havolalari",
    downloadResume: "Rezyumeni yuklab olish",
    pdf: { a4: "PDF (A4, inglizcha)", letter: "PDF (US Letter, inglizcha)", ru: "PDF (ruscha)" },
    newTab: "(yangi oynada ochiladi)",
    live: { one: "Sayt:", many: "Saytlar:" },
    techStack: (name: string) => `${name}: texnologiyalar`,
    moreProjects: (count: number) => `Yana ${count} ta loyiha`,
    fewerProjects: "Loyihalarni yigʻish",
    languages: "Tillar",
    contactLead: "Masofaviy senior React va Next.js lavozimlariga ochiqman.",
    basedIn: (location: string) => `Joylashuv: ${location}.`,
    emailMe: "Elektron pochtaga yozish",
    messengers: "Telegram / WhatsApp",
    footer:
      "Next.js, TypeScript va Tailwind CSS asosida yaratilgan. Vitest, React Testing Library va Playwright " +
      "bilan test qilingan, jumladan ikkala mavzuda axe orqali foydalanish qulayligi tekshiruvi; " +
      "GitHub Actions CI.",
    archive: {
      title: "Barcha loyihalar",
      intro: (count: number, companies: number) =>
        `Rezyumedagi barcha loyihalar, yangilari birinchi: ${companies} ta kompaniyada ${count} ta loyiha. ` +
        "Ishlayotgan saytlarga havola berilgan; ayrim eskilari endi ishlamaydi yoki hech qachon ochiq boʻlmagan.",
      back: "Rezyumega qaytish",
      caption: "Barcha loyihalar, yangilari birinchi",
      columns: { year: "Yil", project: "Loyiha", madeAt: "Kompaniya", builtWith: "Texnologiyalar", link: "Havola" },
      status: { offline: "Ishlamaydi", internal: "Ichki" },
      viewAll: (count: number) => `Barcha ${count} ta loyiha`,
    },
  },
} satisfies Record<Locale, unknown>;

export type Dictionary = (typeof dictionaries)["en"];

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
