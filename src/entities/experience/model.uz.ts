import { jobs as enJobs } from "./model";
import { Job } from "./types";

const NB = " "; // keeps numbers like "37 822" on one line
const TITLE = "Frontend dasturchi";
const REMOTE = "Masofaviy";
const ON_SITE = "Ofisda, Oʻzbekiston";

type Translation = Pick<Job, "title" | "company" | "location" | "bullets">;

// Website only: translated from the English model (there is no Uzbek PDF). Technology names stay
// in English. Dates, work mode, stack and live sites come from the English model.
const translations: Record<string, Translation> = {
  tradetaxi: {
    title: TITLE,
    company: "TradeTaxi",
    location: REMOTE,
    bullets: [
      "Rossiyadagi taksi kompaniyasi uchun avtopark boshqaruvi CRM tizimini yaratayotgan 7 kishilik " +
        "jamoadagi yagona frontend dasturchi; AI yordamida yozilgan va toʻxtab qolgan loyihani qabul " +
        "qilib, frontendning taxminan 70% qismini yozdim.",
      "Brauzer uslubidagi koʻp tabli ish maydonini loyihalashtirdim: har bir tab sahifa holati va " +
        "skroll joylashuvini saqlaydi.",
      "WebSockets (Laravel Echo va Reverb yopiq kanallari) asosida haydovchilar uchun real vaqtli " +
        "qoʻllab-quvvatlash chatini yaratdim: xabarlarga javob, rasm yuborish, oʻqilmaganlar hisoblagichi va " +
        "filtri, qayta yuborish va oldingi xabarlarni yuklash.",
      "«Haydovchilar» (roʻyxat, qoʻllab-quvvatlash, roʻyxatdan oʻtkazish, xabar tarqatish) va «Transport " +
        `vositalari» modullarini 37${NB}822 haydovchi va 5${NB}405 avtomobil uchun ishlab chiqdim; katta ` +
        "jadvallar TanStack Virtual tufayli tez ishlaydi.",
      "«Jarimalar» modulini (GIBDD va TsKAD jarimalari, toʻlov paketlari, eʼtirozlar) GIBDD va Yandex " +
        "integratsiyalariga bagʻishlangan birinchi reliz siklida topshirdim.",
      `Backend — PHP/Laravel, mobil ilova — Flutter. Platformadan 2${NB}000 ga yaqin haydovchi foydalanadi.`,
      "Shuningdek, Hi Bro (hibro.am) — restoran menyusi boʻyicha AI-gid ustida ishlayman: mehmonlar " +
        "QR-kod yoki menyuni skanerlaydi, taomlar haqida soʻraydi va buyurtma yigʻadi. Next.js’da " +
        "mehmonlar ilovasini noldan yaratdim: kamera orqali QR-kod va menyuni skanerlash, AI-chat va " +
        "kategoriyalari suriladigan virtualizatsiyalangan menyu.",
      "Hi Bro admin panelining funksiyalarini yaratdim: kirish, foydalanuvchilar, muassasalar, " +
        "drag-and-drop menyu muharriri va tanib olish jarayonini bosqichma-bosqich koʻrsatadigan menyu " +
        "manbalari lentasi.",
      "Hi Bro Laravel API’sini kengaytirdim: AI-ofitsiant chati va headless-brauzerda menyu oʻqish " +
        "xizmati (Node, Playwright, Docker) — u menyu saytlarini mehmon telefonidek ochadi, ichki " +
        "manzillarga soʻrovlarni bloklaydi va nazorat menyularini har kecha qayta oʻqib, oldingi natija " +
        "bilan solishtiradi.",
    ],
  },
  lumex: {
    title: TITLE,
    company: "Lumex Agency (AQSh)",
    location: REMOTE,
    bullets: [
      "2 nafar frontend dasturchiga rahbarlik qildim va 12 ta mijoz saytini topshirdim: noldan ishlab " +
        "chiqish, yangi funksiyalar, refaktoring, qoʻllab-quvvatlash.",
      "WAVE va IBM Equal Access auditlari orqali saytlarning foydalanish qulayligi bahosini 70–80% dan " +
        "95–100% gacha oshirdim.",
    ],
  },
  softwhere: {
    title: TITLE,
    company: "Softwhere",
    location: REMOTE,
    bullets: [
      "NestEgg — qarz oluvchilarni kredit uyushmalari bilan bogʻlaydigan Britaniya kredit tanlash " +
        "platformasi uchun 2 ta fintech ilovani noldan yaratdim: mijozlar uchun loans.nestegg.ai va " +
        "20+ kreditor foydalanadigan kreditor kabineti.",
      "Mijozlar ilovasi: bosqichma-bosqich kredit arizasi, TrueLayer ochiq banking orqali bank hisobini " +
        "ulash, hujjatlarni yuklash, Ideal Postcodes orqali manzil qidirish va ariza holatini kuzatish.",
      "Kreditor kabineti: arizalarni koʻrib chiqish, tasdiqlash va rad etish, filtrli MUI X Data Grid Pro " +
        "jadvallari, grafiklar va hisobotlar.",
      "Vitest, React Testing Library va MSW bilan unit va integratsion testlar, Playwright bilan end-to-end " +
        "testlar yozdim.",
      "Loyihani Vite’ga oʻtkazdim va funksiyalarni LaunchDarkly flaglari ortida chiqardim.",
    ],
  },
  coyote: {
    title: TITLE,
    company: "COYOTE (Qozogʻiston)",
    location: REMOTE,
    bullets: [
      "Junior dasturchilar tugatmay qoldirgan loyihalarni yakunladim, kod sifati, unumdorlik va " +
        "qoʻllab-quvvatlash qulayligini oshirdim.",
      "COYOTE CRM (erp.cascompany.org) — restoranlar uchun back-office ERP’ning asosiy frontend dasturchisi; " +
        "React, TypeScript, Redux Toolkit va MUI.",
      "Ombor hujjatlarini yaratdim: kirim va chiqim yuk xatlari, koʻchirish, hisobdan chiqarish va " +
        "inventarizatsiya dalolatnomalari (jami summa avtomatik hisoblanadi), qoldiqlar, narxlar roʻyxati, " +
        "yetkazib beruvchilar va kontragentlar; Excel import va eksporti, chop etish.",
      "Nomenklaturani yaratdim: taomlar, modifikatorlar, yarim tayyor mahsulotlar va ingredientlar, oʻlcham va " +
        "amal qilish sanalari boʻyicha texnologik kartalar, filiallar boʻyicha sotuvdagi taomlar.",
      "Operatsion xarajatlar reyestri, grafikli savdo hisobotlari va butun ilova uchun umumiy komponentlarni " +
        "qoʻshdim: sana va vaqt tanlagich, maʼlumotlar jadvallari va qidiruvli mahsulot tanlagichlari.",
    ],
  },
  paybek: {
    title: TITLE,
    company: "Paybek (fintech)",
    location: ON_SITE,
    bullets: [
      "Frontend jamoaga rahbarlik qildim: 3 nafar frontend dasturchiga mentorlik va kundalik nazorat.",
      "4 ta veb-mahsulot uchun CRM tizimlarini noldan yaratdim, soʻng ularni rivojlantirdim, refaktoring " +
        "qildim va qoʻllab-quvvatladim.",
    ],
  },
  epam: {
    title: TITLE,
    company: "EPAM Systems",
    location: ON_SITE,
    bullets: [
      "Scrum jamoasida React Native ilovasi uchun frontend autentifikatsiya va avtorizatsiyani amalga " +
        "oshirdim; Jira, Figma.",
    ],
  },
};

export const jobs: Job[] = enJobs.map((job) => {
  const translation = translations[job.id];
  if (!translation) throw new Error(`Missing Uzbek translation for job "${job.id}"`);
  return { ...job, ...translation, dates: job.dates.replace("Present", "hozirgacha") };
});
