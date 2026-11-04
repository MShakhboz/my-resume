import { archive as enArchive } from "./model";
import { ArchiveEntry } from "./types";

type Translation = Pick<ArchiveEntry, "name" | "description">;

// Website only. Year, job, stack, link and status come from the English model.
const translations: Record<string, Translation> = {
  hibro: {
    name: "Hi Bro",
    description: "AI-гид по меню ресторана: гости сканируют QR-код или меню, задают вопросы о блюдах и собирают заказ.",
  },
  "hibro-admin": {
    name: "Админ-панель Hi Bro",
    description: "Админ-панель Hi Bro: заведения, редактор меню с перетаскиванием и источники меню, которые читает AI.",
  },
  "tradetaxi-crm": {
    name: "CRM таксопарка TradeTaxi",
    description: "CRM для управления таксопарком с браузерными вкладками и чатом поддержки в реальном времени.",
  },
  nxtarmor: { name: "NXTArmor", description: "Сайт компании по покрытиям, тонировке и защите лакокрасочного покрытия." },
  earendel: { name: "Earendel Artists", description: "Сайт платформы для артистов Earendel." },
  seers: {
    name: "Seers",
    description: "Сайт Seers: культурная аналитика в электронной музыке и живых мероприятиях.",
  },
  "10x-code-lab": { name: "10x Code Lab", description: "Маркетинговый сайт 10x Code Lab." },
  "lumex-agency": { name: "Lumex Agency", description: "Собственный сайт агентства." },
  "nova-pixels": { name: "Nova Pixels Design", description: "Сайт студии веб-дизайна и брендинга." },
  "exclusive-mens-spa": {
    name: "Exclusive Men's Spa",
    description: "Сайт мужского спа, одна из тем мультисайтовой wellness-платформы.",
  },
  "serene-luxe": { name: "Serene Luxe", description: "Вторая тема той же wellness-платформы." },
  "nomad-nirvana": { name: "Nomad Nirvana", description: "Третья тема той же wellness-платформы." },
  "forever-love-puppies": {
    name: "Forever Love Puppies",
    description: "Сеть заводчиков щенков в Южной Флориде. Поддержка и сопровождение.",
  },
  "blue-sky-puppies": {
    name: "Blue Sky Puppies",
    description: "Продажа щенков в Орландо и Нэшвилле. Поддержка и сопровождение.",
  },
  "happy-puppy-universe": {
    name: "Happy Puppy Universe",
    description: "Сайт о щенках из той же группы. Поддержка и сопровождение.",
  },
  "nestegg-borrower-app": {
    name: "Клиентское приложение NestEgg",
    description: "Британская заявка на заём с открытым банкингом TrueLayer, загрузкой документов и статусом.",
  },
  "nestegg-lender-dashboard": {
    name: "Кабинет кредитора NestEgg",
    description: "Кабинет для 20+ кредиторов: рассмотрение заявок и решения, таблицы данных, графики и отчёты.",
  },
  "coyote-crm": {
    name: "COYOTE CRM",
    description: "Бэк-офис ERP для ресторанов: складские документы, номенклатура, расходы и отчёты о продажах.",
  },
  qamqorshy: {
    name: "Qamqorshy",
    description: "Проект, брошенный junior-разработчиками: завершён, код и производительность улучшены.",
  },
  "the-post-365": {
    name: "Админка The Post 365",
    description: "Админ-портал (CRM), созданный с нуля, затем развивался и поддерживался.",
  },
  bekpay: { name: "Bekpay", description: "CRM-портал, созданный с нуля, затем развивался и поддерживался." },
  sayra: { name: "Sayra", description: "CRM-портал, созданный с нуля, затем развивался и поддерживался." },
  "olmos-blok": { name: "Olmos Blok", description: "CRM-портал, созданный с нуля, затем развивался и поддерживался." },
  "epam-react-native": {
    name: "Приложение на React Native",
    description: "Вход и права доступа (аутентификация и авторизация) для мобильного приложения.",
  },
};

export const archive: ArchiveEntry[] = enArchive.map((entry) => {
  const translation = translations[entry.id];
  if (!translation) throw new Error(`Missing Russian translation for archive entry "${entry.id}"`);
  return { ...entry, ...translation };
});
