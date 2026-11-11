"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The robot greets each visitor once, on its own: phones have no hover, so without this most
// mobile visitors would never learn what the robot does.

export const GREETING_DELAY_MS = 4_000;
export const GREETING_VISIBLE_MS = 6_000;
const STORAGE_KEY = "ai-chat-greeted";

const alreadyGreeted = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false; // storage blocked: greet, but only once in this page view
  }
};

const rememberGreeted = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage can be blocked (private mode); the greeting then shows once per page view.
  }
};

/**
 * Shows the greeting GREETING_DELAY_MS after load, once per browser session, and hides it after
 * GREETING_VISIBLE_MS. While the visitor hovers or focuses it, it stays (WCAG 2.2.1). Opening the
 * chat hides it; call `dismiss` then so it doesn't come back when the chat closes.
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
    if (alreadyGreeted()) return;
    const showTimer = setTimeout(() => {
      rememberGreeted();
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
    dismiss: () => {
      rememberGreeted();
      setVisible(false);
    },
    hold: () => {
      held.current = true;
    },
    release: () => {
      held.current = false;
      scheduleHide();
    },
  };
}
