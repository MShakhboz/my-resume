import type { Locale } from "@/shared/i18n";
import { profile as en } from "./model";
import { profile as ru } from "./model.ru";
import { profile as uz } from "./model.uz";

const profiles = { en, ru, uz } satisfies Record<Locale, unknown>;

export const getProfile = (locale: Locale) => profiles[locale];
