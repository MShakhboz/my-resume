import type { Locale } from "@/shared/i18n";
import { skillGroups as en } from "./model";
import { skillGroups as ru } from "./model.ru";

const skillsByLocale = { en, ru } satisfies Record<Locale, unknown>;

export const getSkillGroups = (locale: Locale) => skillsByLocale[locale];
