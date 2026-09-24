import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CairnTheme } from "./cairn-theme.js";

describe("CairnTheme", () => {
  it("renders the root and nested appearance in server markup", () => {
    const markup = renderToStaticMarkup(
      createElement(
        CairnTheme,
        { appearance: "dark", theme: "slate" },
        createElement(CairnTheme, { appearance: "light" }, createElement("p", null, "Nested content")),
      ),
    );
    expect(markup).toContain('data-is-root-theme="true"');
    expect(markup).toContain('data-mode="dark"');
    expect(markup).toContain('data-mode="light"');
    expect(markup.match(/data-theme="slate"/gu)).toHaveLength(2);
  });

  it("applies a component-level token without adding a wrapper element", () => {
    const markup = renderToStaticMarkup(
      createElement(
        CairnTheme,
        { asChild: true, tokens: { "--cairn-radius-sm": "14px" } },
        createElement("button", { type: "button" }, "Action"),
      ),
    );
    expect(markup).toMatch(/^<button\b/u);
    expect(markup).toContain('style="--cairn-radius-sm:14px"');
    expect(markup).not.toContain("<div");
  });
});
