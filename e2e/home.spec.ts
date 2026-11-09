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

for (const path of ["/", "/ru", "/uz", "/projects", "/ru/projects", "/uz/projects", "/logs"]) {
  for (const colorScheme of ["dark", "light"] as const) {
    test(`has no detectable accessibility violations (${path}, ${colorScheme})`, async ({ page }) => {
      await page.goto(path);
      await page.emulateMedia({ colorScheme });
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", colorScheme);
      // Guards against unstyled pages, which axe would happily pass.
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        colorScheme === "dark" ? "rgb(17, 17, 16)" : "rgb(249, 249, 248)"
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
  // Absolute since metadataBase is always set: the English page is the site root.
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);

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

for (const path of ["/", "/ru", "/uz", "/projects", "/ru/projects", "/uz/projects", "/logs"]) {
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

test("the project total opens the full list, which links back", async ({ page }) => {
  await page.getByRole("link", { name: /projects across 6 companies/ }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("All projects");
  await expect(page.getByRole("table", { name: "All projects, newest first" }).getByRole("row")).toHaveCount(25); // 24 projects + the header row

  await page.getByRole("list", { name: "Language" }).getByRole("link", { name: "ru" }).click();
  await expect(page).toHaveURL(/\/ru\/projects$/);
  await page.getByRole("link", { name: "Назад к резюме" }).click();
  await expect(page).toHaveURL(/\/ru$/);
});

test("search engines and AI crawlers get a sitemap, robots.txt and llms.txt", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const path of ["/ru", "/uz", "/projects", "/ru/projects"]) expect(xml).toContain(`${path}</loc>`);
  expect(xml).toContain('hreflang="uz"');

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Allow: \//);
  expect(robots).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);

  const llms = await request.get("/llms.txt");
  expect(llms.headers()["content-type"]).toContain("text/plain");
  expect(await llms.text()).toContain("# Shaxboz Mirzomurotov");
});

for (const [path, image] of [["/", "/og/en"], ["/ru/projects", "/og/ru"], ["/uz", "/og/uz"]]) {
  test(`shared links show the business-card preview (${path})`, async ({ page, request }) => {
    await page.goto(path);
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", new RegExp(`^https?://[^/]+${image}$`));
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

    const response = await request.get(image);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toBe("image/png");
  });
}

test("unknown paths are a 404", async ({ request }) => {
  for (const path of ["/de", "/projects/x", "/ru/de", "/projects/ru"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
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

test("the job log stays locked, unindexed and out of the sitemap", async ({ page, request }) => {
  await page.goto("/logs");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await page.getByLabel("Password").fill("not the password");
  await page.getByRole("button", { name: "Unlock" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Wrong password." })).toBeVisible();
  await expect(page.getByRole("list", { name: "Applications, newest first" })).toHaveCount(0);

  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/logs");
});
