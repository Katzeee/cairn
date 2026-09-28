import assert from "node:assert/strict";

import { editorTest as catalogTest, navigateToCatalogPage } from "../editor/support/browser.mjs";

catalogTest("example navigation changes its own content without leaving the catalog", async (page) => {
  await navigateToCatalogPage(page, "layout/app-shell");
  const shellUrl = page.url();
  const sidebar = page.locator('[data-example="app-shell/sidebar"]');
  const bottomBar = page.locator('[data-example="app-shell/bottom-bar"]');
  await bottomBar.getByRole("link", { name: "Explore", exact: true }).filter({ visible: true }).click();
  await bottomBar.getByRole("heading", { name: "Explore", exact: true }).waitFor();
  assert.equal(page.url(), shellUrl);
  assert.equal(await sidebar.getByRole("heading", { name: "Inbox", exact: true }).count(), 1);
  await sidebar.getByRole("link", { name: "Projects", exact: true }).filter({ visible: true }).click();
  await sidebar.getByRole("heading", { name: "Projects", exact: true }).waitFor();
  assert.equal(page.url(), shellUrl);
  await bottomBar.getByRole("heading", { name: "Explore", exact: true }).waitFor();
});
