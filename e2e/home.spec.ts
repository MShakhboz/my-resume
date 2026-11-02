import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows the resume", async ({ page }) => {
  await expect(page).toHaveTitle(/Shaxboz Mirzomurotov/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Shaxboz Mirzomurotov");
  for (const name of ["About", "Experience", "Projects", "Skills", "Education", "Contact"]) {
    await expect(page.getByRole("region", { name })).toBeVisible();
  }
});

test("nav links jump to their sections", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "Sections" });
  await nav.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole("region", { name: "Contact" })).toBeInViewport();
});

test("View more reveals the other projects, with no accessibility violations", async ({ page }) => {
  const projects = page.getByRole("region", { name: "Projects" });
  const extra = projects.getByRole("heading", { name: "COYOTE CRM" });
  await expect(extra).toBeHidden();

  await projects.getByRole("button", { name: /more projects/ }).click();
  await expect(extra).toBeVisible();
  const results = await new AxeBuilder({ page }).include("#projects").analyze();
  expect(results.violations).toEqual([]);

  await projects.getByRole("button", { name: "Show fewer projects" }).click();
  await expect(extra).toBeHidden();
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

for (const path of ["/", "/ru", "/uz"]) {
  for (const colorScheme of ["dark", "light"] as const) {
    test(`has no detectable accessibility violations (${path}, ${colorScheme})`, async ({ page }) => {
      await page.goto(path);
      await page.emulateMedia({ colorScheme });
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", colorScheme);
      // Guards against unstyled pages, which axe would happily pass.
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        colorScheme === "dark" ? "rgb(10, 10, 10)" : "rgb(245, 245, 245)"
      );
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

test("the Russian page is in Russian and links back to English", async ({ page }) => {
  await page.goto("/ru");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page).toHaveTitle(/Шахбоз Мирзомуротов/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Шахбоз Мирзомуротов");
  for (const name of ["О себе", "Опыт", "Проекты", "Навыки", "Образование", "Контакты"]) {
    await expect(page.getByRole("region", { name })).toBeVisible();
  }
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/$/);

  await page.getByRole("list", { name: "Язык" }).getByRole("link", { name: "en" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the Uzbek page is in Uzbek", async ({ page }) => {
  await page.goto("/uz");
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Shaxboz Mirzomurotov");
  for (const name of ["Men haqimda", "Tajriba", "Loyihalar", "Koʻnikmalar", "Taʼlim", "Aloqa"]) {
    await expect(page.getByRole("region", { name })).toBeVisible();
  }
  await expect(page.locator('link[rel="alternate"][hreflang="ru"]')).toHaveAttribute("href", /\/ru$/);
});

for (const path of ["/", "/ru", "/uz"]) {
  test(`fits a 320px screen without sideways scrolling (${path})`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(path);
    const [scrollWidth, viewportWidth] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      window.innerWidth,
    ]);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });
}

test("unknown paths are a 404", async ({ request }) => {
  expect((await request.get("/de")).status()).toBe(404);
});

test("theme toggle overrides the system theme and persists", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
});
