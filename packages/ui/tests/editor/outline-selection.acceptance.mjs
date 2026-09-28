import assert from "node:assert/strict";
import { editorTest, navigateToCatalogPage } from "./support/browser.mjs";

const row = (page, path) =>
  page.locator(`[data-ui="outline-row"][data-item-key="outline-item:${encodeURIComponent(path)}"]`);
const selected = (page) => page.locator('[data-ui="outline-row"][aria-selected="true"]');
const editor = (page) => page.locator('[data-ui="outline-editor"]');
const node = (row) => row.locator('xpath=ancestor::*[@data-ui="outline-node"][1]');

editorTest("Shift click extends a node selection and Ctrl click adds independent subtree roots", async (page) => {
  await navigateToCatalogPage(page, "editor/outline-tree");
  const parent = row(page, "projects/cairn/roadmap");
  await parent.locator('[data-ui="outline-row-text"]').click();
  await editor(page).press("Escape");
  await row(page, "projects/cairn/engine").click({ modifiers: ["Shift"] });
  assert.equal(await row(page, "projects/cairn/engine").getAttribute("aria-selected"), "true");
  assert.equal(await selected(page).count(), (await node(parent).locator('[data-ui="outline-row"]').count()) + 1);
  await page.getByRole("toolbar", { name: "2 items selected" }).waitFor();
  await row(page, "inbox").click({ modifiers: ["Control"] });
  await page.getByRole("toolbar", { name: "3 items selected" }).waitFor();
  assert.equal(await row(page, "inbox/crdt-survey").getAttribute("aria-selected"), "true");
  await row(page, "inbox").click({ modifiers: ["Control"] });
  assert.equal(await row(page, "inbox/crdt-survey").getAttribute("aria-selected"), "false");
  await parent.locator('[data-ui="outline-row-text"]').click();
  assert.equal(await selected(page).count(), 0);
  assert.equal(await editor(page).count(), 1);
});

editorTest(
  "A selected field covers its value column while copying and deleting a parent runs once",
  async (page) => {
    await navigateToCatalogPage(page, "editor/outline-tree");
    const field = row(page, "projects/cairn/owner-field");
    await field.click({ modifiers: ["Control"] });
    assert.equal(await selected(page).count(), 3);
    await page.getByRole("heading", { name: "OutlineTree", exact: true, level: 1 }).click();
    await row(page, "inbox").click();
    await editor(page).press("Escape");
    const clipboard = await editor(page).evaluate((element) => {
      const data = new DataTransfer();
      element.dispatchEvent(new ClipboardEvent("copy", { clipboardData: data, bubbles: true, cancelable: true }));
      return data.getData("application/x-cairn-outline");
    });
    const items = JSON.parse(clipboard);
    assert.equal(items.length, 1, "covered descendants are serialized only inside their parent");
    assert.equal(items[0].children.length, 3);
    await editor(page).press("Delete");
    assert.equal(await row(page, "inbox").count(), 0);
    assert.equal(await row(page, "inbox/crdt-survey").count(), 0);
    await editor(page).press("Control+z");
    assert.equal(await row(page, "inbox").count(), 1);
    assert.equal(await row(page, "inbox/crdt-survey").count(), 1);
  },
);
