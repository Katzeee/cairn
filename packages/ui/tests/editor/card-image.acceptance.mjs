import assert from "node:assert/strict";

import { editorTest } from "./support/browser.mjs";

async function openExample(page, id, width) {
  await page.setViewportSize({ height: 700, width });
  await page.evaluate((hash) => {
    window.location.hash = hash;
  }, `#/design-system/preview/${id}`);
  await page.reload();
}

editorTest("A linked card opens from its body while its own buttons keep their clicks", async (page) => {
  // The link's cover spans the card; a layering change would let it swallow the card's other controls.
  await openExample(page, "card/link", 1000);
  const card = page.locator("article").first();
  const box = await card.boundingBox();
  const target = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.getAttribute("href"), [box.x + box.width / 2, box.y + box.height / 3]);
  assert.equal(target, "#/apps/4412");
  // Playwright's click fails when another element receives the pointer at the button's center.
  await card.getByRole("button", { name: "Detach" }).click({ timeout: 5_000 });
  await page.getByText("Detached Blender").waitFor();
});

editorTest("A refreshed image keeps its last picture until the next one loads, and after a failure", async (page) => {
  await openExample(page, "image/refresh", 600);
  const picture = page.locator("img:not([hidden])");
  const frame = () => picture.evaluate((image) => decodeURIComponent(image.src).match(/Frame \d/)?.[0]);
  await picture.waitFor();
  assert.equal(await frame(), "Frame 1");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await page.waitForFunction(() => decodeURIComponent(document.querySelector("img:not([hidden])").src).includes("Frame 2"));
  await page.getByRole("button", { name: "Refresh with a failure" }).click();
  await page.waitForTimeout(300);
  assert.equal(await frame(), "Frame 2");
  assert.equal(await page.getByRole("img", { name: "Blender window" }).count(), 1);
});
