import type { Locale } from "@/shared/i18n";
import { education as en } from "./model";
import { education as ru } from "./model.ru";
import { education as uz } from "./model.uz";

const educationByLocale = { en, ru, uz } satisfies Record<Locale, unknown>;

export const getEducation = (locale: Locale) => educationByLocale[locale];
