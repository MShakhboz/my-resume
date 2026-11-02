import type { Locale } from "@/shared/i18n";
import { projects as en } from "./model";
import { projects as ru } from "./model.ru";

const projectsByLocale = { en, ru } satisfies Record<Locale, unknown>;

export const getProjects = (locale: Locale) => projectsByLocale[locale];
