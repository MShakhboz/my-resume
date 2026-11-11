"use client";

import { useEffect, useRef } from "react";
import { sectionIds } from "@/shared/config";
import { getDictionary, Locale } from "@/shared/i18n";
import { tw } from "@/shared/lib/tw";
import { useActiveSection } from "./model";

type SectionNavProps = {
  /**
   * `sidebar`: vertical list with growing lines (desktop). `bar`: a row of text tabs (mobile) that
   * scrolls sideways when it doesn't fit, with the current section kept in view. Text, not icons:
   * a recruiter shouldn't have to guess what an icon means.
   */
  variant: "sidebar" | "bar";
  locale: Locale;
  className?: string;
};

export function SectionNav({ variant, locale, className }: SectionNavProps) {
  const active = useActiveSection(sectionIds);
  const t = getDictionary(locale);
  const listRef = useRef<HTMLUListElement>(null);

  // Scrolls the bar sideways (never the page) so the current section's tab stays visible.
  useEffect(() => {
    const list = listRef.current;
    if (variant !== "bar" || !list || !active) return;
    const tab = list.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!tab) return;
    const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    list.scrollTo?.({ left: Math.max(0, left), behavior: "smooth" });
  }, [active, variant]);

  return (
    <nav aria-label={t.sectionsNav} className={className}>
      <ul
        ref={listRef}
        className={
          variant === "sidebar"
            ? "space-y-1"
            : "flex items-center gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
        }
      >
        {sectionIds.map((id) => {
          const label = t.nav[id];
          const current = id === active;
          return (
            <li key={id}>
              {variant === "sidebar" ? (
                <a href={`#${id}`} aria-current={current ? "location" : undefined} className="group flex items-center gap-4 py-2">
                  <span
                    aria-hidden
                    className={tw(
                      "h-px transition-all motion-reduce:transition-none",
                      current
                        ? "w-16 bg-accent"
                        : "w-8 bg-subtle group-hover:w-16 group-hover:bg-foreground"
                    )}
                  />
                  <span
                    className={tw(
                      "text-xs font-bold uppercase tracking-widest transition-colors",
                      current ? "text-strong" : "text-muted group-hover:text-strong"
                    )}
                  >
                    {label}
                  </span>
                </a>
              ) : (
                <a
                  href={`#${id}`}
                  aria-current={current ? "location" : undefined}
                  className={tw(
                    "flex min-h-11 items-center rounded-lg px-3 text-sm font-medium whitespace-nowrap transition",
                    current
                      ? "bg-raised text-strong"
                      : "text-muted hover:bg-raised hover:text-strong"
                  )}
                >
                  {label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
