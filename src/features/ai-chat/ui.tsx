"use client";

import { ArrowUp, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { getDictionary, Locale } from "@/shared/i18n";
import { tw } from "@/shared/lib/tw";
import { CHAT_LIMITS, ChatMessage } from "./model";

type ErrorKey = "rate_limited" | "unavailable" | "generic";

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
  const [error, setError] = useState<ErrorKey | null>(null);
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
        const code = (await response.json().catch(() => ({}))).error;
        throw new Error(code === "rate_limited" || code === "unavailable" ? code : "generic");
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
      setError(e instanceof Error && (e.message === "rate_limited" || e.message === "unavailable") ? e.message : "generic");
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
        className={tw(
          "fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-neutral-950 shadow-lg transition hover:bg-orange-400 motion-reduce:transition-none sm:right-6 sm:bottom-6",
          open && "hidden sm:inline-flex"
        )}
      >
        {open ? <X aria-hidden size={18} /> : <Sparkles aria-hidden size={18} />}
        <span>{open ? t.close : t.open}</span>
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
                <p
                  key={i}
                  className="mr-8 rounded-2xl rounded-bl-sm bg-raised px-3 py-2 leading-relaxed wrap-break-word whitespace-pre-line text-foreground"
                >
                  {m.content || <span className="text-muted">{t.thinking}</span>}
                </p>
              )
            )}
            {error && (
              <p role="alert" className="rounded-lg border border-line px-3 py-2 text-foreground">
                {t.errors[error]}
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
