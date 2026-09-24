import assert from "node:assert/strict";

import { designSystemTest, navigateToCatalogPage } from "./support/browser.mjs";

designSystemTest("the catalog applies and removes a custom semantic token", async (page) => {
  await navigateToCatalogPage(page, "foundations/theming");
  await page
    .getByRole("textbox", { name: "Custom theme CSS" })
    .fill("[data-cairn-theme] { --cairn-color-primary: #123456; }");
  await page.getByRole("button", { name: "Apply custom theme" }).click();
  const primary = () =>
    page
      .locator('[data-cairn-theme][data-is-root-theme="true"]')
      .first()
      .evaluate((element) => getComputedStyle(element).getPropertyValue("--cairn-color-primary").trim());
  assert.equal(await primary(), "#123456");
  await page.getByRole("button", { name: "Remove" }).click();
  assert.notEqual(await primary(), "#123456");
});
