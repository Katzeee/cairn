import { themeVariableGroups, type tokens } from "@cairn/design-tokens";
import { Slot } from "@radix-ui/react-slot";
import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "./components/cn.js";

export type CairnAppearance = "inherit" | "light" | "dark";
export type CairnThemeName = keyof typeof tokens.theme;
export type CairnTokenName = (typeof themeVariableGroups)[number]["variables"][number]["name"];
export type CairnTokenOverrides = Readonly<Partial<Record<CairnTokenName, string>>>;

export type CairnThemeProps = ComponentPropsWithoutRef<"div"> &
  Readonly<{
    appearance?: CairnAppearance;
    asChild?: boolean;
    fontFamily?: string;
    hasBackground?: boolean;
    theme?: CairnThemeName;
    tokens?: CairnTokenOverrides;
  }>;

type ThemeContextValue = Readonly<{
  appearance: CairnAppearance;
  theme: CairnThemeName;
  variables: ReadonlyMap<string, string>;
}>;

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

/** One theme mechanism for the application root, nested regions, and individual components. */
export const CairnTheme = forwardRef<HTMLDivElement, CairnThemeProps>(function CairnTheme(
  {
    appearance = "inherit",
    asChild = false,
    children,
    className,
    fontFamily,
    hasBackground,
    style,
    theme,
    tokens: overrides,
    ...properties
  },
  forwardedRef,
) {
  const parent = useContext(ThemeContext);
  const resolvedAppearance = appearance === "inherit" ? (parent?.appearance ?? "inherit") : appearance;
  const resolvedTheme = theme ?? parent?.theme ?? "forest";
  const localVariables = useMemo(() => themeVariables(overrides, fontFamily), [overrides, fontFamily]);
  const variables = useMemo(
    () => new Map([...(parent?.variables ?? []), ...localVariables]),
    [parent?.variables, localVariables],
  );
  const background = hasBackground ?? (parent === null || appearance === "light" || appearance === "dark");
  const context = useMemo<ThemeContextValue>(
    () => ({ appearance: resolvedAppearance, theme: resolvedTheme, variables }),
    [resolvedAppearance, resolvedTheme, variables],
  );
  const themeStyle = {
    ...style,
    ...Object.fromEntries(variables),
  } as CSSProperties;
  const attributes = {
    ...properties,
    "data-cairn-theme": "",
    "data-is-root-theme": parent === null ? "true" : "false",
    "data-has-background": background ? "true" : "false",
    "data-mode": resolvedAppearance === "inherit" ? undefined : resolvedAppearance,
    "data-theme": resolvedTheme,
  };

  const Component = asChild ? Slot : "div";
  return (
    <ThemeContext.Provider value={context}>
      <Component {...attributes} className={cn("cairn-theme", className)} ref={forwardedRef} style={themeStyle}>
        {children}
      </Component>
    </ThemeContext.Provider>
  );
});

/** Re-establishes the nearest theme after content moves into document.body. */
export function CairnPortalTheme({ children }: Readonly<{ children: ReactNode }>) {
  const context = useContext(ThemeContext);
  if (context === null) {
    return <>{children}</>;
  }
  return (
    <CairnTheme asChild hasBackground={false}>
      <div className="contents">{children}</div>
    </CairnTheme>
  );
}
