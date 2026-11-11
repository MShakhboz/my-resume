"use client";

import { useSyncExternalStore } from "react";
import { EDGE_MARGIN_PX, Offset } from "./drag";

// Where the chat panel opens on desktop: next to the robot, wherever it was dragged. On phones the
// panel fills the screen instead, so none of this applies there.

/** Tailwind's `sm` breakpoint, from which the panel floats instead of filling the screen. */
export const DESKTOP_MIN_WIDTH = 640;
/** The robot on desktop: `size-20`, `right-6 bottom-6`. */
export const LAUNCHER_SIZE = 80;
export const LAUNCHER_INSET = 24;
/** The panel: 25rem wide, up to 44rem tall (about a messenger panel). */
export const PANEL_WIDTH = 400;
export const PANEL_MAX_HEIGHT = 704;
/** The gap between the robot and the panel. */
export const PANEL_GAP = 8;

type Viewport = { width: number; height: number };

/** The panel's height for a screen: as tall as it can be while leaving room for the robot. */
export const panelHeight = ({ height }: Viewport) => Math.min(PANEL_MAX_HEIGHT, height - 136);

/**
 * The panel's top-left corner. It opens above the robot, lined up with the robot's outer edge (its
 * right edge on the right half of the screen, its left edge on the left half). If there is no room
 * above, it opens below; if there is no room below either, beside the robot. It always stays on
 * screen.
 */
export function placePanel(offset: Offset, viewport: Viewport) {
  const { width: vw, height: vh } = viewport;
  const width = PANEL_WIDTH;
  const height = panelHeight(viewport);
  const robot = {
    left: vw - LAUNCHER_INSET - LAUNCHER_SIZE + offset.x,
    top: vh - LAUNCHER_INSET - LAUNCHER_SIZE + offset.y,
    right: vw - LAUNCHER_INSET + offset.x,
    bottom: vh - LAUNCHER_INSET + offset.y,
  };
  const onRight = (robot.left + robot.right) / 2 >= vw / 2;
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));
  const clampX = (x: number) => clamp(x, EDGE_MARGIN_PX, vw - EDGE_MARGIN_PX - width);
  const fits = (top: number) => top >= EDGE_MARGIN_PX && top + height <= vh - EDGE_MARGIN_PX;

  const above = robot.top - PANEL_GAP - height;
  if (fits(above)) return { left: clampX(onRight ? robot.right - width : robot.left), top: above, height };
  const below = robot.bottom + PANEL_GAP;
  if (fits(below)) return { left: clampX(onRight ? robot.right - width : robot.left), top: below, height };
  return {
    left: clampX(onRight ? robot.left - PANEL_GAP - width : robot.right + PANEL_GAP),
    top: clamp((robot.top + robot.bottom) / 2 - height / 2, EDGE_MARGIN_PX, vh - EDGE_MARGIN_PX - height),
    height,
  };
}

const subscribe = (onChange: () => void) => {
  addEventListener("resize", onChange);
  return () => removeEventListener("resize", onChange);
};
const snapshot = () => `${innerWidth}x${innerHeight}`;

/** The window size, kept up to date; null while rendering on the server. */
export function useViewport(): Viewport | null {
  const size = useSyncExternalStore(subscribe, snapshot, () => null);
  if (!size) return null;
  const [width, height] = size.split("x").map(Number);
  return { width, height };
}
