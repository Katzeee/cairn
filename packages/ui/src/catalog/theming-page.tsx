import { themeVariableGroups } from "@cairn/design-tokens";

import { CairnPreviewTheme } from "../cairn-theme.js";
import { Badge, BadgeDot } from "../components/badge.js";
import { Button } from "../components/button.js";
import { Field, FieldLabel } from "../components/field.js";
import { Input } from "../components/input.js";
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
      <ThemeVariablesSpecimen theme={theme} />
    </>
  );
}

function ThemeVariablesSpecimen({ theme }: Readonly<{ theme: ThemeName }>) {
  const mode = useCatalogMode();
  return (
    <Specimen
      className="flex-col flex-nowrap items-stretch gap-6"
      description="These semantic variables define Cairn's built-in themes. Applications can override a specific variable at the application root when a global adjustment is needed."
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

function ThemeFrame({ mode, theme }: Readonly<{ mode: "light" | "dark"; theme: ThemeName }>) {
  return (
    <CairnPreviewTheme
      appearance={mode}
      className="min-w-0 flex-1 rounded-xl border border-border bg-background p-4"
      theme={theme}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-caption font-semibold tracking-widest text-muted-foreground uppercase">
          {theme} · {mode}
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
