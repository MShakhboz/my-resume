import { contacts } from "./contacts";
import { ProfileType } from "./types";

const NB = " "; // keeps "898 868" on one line, as in the PDF

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
    `виртуализированные таблицы почти на 900${NB}000 записей. Руководил командами до 3 человек.`,
  highlights: [
    { value: "20+", label: "проектов в 6 компаниях", source: "project-count" },
    { value: "6+", label: "лет разработки на React и Next.js" },
    { value: "95–100%", label: "доступность сайтов, было 70–\u206080%" },
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
