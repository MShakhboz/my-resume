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
    resumePdfs: "Resume (PDF)",
    download: "Download",
    downloadPdf: (pdf: string) => `Download ${pdf}`,
    pdf: { a4: "PDF (A4)", letter: "PDF (US Letter)", ru: "PDF (Russian)" },
    newTab: "(opens in a new tab)",
    chat: {
      open: "Ask AI about me",
      /** What the robot says on hover: "AI" in full, since voices read the abbreviation oddly. */
      spoken: "Hello! Feel free to ask my artificial intelligence assistant about me.",
      title: "Ask about Shaxboz",
      close: "Close chat",
      intro: "I answer questions about Shaxboz's experience and skills, using only his resume.",
      suggestions: [
        "What has he built with Next.js?",
        "Tell me about the Baza-Taxi CRM",
        "Has he worked with WebSockets?",
        "Is he open to remote work?",
      ],
      placeholder: "Ask a question…",
      send: "Send",
      emailButton: "Email",
      contactHim: "Contact Shaxboz",
      thinking: "Thinking…",
      disclaimer: "AI can make mistakes. Don't share personal information.",
      errors: {
        rate_limited: "Too many questions right now. Please try again in a minute.",
        daily_limit: "The chat has reached today's limit. Please contact Shaxboz directly:",
        unavailable: "The chat is offline right now. Please contact Shaxboz directly:",
        generic: "Something went wrong. Please try again, or contact Shaxboz directly.",
      },
    },
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
    resumePdfs: "Резюме (PDF)",
    download: "Скачать",
    downloadPdf: (pdf: string) => `Скачать ${pdf}`,
    pdf: { a4: "PDF (A4, англ.)", letter: "PDF (US Letter, англ.)", ru: "PDF (на русском)" },
    newTab: "(откроется в новой вкладке)",
    chat: {
      open: "Спросить ИИ обо мне",
      spoken: "Здравствуйте! Вы можете задать вопросы обо мне моему помощнику с искусственным интеллектом.",
      title: "Вопросы о Шахбозе",
      close: "Закрыть чат",
      intro: "Отвечаю на вопросы об опыте и навыках Шахбоза — только по его резюме.",
      suggestions: [
        "Что он делал на Next.js?",
        "Расскажи про CRM Baza-Taxi",
        "Работал ли он с WebSockets?",
        "Готов ли он к удалённой работе?",
      ],
      placeholder: "Задайте вопрос…",
      send: "Отправить",
      emailButton: "Почта",
      contactHim: "Связаться с Шахбозом",
      thinking: "Думаю…",
      disclaimer: "ИИ может ошибаться. Не отправляйте личные данные.",
      errors: {
        rate_limited: "Слишком много вопросов. Попробуйте через минуту.",
        daily_limit: "Чат исчерпал лимит вопросов на сегодня. Напишите Шахбозу напрямую:",
        unavailable: "Чат сейчас недоступен. Напишите Шахбозу напрямую:",
        generic: "Что-то пошло не так. Попробуйте ещё раз или напишите Шахбозу напрямую.",
      },
    },
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
    resumePdfs: "Rezyume (PDF)",
    download: "Yuklab olish",
    downloadPdf: (pdf: string) => `Yuklab olish: ${pdf}`,
    pdf: { a4: "PDF (A4, inglizcha)", letter: "PDF (US Letter, inglizcha)", ru: "PDF (ruscha)" },
    newTab: "(yangi oynada ochiladi)",
    chat: {
      open: "Men haqimda AIʼdan soʻrang",
      spoken: "Assalomu alaykum! Men haqimda sunʼiy intellekt yordamchimdan soʻrashingiz mumkin.",
      title: "Shaxboz haqida savollar",
      close: "Chatni yopish",
      intro: "Shaxbozning tajribasi va koʻnikmalari haqidagi savollarga faqat uning rezyumesi asosida javob beraman.",
      suggestions: [
        "Next.js’da nimalar qilgan?",
        "Baza-Taxi CRM haqida aytib bering",
        "WebSockets bilan ishlaganmi?",
        "Masofaviy ishga tayyormi?",
      ],
      placeholder: "Savol bering…",
      send: "Yuborish",
      emailButton: "Pochta",
      contactHim: "Shaxboz bilan bogʻlanish",
      thinking: "Oʻylayapman…",
      disclaimer: "AI xato qilishi mumkin. Shaxsiy maʼlumotlarni yubormang.",
      errors: {
        rate_limited: "Savollar juda koʻp. Bir daqiqadan soʻng qayta urinib koʻring.",
        daily_limit: "Chat bugungi savollar limitiga yetdi. Shaxbozga toʻgʻridan-toʻgʻri yozing:",
        unavailable: "Chat hozir ishlamayapti. Shaxbozga toʻgʻridan-toʻgʻri yozing:",
        generic: "Nimadir xato ketdi. Qayta urinib koʻring yoki Shaxbozga toʻgʻridan-toʻgʻri yozing.",
      },
    },
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
