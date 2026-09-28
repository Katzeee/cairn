import assert from "node:assert/strict";

import { editorTest, navigateToCatalogPage } from "./support/browser.mjs";

const rowAt = (page, path) => page.locator(`[data-item-key="outline-item:${encodeURIComponent(path)}"]`);

editorTest("outline readonly names remain selectable and leave editing to editable rows", async (page) => {
  await navigateToCatalogPage(page, "editor/outline-tree");
  const field = rowAt(page, "projects/cairn/status-field");
  const text = field.locator('[data-ui="outline-readonly-text"]');
  await text.dblclick();
  assert.equal(
    await page.evaluate(() => window.getSelection()?.toString()),
    "Status",
    "readonly names remain selectable for copying",
  );
  const tree = page.getByRole("tree");
  await tree.press("Escape");
  await tree.press("Enter");
  assert.equal(await page.locator('[data-ui="outline-editor"]').count(), 0);
  await tree.press("ArrowDown");
  await tree.press("Enter");
  await page.locator('[data-ui="outline-editor"]').waitFor({ state: "visible" });
  await page.locator('[data-ui="outline-editor"]').press("Escape");
});

editorTest("outline readonly names stay non-editable on touch", async (page) => {
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  try {
    await navigateToCatalogPage(page, "editor/outline-tree");
    const label = rowAt(page, "projects/cairn/status-field").locator('[data-ui="outline-readonly-text"]');
    await label.scrollIntoViewIfNeeded();
    const box = await label.boundingBox();
    assert.ok(box !== null);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }],
    });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    assert.equal(await page.locator('[data-ui="outline-editor"]').count(), 0);
    await page.getByRole("heading", { name: "OutlineTree", exact: true, level: 1 }).click();
  } finally {
    await session.send("Emulation.setTouchEmulationEnabled", { enabled: false });
    await session.detach();
  }
});
