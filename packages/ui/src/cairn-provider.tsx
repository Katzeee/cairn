import { themeVariableGroups, type tokens } from "@cairn/design-tokens";
import { createContext, useContext, useLayoutEffect, useMemo, type CSSProperties, type ReactNode } from "react";

import { cn } from "./components/cn.js";

export type CairnMode = "system" | "light" | "dark";
export type CairnThemeName = keyof typeof tokens.theme;
export type CairnTokenName = (typeof themeVariableGroups)[number]["variables"][number]["name"];
export type CairnTokenOverrides = Readonly<Partial<Record<CairnTokenName, string>>>;

export type CairnProviderProps = Readonly<{
  children: ReactNode;
  mode?: CairnMode;
  theme?: CairnThemeName;
  fontFamily?: string;
  tokens?: CairnTokenOverrides;
}>;

export type CairnThemeProps = Readonly<{
  children: ReactNode;
  className?: string;
  mode?: "inherit" | "light" | "dark";
  theme?: CairnThemeName;
  fontFamily?: string;
  tokens?: CairnTokenOverrides;
}>;

type ThemeContextValue = Readonly<{
  mode: CairnMode;
  theme: CairnThemeName;
  variables: ReadonlyMap<string, string>;
  portalContainer: HTMLElement | null;
}>;

const configurableVariables = new Set<string>(
  themeVariableGroups.flatMap(({ variables }) => variables.map(({ name }) => name)),
);
const defaultTheme: ThemeContextValue = {
  mode: "system",
  theme: "forest",
  variables: new Map(),
  portalContainer: null,
};
const ThemeContext = createContext<ThemeContextValue>(defaultTheme);

function themeVariables(overrides: CairnTokenOverrides | undefined, fontFamily: string | undefined) {
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
  return variables;
}

function variableStyle(variables: ReadonlyMap<string, string>): CSSProperties {
  return {
    ...Object.fromEntries(variables),
    color: "var(--cairn-color-foreground)",
    fontFamily: "var(--cairn-font-sans)",
  } as CSSProperties;
}

/** Sets the application theme at the document root, including root-level portals. */
export function CairnProvider({
  children,
  mode = "system",
  theme = "forest",
  fontFamily,
  tokens: overrides,
}: CairnProviderProps) {
  const variables = useMemo(() => themeVariables(overrides, fontFamily), [overrides, fontFamily]);

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
  }, [mode, theme, variables]);

  const context = useMemo<ThemeContextValue>(
    () => ({ mode, theme, variables, portalContainer: null }),
    [mode, theme, variables],
  );
  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
}

/** Themes a subtree or a single component without changing the rest of the application. */
export function CairnTheme({
  children,
  className,
  mode = "inherit",
  theme,
  fontFamily,
  tokens: overrides,
}: CairnThemeProps) {
  const parent = useContext(ThemeContext);
  const resolvedMode = mode === "inherit" ? parent.mode : mode;
  const resolvedTheme = theme ?? parent.theme;
  const localVariables = useMemo(() => themeVariables(overrides, fontFamily), [overrides, fontFamily]);
  const variables = useMemo(
    () => new Map([...parent.variables, ...localVariables]),
    [parent.variables, localVariables],
  );
  const portalContainer = useMemo(() => {
    if (typeof document === "undefined") {
      return null;
    }
    const container = document.createElement("div");
    container.dataset.cairnThemePortal = "";
    return container;
  }, []);

  useLayoutEffect(() => {
    if (portalContainer === null) {
      return;
    }
    document.body.append(portalContainer);
    return () => portalContainer.remove();
  }, [portalContainer]);

  useLayoutEffect(() => {
    if (portalContainer === null) {
      return;
    }
    portalContainer.dataset.theme = resolvedTheme;
    if (resolvedMode === "system") {
      delete portalContainer.dataset.mode;
    } else {
      portalContainer.dataset.mode = resolvedMode;
    }
    portalContainer.style.cssText = "";
    portalContainer.style.color = "var(--cairn-color-foreground)";
    portalContainer.style.fontFamily = "var(--cairn-font-sans)";
    for (const [name, value] of variables) {
      portalContainer.style.setProperty(name, value);
    }
  }, [portalContainer, resolvedMode, resolvedTheme, variables]);

  const context = useMemo<ThemeContextValue>(
    () => ({ mode: resolvedMode, theme: resolvedTheme, variables, portalContainer }),
    [resolvedMode, resolvedTheme, variables, portalContainer],
  );
  return (
    <ThemeContext.Provider value={context}>
      <div
        className={cn("contents", className)}
        data-cairn-theme=""
        data-mode={resolvedMode === "system" ? undefined : resolvedMode}
        data-theme={resolvedTheme}
        style={variableStyle(variables)}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/** Base UI portals stay inside the nearest nested Cairn theme. */
export function useCairnPortalContainer(): HTMLElement | undefined {
  return useContext(ThemeContext).portalContainer ?? undefined;
}
