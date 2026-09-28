import forest from "./forest.mjs";

const unit = (steps) => `${steps * 3.5}px`;

// Cool ink-blue slate for dense, data-heavy tools: the forest structure on a 3.5px grid with sharper corners.
export default {
  label: "Slate",
  description: "A cool, compact theme for dense and data-heavy tools.",
  colors: {
    accent: { light: "#24466E", dark: "#8FB8E8" },
    gray: { light: "#5B6470", dark: "#8B96A5" },
    background: { light: "#F4F6F8", dark: "#0E1116" },
    info: { light: "#2F5E9E", dark: "#8FB8E8" },
    success: forest.colors.success,
    warning: forest.colors.warning,
    danger: forest.colors.danger,
    toneSteps: forest.colors.toneSteps,
  },
  tokens: {
    ...forest.tokens,
    "heading-letter-spacing": "-0.01em",
    "space-1": unit(1),
    "space-2": unit(2),
    "space-3": unit(3),
    "space-4": unit(4),
    "space-5": unit(6),
    "space-6": unit(8),
    "space-7": unit(10),
    "space-8": unit(12),
    "space-9": unit(16),
    "radius-selection": "2px",
    "radius-indicator": "2px",
    "radius-control": "4px",
    "radius-item": "4px",
    "radius-panel": "6px",
    "radius-card": "8px",
    "radius-dialog": "8px",
    "control-height-sm": unit(8),
    "control-height-md": unit(10),
    "control-height-lg": unit(12),
    "control-padding-sm": unit(3),
    "control-padding-md": unit(4),
    "control-padding-lg": unit(6),
    "duration-standard": "120ms",
  },
};
