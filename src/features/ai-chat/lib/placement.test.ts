import { describe, expect, it } from "vitest";
import { EDGE_MARGIN_PX } from "./drag";
import { LAUNCHER_INSET, LAUNCHER_SIZE, PANEL_GAP, PANEL_WIDTH, placePanel } from "./placement";

describe("placePanel (the chat opens next to the robot)", () => {
  const screen = { width: 1440, height: 900 };
  const robotTop = (y: number) => screen.height - LAUNCHER_INSET - LAUNCHER_SIZE + y;

  it("opens above the robot in its usual corner, lined up with its right edge", () => {
    const spot = placePanel({ x: 0, y: 0 }, screen);
    expect(spot.left + PANEL_WIDTH).toBe(screen.width - LAUNCHER_INSET);
    expect(spot.top + spot.height).toBe(robotTop(0) - PANEL_GAP);
  });

  it("follows the robot to the left half, lining up with its left edge", () => {
    const spot = placePanel({ x: -1200, y: 0 }, screen);
    expect(spot.left).toBe(screen.width - LAUNCHER_INSET - LAUNCHER_SIZE - 1200);
  });

  it("opens below a robot near the top of the screen", () => {
    const y = -(screen.height - LAUNCHER_INSET - LAUNCHER_SIZE - EDGE_MARGIN_PX);
    const spot = placePanel({ x: 0, y }, screen);
    expect(spot.top).toBe(robotTop(y) + LAUNCHER_SIZE + PANEL_GAP);
  });

  it("opens beside a robot in the middle of a short screen, and stays on screen", () => {
    const short = { width: 1440, height: 700 };
    const spot = placePanel({ x: -400, y: -250 }, short);
    const robotLeft = short.width - LAUNCHER_INSET - LAUNCHER_SIZE - 400;
    expect(spot.left + PANEL_WIDTH).toBe(robotLeft - PANEL_GAP);
    expect(spot.top).toBeGreaterThanOrEqual(EDGE_MARGIN_PX);
    expect(spot.top + spot.height).toBeLessThanOrEqual(short.height - EDGE_MARGIN_PX);
  });
});
