import Color from "colorjs.io";

import { generateScale } from "./radix-scale.mjs";

const appearances = ["light", "dark"];

// Expands [light, dark] seed pairs into Radix-style 12-step scales, all generated against the
// background. A scale is read as scale(lightStep, darkStep = lightStep) and returns a [light, dark]
// pair; a step is "1"–"12", "a1"–"a12", or "contrast", the legible ink on step 9.
export function scales({ background, gray, ...seeds }) {
  const expand = (seed, neutral = false) => {
    const generated = appearances.map((appearance, index) =>
      generateScale({ appearance, seed: seed[index], background: background[index], neutral }),
    );
    const steps = generated.map(({ steps, alpha }) => ({
      ...Object.fromEntries(steps.map((hex, index) => [`${index + 1}`, hex])),
      ...Object.fromEntries(alpha.map((hex, index) => [`a${index + 1}`, hex])),
      contrast: legibleOn(steps[8]),
    }));
    return { background: generated.map((scale) => scale.background), read: (light, dark = light) => [steps[0][light], steps[1][dark]] };
  };
  const neutral = expand(gray, true);
  return {
    background: neutral.background,
    gray: neutral.read,
    ...Object.fromEntries(Object.entries(seeds).map(([name, seed]) => [name, expand(seed).read])),
  };
}

const radixToneSteps = {
  solid: "9",
  "solid-hover": "10",
  "on-solid": "contrast",
  subtle: "a3",
  "subtle-hover": "a4",
  "subtle-active": "a5",
  border: "a6",
  "border-strong": "a8",
  text: "a11",
};

// Binds every tone role to a scale step; a step may be a [light, dark] pair.
export function tone(scale, steps = {}) {
  return Object.fromEntries(
    Object.entries({ ...radixToneSteps, ...steps }).map(([role, step]) => [role, scale(...[step].flat())]),
  );
}

function legibleOn(step9) {
  const base = new Color(step9);
  const [, chroma, hue] = base.to("oklch").coords;
  const dark = new Color("oklch", [0.22, Math.max(0.08 * chroma, 0.03), hue || 0]).to("srgb").toString({ format: "hex" });
  const contrast = (candidate) => new Color(candidate).contrast(base, "WCAG21");
  return contrast("#ffffff") >= 4.5 || contrast("#ffffff") >= contrast(dark) ? "#ffffff" : dark;
}
