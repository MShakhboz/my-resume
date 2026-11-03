import { describe, expect, it } from "vitest";
import { pagePath, routeSegments, toRoute } from "./config";

describe("routes", () => {
  it("maps route segments to a locale and page", () => {
    expect(toRoute(undefined)).toEqual({ locale: "en", page: "home" });
    expect(toRoute(["projects"])).toEqual({ locale: "en", page: "projects" });
    expect(toRoute(["ru"])).toEqual({ locale: "ru", page: "home" });
    expect(toRoute(["uz", "projects"])).toEqual({ locale: "uz", page: "projects" });
  });

  it("builds paths with English at the root", () => {
    expect(pagePath("en")).toBe("/");
    expect(pagePath("en", "projects")).toBe("/projects");
    expect(pagePath("ru")).toBe("/ru");
    expect(pagePath("ru", "projects")).toBe("/ru/projects");
  });

  it("generates every page in every language, and nothing else", () => {
    expect(routeSegments()).toEqual([[], ["projects"], ["ru"], ["ru", "projects"], ["uz"], ["uz", "projects"]]);
    for (const segments of routeSegments()) {
      const { locale, page } = toRoute(segments);
      expect(pagePath(locale, page)).toBe(`/${segments.join("/")}`);
    }
  });
});
