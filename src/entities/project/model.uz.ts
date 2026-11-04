import { projects as enProjects } from "./model";
import { Project } from "./types";

const NB = " ";

type Translation = Pick<Project, "title" | "description"> & { imageAlt?: string };

// Website only: translations of the English model. Technology names stay in English; stack, links,
// `featured` and the screenshot come from the English model.
const translations: Record<string, Translation> = {
  hibro: {
    title: "Hi Bro",
    description:
      "Restoran menyusi boʻyicha AI-gid: mehmonlar QR-kod yoki menyuni skanerlaydi, taomlar haqida " +
      "soʻraydi va buyurtma yigʻadi. Next.js’da mehmonlar ilovasini noldan yaratdim, menyu muharririli " +
      "admin panelni hamda Laravel API uchun menyu saytlarini mehmon telefonidek ochadigan " +
      "headless-brauzer menyu oʻquvchisini qildim.",
  },
  "tradetaxi-crm": {
    title: "TradeTaxi avtopark CRM tizimi",
    description:
      `Rossiyadagi taksi kompaniyasi uchun avtopark CRM tizimi, undan 2${NB}000 ga yaqin haydovchi ` +
      "foydalanadi. Yagona frontend dasturchi sifatida har bir tab sahifa holati va skroll joylashuvini " +
      "saqlaydigan brauzer uslubidagi koʻp tabli ish maydonini, virtualizatsiyalangan jadvallarga ega " +
      "«Haydovchilar», «Transport vositalari» va «Jarimalar» modullarini hamda WebSockets asosidagi real " +
      "vaqtli qoʻllab-quvvatlash chatini yaratdim.",
  },
  "nestegg-borrower-app": {
    title: "NestEgg mijozlar ilovasi",
    description:
      "NestEgg — qarz oluvchilarni kredit uyushmalari bilan bogʻlaydigan Britaniya kredit tanlash " +
      "platformasining qarz oluvchilar uchun ilovasi. Softwhere’da noldan yaratilgan: bosqichma-bosqich " +
      "kredit arizasi, TrueLayer orqali bankni ulash, hujjatlarni yuklash, Ideal Postcodes orqali manzil " +
      "qidirish va holatni kuzatish.",
  },
  "nestegg-lender-dashboard": {
    title: "NestEgg kreditor kabineti",
    description:
      "NestEgg orqali qarz beradigan kredit uyushmalari uchun kabinet; undan 20+ kreditor foydalanadi. " +
      "Softwhere’da noldan yaratilgan: arizalarni koʻrib chiqish, tasdiqlash va rad etish, filtrli MUI X " +
      "Data Grid Pro jadvallari, Recharts va MUI X Charts asosidagi koʻplab grafiklar va hisobotlar, LaunchDarkly flaglari.",
  },
  "lumex-client-sites": {
    title: "Lumex Agency mijoz saytlari",
    description:
      "AQSh agentligi mijozlari uchun 12 ta saytda 2 nafar frontend dasturchiga rahbarlik qildim: noldan " +
      "ishlab chiqish, yangi funksiyalar, refaktoring, qoʻllab-quvvatlash. WAVE va IBM Equal Access " +
      "auditlari orqali foydalanish qulayligi bahosini 70–80% dan 95–100% gacha oshirdim.",
  },
  "coyote-crm": {
    title: "COYOTE CRM",
    description:
      "Restoranlar uchun back-office ERP. Asosiy frontend dasturchi sifatida ombor hujjatlari (yuk xatlari; " +
      "koʻchirish, hisobdan chiqarish va inventarizatsiya dalolatnomalari), qoldiqlar, narxlar roʻyxati, " +
      "texnologik kartali nomenklatura, xarajatlar reyestri va savdo grafiklarini Excel import/eksporti " +
      "va chop etish bilan yaratdim.",
  },
  qamqorshy: {
    title: "Qamqorshy",
    description:
      "COYOTE’dagi (Qozogʻiston) junior dasturchilar tugatmay qoldirgan loyiha: uni yakunladim, kod " +
      "sifati va unumdorligini oshirdim.",
  },
  "paybek-crm": {
    title: "Paybek CRM tizimlari",
    description:
      "Paybek’ning 4 ta fintech veb-mahsuloti uchun CRM tizimlari. Frontend jamoaga rahbarlik qildim va " +
      "3 nafar dasturchiga mentorlik qildim; CRM’larni noldan yaratdim, soʻng rivojlantirdim, " +
      "refaktoring qildim va qoʻllab-quvvatladim.",
  },
};

export const projects: Project[] = enProjects.map((project) => {
  const translation = translations[project.id];
  if (!translation) throw new Error(`Missing Uzbek translation for project "${project.id}"`);
  const { imageAlt, ...text } = translation;
  return {
    ...project,
    ...text,
    image: project.image && { ...project.image, alt: imageAlt ?? project.image.alt },
  };
});
