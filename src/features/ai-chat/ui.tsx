"use client";

import { ArrowUp, Mail, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { getJobs } from "@/entities/experience";
import { getProfile } from "@/entities/profile";
import { getProjects } from "@/entities/project";
import { getDictionary, Locale } from "@/shared/i18n";
import { tw } from "@/shared/lib/tw";
import { createLinkifier, Segment } from "./lib/linkify";
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
  const panelId = useId();
  const titleId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    // Escape closes the chat wherever focus is, e.g. after a suggestion button disappears.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, busy, error]);

  function close() {
    setOpen(false);
    toggleRef.current?.focus();
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
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
        // On phones a round icon button (52px), so it doesn't cover the text being read; the label
        // shows from sm up and stays available to screen readers at every size.
        className={tw(
          "fixed right-4 bottom-4 z-50 inline-flex size-13 items-center justify-center gap-2 rounded-full bg-orange-500 text-sm font-semibold text-neutral-950 shadow-lg transition hover:bg-orange-400 motion-reduce:transition-none sm:right-6 sm:bottom-6 sm:size-auto sm:px-4 sm:py-3",
          open && "hidden sm:inline-flex"
        )}
      >
        {open ? <X aria-hidden size={20} /> : <Sparkles aria-hidden size={20} />}
        <span className="sr-only sm:not-sr-only">{open ? t.close : t.open}</span>
      </button>

      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(36rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-22 sm:w-[24rem]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <h2 id={titleId} className="inline-flex items-center gap-2 font-semibold text-strong">
              <Sparkles aria-hidden size={16} className="text-accent" />
              {t.title}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className="rounded-full p-1.5 text-muted hover:bg-raised hover:text-strong"
            >
              <X aria-hidden size={18} />
            </button>
          </header>

          <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            <p className="leading-relaxed text-body">{t.intro}</p>
            {messages.length === 0 && (
              <ul aria-label={t.title} className="flex flex-wrap gap-2">
                {t.suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => void ask(s)}
                      className="rounded-full border border-line bg-raised px-3 py-1.5 text-left text-foreground hover:border-accent hover:text-accent"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p key={i} className="ml-8 rounded-2xl rounded-br-sm bg-accent-soft px-3 py-2 wrap-break-word text-strong">
                  {m.content}
                </p>
              ) : (
                <AssistantMessage key={i} content={m.content} locale={locale} />
              )
            )}
            {error && (
              <p role="alert" className="rounded-lg border border-line px-3 py-2 text-foreground">
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
                className="min-w-0 flex-1 rounded-full border border-line bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t.send}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-neutral-950 hover:bg-orange-400 disabled:opacity-50"
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
