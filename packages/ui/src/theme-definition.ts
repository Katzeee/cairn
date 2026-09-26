import { contrastRequirements, themeVariableGroups, type tokens } from "@cairn/design-tokens";

export type CairnThemeName = keyof typeof tokens.theme;
export type CairnMode = "light" | "dark";

type ThemeVariable = (typeof themeVariableGroups)[number]["variables"][number];
export type CairnTokenName = ThemeVariable["name"];
export type CairnColorToken = Extract<ThemeVariable, { kind: "color" }>["name"];
export type CairnValueToken = Extract<ThemeVariable, { kind: "value" }>["name"];

// Serializable so applications can store, import, and share user themes.
export type CairnThemeDefinition = Readonly<{
  version: 1;
  base?: CairnThemeName;
  colors?: Readonly<{
    light?: Readonly<Partial<Record<CairnColorToken, string>>>;
    dark?: Readonly<Partial<Record<CairnColorToken, string>>>;
  }>;
  values?: Readonly<Partial<Record<CairnValueToken, string>>>;
}>;

declare const resolvedTheme: unique symbol;

export type ResolvedCairnTheme = Readonly<{
  [resolvedTheme]: true;
  base: CairnThemeName;
  colors: Readonly<Record<CairnMode, Readonly<Record<CairnColorToken, string>>>>;
  variables: ReadonlyMap<string, string>;
}>;

export type CairnThemeIssue = Readonly<{ message: string; mode?: CairnMode; token?: string }>;

const variables = themeVariableGroups.flatMap((group): readonly ThemeVariable[] => group.variables);
const colorTokens = new Set<string>(variables.filter(({ kind }) => kind === "color").map(({ name }) => name));
const valueTokens = new Set<string>(variables.filter(({ kind }) => kind === "value").map(({ name }) => name));
const builtInThemes = new Set<string>(Object.keys(variables[0]?.values ?? {}));
const modes: readonly CairnMode[] = ["light", "dark"];
const hexColor = /^#[\dA-F]{6}$/iu;
// Values land in inline custom properties; they may not escape the declaration or load resources.
const unsafeValue = /[;{}<>\\]|url\(|expression\(|@import/iu;

export function resolveTheme(definition: unknown): Readonly<{
  issues: readonly CairnThemeIssue[];
  theme: ResolvedCairnTheme;
}> {
  const issues: CairnThemeIssue[] = [];
  const source = isRecord(definition) ? definition : {};
  if (!isRecord(definition) || definition.version !== 1) {
    issues.push({ message: "A Cairn theme definition must be an object with version 1." });
  }
  const base = typeof source.base === "string" && builtInThemes.has(source.base) ? (source.base as CairnThemeName) : "forest";
  if (source.base !== undefined && source.base !== base) {
    issues.push({ message: `Unknown base theme "${String(source.base)}"; using forest.` });
  }

  const colors = Object.fromEntries(
    modes.map((mode) => [
      mode,
      Object.fromEntries(
        variables
          .filter(({ kind }) => kind === "color")
          .map(({ name, values }) => [name, (values as Record<string, Record<CairnMode, string>>)[base]![mode]]),
      ),
    ]),
  ) as Record<CairnMode, Record<CairnColorToken, string>>;
  const overridden = new Set<CairnColorToken>();
  const colorSource = isRecord(source.colors) ? source.colors : {};
  for (const mode of modes) {
    for (const [token, value] of entries(colorSource[mode])) {
      if (!colorTokens.has(token)) {
        issues.push({ message: `${token} is not a Cairn color token.`, mode, token });
      } else if (typeof value !== "string" || !hexColor.test(value)) {
        issues.push({ message: `${token} must be a six-digit hex color.`, mode, token });
      } else {
        colors[mode][token as CairnColorToken] = value;
        overridden.add(token as CairnColorToken);
      }
    }
  }

  const themeVariables = new Map<string, string>();
  for (const token of overridden) {
    const { light, dark } = { light: colors.light[token], dark: colors.dark[token] };
    themeVariables.set(token, light === dark ? light : `light-dark(${light}, ${dark})`);
  }
  for (const [token, value] of entries(source.values)) {
    if (!valueTokens.has(token)) {
      issues.push({ message: `${token} is not a Cairn value token.`, token });
    } else if (typeof value !== "string" || value.trim() === "" || value.length > 200 || unsafeValue.test(value)) {
      issues.push({ message: `${token} has an unsupported value.`, token });
    } else {
      themeVariables.set(token, value);
    }
  }

  for (const mode of modes) {
    for (const { foreground, background, minimum } of contrastRequirements) {
      const foregroundToken = `--cairn-color-${foreground}` as CairnColorToken;
      const backgroundToken = `--cairn-color-${background}` as CairnColorToken;
      const ratio = contrastRatio(colors[mode][foregroundToken], colors[mode][backgroundToken]);
      if (ratio < minimum) {
        issues.push({
          message: `${foreground} on ${background} has contrast ${ratio.toFixed(2)}; at least ${minimum} is required.`,
          mode,
          token: foregroundToken,
        });
      }
    }
  }

  const theme = { base, colors, variables: themeVariables } as unknown as ResolvedCairnTheme;
  return { issues, theme };
}

export function isResolvedTheme(theme: CairnThemeName | ResolvedCairnTheme): theme is ResolvedCairnTheme {
  return typeof theme !== "string";
}

function contrastRatio(first: string, second: string): number {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((left, right) => right - left);
  return (lighter! + 0.05) / (darker! + 0.05);
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red! + 0.7152 * green! + 0.0722 * blue!;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function entries(value: unknown): [string, unknown][] {
  return isRecord(value) ? Object.entries(value) : [];
}
