import type { Locale } from "@/shared/i18n";
import { profile as en } from "./model";
import { profile as ru } from "./model.ru";

const profiles = { en, ru } satisfies Record<Locale, unknown>;

export const getProfile = (locale: Locale) => profiles[locale];
