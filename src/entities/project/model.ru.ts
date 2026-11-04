import { projects as enProjects } from "./model";
import { Project } from "./types";

const NB = " ";

type Translation = Pick<Project, "title" | "description"> & { imageAlt?: string };

// Website only. Translations of the English model; stack, links, `featured` and the screenshot
// come from it, so the two can't drift apart.
const translations: Record<string, Translation> = {
  hibro: {
    title: "Hi Bro",
    description:
      "AI-гид по меню ресторана: гости сканируют QR-код или меню, задают вопросы о блюдах и собирают " +
      "заказ. С нуля создал гостевое приложение на Next.js, админ-панель с редактором меню и чтение меню в " +
      "headless-браузере для Laravel API, который открывает сайты меню как телефон гостя.",
  },
  "baza-taxi-crm": {
    title: "CRM таксопарка Baza-Taxi",
    description:
      "CRM для таксопарка из России (бывший TradeTaxi). В Itway как единственный " +
      "frontend-разработчик создал многовкладочный интерфейс по принципу браузера, где каждая вкладка " +
      "сохраняет состояние страницы и позицию прокрутки, модули «Водители», «ТС», «Заказы» и «Штрафы» " +
      `с виртуализированными таблицами почти на 900${NB}000 записей и чат поддержки в реальном времени на WebSockets.`,
  },
  "nestegg-borrower-app": {
    title: "Клиентское приложение NestEgg",
    description:
      "Приложение для заёмщиков NestEgg — британской платформы подбора займов в кредитных союзах. " +
      "Создано с нуля в Softwhere: пошаговая заявка на заём, подключение банка через TrueLayer, загрузка " +
      "документов, поиск адреса через Ideal Postcodes и отслеживание статуса.",
  },
  "nestegg-lender-dashboard": {
    title: "Кабинет кредитора NestEgg",
    description:
      "Кабинет для кредитных союзов, которые выдают займы через NestEgg; им пользуются 20+ кредиторов. " +
      "Создан с нуля в Softwhere: рассмотрение заявок с одобрением и отказом, таблицы MUI X Data Grid Pro " +
      "с фильтрами, множество графиков и отчётов на Recharts и MUI X Charts, флаги LaunchDarkly.",
  },
  "lumex-client-sites": {
    title: "Клиентские сайты Lumex Agency",
    description:
      "Руководил 2 frontend-разработчиками на 12 сайтах для клиентов американского агентства: разработка " +
      "с нуля, новые функции, рефакторинг, поддержка. Поднял доступность с 70–80% до 95–100% " +
      "(аудиты WAVE и IBM Equal Access).",
  },
  "coyote-crm": {
    title: "COYOTE CRM",
    description:
      "Бэк-офис ERP для ресторанов. Как основной frontend-разработчик создал складские документы " +
      "(накладные; акты перемещения, списания и инвентаризации), остатки, прейскурант, номенклатуру " +
      "с техкартами, регистр расходов и графики продаж, с импортом и экспортом Excel и печатью.",
  },
  qamqorshy: {
    title: "Qamqorshy",
    description:
      "Проект в COYOTE (Казахстан), брошенный junior-разработчиками: завершил его и улучшил качество кода " +
      "и производительность.",
  },
  "paybek-crm": {
    title: "CRM-системы Paybek",
    description:
      "CRM-системы для 4 финтех-веб-продуктов Paybek. Руководил frontend-командой и менторил " +
      "3 разработчиков; создал CRM с нуля, затем развивал, рефакторил и поддерживал их.",
  },
};

export const projects: Project[] = enProjects.map((project) => {
  const translation = translations[project.id];
  if (!translation) throw new Error(`Missing Russian translation for project "${project.id}"`);
  const { imageAlt, ...text } = translation;
  return {
    ...project,
    ...text,
    image: project.image && { ...project.image, alt: imageAlt ?? project.image.alt },
  };
});
