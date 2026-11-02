"use client";

import { Briefcase, GraduationCap, Mail, User, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { navItems, SectionId } from "@/shared/config";
import { tw } from "@/shared/lib/tw";
import { useActiveSection } from "./model";

const icons: Record<SectionId, LucideIcon> = {
  about: User,
  experience: Briefcase,
  skills: Wrench,
  education: GraduationCap,
  contact: Mail,
};

const sectionIds = navItems.map((item) => item.id);

type SectionNavProps = {
  /** `sidebar`: vertical list with growing lines (desktop). `bar`: icon row (mobile). */
  variant: "sidebar" | "bar";
  className?: string;
};

export function SectionNav({ variant, className }: SectionNavProps) {
  const active = useActiveSection(sectionIds);

  return (
    <nav aria-label="Sections" className={className}>
      <ul
        className={
          variant === "sidebar"
            ? "space-y-1"
            : "flex items-center justify-between gap-1 sm:justify-start sm:gap-2"
        }
      >
        {navItems.map(({ id, label }) => {
          const current = id === active;
          const Icon = icons[id];
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
                    "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition sm:px-3",
                    current
                      ? "bg-raised text-strong"
                      : "text-muted hover:bg-raised hover:text-strong"
                  )}
                >
                  <Icon aria-hidden size={18} />
                  <span className="sr-only sm:not-sr-only">{label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
