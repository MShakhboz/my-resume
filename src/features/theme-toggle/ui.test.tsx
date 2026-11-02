import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "./model";
import { ThemeToggle } from "./ui";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "dark";
  });

  it("switches between dark and light and remembers the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle locale="en" />);

    await user.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");

    await user.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("speaks Russian on the Russian page", () => {
    render(<ThemeToggle locale="ru" />);
    expect(screen.getByRole("button", { name: "Включить светлую тему" })).toBeInTheDocument();
  });

  it("reflects a theme set elsewhere", async () => {
    render(<ThemeToggle locale="en" />);
    document.documentElement.dataset.theme = "light";
    expect(await screen.findByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });
});
