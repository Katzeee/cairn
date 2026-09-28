import { describe, expect, it } from "vitest";

import { resolveOutlinePresentation, type OutlinePresentationRowState } from "./outline-presentation.js";

type Presentation = Readonly<{ glyph: string }>;

const state: OutlinePresentationRowState = {
  depth: 2,
  expanded: false,
  expandable: true,
  hasChildren: true,
  selected: false,
};

describe("outline presentation seam", () => {
  it("keeps a registered action inert when the host does not handle presentation actions", () => {
    const presentation = resolveOutlinePresentation(
      {
        resolve: ({ glyph }: Presentation) => ({ bullet: { action: { type: "open" }, content: glyph } }),
      },
      { glyph: "registered glyph" },
      "opaque item key",
      "Visible item",
      state,
    );

    expect(presentation.bullet.onActivate).toBeUndefined();
  });
});
