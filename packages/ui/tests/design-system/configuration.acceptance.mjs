import assert from "node:assert/strict";

import { designSystemTest } from "./support/browser.mjs";

designSystemTest("an application can override the global theme, font, and semantic token", async (page) => {
  const documentUrl = page.url().split("#")[0];
  await page.goto("about:blank");
  await page.goto(`${documentUrl}#/configuration-fixture`, { waitUntil: "load" });
  const button = page.getByRole("button", { name: "Configured action" });
  await button.waitFor();

  const actual = await page.evaluate(() => ({
    mode: document.documentElement.dataset.mode,
    theme: document.documentElement.dataset.theme,
    font: getComputedStyle(document.body).fontFamily,
    token: document.documentElement.style.getPropertyValue("--cairn-color-primary"),
  }));
  assert.equal(actual.mode, "dark");
  assert.equal(actual.theme, "slate");
  assert.equal(actual.font, 'Georgia, serif');
  assert.equal(actual.token, "#123456");
  assert.equal(await button.evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(18, 52, 86)");

  await page.evaluate(() => {
    window.location.hash = "#/empty-fixture";
  });
  await page.getByText("Empty fixture").waitFor();
  const restored = await page.evaluate(() => ({
    mode: document.documentElement.dataset.mode,
    theme: document.documentElement.dataset.theme,
    token: document.documentElement.style.getPropertyValue("--cairn-color-primary"),
    font: document.documentElement.style.getPropertyValue("--cairn-font-sans"),
  }));
  assert.deepEqual(restored, { mode: "light", theme: undefined, token: "", font: "" });
});
