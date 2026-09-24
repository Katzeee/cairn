import assert from "node:assert/strict";

import { designSystemTest } from "./support/browser.mjs";

designSystemTest("an application can override the global theme, font, and semantic token", async (page) => {
  const documentUrl = page.url().split("#")[0];
  await page.goto("about:blank");
  await page.goto(`${documentUrl}#/configuration-fixture`, { waitUntil: "load" });
  const button = page.getByRole("button", { name: "Configured action" });
  await button.waitFor();

  const actual = await page.evaluate(() => {
    const scope = document.querySelector("[data-cairn-theme]");
    if (scope === null) {
      throw new Error("Configured theme is missing");
    }
    return {
      mode: scope.getAttribute("data-mode"),
      theme: scope.getAttribute("data-theme"),
      font: getComputedStyle(document.body).fontFamily,
      token: getComputedStyle(scope).getPropertyValue("--cairn-color-primary").trim(),
    };
  });
  assert.equal(actual.mode, "dark");
  assert.equal(actual.theme, "slate");
  assert.equal(await button.evaluate((element) => getComputedStyle(element).fontFamily), "Georgia, serif");
  assert.equal(actual.token, "#123456");
  assert.equal(await button.evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(18, 52, 86)");

  await page.evaluate(() => {
    window.location.hash = "#/empty-fixture";
  });
  await page.getByText("Empty fixture").waitFor();
  const restored = await page.evaluate(() => ({
    themeCount: document.querySelectorAll("#root [data-cairn-theme]").length,
    rootMode: document.documentElement.dataset.mode,
  }));
  assert.deepEqual(restored, { themeCount: 0, rootMode: "light" });
});
