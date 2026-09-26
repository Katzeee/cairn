import { themeVariableGroups } from "@cairn/design-tokens";

import { CairnPreviewTheme } from "../cairn-theme.js";
import { Alert, AlertTitle } from "../components/alert.js";
import { Badge, BadgeDot } from "../components/badge.js";
import { Button } from "../components/button.js";
import { Field, FieldLabel } from "../components/field.js";
import { Input } from "../components/input.js";
import { resolveTheme, type ResolvedCairnTheme } from "../theme-definition.js";
import { themeNames, type ThemeName, useCatalogMode } from "./catalog-theme.js";
import { PageIntro, Specimen } from "./specimen.js";

export function ThemingPage({
  onThemeChange,
  theme,
}: Readonly<{ onThemeChange(theme: ThemeName): void; theme: ThemeName }>) {
  return (
    <>
      <PageIntro
        description="Cairn provides one visual language with two built-in color themes and light and dark modes. Choose a theme for the whole application; components continue to use the same semantic roles and layouts."
        title="Theming"
      />
      <Specimen
        className="gap-2.5"
        description="Switch the application theme, then browse any page to see the same components in that style."
        title="Built-in themes"
      >
        {themeNames.map((name) => (
          <Button
            aria-pressed={theme === name}
            key={name}
            onClick={() => onThemeChange(name)}
            size="sm"
            variant={theme === name ? "primary" : "outline"}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Button>
        ))}
      </Specimen>
      <Specimen
        className="grid grid-cols-1 items-stretch gap-4 @3xl:grid-cols-2"
        description="Each built-in theme supports both modes and passes the same contrast checks in CI. These frames are catalog previews of the application-wide settings."
        title="Theme × mode"
      >
        {themeNames.map((name) => (
          <div className="flex flex-col gap-3" key={name}>
            <ThemeFrame mode="light" theme={name} />
            <ThemeFrame mode="dark" theme={name} />
          </div>
        ))}
      </Specimen>
      <UserThemeSpecimen />
      <ThemeVariablesSpecimen theme={theme} />
    </>
  );
}

/* eslint-disable cairn/no-raw-visual-values -- a user theme definition is color data by nature */
const userThemeDefinition = {
  version: 1,
  base: "forest",
  colors: {
    light: { "--cairn-color-primary": "#6B3FA0", "--cairn-color-ring": "#6B3FA0" },
    dark: { "--cairn-color-primary": "#C9A7F2", "--cairn-color-ring": "#C9A7F2" },
  },
  values: { "--cairn-radius-sm": "4px" },
} as const;
const sampleUserTheme = resolveTheme(userThemeDefinition).theme;
const illegibleEditIssues = resolveTheme({
  ...userThemeDefinition,
  colors: {
    ...userThemeDefinition.colors,
    light: { ...userThemeDefinition.colors.light, "--cairn-color-muted-foreground": "#B8B8B8" },
  },
}).issues;
/* eslint-enable cairn/no-raw-visual-values */

function UserThemeSpecimen() {
  return (
    <Specimen
      className="grid grid-cols-1 items-stretch gap-4 @3xl:grid-cols-2"
      description="Applications store user themes as data and pass them through resolveTheme. Missing values come from the base theme; invalid entries are ignored; every contrast failure is reported so the application can guide the user."
      title="User theme"
    >
      <div className="flex flex-col gap-3">
        <ThemeFrame label="user · light" mode="light" theme={sampleUserTheme} />
        <ThemeFrame label="user · dark" mode="dark" theme={sampleUserTheme} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-label font-semibold">Issues reported for a lighter muted text color</h3>
        <ul className="flex flex-col gap-2">
          {illegibleEditIssues.map((issue) => (
            <li key={`${issue.mode ?? "both"}:${issue.message}`}>
              <Alert tone="warning">
                {issue.mode === undefined ? null : <AlertTitle>{issue.mode}</AlertTitle>}
                {issue.message}
              </Alert>
            </li>
          ))}
        </ul>
      </div>
    </Specimen>
  );
}

function ThemeVariablesSpecimen({ theme }: Readonly<{ theme: ThemeName }>) {
  const mode = useCatalogMode();
  return (
    <Specimen
      className="flex-col flex-nowrap items-stretch gap-6"
      description="These semantic variables define Cairn's built-in themes. A user theme overrides any of them through a theme definition: colors per mode, other values for both modes."
      title="Variables"
    >
      {themeVariableGroups.map((group) => (
        <div className="flex flex-col gap-2" key={group.id}>
          <h3 className="text-label font-semibold">{group.title}</h3>
          <div className="overflow-hidden rounded-md border border-border">
            {group.variables.map((variable) => {
              const value = variable.values[theme][mode];
              return (
                <div
                  className="grid grid-cols-1 gap-1 border-b border-border px-3 py-2 last:border-b-0 @xl:grid-cols-2 @xl:items-center"
                  key={variable.name}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {variable.kind === "color" ? (
                      <span
                        aria-hidden
                        className="size-6 shrink-0 rounded-xs border border-border"
                        style={{ backgroundColor: value }}
                      />
                    ) : null}
                    <code className="min-w-0 break-all font-mono text-caption text-foreground">{variable.name}</code>
                  </div>
                  <code className="break-all font-mono text-caption text-muted-foreground">{value}</code>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Specimen>
  );
}

function ThemeFrame({
  label,
  mode,
  theme,
}: Readonly<{ label?: string; mode: "light" | "dark"; theme: ThemeName | ResolvedCairnTheme }>) {
  return (
    <CairnPreviewTheme
      appearance={mode}
      className="min-w-0 flex-1 rounded-xl border border-border bg-background p-4"
      theme={theme}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-caption font-semibold tracking-widest text-muted-foreground uppercase">
          {label ?? `${String(theme)} · ${mode}`}
        </p>
        <Badge tone="success">
          <BadgeDot />
          Ready
        </Badge>
      </div>
      <Field>
        <FieldLabel>Vault passphrase</FieldLabel>
        <Input placeholder="At least 8 characters" type="password" />
      </Field>
      <div className="mt-3 flex items-center gap-2">
        <Button size="sm">Unlock</Button>
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
      </div>
    </CairnPreviewTheme>
  );
}
