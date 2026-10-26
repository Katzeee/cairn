import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { colorTokens, componentTokens, themeTokens, toneRoles, tones } from "../tokens/contract.mjs";
import { themeNames } from "../tokens/themes/index.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = (name) => readFile(resolve(root, "dist", name), "utf8");
const declared = (css) => new Set([...css.matchAll(/(--[\w-]+):/g)].map((match) => match[1]));
const referenced = (css) => new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]));

test("every theme assigns every contract token and nothing else", async () => {
  const contract = [
    ...colorTokens.map((token) => `color-${token}`),
    ...tones.flatMap((tone) => Object.keys(toneRoles).map((role) => `${tone}-${role}`)),
    ...themeTokens,
    ...Object.keys(componentTokens),
  ];
  const known = new Set(contract);
  for (const name of themeNames) {
    const css = declared(await output(`themes/${name}.css`));
    for (const token of contract) assert.ok(css.has(`--cairn-${token}`), `${name} must assign ${token}`);
    for (const variable of css) assert.ok(known.has(variable.slice("--cairn-".length)), `${name} assigns unknown ${variable}`);
  }
});

test("every tone scope resolves to a variable each theme defines", async () => {
  const tokens = await output("tokens.css");
  for (const name of themeNames) {
    const defined = new Set([...declared(tokens), ...declared(await output(`themes/${name}.css`))]);
    for (const variable of referenced(tokens)) assert.ok(defined.has(variable), `${name} leaves ${variable} undefined`);
  }
});

test("every stylesheet declares the same cascade layer order", async () => {
  const order = (css) => css.match(/^@layer [^{]+;$/m)?.[0];
  const expected = order(await output("tokens.css"));
  assert.ok(expected);
  for (const name of themeNames) assert.equal(order(await output(`themes/${name}.css`)), expected);
});
