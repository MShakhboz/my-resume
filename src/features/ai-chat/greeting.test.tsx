import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/shared/i18n";
import { GREETING_DELAY_MS, GREETING_VISIBLE_MS } from "./lib/greeting";
import { resetSpeech } from "./lib/speak";
import { ChatWidget } from "./ui";

const t = getDictionary("en").chat;
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe("the robot's proactive greeting", () => {
  const played: string[] = [];
  let play: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.useFakeTimers();
    resetSpeech();
    played.length = 0;
    play = vi.fn(() => Promise.resolve());
    vi.stubGlobal(
      "Audio",
      class {
        paused = false;
        ended = true;
        constructor(src: string) {
          played.push(src);
        }
        play = play;
      }
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("appears on its own right after the page renders, silently, then hides itself", () => {
    render(<ChatWidget locale="en" />);
    expect(screen.queryByText(t.greeting)).not.toBeInTheDocument();

    advance(GREETING_DELAY_MS);
    expect(screen.getByRole("status")).toHaveTextContent(t.greeting);
    expect(played).toEqual([]); // the robot speaks on the visitor's first hover, not on its own

    advance(GREETING_VISIBLE_MS);
    expect(screen.queryByText(t.greeting)).not.toBeInTheDocument();
  });

  it("stays while the visitor is hovering it", () => {
    render(<ChatWidget locale="en" />);
    advance(GREETING_DELAY_MS);
    fireEvent.mouseEnter(screen.getByRole("status"));
    advance(GREETING_VISIBLE_MS * 2);
    expect(screen.getByText(t.greeting)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByRole("status"));
    advance(GREETING_VISIBLE_MS);
    expect(screen.queryByText(t.greeting)).not.toBeInTheDocument();
  });

  it("can be dismissed, and greets again on the next page load", () => {
    const { unmount } = render(<ChatWidget locale="en" />);
    advance(GREETING_DELAY_MS);
    fireEvent.click(screen.getByRole("button", { name: t.dismissGreeting }));
    expect(screen.queryByText(t.greeting)).not.toBeInTheDocument();

    unmount();
    render(<ChatWidget locale="en" />); // the next page load
    advance(GREETING_DELAY_MS);
    expect(screen.getByText(t.greeting)).toBeInTheDocument();
  });

  it("greets out loud on the first hover while the bubble is showing", () => {
    render(<ChatWidget locale="en" />);
    advance(GREETING_DELAY_MS);
    fireEvent.mouseEnter(screen.getByRole("button", { name: t.open }));
    expect(played).toEqual(["/voice/greeting-en.m4a"]);
  });

  it("opens the chat when clicked", () => {
    render(<ChatWidget locale="en" />);
    advance(GREETING_DELAY_MS);
    fireEvent.click(screen.getByRole("button", { name: t.greeting }));
    expect(screen.getByRole("dialog", { name: t.title })).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("says hello in the page's language", () => {
    render(<ChatWidget locale="ru" />);
    advance(GREETING_DELAY_MS);
    expect(screen.getByRole("status")).toHaveTextContent(getDictionary("ru").chat.greeting);
  });
});
