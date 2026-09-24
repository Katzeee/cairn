import { themeVariableGroups, type tokens } from "@cairn/design-tokens";
import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";

import { cn } from "./components/cn.js";

export type CairnAppearance = "inherit" | "light" | "dark";
export type CairnThemeName = keyof typeof tokens.theme;
export type CairnTokenName = (typeof themeVariableGroups)[number]["variables"][number]["name"];
export type CairnTokenOverrides = Readonly<Partial<Record<CairnTokenName, string>>>;

export type CairnThemeProps = Readonly<{
  appearance?: CairnAppearance;
  children?: ReactNode;
  fontFamily?: string;
  theme?: CairnThemeName;
  tokens?: CairnTokenOverrides;
}>;

type ThemeContextValue = Readonly<{
  appearance: CairnAppearance;
  theme: CairnThemeName;
  variables: ReadonlyMap<string, string>;
}>;

type ThemeScopeProps = CairnThemeProps & Readonly<{ className?: string; hasBackground: boolean }>;

const ThemeContext = createContext<ThemeContextValue | null>(null);
const configurableVariables = new Set<string>(
  themeVariableGroups.flatMap(({ variables }) => variables.map(({ name }) => name)),
);

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

function ThemeScope({
  appearance = "inherit",
  children,
  className,
  fontFamily,
  hasBackground,
  theme,
  tokens: overrides,
}: ThemeScopeProps) {
  const parent = useContext(ThemeContext);
  const resolvedAppearance = appearance === "inherit" ? (parent?.appearance ?? "inherit") : appearance;
  const resolvedTheme = theme ?? parent?.theme ?? "forest";
  const localVariables = useMemo(() => themeVariables(overrides, fontFamily), [overrides, fontFamily]);
  const variables = useMemo(
    () => new Map([...(parent?.variables ?? []), ...localVariables]),
    [parent?.variables, localVariables],
  );
  const context = useMemo<ThemeContextValue>(
    () => ({ appearance: resolvedAppearance, theme: resolvedTheme, variables }),
    [resolvedAppearance, resolvedTheme, variables],
  );

  return (
    <ThemeContext.Provider value={context}>
      <div
        className={cn("cairn-theme", className)}
        data-cairn-theme=""
        data-has-background={hasBackground ? "true" : "false"}
        data-is-root-theme={parent === null ? "true" : "false"}
        data-mode={resolvedAppearance === "inherit" ? undefined : resolvedAppearance}
        data-theme={resolvedTheme}
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
