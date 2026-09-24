import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CairnTheme } from "./cairn-theme.js";

describe("CairnTheme", () => {
  it("renders the application theme and global token override in server markup", () => {
    const markup = renderToStaticMarkup(
      createElement(
        CairnTheme,
        {
          appearance: "dark",
          fontFamily: '"Georgia", serif',
          theme: "slate",
          tokens: { "--cairn-radius-sm": "14px" },
        },
        createElement("p", null, "Application content"),
      ),
    );
    expect(markup).toContain('data-is-root-theme="true"');
    expect(markup).toContain('data-mode="dark"');
    expect(markup).toContain('data-theme="slate"');
    expect(markup).toContain('--cairn-radius-sm:14px');
    expect(markup).toContain('--cairn-font-sans:&quot;Georgia&quot;, serif');
  });

  it("rejects a second application theme inside the first", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(
          CairnTheme,
          null,
          createElement(CairnTheme, { theme: "slate" }, createElement("p", null, "Nested")),
        ),
      ),
    ).toThrow("CairnTheme configures the application root");
  });
});
