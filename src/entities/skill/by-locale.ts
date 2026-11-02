import type { Locale } from "@/shared/i18n";
import { skillGroups as en } from "./model";
import { skillGroups as ru } from "./model.ru";
import { skillGroups as uz } from "./model.uz";

const skillsByLocale = { en, ru, uz } satisfies Record<Locale, unknown>;

export const getSkillGroups = (locale: Locale) => skillsByLocale[locale];
