import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows the resume", async ({ page }) => {
  await expect(page).toHaveTitle(/Shaxboz Mirzomurotov/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Shaxboz Mirzomurotov");
  for (const name of ["About", "Experience", "Skills", "Education", "Contact"]) {
    await expect(page.getByRole("region", { name })).toBeVisible();
  }
});

test("nav links jump to their sections", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "Sections" });
  await nav.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole("region", { name: "Contact" })).toBeInViewport();
});

test("resume PDFs are served", async ({ page, request }) => {
  const links = page.getByRole("list", { name: "Download resume" }).getByRole("link");
  await expect(links).toHaveCount(3);
  for (const href of await links.evaluateAll((els) => els.map((el) => el.getAttribute("href")))) {
    const response = await request.get(href!);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }
});

test("has no detectable accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
