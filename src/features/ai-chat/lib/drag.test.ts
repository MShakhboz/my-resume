import { describe, expect, it } from "vitest";
import { clampOffset, EDGE_MARGIN_PX } from "./drag";

describe("clampOffset (keeps the dragged robot on screen)", () => {
  // An 80px robot in the bottom-right corner of a 1000 × 800 screen.
  const home = { left: 896, top: 696, right: 976, bottom: 776 };
  const viewport = { width: 1000, height: 800 };

  it("leaves a move inside the screen alone", () => {
    expect(clampOffset({ x: -300, y: -200 }, home, viewport)).toEqual({ x: -300, y: -200 });
  });

  it("stops at every edge, keeping a small margin", () => {
    expect(clampOffset({ x: -5000, y: -5000 }, home, viewport)).toEqual({
      x: EDGE_MARGIN_PX - home.left,
      y: EDGE_MARGIN_PX - home.top,
    });
    expect(clampOffset({ x: 5000, y: 5000 }, home, viewport)).toEqual({
      x: viewport.width - EDGE_MARGIN_PX - home.right,
      y: viewport.height - EDGE_MARGIN_PX - home.bottom,
    });
  });

  it("pulls the robot back in when the screen gets smaller", () => {
    const phone = { width: 360, height: 640 };
    const { x, y } = clampOffset({ x: 0, y: 0 }, home, phone);
    expect(home.right + x).toBeLessThanOrEqual(phone.width - EDGE_MARGIN_PX);
    expect(home.bottom + y).toBeLessThanOrEqual(phone.height - EDGE_MARGIN_PX);
  });
});
