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
    const bundledFonts = await page.evaluate(async () => {
      const interfaceFaces = await document.fonts.load('400 14px "HarmonyOS Sans SC"');
      const codeFaces = await document.fonts.load('400 14px "JetBrains Mono"');
      return [interfaceFaces.length, codeFaces.length];
    });
    assert.ok(bundledFonts[0] > 0, "the default interface font loads from the showcase bundle");
    assert.ok(bundledFonts[1] > 0, "the default code font loads from the showcase bundle");

    await page.evaluate(() => {
      window.location.hash = "#/design-system/components/button";
    });
    await page.getByRole("heading", { level: 1, name: "Button" }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Primary", exact: true }).count(), 1);
    const buttonApi = page.locator('[data-api-component="Button"]');
    assert.match(
      await buttonApi.getByRole("table", { name: "Button properties", exact: true }).innerText(),
      /loading[\s\S]*false/u,
    );
    await page.getByRole("link", { name: "API Reference", exact: true }).click();
    await page.waitForFunction(
      () => Math.abs(document.getElementById("api-reference").getBoundingClientRect().top - 24) < 2,
    );
    await page.reload();
    await page.waitForFunction(
      () => Math.abs(document.getElementById("api-reference").getBoundingClientRect().top - 24) < 2,
    );

    await page.evaluate(() => {
      window.location.hash = "#/design-system/components/select";
    });
    await page.getByRole("heading", { level: 1, name: "Select", exact: true }).waitFor();
    assert.equal(
      await page.locator("#examples").getByRole("combobox").count(),
      1,
      "Select examples do not include a Combobox example",
    );
    assert.equal(await page.locator("#examples").getByRole("heading", { name: "Combobox", exact: true }).count(), 0);
    const selectApi = page.locator('[data-api-component="Select"]');
    const optionsRow = selectApi
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader", { name: "options", exact: true }) });
    assert.match(await optionsRow.getByRole("cell").nth(0).innerText(), /readonly[\s\S]*\[\]$/u);
    assert.equal(await optionsRow.getByRole("cell").nth(1).innerText(), "Yes");
    await selectApi.getByText("Full TypeScript reference", { exact: true }).click();
    assert.match(await selectApi.locator("pre").innerText(), /export type SelectOption/u);

    await page.evaluate(() => {
      window.location.hash = "#/design-system/editor/node-table";
    });
    await page.getByRole("heading", { level: 1, name: "NodeTable", exact: true }).waitFor();
    assert.equal(await page.locator("#examples").getByRole("table").count(), 1);
    assert.match(await page.locator("#usage pre").innerText(), /from "@cairn\/ui\/editor"/u);
    assert.equal(await page.locator('[data-api-component="OutlineEmptyChild"]').count(), 1);

    await page.evaluate(() => {
      window.location.hash = "#/design-system/components/dropdown-menu";
    });
    await page.getByRole("heading", { level: 1, name: "DropdownMenu", exact: true }).waitFor();
    await page.getByRole("button", { name: "Workspace actions", exact: true }).click();
    await page.getByRole("menuitem", { name: "Rename", exact: true }).click();
    await page.getByRole("dialog", { name: "Rename Workspace" }).waitFor();
    await page.keyboard.press("Escape");

    await page.evaluate(() => {
      window.location.hash = "#/design-system/patterns/navigation";
    });
    const search = page.getByRole("combobox", { name: "Find a component" });
    await search.fill("dia");
    await page.getByRole("option", { name: /Dialog/u }).click();
    assert.equal(await search.inputValue(), "Dialog");
  } finally {
    await application.close();
  }
});
