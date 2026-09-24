import assert from "node:assert/strict";

import { designSystemTest } from "./support/browser.mjs";

designSystemTest("nested themes and component overrides reach portaled content", async (page) => {
  const documentUrl = page.url().split("#")[0];
  await page.goto("about:blank");
  await page.goto(`${documentUrl}#/scoped-theme-fixture`, { waitUntil: "load" });

  const color = (name) =>
    page.getByRole("button", { name }).evaluate((button) => getComputedStyle(button).backgroundColor);
  const outer = await color("Outer action");
  assert.equal(await color("Inner action"), "rgb(18, 52, 86)");
  assert.equal(await color("Innermost action"), "rgb(101, 67, 33)");
  assert.notEqual(outer, await color("Inner action"));
  const outerBackground = await page
    .locator('[data-cairn-theme][data-is-root-theme="true"]')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  const innerBackground = await page
    .locator('[data-cairn-theme][data-mode="dark"]')
    .first()
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  assert.notEqual(innerBackground, outerBackground);
  assert.equal(
    await page.getByRole("button", { name: "Inner action" }).evaluate((button) => getComputedStyle(button).fontFamily),
    "Georgia, serif",
  );
  assert.notEqual(
    await page.locator('[data-ui="scoped-copy"]').evaluate((element) => getComputedStyle(element).color),
    await page.locator('[data-ui="outer-copy"]').evaluate((element) => getComputedStyle(element).color),
  );

  await page.getByRole("button", { name: "Open scoped dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Scoped dialog" });
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

designSystemTest("an unwrapped overlay follows document theme attributes", async (page) => {
  const documentUrl = page.url().split("#")[0];
  await page.goto("about:blank");
  await page.goto(`${documentUrl}#/raw-theme-fixture`, { waitUntil: "load" });
  await page.evaluate(() => {
    document.documentElement.dataset.mode = "dark";
    document.documentElement.dataset.theme = "slate";
  });
  await page.getByRole("button", { name: "Open raw-theme dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Raw-theme dialog" });
  await dialog.waitFor();
  const values = await dialog.evaluate((element) => ({
    portalTheme: element.closest("[data-cairn-theme]") !== null,
    primary: getComputedStyle(element).getPropertyValue("--cairn-color-primary").trim(),
    rootPrimary: getComputedStyle(document.documentElement).getPropertyValue("--cairn-color-primary").trim(),
  }));
  await page.evaluate(() => {
    document.documentElement.dataset.mode = "light";
    delete document.documentElement.dataset.theme;
  });
  assert.equal(values.portalTheme, false);
  assert.equal(values.primary, values.rootPrimary);
});
