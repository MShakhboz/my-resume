"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getDictionary, Locale } from "@/shared/i18n";
import { getTheme, setTheme, subscribeToTheme, Theme } from "./model";

const getServerTheme = (): Theme => "dark";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;
  const { theme: labels } = getDictionary(locale);
  const label = next === "light" ? labels.toLight : labels.toDark;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-raised hover:text-strong"
    >
      <Icon aria-hidden size={18} />
    </button>
  );
}
