"use client";

import { ArrowUp, ChevronRight, Mail, MousePointerClick, Send, X } from "lucide-react";
import { BotIcon } from "./bot-icon";
import styles from "./bot-icon.module.css";
import { FormEvent, ReactNode, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { getJobs } from "@/entities/experience";
import { getProfile } from "@/entities/profile";
import { getProjects } from "@/entities/project";
import { getDictionary, Locale } from "@/shared/i18n";
import { tw } from "@/shared/lib/tw";
import { createLinkifier, Segment } from "./lib/linkify";
import { useDraggable } from "./lib/drag";
import { useProactiveGreeting } from "./lib/greeting";
import { DESKTOP_MIN_WIDTH, placePanel, useViewport } from "./lib/placement";
import { greet, speaking } from "./lib/speak";
import { CHAT_LIMITS, ChatError, ChatMessage } from "./model";

const ERRORS: readonly ChatError[] = ["rate_limited", "daily_limit", "unavailable", "generic"];
const toError = (code: unknown): ChatError => (ERRORS.includes(code as ChatError) ? (code as ChatError) : "generic");

const contacts = getProfile("en").contacts;
const email = contacts.find((c) => c.id === "email")!;
const telegram = contacts.find((c) => c.id === "telegram")!;

/** The owner's own contacts and project sites: the only things an answer may turn into links. */
const linkify = createLinkifier([
  ...contacts.map((c) => ({ text: c.display, href: c.href })),
  { text: telegram.href.replace("https://", ""), href: telegram.href },
  ...[...getJobs("en").flatMap((j) => j.liveSites), ...getProjects("en").flatMap((p) => p.links)].map((site) => ({
    text: site,
    href: `https://${site}`,
  })),
]);

const isExternal = (href: string) => href.startsWith("http");
const linkClass = "font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent";

/** One-tap ways to reach the owner, shown under an answer that mentions them and with "can't help" errors. */
function ContactButtons({ locale, label }: { locale: Locale; label: string }) {
  const t = getDictionary(locale).chat;
  const button =
    "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent motion-reduce:transition-none";
  return (
    <span role="group" aria-label={label} className="mt-2 flex flex-wrap gap-2">
      <a href={email.href} className={button} title={email.display}>
        <Mail aria-hidden size={15} />
        {t.emailButton}
      </a>
      <a href={telegram.href} target="_blank" rel="noopener noreferrer" className={button} title={telegram.display}>
        <Send aria-hidden size={15} />
        Telegram
        <span className="sr-only">{getDictionary(locale).newTab}</span>
      </a>
    </span>
  );
}

/** An answer with the owner's contacts and sites made clickable. */
function Answer({ segments }: { segments: Segment[] }) {
  return segments.map((s, i) =>
    s.href ? (
      <a
        key={i}
        href={s.href}
        className={linkClass}
        {...(isExternal(s.href) && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {s.text}
      </a>
    ) : (
      s.text
    )
  );
}

/**
 * "Ask AI about me": a small chat in the corner that answers from the resume through /api/chat.
 * Nothing is stored; closing the page clears the conversation.
 */
export function ChatWidget({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).chat;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [hint, setHint] = useState(false);
  const greeting = useProactiveGreeting(open);
  /** The robot can be dragged anywhere on screen; its bubbles open towards the free side. */
  const drag = useDraggable<HTMLDivElement>();
  const bubbleSide = drag.onLeftSide ? "left-full ml-2" : "right-full mr-2";
  /** On desktop the panel opens next to the robot; on phones it fills the screen. */
  const viewport = useViewport();
  const panelSpot = viewport && viewport.width >= DESKTOP_MIN_WIDTH ? placePanel(drag.offset, viewport) : undefined;
  /** True while the robot's greeting plays: its icons move their mouth, and the chat header zooms. */
  const talking = useSyncExternalStore(speaking.subscribe, speaking.get, () => false);
  /** The home view (greeting and cards) until the first question; then the conversation. */
  const home = messages.length === 0;
  const panelId = useId();
  const titleId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  /** Set when the ✕ or Escape closes the chat: focus then goes back to the robot. */
  const returnFocus = useRef(false);

  useEffect(() => {
    if (!open && returnFocus.current) {
      returnFocus.current = false;
      toggleRef.current?.focus();
    }
    if (!open) return;
    inputRef.current?.focus();
    // Escape closes the chat wherever focus is, e.g. after a suggestion button disappears.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        returnFocus.current = true;
        setOpen(false);
      }
    };
    // A press anywhere outside the panel closes it, leaving focus where the visitor clicked.
    const onPress = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, busy, error]);

  // Opening the chat is a click, which unlocks sound: the robot says hello here if it hasn't been
  // heard yet (on a fresh visit a hover can't play anything).
  function openChat() {
    setOpen(true);
    greet(t.spoken, locale);
  }

  /** Closes the chat and puts focus back on the robot once it is shown again. */
  function close() {
    returnFocus.current = true;
    setOpen(false);
  }

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setBusy(true);
    inputRef.current?.focus();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, locale }),
      });
      if (!response.ok || !response.body) {
        throw new Error(toError((await response.json().catch(() => ({}))).error));
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) throw new Error("generic");
    } catch (e) {
      setMessages(history);
      setError(e instanceof Error ? toError(e.message) : "generic");
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <>
      {/*
        One big round robot button. Hovering (or keyboard focus) shows a speech bubble with the
        label, and on the first hover the robot also says it out loud when the browser allows;
        the bubble works on its own when sound is off, blocked or unsupported.
      */}
      <div
        ref={drag.ref}
        style={{ translate: `${drag.offset.x}px ${drag.offset.y}px` }}
        // Hidden while the chat is open: the panel's ✕, Escape or a click outside close it.
        hidden={open}
        // Invisible until its stored spot is restored; then the robot rises out of a hole there.
        className={tw("fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6", !drag.ready && "invisible")}
      >
        {greeting.visible ? (
          // The proactive greeting: a real control (click to open the chat, ✕ to dismiss), so it
          // isn't hidden from assistive tech; announced once, politely.
          <div
            role="status"
            className={tw("absolute top-1/2 -translate-y-1/2", bubbleSide)}
            onMouseEnter={greeting.hold}
            onMouseLeave={greeting.release}
            onFocus={greeting.hold}
            onBlur={greeting.release}
          >
            <Bubble title={t.bubbleTitle} wide flip={drag.onLeftSide}>
              <button
                type="button"
                onClick={() => {
                  greeting.dismiss();
                  openChat();
                }}
                className="mt-0.5 block text-left text-[15px] leading-snug font-semibold text-strong hover:text-accent"
              >
                {t.greeting}
                <ClickHint click={t.clickHint} tap={t.tapHint} />
              </button>
              <button
                type="button"
                onClick={greeting.dismiss}
                aria-label={t.dismissGreeting}
                className={tw(
                  "absolute -top-2.5 flex size-7 items-center justify-center rounded-full border border-line bg-surface text-muted shadow hover:text-strong",
                  drag.onLeftSide ? "-right-2.5" : "-left-2.5"
                )}
              >
                <X aria-hidden size={14} />
              </button>
            </Bubble>
          </div>
        ) : (
          hint &&
          !open &&
          !drag.dragging && (
            <span aria-hidden className={tw("pointer-events-none absolute top-1/2 -translate-y-1/2", bubbleSide)}>
              <Bubble title={t.bubbleTitle} flip={drag.onLeftSide}>
                <span className="mt-0.5 block text-[15px] font-semibold whitespace-nowrap text-strong">{t.open}</span>
                <ClickHint click={t.clickHint} tap={t.tapHint} nowrap />
              </Bubble>
            </span>
          )
        )}
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? t.close : t.open}
          // Press and move to drag the robot; a press without moving is a normal click.
          {...drag.handlers}
          onClick={() => {
            if (drag.consumeDrag()) return;
            setHint(false);
            greeting.dismiss();
            if (open) close();
            else openChat();
          }}
          onMouseEnter={() => {
            setHint(true);
            greet(t.spoken, locale);
          }}
          onMouseLeave={() => setHint(false)}
          onFocus={(event) => setHint(event.currentTarget.matches(":focus-visible"))}
          onBlur={() => setHint(false)}
          onKeyDown={(event) => event.key === "Escape" && setHint(false)}
          // Just the robot, no circle: big enough to see it float, blink and wave.
          // data-waving makes the robot wave while it greets (bot-icon.module.css).
          data-waving={greeting.visible || undefined}
          className={tw(
            "group relative flex touch-none items-center justify-center rounded-full transition select-none motion-reduce:transition-none",
            "size-20 hover:scale-105 motion-reduce:hover:scale-100 sm:size-24",
            drag.dragging && "scale-110 cursor-grabbing motion-reduce:scale-100"
          )}
        >
          {drag.ready && <span aria-hidden className={styles.hole} />}
          <span className={tw("size-full", drag.ready && styles.rise)}>
            <span className={tw("block size-full", drag.ready && styles.riser)}>
              <BotIcon talking={talking} />
            </span>
          </span>
        </button>
      </div>

      {open && (
        <section
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          // About the size of a messenger panel (400 × up to 704px) on desktop, opening in the
          // robot's place; nearly full screen on phones.
          style={panelSpot}
          className={tw(
            styles.panel,
            "fixed inset-2 z-50 flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(44rem,calc(100dvh-3rem))] sm:w-[25rem]"
          )}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t.close}
            className={tw(
              "absolute top-3 right-3 z-10 rounded-full p-1.5",
              home ? "text-neutral-950 hover:bg-neutral-950/10" : "text-muted hover:bg-raised hover:text-strong"
            )}
          >
            <X aria-hidden size={20} />
          </button>

          <div ref={logRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto">
            {home ? (
              <>
                {/* Home: an orange header fading into the panel, with cards overlapping it. The top bar
                    stays pinned while the greeting and cards scroll under it, like the chat header. */}
                <header className="sticky top-0 z-5 bg-orange-500 px-6 pt-5 pb-3 text-neutral-950">
                  <h2 id={titleId} className="flex items-center gap-2 pr-10 text-lg leading-tight font-semibold">
                    {/* On a light chip: an orange robot would vanish on the orange header. It grows
                        while talking. */}
                    <span
                      className={tw(
                        "flex size-10 origin-left items-center justify-center rounded-full bg-white/90 shadow-sm transition-[scale,margin] duration-300 motion-reduce:transition-none",
                        talking && "mr-3.5 scale-135 motion-reduce:mr-0 motion-reduce:scale-100"
                      )}
                    >
                      <span className="size-8">
                        <BotIcon talking={talking} thinking={busy} stillArms />
                      </span>
                    </span>
                    {t.title}
                  </h2>
                </header>
                <div className="bg-linear-to-b from-orange-500 via-orange-500 via-68% to-surface px-6 pt-7 pb-20 text-neutral-950">
                  <p className="text-[28px] leading-tight font-bold tracking-tight">{t.homeHello}</p>
                  <p className="text-[28px] leading-tight font-bold tracking-tight opacity-80">{t.homeQuestion}</p>
                </div>

                <div className="-mt-12 space-y-3 px-4 pb-4">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.focus()}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-left shadow-md transition hover:border-accent motion-reduce:transition-none"
                  >
                    <span>
                      <span className="block text-[15px] font-semibold text-strong">{t.askTitle}</span>
                      <span className="block text-sm text-muted">{t.askSubtitle}</span>
                    </span>
                    <Send aria-hidden size={18} className="shrink-0 text-accent" />
                  </button>

                  <div className="rounded-xl border border-line bg-surface py-2 shadow-md">
                    <h3 className="px-4 pt-1 pb-1 text-xs font-semibold text-muted">{t.popular}</h3>
                    <ul>
                      {t.suggestions.map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            onClick={() => void ask(s)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-foreground transition hover:bg-raised hover:text-accent motion-reduce:transition-none"
                          >
                            {s}
                            <ChevronRight aria-hidden size={16} className="shrink-0 text-muted" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-line bg-surface px-4 py-3.5 shadow-md">
                    <p className="text-[15px] font-semibold text-strong">{t.humanTitle}</p>
                    <p className="text-sm text-muted">{t.humanSubtitle}</p>
                    <ContactButtons locale={locale} label={t.contactHim} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <header className="sticky top-0 z-5 flex items-center gap-2.5 border-b border-line bg-surface/95 px-4 py-3 pr-12 backdrop-blur">
                  <span
                    className={tw(
                      "size-9 shrink-0 origin-left transition-[scale,margin] duration-300 motion-reduce:transition-none",
                      talking && "mr-3 scale-135 motion-reduce:mr-0 motion-reduce:scale-100"
                    )}
                  >
                    <BotIcon talking={talking} thinking={busy} stillArms />
                  </span>
                  <span>
                    <h2 id={titleId} className="text-[15px] leading-tight font-semibold text-strong">
                      {t.title}
                    </h2>
                    <span className="block text-xs text-muted">{t.askSubtitle}</span>
                  </span>
                </header>
                <div className="space-y-3 px-4 py-4 text-sm">
                  <p className="leading-relaxed text-muted">{t.intro}</p>
                  {messages.map((m, i) =>
                    m.role === "user" ? (
                      <p key={i} className="ml-10 rounded-2xl rounded-br-sm bg-accent-soft px-3.5 py-2.5 wrap-break-word text-strong">
                        {m.content}
                      </p>
                    ) : (
                      <AssistantMessage key={i} content={m.content} locale={locale} />
                    )
                  )}
                </div>
              </>
            )}
            {error && (
              <p role="alert" className="mx-4 mb-4 rounded-lg border border-line px-3 py-2 text-sm text-foreground">
                {t.errors[error]}
                {(error === "daily_limit" || error === "unavailable") && (
                  <ContactButtons locale={locale} label={t.contactHim} />
                )}
              </p>
            )}
          </div>

          <form onSubmit={submit} className="border-t border-line px-3 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <label htmlFor={`${panelId}-input`} className="sr-only">
                {t.placeholder}
              </label>
              <input
                ref={inputRef}
                id={`${panelId}-input`}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={CHAT_LIMITS.maxQuestion}
                placeholder={t.placeholder}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-line bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t.send}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-neutral-950 hover:bg-orange-400 disabled:opacity-50"
              >
                <ArrowUp aria-hidden size={18} />
              </button>
            </div>
            <p className="mt-2 px-1 text-xs text-muted">{t.disclaimer}</p>
          </form>
        </section>
      )}
    </>
  );
}

function AssistantMessage({ content, locale }: { content: string; locale: Locale }) {
  const t = getDictionary(locale).chat;
  const segments = linkify(content);
  const mentionsContacts = segments.some((s) => s.href === email.href || s.href === telegram.href);
  return (
    <div className="mr-8">
      <p className="rounded-2xl rounded-bl-sm bg-raised px-3 py-2 leading-relaxed wrap-break-word whitespace-pre-line text-foreground">
        {content ? <Answer segments={segments} /> : <span className="text-muted">{t.thinking}</span>}
      </p>
      {mentionsContacts && <ContactButtons locale={locale} label={t.contactHim} />}
    </div>
  );
}

/** The robot's speech bubble: a small card with an "online" label and a tail pointing at the robot. */
/** "Click me to start a chat" (or "Tap me…" on touch screens) under a bubble's text. */
function ClickHint({ click, tap, nowrap }: { click: string; tap: string; nowrap?: boolean }) {
  return (
    <span className={tw("mt-1.5 flex items-start gap-1.5 text-xs font-medium text-muted", nowrap && "whitespace-nowrap")}>
      <MousePointerClick aria-hidden size={14} className="mt-px shrink-0 text-accent" />
      <span className="pointer-coarse:hidden">{click}</span>
      <span className="hidden pointer-coarse:inline">{tap}</span>
    </span>
  );
}

/** A speech bubble beside the robot; `flip` puts it on the robot's right, with the tail on its left. */
function Bubble({ title, wide, flip, children }: { title: string; wide?: boolean; flip?: boolean; children: ReactNode }) {
  return (
    <span
      className={tw(
        styles.bubble,
        flip && styles.flip,
        "relative block rounded-2xl border border-line bg-surface px-4 py-2.5 shadow-xl",
        wide && "w-[min(17rem,calc(100vw-7rem))]"
      )}
    >
      <span className="flex items-center gap-1.5 text-xs font-semibold text-accent">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:hidden" />
          <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
        </span>
        {title}
      </span>
      {children}
      {/* The tail, pointing at the robot: a rotated square sharing the card's border. */}
      <span
        className={tw(
          "absolute top-1/2 size-3 -translate-y-1/2 rotate-45 rounded-[3px] border-line bg-surface",
          flip ? "-left-[7px] border-b border-l" : "-right-[7px] border-t border-r"
        )}
      />
    </span>
  );
}
