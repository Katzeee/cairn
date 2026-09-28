import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { colorRoles, themeTokens, toneRoles, tones } from "../tokens/contract.mjs";
import { themeNames, themes } from "../tokens/themes/index.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = (name) => readFile(resolve(root, "dist", name), "utf8");
const declared = (css) => new Set([...css.matchAll(/(--[\w-]+):/g)].map((match) => match[1]));
const referenced = (css) => new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]));

test("every theme assigns every theme token and nothing else", async () => {
  for (const name of themeNames) {
    const css = declared(await output(`themes/${name}.css`));
    for (const token of themeTokens) assert.ok(css.has(`--cairn-${token}`), `${name} must assign ${token}`);
    const assigned = [...css].filter((variable) => variable.startsWith("--cairn-") && !/^--cairn-(color|tone)-/.test(variable));
    const known = new Set([...themeTokens, ...tones.flatMap((tone) => Object.keys(toneRoles).map((role) => `${tone}-${role}`))]);
    for (const variable of assigned) assert.ok(known.has(variable.slice("--cairn-".length)), `${name} assigns unknown ${variable}`);
  }
});

test("every role resolves to a variable some theme defines", async () => {
  const tokens = await output("tokens.css");
  for (const name of themeNames) {
    const defined = new Set([...declared(tokens), ...declared(await output(`themes/${name}.css`))]);
    for (const variable of referenced(tokens)) assert.ok(defined.has(variable), `${name} leaves ${variable} undefined`);
  }
  const roles = declared(tokens);
  for (const role of Object.keys(colorRoles)) assert.ok(roles.has(`--cairn-color-${role}`));
  for (const tone of tones) for (const role of Object.keys(toneRoles)) assert.ok(roles.has(`--cairn-${tone}-${role}`));
});

test("seeds survive palette generation in both appearances", async () => {
  for (const name of themeNames) {
    const css = await output(`themes/${name}.css`);
    const { accent, background } = themes[name].colors;
    const step = (variable) => css.match(new RegExp(`${variable}: light-dark\\((#[\\da-f]+), (#[\\da-f]+)\\)`, "i"))?.slice(1);
    assert.deepEqual(step("--accent-9")?.map((hex) => hex.toUpperCase()), [accent.light, accent.dark]);
    assert.deepEqual(step("--color-background")?.map((hex) => hex.toUpperCase()), [background.light, background.dark]);
  }
});

test("every stylesheet declares the same cascade layer order", async () => {
  const order = (css) => css.match(/^@layer [^{]+;$/m)?.[0];
  const expected = order(await output("tokens.css"));
  assert.ok(expected);
  for (const name of themeNames) assert.equal(order(await output(`themes/${name}.css`)), expected);
});
