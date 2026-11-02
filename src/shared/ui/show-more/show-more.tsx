"use client";

import { ChevronDown } from "lucide-react";
import { ReactNode, useId, useState } from "react";
import { tw } from "@/shared/lib/tw";

type ShowMoreProps = {
  children: ReactNode;
  /** Button text while collapsed, e.g. "View 4 more projects". */
  moreLabel: string;
  /** Button text while expanded. */
  lessLabel: string;
};

/** Hides extra content behind a toggle button. The content stays in the HTML, so search engines still see it. */
export function ShowMore({ children, moreLabel, lessLabel }: ShowMoreProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <>
      <div id={id} hidden={!open}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="mt-12 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-raised px-4 py-2 text-sm font-medium text-foreground transition hover:bg-raised-hover hover:text-strong"
      >
        {open ? lessLabel : moreLabel}
        <ChevronDown
          aria-hidden
          size={16}
          className={tw("transition-transform motion-reduce:transition-none", open && "rotate-180")}
        />
      </button>
    </>
  );
}
