import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/shared/i18n";
import { ChatWidget } from "./ui";

const t = getDictionary("en").chat;

const streamOf = (...chunks: string[]) =>
  new Response(
    new ReadableStream({
      start(controller) {
        for (const c of chunks) controller.enqueue(new TextEncoder().encode(c));
        controller.close();
      },
    }),
    { status: 200 }
  );

describe("ChatWidget", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("opens with suggested questions and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<ChatWidget locale="en" />);
    await user.click(screen.getByRole("button", { name: t.open }));
    expect(screen.getByRole("dialog", { name: t.title })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: t.suggestions[0] })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: t.placeholder })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends a suggested question and shows the streamed answer", async () => {
    const fetchMock = vi.fn().mockResolvedValue(streamOf("He built ", "a fleet CRM."));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ChatWidget locale="en" />);
    await user.click(screen.getByRole("button", { name: t.open }));
    await user.click(screen.getByRole("button", { name: t.suggestions[1] }));

    expect(await screen.findByText("He built a fleet CRM.")).toBeInTheDocument();
    expect(screen.getByText(t.suggestions[1])).toBeInTheDocument();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toEqual({ messages: [{ role: "user", content: t.suggestions[1] }], locale: "en" });
  });

  it("points to direct contacts when today's limit is used up", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: "daily_limit" }, { status: 429 })));
    const user = userEvent.setup();
    render(<ChatWidget locale="en" />);
    await user.click(screen.getByRole("button", { name: t.open }));
    await user.click(screen.getByRole("button", { name: t.suggestions[0] }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(t.errors.daily_limit);
    expect(within(alert).getByRole("link", { name: "mirzomurotovshaxboz@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:mirzomurotovshaxboz@gmail.com"
    );
    expect(within(alert).getByRole("link", { name: "Telegram @nornof" })).toHaveAttribute("href", "https://t.me/nornof");
  });

  it("explains a rate limit and keeps the question", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: "rate_limited" }, { status: 429 })));
    const user = userEvent.setup();
    render(<ChatWidget locale="en" />);
    await user.click(screen.getByRole("button", { name: t.open }));
    await user.type(screen.getByRole("textbox", { name: t.placeholder }), "Is he senior?{Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent(t.errors.rate_limited);
    expect(screen.getByText("Is he senior?")).toBeInTheDocument();
  });
});
