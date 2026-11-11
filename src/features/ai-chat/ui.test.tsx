import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/shared/i18n";
import { resetSpeech } from "./lib/speak";
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

  it("shows a speech bubble on hover and hides it with Escape", async () => {
    const user = userEvent.setup();
    render(<ChatWidget locale="en" />);
    const launcher = screen.getByRole("button", { name: t.open });
    expect(screen.queryByText(t.open)).not.toBeInTheDocument();

    await user.hover(launcher);
    expect(screen.getByText(t.open)).toBeInTheDocument();
    await user.unhover(launcher);
    expect(screen.queryByText(t.open)).not.toBeInTheDocument();

    await user.hover(launcher);
    launcher.focus();
    await user.keyboard("{Escape}");
    expect(screen.queryByText(t.open)).not.toBeInTheDocument();
  });

  it("plays the recorded greeting on hover while the bubble shows the short label", async () => {
    resetSpeech();
    const played: string[] = [];
    vi.stubGlobal(
      "Audio",
      class {
        constructor(src: string) {
          played.push(src);
        }
        play = () => Promise.resolve();
      }
    );
    const user = userEvent.setup();
    render(<ChatWidget locale="en" />);
    await user.hover(screen.getByRole("button", { name: t.open }));

    expect(screen.getByText(t.open)).toBeInTheDocument();
    expect(played).toEqual(["/voice/greeting-en.m4a"]);
  });

  it("says hello when the chat opens, since that click unlocks sound", async () => {
    resetSpeech();
    const played: string[] = [];
    vi.stubGlobal(
      "Audio",
      class {
        paused = false;
        ended = true;
        constructor(src: string) {
          played.push(src);
        }
        play = () => Promise.resolve();
      }
    );
    render(<ChatWidget locale="uz" />);
    fireEvent.click(screen.getByRole("button", { name: getDictionary("uz").chat.open }));
    expect(played).toEqual(["/voice/greeting-uz.m4a"]);
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
    expect(within(alert).getByRole("link", { name: t.emailButton })).toHaveAttribute(
      "href",
      "mailto:mirzomurotovshaxboz@gmail.com"
    );
    expect(within(alert).getByRole("link", { name: /^Telegram/ })).toHaveAttribute("href", "https://t.me/nornof");
  });

  it("makes his contacts and sites clickable in answers, with contact buttons below", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamOf("He built hibro.am. Ask him at mirzomurotovshaxboz@gmail.com or Telegram @nornof, not at evil.example.")
      )
    );
    const user = userEvent.setup();
    render(<ChatWidget locale="en" />);
    await user.click(screen.getByRole("button", { name: t.open }));
    await user.click(screen.getByRole("button", { name: t.suggestions[0] }));

    const email = await screen.findByRole("link", { name: "mirzomurotovshaxboz@gmail.com" });
    expect(email).toHaveAttribute("href", "mailto:mirzomurotovshaxboz@gmail.com");
    expect(screen.getByRole("link", { name: /^@nornof/ })).toHaveAttribute("href", "https://t.me/nornof");
    expect(screen.getByRole("link", { name: /^hibro\.am/ })).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("link", { name: /evil/ })).not.toBeInTheDocument();

    const buttons = screen.getByRole("group", { name: t.contactHim });
    expect(within(buttons).getByRole("link", { name: t.emailButton })).toHaveAttribute("href", "mailto:mirzomurotovshaxboz@gmail.com");
    expect(within(buttons).getByRole("link", { name: /^Telegram/ })).toHaveAttribute("href", "https://t.me/nornof");
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
