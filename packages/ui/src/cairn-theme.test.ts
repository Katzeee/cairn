import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CairnTheme } from "./cairn-theme.js";
import { resolveTheme } from "./theme-definition.js";

describe("CairnTheme", () => {
  it("renders a resolved user theme on the application root", () => {
    const { theme } = resolveTheme({
      version: 1,
      base: "slate",
      colors: { light: { "--cairn-color-primary": "#123456" } },
      values: { "--cairn-radius-sm": "14px", "--cairn-font-sans": '"Georgia", serif' },
    });
    const markup = renderToStaticMarkup(
      createElement(CairnTheme, { appearance: "dark", theme }, createElement("p", null, "Application content")),
    );
    expect(markup).toContain('data-is-root-theme="true"');
    expect(markup).toContain('data-mode="dark"');
    expect(markup).toContain('data-theme="slate"');
    expect(markup).toContain("--cairn-color-primary:light-dark(#123456, #8FB8E8)");
    expect(markup).toContain("--cairn-radius-sm:14px");
    expect(markup).toContain("--cairn-font-sans:&quot;Georgia&quot;, serif");
  });

  it("renders a built-in theme without inline variables", () => {
    const markup = renderToStaticMarkup(createElement(CairnTheme, { theme: "forest" }, createElement("p", null, "Content")));
    expect(markup).toContain('data-theme="forest"');
    expect(markup).not.toContain("--cairn-");
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
