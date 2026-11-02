import type { Locale } from "@/shared/i18n";
import { education as en } from "./model";
import { education as ru } from "./model.ru";

const educationByLocale = { en, ru } satisfies Record<Locale, unknown>;

export const getEducation = (locale: Locale) => educationByLocale[locale];
