import { describe, expect, it } from "vitest";

import { resolveTheme } from "./theme-definition.js";

describe("resolveTheme", () => {
  it("completes a partial definition from its base theme", () => {
    const { issues, theme } = resolveTheme({ version: 1, base: "slate", colors: { dark: { "--cairn-color-ring": "#9FC4F0" } } });
    expect(issues).toEqual([]);
    expect(theme.base).toBe("slate");
    expect(theme.colors.light["--cairn-color-ring"]).toBe("#2F5E9E");
    expect(theme.colors.dark["--cairn-color-ring"]).toBe("#9FC4F0");
    expect(theme.variables.get("--cairn-color-ring")).toBe("light-dark(#2F5E9E, #9FC4F0)");
    expect(theme.variables.size).toBe(1);
  });

  it("reports and ignores entries it cannot apply", () => {
    const { issues, theme } = resolveTheme({
      version: 1,
      base: "neon",
      colors: { light: { "--cairn-color-primary": "tomato", "--cairn-color-glow": "#FFFFFF" } },
      values: {
        "--cairn-radius-sm": "4px; background: url(https://example.com)",
        "--cairn-color-card": "#FFFFFF",
        "--cairn-spacing": "3px",
      },
    });
    expect(theme.base).toBe("forest");
    expect(issues.map(({ token }) => token)).toEqual([
      undefined,
      "--cairn-color-primary",
      "--cairn-color-glow",
      "--cairn-radius-sm",
      "--cairn-color-card",
    ]);
    expect([...theme.variables]).toEqual([["--cairn-spacing", "3px"]]);
  });

  it("applies illegible colors but reports every failed contrast pair per mode", () => {
    const { issues, theme } = resolveTheme({
      version: 1,
      colors: { light: { "--cairn-color-muted-foreground": "#E0E0E0" } },
    });
    expect(theme.colors.light["--cairn-color-muted-foreground"]).toBe("#E0E0E0");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.every(({ mode, token }) => mode === "light" && token === "--cairn-color-muted-foreground")).toBe(true);
  });

  it("rejects input that is not a version 1 definition", () => {
    const { issues, theme } = resolveTheme("forest");
    expect(issues[0]?.message).toContain("version 1");
    expect(theme.variables.size).toBe(0);
  });
});
