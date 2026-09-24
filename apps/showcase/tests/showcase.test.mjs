import assert from "node:assert/strict";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { _electron } from "playwright-core";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const documentPath = join(appRoot, "dist/index.html");
const harnessPath = join(appRoot, "tests/harness.cjs");

test("the built showcase opens directly and navigates to a component page", async () => {
  const application = await _electron.launch({ args: [harnessPath, documentPath], cwd: appRoot });
  try {
    const page = await application.firstWindow();
    await page.getByRole("heading", { level: 1, name: "Cairn Design System" }).waitFor();
    assert.match(await page.locator("body").evaluate((body) => getComputedStyle(body).fontFamily), /HarmonyOS Sans/u);

    await page.evaluate(() => {
      window.location.hash = "#/design-system/components/buttons";
    });
    await page.getByRole("heading", { level: 1, name: "Buttons" }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Primary", exact: true }).count(), 1);

    await page.evaluate(() => {
      window.location.hash = "#/design-system/components/navigation";
    });
    const search = page.getByRole("combobox", { name: "Find a component" });
    await search.fill("dia");
    await page.getByRole("option", { name: /Dialog/u }).click();
    assert.equal(await search.inputValue(), "Dialog");
  } finally {
    await application.close();
  }
});
