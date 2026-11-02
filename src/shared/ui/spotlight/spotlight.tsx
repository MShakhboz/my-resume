"use client";

import { useEffect, useRef } from "react";

/** A soft accent glow that follows the pointer on large screens. Purely decorative. */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      el.style.setProperty("--spot-x", `${event.clientX}px`);
      el.style.setProperty("--spot-y", `${event.clientY}px`);
      el.style.opacity = "1";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="spotlight pointer-events-none fixed inset-0 -z-10 hidden opacity-0 transition-opacity duration-700 lg:block"
    />
  );
}
