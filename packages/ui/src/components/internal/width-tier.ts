import breakpoints from "../breakpoints.json" with { type: "json" };

export type WidthTier = "compact" | "medium" | "expanded";

// Regions adapt to their own width on the shared breakpoint scale, so a region inside a resizable
// preview or beside a docked sidebar adapts the way a window does.
export const widthTierFor = (width: number): WidthTier =>
  width < breakpoints.sm ? "compact" : width < breakpoints.md ? "medium" : "expanded";
