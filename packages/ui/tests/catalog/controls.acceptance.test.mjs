import assert from "node:assert/strict";

import { editorTest as catalogTest, navigateToCatalogPage } from "../editor/support/browser.mjs";

catalogTest("toast examples reach the notification provider and wire actions and dismissal", async (page) => {
  await navigateToCatalogPage(page, "components/toast");
  await page.getByRole("button", { name: "Neutral", exact: true }).click();
  const notification = page.locator('[data-ui="toast"]').filter({ hasText: "Draft saved" });
  await notification.waitFor({ state: "visible" });
  await notification.locator('[data-ui="toast-close"]').click();
  await notification.waitFor({ state: "detached" });
  await page.getByRole("button", { name: "Danger with action", exact: true }).click();
  const failure = page.locator('[data-ui="toast"]').filter({ hasText: "Connection lost" });
  await failure.getByText("Retry now", { exact: true }).click();
  await page.locator('[data-ui="toast"]').filter({ hasText: "Connection restored" }).waitFor({ state: "visible" });
});

catalogTest("text-only navigation reaches destinations and closes the drawer at compact breakpoints", async (page) => {
  await navigateToCatalogPage(page, "components/spinner");
  for (const width of [720, 480]) {
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    const drawer = page.getByRole("dialog", { name: "Cairn navigation", exact: true });
    await drawer.waitFor({ state: "visible" });
    await drawer.getByRole("link", { name: width === 720 ? "Toast" : "Spinner", exact: true }).click();
    await drawer.waitFor({ state: "hidden" });
    assert.ok(page.url().endsWith(width === 720 ? "/components/toast" : "/components/spinner"));
  }
});
