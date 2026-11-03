import type { Locale } from "@/shared/i18n";
import { archive as en } from "./model";
import { archive as ru } from "./model.ru";
import { archive as uz } from "./model.uz";

const archiveByLocale = { en, ru, uz } satisfies Record<Locale, unknown>;

/** Every project, newest first. */
export const getArchive = (locale: Locale) => archiveByLocale[locale];
