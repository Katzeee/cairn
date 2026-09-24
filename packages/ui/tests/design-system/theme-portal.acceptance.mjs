import assert from "node:assert/strict";

import { designSystemTest } from "./support/browser.mjs";

designSystemTest("application theme settings reach portaled content", async (page) => {
  const documentUrl = page.url().split("#")[0];
  await page.goto("about:blank");
  await page.goto(`${documentUrl}#/configured-portal-fixture`, { waitUntil: "load" });
  await page.getByRole("button", { name: "Open configured dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Configured dialog" });
  await dialog.waitFor();
  const portal = await dialog.evaluate((element) => {
    const scope = element.closest("[data-cairn-theme]");
    return scope === null
      ? null
      : {
          mode: scope.getAttribute("data-mode"),
          theme: scope.getAttribute("data-theme"),
          primary: getComputedStyle(element).getPropertyValue("--cairn-color-primary").trim(),
          font: getComputedStyle(element).fontFamily,
        };
  });
  assert.deepEqual(portal, { mode: "dark", theme: "slate", primary: "#123456", font: "Georgia, serif" });
});
