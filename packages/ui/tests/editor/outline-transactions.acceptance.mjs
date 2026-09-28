import assert from "node:assert/strict";
import { editorTest, navigateToCatalogPage } from "./support/browser.mjs";

const key = (path) => `outline-item:${encodeURIComponent(path)}`;
const row = (page, path) => page.locator(`[data-ui="outline-row"][data-item-key="${key(path)}"]`);
const current = (page) => page.locator('[data-ui="outline-row"][data-editing="true"]');
const editor = (page) => page.locator('[data-ui="outline-editor"]');
async function edit(page, path, offset = 0) {
  await row(page, path).locator('[data-ui="outline-row-text"]').click();
  await page.locator('[data-ui="outline-editor"]:focus').waitFor();
  await editor(page).evaluate((element, position) => element.editor.commands.setTextSelection(position + 1), offset);
}
async function paste(page, data) {
  await page.evaluate((data) => {
    const transfer = new DataTransfer();
    for (const [type, content] of Object.entries(data)) {
      transfer.setData(type, content);
    }
    document.activeElement.dispatchEvent(
      new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: transfer }),
    );
  }, data);
}
editorTest("Outline undo spans text editor sessions and restores the edited node", async (page) => {
  await navigateToCatalogPage(page, "editor/outline-tree");
  await edit(page, "inbox/crdt-survey", "CRDT ordering survey".length);
  await page.keyboard.type(" draft");
  await edit(page, "projects/home-lab", 3);
  await page.keyboard.press("Control+z");
  await row(page, "inbox/crdt-survey").locator('[data-ui="outline-editor"]:focus').waitFor();
  assert.equal(await editor(page).textContent(), "CRDT ordering survey");
  await page.keyboard.press("Control+Shift+z");
  assert.equal(await row(page, "inbox/crdt-survey").textContent(), "CRDT ordering survey draft");
});

editorTest("Outline structural moves and insertion each undo as one edit", async (page) => {
  await navigateToCatalogPage(page, "editor/outline-tree");
  await edit(page, "inbox/crdt-survey", "CRDT ordering survey".length);
  await page.keyboard.press("Enter");
  await page.locator('[data-ui="outline-editor"]:focus').waitFor();
  const siblingKey = await current(page).getAttribute("data-item-key");
  await page.keyboard.type("Draft");
  await page.keyboard.press("Tab");
  await page.waitForFunction(
    (key) =>
      document.querySelector('[data-ui="outline-row"][data-editing="true"]')?.getAttribute("data-item-key") !== key,
    siblingKey,
  );
  await page.keyboard.press("Control+z");
  assert.equal(await current(page).getAttribute("data-item-key"), siblingKey);
  assert.equal(await editor(page).textContent(), "Draft");
  await page.keyboard.press("Control+z");
  assert.equal(await editor(page).textContent(), "");
  await page.keyboard.press("Control+z");
  assert.equal(await current(page).getAttribute("data-item-key"), key("inbox/crdt-survey"));
  assert.equal(await page.locator(`[data-item-key="${siblingKey}"]`).count(), 0);
});

editorTest("Forward delete merges the next leaf and undo restores both node identities", async (page) => {
  await navigateToCatalogPage(page, "editor/outline-tree");
  await edit(page, "inbox/crdt-survey", 0);
  await page.keyboard.press("Shift+Enter");
  await page.locator('[data-ui="outline-editor"]:focus').waitFor();
  await page.keyboard.type("Tail");
  const tailKey = await current(page).getAttribute("data-item-key");
  await edit(page, "inbox/crdt-survey", "CRDT ordering survey".length);
  await page.keyboard.press("Delete");
  assert.equal(await editor(page).textContent(), "CRDT ordering surveyTail");
  assert.equal(await page.locator(`[data-item-key="${tailKey}"]`).count(), 0);
  await page.keyboard.press("Control+z");
  assert.equal(await editor(page).textContent(), "CRDT ordering survey");
  assert.equal(await page.locator(`[data-item-key="${tailKey}"]`).textContent(), "Tail");
});

editorTest(
  "Multiline paste creates sibling nodes, preserves current text and undoes atomically",
  async (page) => {
    await navigateToCatalogPage(page, "editor/outline-tree");
    await edit(page, "inbox/crdt-survey", 2);
    await paste(page, { "text/plain": "First\nSecond" });
    await page.locator('[data-ui="outline-editor"]:focus').waitFor();
    assert.equal(await editor(page).textContent(), "Second");
    assert.equal(await row(page, "inbox/crdt-survey").textContent(), "CRDT ordering survey");
    assert.equal(await current(page).getAttribute("data-parent-key"), key("inbox"));
    await page.keyboard.press("Control+z");
    assert.equal(await page.locator('[data-ui="outline-row"]', { hasText: /^First$/ }).count(), 0);
    assert.equal(await current(page).getAttribute("data-item-key"), key("inbox/crdt-survey"));
  },
);

editorTest("Deleting all nodes leaves an editable empty outline and remains undoable", async (page) => {
  await navigateToCatalogPage(page, "editor/outline-tree");
  const count = await page.locator('[data-ui="outline-row"]').count();
  await edit(page, "inbox/crdt-survey", 2);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+a");
  await page.keyboard.press("Delete");
  assert.equal(await page.locator('[data-ui="outline-row"]').count(), 0);
  assert.equal(await page.getByRole("button", { name: "Create node", exact: true }).count(), 1);
  await page.keyboard.type("x");
  await page.locator('[data-ui="outline-editor"]:focus').waitFor();
  assert.equal(await editor(page).textContent(), "x");
  await page.keyboard.press("Control+z");
  assert.equal(await page.locator('[data-ui="outline-row"]').count(), 0);
  await paste(page, { "text/plain": "Pasted into empty outline" });
  assert.equal(await editor(page).textContent(), "Pasted into empty outline");
  await page.keyboard.press("Control+z");
  assert.equal(await page.locator('[data-ui="outline-row"]').count(), 0);
  await page.keyboard.press("Control+z");
  assert.equal(await page.locator('[data-ui="outline-row"]').count(), count);
});

editorTest("Formatting has its own undo boundary after text input", async (page) => {
  await navigateToCatalogPage(page, "editor/outline-tree");
  await edit(page, "inbox/quick-capture", 0);
  await page.keyboard.type("Word");
  await page.keyboard.press("Control+a");
  await page.keyboard.press("Control+b");
  assert.equal(await editor(page).textContent(), "**Word**");
  await page.keyboard.press("Control+z");
  assert.equal(await editor(page).textContent(), "Word");
  await page.keyboard.press("Control+z");
  assert.equal(await editor(page).textContent(), "");
});
