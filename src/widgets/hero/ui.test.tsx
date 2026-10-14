import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "@/entities/profile";
import { resumePdfs } from "@/shared/config";
import { Hero } from "./ui";

describe("Hero", () => {
  it("renders the name as the page heading", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();
  });

  it("links every contact channel", () => {
    render(<Hero />);
    const list = screen.getByRole("list", { name: "Contact links" });
    for (const contact of profile.contacts) {
      expect(within(list).getByRole("link", { name: contact.label })).toHaveAttribute(
        "href",
        contact.href
      );
    }
  });

  it("offers each PDF as a download", () => {
    render(<Hero />);
    for (const pdf of resumePdfs) {
      const link = screen.getByRole("link", { name: pdf.label });
      expect(link).toHaveAttribute("href", pdf.href);
      expect(link).toHaveAttribute("download");
    }
  });
});
