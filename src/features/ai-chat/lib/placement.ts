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

type Viewport = { width: number; height: number };

/** The panel's height for a screen: up to PANEL_MAX_HEIGHT, keeping the robot's inset free. */
export const panelHeight = ({ height }: Viewport) => Math.min(PANEL_MAX_HEIGHT, height - 2 * LAUNCHER_INSET);

/**
 * The panel's top-left corner. It opens in the robot's place (the robot hides while it's open):
 * its bottom edge where the robot's bottom was, lined up with the robot's outer side (its right
 * edge on the right half of the screen, its left edge on the left half), and grows out of that
 * corner (`transformOrigin`). It always stays on screen, sliding down when the robot is near the top.
 */
export function placePanel(offset: Offset, viewport: Viewport) {
  const { width: vw, height: vh } = viewport;
  const width = PANEL_WIDTH;
  const height = panelHeight(viewport);
  const robot = {
    left: vw - LAUNCHER_INSET - LAUNCHER_SIZE + offset.x,
    right: vw - LAUNCHER_INSET + offset.x,
    bottom: vh - LAUNCHER_INSET + offset.y,
  };
  const onRight = (robot.left + robot.right) / 2 >= vw / 2;
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));
  const left = clamp(onRight ? robot.right - width : robot.left, EDGE_MARGIN_PX, vw - EDGE_MARGIN_PX - width);
  const top = clamp(robot.bottom - height, EDGE_MARGIN_PX, vh - EDGE_MARGIN_PX - height);
  return { left, top, height, transformOrigin: `${onRight ? "right" : "left"} bottom` };
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
