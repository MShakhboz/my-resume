"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";

// Lets the visitor move the chat robot anywhere on the screen by dragging it (mouse, pen or
// finger). A press that moves less than DRAG_THRESHOLD_PX is still a click, so it opens the chat.
// The spot is kept in localStorage, a per-visitor convenience: without it the robot sits in its
// corner.

export const DRAG_THRESHOLD_PX = 6;
/** The smallest gap kept between the robot and the edges of the screen. */
export const EDGE_MARGIN_PX = 8;
const STORAGE_KEY = "chat-launcher-offset";

export type Offset = { x: number; y: number };
type Rect = { left: number; top: number; right: number; bottom: number };

/**
 * Keeps an element inside the viewport. `home` is where the element sits with no offset; the
 * result is the nearest offset that leaves EDGE_MARGIN_PX free on every side.
 */
export function clampOffset(offset: Offset, home: Rect, viewport: { width: number; height: number }): Offset {
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));
  return {
    x: clamp(offset.x, EDGE_MARGIN_PX - home.left, viewport.width - EDGE_MARGIN_PX - home.right),
    y: clamp(offset.y, EDGE_MARGIN_PX - home.top, viewport.height - EDGE_MARGIN_PX - home.bottom),
  };
}

function readStored(): Offset {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) return { x: value.x, y: value.y };
  } catch {
    // Storage blocked or the value is broken: start in the corner.
  }
  return { x: 0, y: 0 };
}

function store(offset: Offset) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offset));
  } catch {
    // Private window or blocked storage: the robot just won't remember its spot.
  }
}

/**
 * Drag handling for the element `ref` points at, which is moved with `translate` by `offset`.
 * Spread `handlers` on the part that is grabbed. Call `consumeDrag()` in its click handler: it
 * returns true (and resets) when the click only ended a drag, so the click should be ignored.
 * `onLeftSide` tells which half of the screen the element is in, so popups can open towards the
 * free side.
 */
export function useDraggable<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [onLeftSide, setOnLeftSide] = useState(false);
  /** False until the stored spot is restored: keep the element hidden till then, so it doesn't
      show in the corner first and then jump. */
  const [ready, setReady] = useState(false);
  const gesture = useRef<{ id: number; startX: number; startY: number; from: Offset; home: Rect } | null>(null);
  const dragged = useRef(false);
  /** The latest offset, for saving it when a drag ends. */
  const latest = useRef<Offset>({ x: 0, y: 0 });

  /** Where the element sits with no offset, measured from where it is now. */
  const homeRect = useCallback((current: Offset): Rect | null => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      left: rect.left - current.x,
      top: rect.top - current.y,
      right: rect.right - current.x,
      bottom: rect.bottom - current.y,
    };
  }, []);

  const place = useCallback(
    (next: Offset, home: Rect | null) => {
      const clamped = home ? clampOffset(next, home, { width: innerWidth, height: innerHeight }) : next;
      latest.current = clamped;
      setOffset(clamped);
      if (home) setOnLeftSide((home.left + home.right) / 2 + clamped.x < innerWidth / 2);
      return clamped;
    },
    []
  );

  // Restore the stored spot after the first render (the server can't know it), and keep the robot
  // on screen when the window is resized or a phone is rotated.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      place(readStored(), homeRect({ x: 0, y: 0 }));
      setReady(true);
    });
    const onResize = () => place(latest.current, homeRect(latest.current));
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", onResize);
    };
  }, [place, homeRect]);

  const handlers = {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0) return;
      const home = homeRect(offset);
      if (!home) return;
      gesture.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, from: offset, home };
      dragged.current = false;
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const g = gesture.current;
      if (!g || g.id !== event.pointerId) return;
      const dx = event.clientX - g.startX;
      const dy = event.clientY - g.startY;
      if (!dragged.current) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
        dragged.current = true;
        setDragging(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
      place({ x: g.from.x + dx, y: g.from.y + dy }, g.home);
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      const g = gesture.current;
      if (!g || g.id !== event.pointerId) return;
      gesture.current = null;
      if (dragged.current) {
        setDragging(false);
        store(latest.current);
      }
    },
    onPointerCancel() {
      gesture.current = null;
      setDragging(false);
    },
  };

  const consumeDrag = () => {
    const was = dragged.current;
    dragged.current = false;
    return was;
  };

  return { ref, offset, dragging, onLeftSide, ready, handlers, consumeDrag };
}
