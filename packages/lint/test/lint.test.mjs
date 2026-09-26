import assert from "node:assert/strict";
import { test } from "node:test";

import { ESLint } from "eslint";
import stylelint from "stylelint";
import tseslint from "typescript-eslint";

import { appConfig } from "../eslint.js";
import stylelintConfig from "../stylelint.js";

async function eslintMessages(code) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [{ files: ["**/*.tsx"], languageOptions: { parser: tseslint.parser } }, { files: ["**/*.tsx"], ...appConfig }],
  });
  const [result] = await eslint.lintText(code, { filePath: "app.tsx" });
  return result.messages.map((message) => message.ruleId ?? message.message);
}

async function stylelintWarnings(code) {
  const { results } = await stylelint.lint({ code, config: stylelintConfig });
  return results[0].warnings.map((warning) => warning.rule);
}

test("applications cannot reach Cairn primitives or internals", async () => {
  assert.deepEqual(await eslintMessages('import { Menu } from "@base-ui/react/menu";\n'), ["no-restricted-imports"]);
  assert.deepEqual(await eslintMessages('import "@tiptap/core";\n'), ["no-restricted-imports"]);
  assert.deepEqual(await eslintMessages('import { Button } from "@cairn/ui/dist/components/button.js";\n'), [
    "no-restricted-imports",
  ]);
  assert.deepEqual(await eslintMessages('import { Button } from "@cairn/ui";\nimport { OutlineTree } from "@cairn/ui/editor";\n'), []);
});

test("disable directives need a reason and must stay necessary", async () => {
  const bare = 'import { Menu } from "@base-ui/react/menu"; // eslint-disable-line no-restricted-imports\n';
  assert.deepEqual(await eslintMessages(bare), ["cairn/require-disable-description"]);
  const explained =
    'import { Menu } from "@base-ui/react/menu"; // eslint-disable-line no-restricted-imports -- migration spike\n';
  assert.deepEqual(await eslintMessages(explained), []);
  const needless = 'import { Button } from "@cairn/ui"; // eslint-disable-line no-restricted-imports -- stale\n';
  assert.equal((await eslintMessages(needless)).length, 1);
});

test("application source cannot carry raw visual values", async () => {
  assert.deepEqual(await eslintMessages('export const accent = "#1a2b3c";\n'), ["cairn/no-raw-visual-values"]);
  assert.deepEqual(await eslintMessages('export const route = "#/legal";\n'), []);
});

test("application CSS uses Cairn tokens only", async () => {
  assert.deepEqual(await stylelintWarnings(".graph { color: #ff0000; }"), ["cairn/token-values"]);
  assert.deepEqual(await stylelintWarnings(".graph { gap: 12px; }"), ["cairn/token-values"]);
  assert.deepEqual(
    await stylelintWarnings(
      ".graph { gap: calc(var(--cairn-spacing) * 3); border: 1px solid var(--cairn-color-border); }",
    ),
    [],
  );
  assert.deepEqual(await stylelintWarnings(".page .cairn-toast { opacity: 1; }"), ["cairn/no-internal-selectors"]);
  assert.deepEqual(await stylelintWarnings('[data-ui="outline-row"] { opacity: 1; }'), ["cairn/no-internal-selectors"]);
});
