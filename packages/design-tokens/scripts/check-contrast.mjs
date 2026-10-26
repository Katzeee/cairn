import * as RadixColors from "@radix-ui/colors";
import Color from "colorjs.io";

import { tones } from "../tokens/contract.mjs";
import { themeNames, themes } from "../tokens/themes/index.mjs";

// A translucent background is composited over each layer it sits on. Neutral solid is a mid-gray
// indicator color; no component places text on it.
const contrastRequirements = [
  { text: "text", on: ["canvas"], minimum: 7 },
  { text: "text", on: ["surface", "overlay", "navigation"], minimum: 4.5 },
  { text: "text-muted", on: ["canvas", "surface", "overlay", "navigation"], minimum: 4.5 },
  { text: "on-inverse", on: ["inverse"], minimum: 4.5 },
  { text: "link", on: ["canvas", "surface"], minimum: 4.5 },
  { text: "text", on: ["hover"], over: ["surface", "overlay", "navigation"], minimum: 4.5 },
  { text: "selected-text", on: ["selected"], over: ["surface", "navigation"], minimum: 4.5 },
  { text: "on-primary", on: ["primary", "primary-hover"], minimum: 4.5 },
];
const toneContrastRequirements = [
  { text: "on-solid", on: "solid", minimum: 4.5, except: ["neutral"] },
  { text: "text", on: "subtle", over: ["surface"], minimum: 4.5, except: [] },
];

const filter = process.argv.slice(2);
let failures = 0;

for (const name of themeNames.filter((theme) => filter.length === 0 || filter.includes(theme))) {
  const theme = themes[name];
  const lines = [];
  for (const [index, appearance] of ["light", "dark"].entries()) {
    const read = (value) => parse(Array.isArray(value) ? value[index] : value);
    const canvas = read(theme.colors.canvas);
    const opaque = (color, base = canvas) => (color.alpha < 1 ? composite(color, opaque(base)) : color);
    const measure = (label, text, on, over, minimum) => {
      if (!text || !on || over?.some((layer) => !layer)) return lines.push(`  ${appearance}: ${label} skipped, a value is not a measurable color`);
      const background = over ? over.map((layer) => composite(on, opaque(layer))) : [opaque(on)];
      for (const base of background) {
        const ratio = composite(text, base).contrast(base, "WCAG21");
        if (ratio < minimum) {
          failures += 1;
          lines.push(`  ${appearance}: ${label} is ${ratio.toFixed(2)}, needs ${minimum}`);
        }
      }
    };
    for (const { text, on, over, minimum } of contrastRequirements) {
      for (const token of on) {
        const label = `${text} on ${token}${over ? ` over ${over.join("/")}` : ""}`;
        measure(label, read(theme.colors[text]), read(theme.colors[token]), over?.map((layer) => read(theme.colors[layer])), minimum);
      }
    }
    for (const { text, on, over, minimum, except } of toneContrastRequirements) {
      for (const tone of tones.filter((entry) => !except.includes(entry))) {
        const roles = theme.tones[tone];
        const label = `${tone}-${text} on ${tone}-${on}${over ? ` over ${over.join("/")}` : ""}`;
        measure(label, read(roles[text]), read(roles[on]), over?.map((layer) => read(theme.colors[layer])), minimum);
      }
    }
  }
  console.log(lines.length === 0 ? `${name}: every pair passes` : `${name}:\n${lines.join("\n")}`);
}

if (failures > 0) process.exitCode = 1;

function parse(value) {
  const alpha = value?.match(/^var\(--(black|white)-a(\d+)\)$/);
  const source = alpha ? RadixColors[`${alpha[1]}A`][`${alpha[1]}A${alpha[2]}`] : value;
  try {
    return new Color(source).to("srgb");
  } catch {
    return undefined;
  }
}

function composite(color, base) {
  if (color.alpha >= 1) return color;
  const coords = color.coords.map((channel, index) => channel * color.alpha + base.coords[index] * (1 - color.alpha));
  return new Color("srgb", coords);
}
