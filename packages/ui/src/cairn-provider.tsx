import { themeVariableGroups, type tokens } from "@cairn/design-tokens";
import { useLayoutEffect, type ReactNode } from "react";

export type CairnMode = "system" | "light" | "dark";
export type CairnTheme = keyof typeof tokens.theme;
export type CairnTokenName = (typeof themeVariableGroups)[number]["variables"][number]["name"];
export type CairnTokenOverrides = Readonly<Partial<Record<CairnTokenName, string>>>;

type CairnProviderProperties = Readonly<{
  children: ReactNode;
  mode?: CairnMode;
  theme?: CairnTheme;
  fontFamily?: string;
  tokens?: CairnTokenOverrides;
}>;

const configurableVariables = new Set<string>(
  themeVariableGroups.flatMap(({ variables }) => variables.map(({ name }) => name)),
);

/** Applies one application-wide theme, including overlays portaled to document.body. */
export function CairnProvider({
  children,
  mode = "system",
  theme = "forest",
  fontFamily,
  tokens: overrides,
}: CairnProviderProperties) {
  const variables = new Map<string, string>();
  for (const [name, value] of Object.entries(overrides ?? {})) {
    if (!configurableVariables.has(name)) {
      throw new Error(`Unknown Cairn theme variable: ${name}`);
    }
    if (value !== undefined) {
      variables.set(name, value);
    }
  }
  if (fontFamily !== undefined) {
    variables.set("--cairn-font-sans", fontFamily);
  }

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousMode = root.getAttribute("data-mode");
    const previousTheme = root.getAttribute("data-theme");
    const previousVariables = new Map<string, readonly [string, string]>(
      [...variables.keys()].map((name): readonly [string, readonly [string, string]] => [
        name,
        [root.style.getPropertyValue(name), root.style.getPropertyPriority(name)],
      ]),
    );

    root.setAttribute("data-theme", theme);
    if (mode === "system") {
      root.removeAttribute("data-mode");
    } else {
      root.setAttribute("data-mode", mode);
    }
    for (const [name, value] of variables) {
      root.style.setProperty(name, value);
    }

    return () => {
      if (previousMode === null) {
        root.removeAttribute("data-mode");
      } else {
        root.setAttribute("data-mode", previousMode);
      }
      if (previousTheme === null) {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", previousTheme);
      }
      for (const [name, previous] of previousVariables) {
        const [value, priority] = previous;
        if (value === "") {
          root.style.removeProperty(name);
        } else {
          root.style.setProperty(name, value, priority);
        }
      }
    };
  }, [mode, theme, fontFamily, overrides]);

  return <>{children}</>;
}
