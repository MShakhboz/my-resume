import { archive as enArchive } from "./model";
import { ArchiveEntry } from "./types";

type Translation = Pick<ArchiveEntry, "name" | "description">;

// Website only. Year, job, stack, link and status come from the English model.
const translations: Record<string, Translation> = {
  hibro: {
    name: "Hi Bro",
    description: "Restoran menyusi boʻyicha AI-gid: mehmonlar QR-kod yoki menyuni skanerlaydi, taomlar haqida soʻraydi va buyurtma yigʻadi.",
  },
  "hibro-admin": {
    name: "Hi Bro admin paneli",
    description: "Hi Bro admin paneli: muassasalar, drag-and-drop menyu muharriri va AI oʻqiydigan menyu manbalari.",
  },
  "baza-taxi-crm": {
    name: "Baza-Taxi avtopark CRM tizimi",
    description: "Taksi kompaniyasi uchun brauzer uslubidagi tablar va real vaqtli qoʻllab-quvvatlash chatiga ega avtopark CRM tizimi (avvalgi nomi TradeTaxi).",
  },
  nxtarmor: { name: "NXTArmor", description: "Qoplama, oyna tonirovkasi va boʻyoqni himoyalash kompaniyasi sayti." },
  earendel: { name: "Earendel Artists", description: "Earendel artistlar platformasi sayti." },
  seers: {
    name: "Seers",
    description: "Seers sayti: elektron musiqa va jonli tadbirlardagi madaniy tahlil.",
  },
  "10x-code-lab": { name: "10x Code Lab", description: "10x Code Lab marketing sayti." },
  "lumex-agency": { name: "Lumex Agency", description: "Agentlikning oʻz sayti." },
  "nova-pixels": { name: "Nova Pixels Design", description: "Veb-dizayn va brending studiyasi sayti." },
  "exclusive-mens-spa": {
    name: "Exclusive Men's Spa",
    description: "Erkaklar spa sayti, koʻp saytli wellness platformasining mavzularidan biri.",
  },
  "serene-luxe": { name: "Serene Luxe", description: "Oʻsha wellness platformasining ikkinchi mavzusi." },
  "nomad-nirvana": { name: "Nomad Nirvana", description: "Oʻsha wellness platformasining uchinchi mavzusi." },
  "forever-love-puppies": {
    name: "Forever Love Puppies",
    description: "Janubiy Floridadagi kuchukcha yetishtiruvchilar tarmogʻi. Texnik xizmat va qoʻllab-quvvatlash.",
  },
  "blue-sky-puppies": {
    name: "Blue Sky Puppies",
    description: "Orlando va Neshvilda kuchukchalar sotuvi. Texnik xizmat va qoʻllab-quvvatlash.",
  },
  "happy-puppy-universe": {
    name: "Happy Puppy Universe",
    description: "Oʻsha guruhdagi kuchukchalar sayti. Texnik xizmat va qoʻllab-quvvatlash.",
  },
  "nestegg-borrower-app": {
    name: "NestEgg mijozlar ilovasi",
    description: "TrueLayer ochiq banking, hujjat yuklash va holatni kuzatish bilan Britaniya kredit arizasi.",
  },
  "nestegg-lender-dashboard": {
    name: "NestEgg kreditor kabineti",
    description: "20+ kreditor uchun kabinet: arizalarni koʻrib chiqish va qarorlar, jadvallar, grafiklar va hisobotlar.",
  },
  "coyote-crm": {
    name: "COYOTE CRM",
    description: "Restoranlar uchun back-office ERP: ombor hujjatlari, nomenklatura, xarajatlar va savdo hisobotlari.",
  },
  qamqorshy: {
    name: "Qamqorshy",
    description: "Junior dasturchilar tugatmay qoldirgan loyiha: yakunlandi, kod va unumdorlik yaxshilandi.",
  },
  "the-post-365": {
    name: "The Post 365 admin paneli",
    description: "Noldan yaratilgan, soʻng rivojlantirilgan va qoʻllab-quvvatlangan admin portal (CRM).",
  },
  bekpay: { name: "Bekpay", description: "Noldan yaratilgan, soʻng rivojlantirilgan va qoʻllab-quvvatlangan CRM portal." },
  sayra: { name: "Sayra", description: "Noldan yaratilgan, soʻng rivojlantirilgan va qoʻllab-quvvatlangan CRM portal." },
  "olmos-blok": {
    name: "Olmos Blok",
    description: "Noldan yaratilgan, soʻng rivojlantirilgan va qoʻllab-quvvatlangan CRM portal.",
  },
  "epam-react-native": {
    name: "React Native ilovasi",
    description: "Mobil ilova uchun kirish va ruxsatlar (autentifikatsiya va avtorizatsiya).",
  },
};

export const archive: ArchiveEntry[] = enArchive.map((entry) => {
  const translation = translations[entry.id];
  if (!translation) throw new Error(`Missing Uzbek translation for archive entry "${entry.id}"`);
  return { ...entry, ...translation };
});
