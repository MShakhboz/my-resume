import type { Locale } from "@/shared/i18n";
import { jobs as en } from "./model";
import { jobs as ru } from "./model.ru";
import { jobs as uz } from "./model.uz";

const jobsByLocale = { en, ru, uz } satisfies Record<Locale, unknown>;

/** Newest first. */
export const getJobs = (locale: Locale) => jobsByLocale[locale];
