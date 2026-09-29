import assert from "node:assert/strict";

import { editorTest } from "./support/browser.mjs";

const isFocused = (locator) => locator.evaluate((element) => element === document.activeElement);
const mainInert = (page) => page.evaluate(() => document.querySelector("main").inert);

async function openExample(page, id, width) {
  await page.setViewportSize({ height: 700, width });
  await page.evaluate((hash) => {
    window.location.hash = hash;
  }, `#/design-system/preview/app-shell/${id}`);
  await page.reload();
}

editorTest("App shell overlay keeps focus when it docks and returns it to the toggle when it closes", async (page) => {
  // A collapsible sidebar hidden in a wide shell, then asked for in a narrow one, opens as an overlay.
  await openExample(page, "desktop", 1100);
  await page.getByRole("button", { name: "Hide sidebar" }).click();
  await page.setViewportSize({ height: 700, width: 700 });
  await page.getByRole("button", { name: "Show sidebar" }).click();
  const item = page.getByRole("link", { name: "Instances" });
  await item.focus();

  // Widening past the dock width keeps the sidebar and the focused item, and releases the page.
  await page.setViewportSize({ height: 700, width: 1100 });
  await page.getByRole("button", { name: "Hide sidebar" }).waitFor();
  assert.equal(await isFocused(item), true);
  assert.equal(await mainInert(page), false);

  await page.setViewportSize({ height: 700, width: 700 });
  await page.getByRole("button", { name: "Show sidebar" }).click();
  await page.keyboard.press("Escape");
  assert.equal(await isFocused(page.getByRole("button", { name: "Show sidebar" })), true);
  assert.equal(await mainInert(page), false);
});

editorTest("App shell fixed sidebar keeps focus when its overlay docks as the menu button leaves", async (page) => {
  await openExample(page, "web", 700);
  await page.getByRole("button", { name: "Open navigation" }).click();
  const item = page.getByRole("link", { name: "Forms" });
  await item.focus();

  await page.setViewportSize({ height: 700, width: 1100 });
  await page.getByRole("button", { name: /navigation/ }).waitFor({ state: "detached" });
  assert.equal(await isFocused(item), true);
  assert.equal(await mainInert(page), false);
});

editorTest("A stacked detail's back button stays reachable under the window's top row", async (page) => {
  // The shell's drag strip once covered the whole top row and sat above the stacked panes' page bars.
  await page.setViewportSize({ height: 700, width: 700 });
  await page.evaluate(() => {
    window.location.hash = "#/design-system/preview/list-detail/desktop";
  });
  await page.reload();
  await page.getByRole("button", { name: /Sprint retro/ }).click();
  // Playwright's click fails when another element receives the pointer at the button's center.
  await page.getByRole("button", { name: "Back to Notes" }).click({ timeout: 5_000 });
  await page.getByRole("button", { name: /Sprint retro/ }).focus();
  assert.equal(await page.getByRole("region", { name: "Notes" }).evaluate((element) => element.inert), false);
});
