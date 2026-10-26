/* Ported from radix-ui/website components/generate-radix-colors.tsx (MIT). */
import * as RadixColors from "@radix-ui/colors";
import BezierEasing from "bezier-easing";
import Color from "colorjs.io";

const grayScaleNames = ["gray", "mauve", "slate", "sage", "olive", "sand"];
const scaleNames = [...grayScaleNames, "tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet", "iris",
  "indigo", "blue", "cyan", "teal", "jade", "green", "grass", "brown", "orange", "sky", "mint", "lime", "yellow", "amber"];
const load = (names, suffix) =>
  Object.fromEntries(names.map((name) => [name, Object.values(RadixColors[`${name}${suffix}`]).map((value) => new Color(value).to("oklch"))]));
const radixScales = { light: load(scaleNames, "P3"), dark: load(scaleNames, "DarkP3") };
const radixGrays = { light: load(grayScaleNames, "P3"), dark: load(grayScaleNames, "DarkP3") };
const darkModeEasing = [1, 0, 1, 0];
const lightModeEasing = [0, 2, 0, 2];

// One 12-step scale and its alpha steps against the background. A neutral scale blends only Radix
// grays and keeps steps 9–12 as blended; any other scale puts its seed at step 9.
export function generateScale({ appearance, seed, background, neutral = false }) {
  const backgroundColor = new Color(background).to("oklch");
  const source = new Color(seed).to("oklch");
  const scale = getScaleFromColor(source, (neutral ? radixGrays : radixScales)[appearance], backgroundColor);
  if (!neutral) {
    scale[8] = getStep9Color(scale, source);
    scale[9] = getButtonHoverColor(scale[8], [scale]);
    const chroma = Math.max(scale[8].coords[1], scale[7].coords[1]);
    scale[10].coords[1] = Math.min(chroma, scale[10].coords[1]);
    scale[11].coords[1] = Math.min(chroma, scale[11].coords[1]);
  }
  const backgroundHex = backgroundColor.to("srgb").toString({ format: "hex" });
  const steps = scale.map((color) => color.to("srgb").toString({ format: "hex" }));
  return { background: backgroundHex, steps, alpha: steps.map((hex) => getAlphaColorSrgb(hex, backgroundHex)) };
}

function getStep9Color(scale, source) {
  return source.deltaEOK(scale[0]) * 100 < 25 ? scale[8] : source;
}

function getButtonHoverColor(source, scales) {
  const [L, C, H] = source.coords;
  const newL = L > 0.4 ? L - 0.03 / (L + 0.1) : L + 0.03 / (L + 0.1);
  const newC = L > 0.4 && !isNaN(H) ? C * 0.93 + 0 : C;
  const buttonHoverColor = new Color("oklch", [newL, newC, H]);
  let closestColor = buttonHoverColor;
  let minDistance = Infinity;
  scales.forEach((scale) => {
    for (const color of scale) {
      const distance = buttonHoverColor.deltaEOK(color);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
  });
  buttonHoverColor.coords[1] = closestColor.coords[1];
  buttonHoverColor.coords[2] = closestColor.coords[2];
  return buttonHoverColor;
}

function getScaleFromColor(source, scales, backgroundColor) {
  const allColors = [];
  Object.entries(scales).forEach(([name, scale]) => {
    for (const color of scale) allColors.push({ scale: name, distance: source.deltaEOK(color), color });
  });
  allColors.sort((a, b) => a.distance - b.distance);
  const closestColors = allColors.filter((color, i, arr) => i === arr.findIndex((value) => value.scale === color.scale));
  const allAreGrays = closestColors.every((color) => grayScaleNames.includes(color.scale));
  if (!allAreGrays && grayScaleNames.includes(closestColors[0].scale)) {
    while (grayScaleNames.includes(closestColors[1].scale)) closestColors.splice(1, 1);
  }
  const colorA = closestColors[0];
  const colorB = closestColors[1];
  const a = colorB.distance;
  const b = colorA.distance;
  const c = colorA.color.deltaEOK(colorB.color);
  const cosA = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);
  const sinA = Math.sin(Math.acos(cosA));
  const cosB = (a ** 2 + c ** 2 - b ** 2) / (2 * a * c);
  const sinB = Math.sin(Math.acos(cosB));
  const ratio = Math.max(0, cosA / sinA / (cosB / sinB)) * 0.5;
  const scaleA = scales[colorA.scale];
  const scaleB = scales[colorB.scale];
  const scale = scaleA.map((_, i) => new Color(Color.mix(scaleA[i], scaleB[i], ratio)).to("oklch"));
  const baseColor = scale.slice().sort((x, y) => source.deltaEOK(x) - source.deltaEOK(y))[0];
  // An achromatic base (Radix gray) keeps the scale neutral; its zero chroma leaves the ratio undefined.
  const achromatic = !(baseColor.coords[1] > 0);
  const ratioC = source.coords[1] / baseColor.coords[1];
  scale.forEach((color) => {
    if (!achromatic) color.coords[1] = Math.min(source.coords[1] * 1.5, color.coords[1] * ratioC);
    color.coords[2] = source.coords[2];
  });
  if (scale[0].coords[0] > 0.5) {
    const lightnessScale = scale.map(({ coords }) => coords[0]);
    const backgroundL = Math.max(0, Math.min(1, backgroundColor.coords[0]));
    const newLightnessScale = transposeProgressionStart(backgroundL, [1, ...lightnessScale], lightModeEasing);
    newLightnessScale.shift();
    newLightnessScale.forEach((lightness, i) => (scale[i].coords[0] = lightness));
    return scale;
  }
  const ease = [...darkModeEasing];
  const ratioL = Math.max(0, Math.min(1, backgroundColor.coords[0])) / scale[0].coords[0];
  if (ratioL > 1) {
    const maxRatio = 1.5;
    for (let i = 0; i < ease.length; i++) {
      const metaRatio = (ratioL - 1) * (maxRatio / (maxRatio - 1));
      ease[i] = ratioL > maxRatio ? 0 : Math.max(0, ease[i] * (1 - metaRatio));
    }
  }
  const lightnessScale = scale.map(({ coords }) => coords[0]);
  const newLightnessScale = transposeProgressionStart(backgroundColor.coords[0], lightnessScale, ease);
  newLightnessScale.forEach((lightness, i) => (scale[i].coords[0] = lightness));
  return scale;
}

function transposeProgressionStart(to, arr, curve) {
  const fn = BezierEasing(...curve);
  return arr.map((n, i) => n - (arr[0] - to) * fn(1 - i / (arr.length - 1)));
}

function getAlphaColor(targetRgb, backgroundRgb, rgbPrecision, alphaPrecision) {
  const [tr, tg, tb] = targetRgb.map((c) => Math.round(c * rgbPrecision));
  const [br, bg, bb] = backgroundRgb.map((c) => Math.round(c * rgbPrecision));
  const desiredRgb = tr > br || tg > bg || tb > bb ? rgbPrecision : 0;
  const alphaR = (tr - br) / (desiredRgb - br);
  const alphaG = (tg - bg) / (desiredRgb - bg);
  const alphaB = (tb - bb) / (desiredRgb - bb);
  if ([alphaR, alphaG, alphaB].every((alpha) => alpha === alphaR)) {
    const V = desiredRgb / rgbPrecision;
    return [V, V, V, alphaR];
  }
  const clampRgb = (n) => (isNaN(n) ? 0 : Math.min(rgbPrecision, Math.max(0, n)));
  const clampA = (n) => (isNaN(n) ? 0 : Math.min(alphaPrecision, Math.max(0, n)));
  const A = clampA(Math.ceil(Math.max(alphaR, alphaG, alphaB) * alphaPrecision)) / alphaPrecision;
  let R = Math.ceil(clampRgb(((br * (1 - A) - tr) / A) * -1));
  let G = Math.ceil(clampRgb(((bg * (1 - A) - tg) / A) * -1));
  let B = Math.ceil(clampRgb(((bb * (1 - A) - tb) / A) * -1));
  const blendedR = blendAlpha(R, A, br);
  const blendedG = blendAlpha(G, A, bg);
  const blendedB = blendAlpha(B, A, bb);
  if (desiredRgb === 0) {
    if (tr <= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg <= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb <= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  } else {
    if (tr >= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg >= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb >= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }
  return [R / rgbPrecision, G / rgbPrecision, B / rgbPrecision, A];
}

function blendAlpha(foreground, alpha, background) {
  return Math.round(background * (1 - alpha)) + Math.round(foreground * alpha);
}

function getAlphaColorSrgb(targetColor, backgroundColor) {
  const [r, g, b, a] = getAlphaColor(new Color(targetColor).to("srgb").coords, new Color(backgroundColor).to("srgb").coords, 255, 255);
  return expandHex(new Color("srgb", [r, g, b], a).toString({ format: "hex" }));
}

function expandHex(hex) {
  return hex.length === 4 || hex.length === 5 ? `#${[...hex.slice(1)].map((digit) => digit + digit).join("")}` : hex;
}
