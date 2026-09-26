import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";

import { cn } from "./components/cn.js";
import { isResolvedTheme, type CairnThemeName, type ResolvedCairnTheme } from "./theme-definition.js";

export type CairnAppearance = "inherit" | "light" | "dark";

export type CairnThemeProps = Readonly<{
  appearance?: CairnAppearance;
  children?: ReactNode;
  theme?: CairnThemeName | ResolvedCairnTheme;
}>;

type ThemeContextValue = Readonly<{
  appearance: CairnAppearance;
  theme: CairnThemeName;
  variables: ReadonlyMap<string, string>;
}>;

type ThemeScopeProps = CairnThemeProps & Readonly<{ className?: string; hasBackground: boolean }>;

const ThemeContext = createContext<ThemeContextValue | null>(null);
const noVariables: ReadonlyMap<string, string> = new Map();

function ThemeScope({ appearance = "inherit", children, className, hasBackground, theme }: ThemeScopeProps) {
  const parent = useContext(ThemeContext);
  const resolvedAppearance = appearance === "inherit" ? (parent?.appearance ?? "inherit") : appearance;
  const themeName = theme === undefined ? (parent?.theme ?? "forest") : isResolvedTheme(theme) ? theme.base : theme;
  const variables = theme === undefined ? (parent?.variables ?? noVariables) : isResolvedTheme(theme) ? theme.variables : noVariables;
  const context = useMemo<ThemeContextValue>(
    () => ({ appearance: resolvedAppearance, theme: themeName, variables }),
    [resolvedAppearance, themeName, variables],
  );

  return (
    <ThemeContext.Provider value={context}>
      <div
        className={cn("cairn-theme", className)}
        data-cairn-theme=""
        data-has-background={hasBackground ? "true" : "false"}
        data-is-root-theme={parent === null ? "true" : "false"}
        data-mode={resolvedAppearance === "inherit" ? undefined : resolvedAppearance}
        data-theme={themeName}
        style={Object.fromEntries(variables) as CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/** Configures the shared visual language for an application. */
export function CairnTheme(props: CairnThemeProps) {
  if (useContext(ThemeContext) !== null) {
    throw new Error("CairnTheme configures the application root; use component props within it.");
  }
  return <ThemeScope {...props} hasBackground />;
}

/** Internal catalog preview; uses the same theme renderer as the application root. */
export function CairnPreviewTheme(props: Omit<ThemeScopeProps, "hasBackground">) {
  return <ThemeScope {...props} hasBackground />;
}

/** Re-establishes the nearest theme after content moves into document.body. */
export function CairnPortalTheme({ children }: Readonly<{ children: ReactNode }>) {
  const context = useContext(ThemeContext);
  if (context === null) {
    return <>{children}</>;
  }
  return (
    <ThemeScope className="contents" hasBackground={false}>
      {children}
    </ThemeScope>
  );
}
