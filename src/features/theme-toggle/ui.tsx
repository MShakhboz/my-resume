"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getTheme, setTheme, subscribeToTheme, Theme } from "./model";

const getServerTheme = (): Theme => "dark";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-raised hover:text-strong"
    >
      <Icon aria-hidden size={18} />
    </button>
  );
}
