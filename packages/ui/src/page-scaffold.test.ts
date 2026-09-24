import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PageScaffold } from "./components/page-scaffold.js";

describe("PageScaffold", () => {
  it("uses stylesheet geometry so strict CSP can render both layouts", () => {
    for (const layout of ["standard", "document"] as const) {
      const markup = renderToStaticMarkup(
        createElement(PageScaffold, { children: "Content", layout, title: "Page" }),
      );
      expect(markup).toContain('class="cairn-page-scaffold');
      expect(markup).not.toContain(" style=");
    }
  });
});
