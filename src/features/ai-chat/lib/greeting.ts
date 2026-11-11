"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The robot greets the visitor every time the page loads, as soon as it shows: phones have no
// hover, so without this most mobile visitors would never learn what the robot does.

/** Once the robot has risen out of its hole (bot-icon.module.css), so the bubble pops in after it. */
export const GREETING_DELAY_MS = 1_000;
export const GREETING_VISIBLE_MS = 8_000;

/**
 * Shows the greeting right after each page load and hides it after GREETING_VISIBLE_MS. While the
 * visitor hovers or focuses it, it stays (WCAG 2.2.1). Opening the chat hides it; call `dismiss`
 * then so it doesn't come back when the chat closes.
 */
export function useProactiveGreeting(chatOpen: boolean) {
  const [visible, setVisible] = useState(false);
  const held = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!held.current) setVisible(false);
    }, GREETING_VISIBLE_MS);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      scheduleHide();
    }, GREETING_DELAY_MS);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer.current);
    };
  }, [scheduleHide]);

  return {
    visible: visible && !chatOpen,
    dismiss: () => setVisible(false),
    hold: () => {
      held.current = true;
    },
    release: () => {
      held.current = false;
      scheduleHide();
    },
  };
}
