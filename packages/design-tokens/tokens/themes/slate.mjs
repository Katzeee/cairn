import forest, { forestColors } from "./forest.mjs";

const unit = (steps) => `${steps * 3.5}px`;

// Cool ink-blue slate for dense, data-heavy tools: the forest structure on a 3.5px grid with sharper corners.
export default {
  label: "Slate",
  description: "A cool, compact theme for dense and data-heavy tools.",
  ...forestColors({
    background: ["#F4F6F8", "#0E1116"],
    gray: ["#5B6470", "#8B96A5"],
    accent: ["#24466E", "#8FB8E8"],
    info: ["#2F5E9E", "#8FB8E8"],
    success: ["#3F7D55", "#67D498"],
    warning: ["#8A6116", "#F0C96E"],
    danger: ["#B4403B", "#FF918C"],
  }),
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
    "item-height": "34px",
    "item-padding-inline": unit(2.5),
    "duration-standard": "120ms",
  },
  components: forest.components,
};
