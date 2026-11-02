import { contacts } from "./contacts";
import { ProfileType } from "./types";

const NB = " "; // keeps "37 822" on one line, as in the PDF

// Source of truth: ../build_resume_ru.py. Highlight labels are website only.
export const profile: ProfileType = {
  name: "Шахбоз Мирзомуротов",
  initials: "ШМ",
  headline: "Senior Frontend-разработчик | React, Next.js, TypeScript",
  location: "Ташкент, Узбекистан (UTC+5)",
  availability: "Открыт к удалённой работе",
  summary:
    "Senior frontend-разработчик, 6+ лет опыта: React и Next.js на TypeScript для финтеха, управления " +
    "автопарком и агентских проектов (клиенты из США, Великобритании, России и Центральной Азии). " +
    "Единственный frontend-разработчик CRM таксопарка: браузерные вкладки с сохранением состояния и " +
    `виртуализированные таблицы на 37${NB}000+ водителей. Руководил командами до 3 человек.`,
  highlights: [
    { value: "6+", label: "лет разработки на React и Next.js" },
    { value: "12", label: "клиентских сайтов для агентства из США" },
    { value: `37${NB}822`, label: "водителей в CRM таксопарка TradeTaxi" },
    { value: "95–100%", label: "доступность сайтов, было 70–80%" },
  ],
  contacts,
  messengerHandle: "@nornof",
  languages: [
    "Узбекский (родной)",
    "Русский (продвинутый)",
    "Английский (продвинутый)",
    "Немецкий (начальный)",
  ],
};
