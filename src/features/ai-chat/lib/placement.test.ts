import { describe, expect, it } from "vitest";
import { EDGE_MARGIN_PX } from "./drag";
import { LAUNCHER_INSET, LAUNCHER_SIZE, PANEL_WIDTH, placePanel } from "./placement";

describe("placePanel (the chat opens in the robot's place)", () => {
  const screen = { width: 1440, height: 900 };
  const robotBottom = (y: number) => screen.height - LAUNCHER_INSET + y;

  it("takes the robot's corner: bottom and right edges where the robot's were", () => {
    const spot = placePanel({ x: 0, y: 0 }, screen);
    expect(spot.left + PANEL_WIDTH).toBe(screen.width - LAUNCHER_INSET);
    expect(spot.top + spot.height).toBe(robotBottom(0));
    expect(spot.transformOrigin).toBe("right bottom");
  });

  it("lines up with the robot's left edge on the left half of the screen", () => {
    const spot = placePanel({ x: -1200, y: -100 }, screen);
    expect(spot.left).toBe(screen.width - LAUNCHER_INSET - LAUNCHER_SIZE - 1200);
    expect(spot.top + spot.height).toBe(robotBottom(-100));
    expect(spot.transformOrigin).toBe("left bottom");
  });

  it("slides down to stay on screen when the robot is near the top", () => {
    const y = -(screen.height - LAUNCHER_INSET - LAUNCHER_SIZE - EDGE_MARGIN_PX);
    const spot = placePanel({ x: 0, y }, screen);
    expect(spot.top).toBe(EDGE_MARGIN_PX);
    expect(spot.top + spot.height).toBeLessThanOrEqual(screen.height - EDGE_MARGIN_PX);
  });
});
