import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Layout props compile to breakpoint-prefixed utility classes; values outside a fixed
// scale flow through a custom property set inline by the component.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "src", "styles", "generated");
const breakpoints = { initial: 0, xs: 520, sm: 768, md: 1024, lg: 1280, xl: 1640 };

const keywords = (property, values, rename = {}) =>
  Object.fromEntries(values.map((value) => [value, `${property}:${rename[value] ?? value}`]));
const alignments = ["start", "center", "end", "baseline", "stretch"];
const overflows = ["visible", "hidden", "clip", "scroll", "auto"];
const space = (step) => (step === "0" ? "0px" : `var(--cairn-space-${step})`);
const steps = Array.from({ length: 10 }, (_, index) => String(index));

const rules = {
  display: keywords("display", ["none", "inline", "inline-block", "block", "contents", "flex", "inline-flex", "grid", "inline-grid"]),
  fd: keywords("flex-direction", ["row", "column", "row-reverse", "column-reverse"]),
  ai: keywords("align-items", alignments),
  jc: keywords("justify-content", ["start", "center", "end", "between"], { between: "space-between" }),
  fw: keywords("flex-wrap", ["nowrap", "wrap", "wrap-reverse"]),
  gaf: keywords("grid-auto-flow", ["row", "column", "dense", "row-dense", "column-dense"], {
    "row-dense": "row dense",
    "column-dense": "column dense",
  }),
  ac: keywords("align-content", [...alignments, "between", "around", "evenly"], {
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  }),
  ji: keywords("justify-items", alignments),
  as: keywords("align-self", alignments),
  js: keywords("justify-self", alignments),
  position: keywords("position", ["static", "relative", "absolute", "fixed", "sticky"]),
  overflow: keywords("overflow", overflows),
  ox: keywords("overflow-x", overflows),
  oy: keywords("overflow-y", overflows),
  fg: { 0: "flex-grow:0", 1: "flex-grow:1" },
  fs: { 0: "flex-shrink:0", 1: "flex-shrink:1" },
};
const spaced = { p: "padding", px: "padding-inline", py: "padding-block", pt: "padding-top", pr: "padding-right", pb: "padding-bottom", pl: "padding-left", gap: "gap", cg: "column-gap", rg: "row-gap" };
for (const [prop, css] of Object.entries(spaced)) {
  rules[prop] = Object.fromEntries(steps.map((step) => [step, `${css}:${space(step)}`]));
}
for (const prop of ["inset", "top", "right", "bottom", "left"]) {
  rules[prop] = Object.fromEntries(
    [...steps, ...steps.slice(1).map((step) => `-${step}`)].map((step) => [
      step,
      `${prop}:${step.startsWith("-") ? `calc(-1 * ${space(step.slice(1))})` : space(step)}`,
    ]),
  );
}
for (const prop of ["gtc", "gtr"]) {
  const property = prop === "gtc" ? "grid-template-columns" : "grid-template-rows";
  rules[prop] = Object.fromEntries(steps.slice(1).map((count) => [count, `${property}:repeat(${count},minmax(0,1fr))`]));
}

const custom = {
  ...spaced,
  w: "width",
  "min-w": "min-width",
  "max-w": "max-width",
  h: "height",
  "min-h": "min-height",
  "max-h": "max-height",
  inset: "inset",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  fb: "flex-basis",
  fg: "flex-grow",
  fs: "flex-shrink",
  ga: "grid-area",
  gc: "grid-column",
  gcs: "grid-column-start",
  gce: "grid-column-end",
  gr: "grid-row",
  grs: "grid-row-start",
  gre: "grid-row-end",
  gta: "grid-template-areas",
  gtc: "grid-template-columns",
  gtr: "grid-template-rows",
};

let css = "";
for (const [point, min] of Object.entries(breakpoints)) {
  const prefix = point === "initial" ? "" : `${point}\\:`;
  let block = "";
  for (const [prop, values] of Object.entries(rules)) {
    for (const [value, declaration] of Object.entries(values)) block += `.${prefix}cairn-r-${prop}-${value}{${declaration}}\n`;
  }
  for (const [prop, property] of Object.entries(custom)) {
    block += `.${prefix}cairn-r-${prop}{${property}:var(--${prop}${point === "initial" ? "" : `-${point}`})}\n`;
  }
  css += min === 0 ? block : `@media (min-width:${min}px){\n${block}}\n`;
}

await mkdir(output, { recursive: true });
await writeFile(join(output, "responsive.css"), css);
