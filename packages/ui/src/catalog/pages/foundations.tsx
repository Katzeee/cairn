import { contract, textRoles, themeNames, themes, tones, type CairnThemeName } from "@cairn/design-tokens";
import type { CSSProperties, ReactNode } from "react";

import { Badge } from "../../components/badge.js";
import { Button } from "../../components/button.js";
import { Card } from "../../components/card.js";
import { Heading, Text } from "../../components/typography.js";
import { TextField } from "../../components/text-field.js";
import { CatalogSection, PageHeader } from "../docs/page-header.js";

type ThemeProps = Readonly<{ theme: CairnThemeName }>;
type TokenName = keyof (typeof themes)[CairnThemeName]["tokens"];

// eslint-disable-next-line cairn/no-raw-visual-values -- the foundation pages display color tokens by name
const variable = (name: string) => ({ "--swatch": `var(--${name})` }) as CSSProperties;
const token = (theme: CairnThemeName, name: TokenName) => themes[theme].tokens[name];
const colorValue = (value: string | readonly string[]) => [value].flat().join(" / ");
const definingColors = ["canvas", "navigation", "text", "primary", "link", "hover", "selected", "focus-ring"] as const;
const groupTokens = (group: keyof typeof contract.themeTokenGroups) =>
  Object.entries(contract.themeTokenGroups[group].tokens) as [TokenName, string][];

function TokenTable({ rows }: Readonly<{ rows: readonly (readonly [ReactNode, string, ReactNode])[] }>) {
  return (
    <div className="cairn-CatalogTableViewport" tabIndex={0}>
      <table className="cairn-CatalogTable">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Use</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, use, value], index) => (
            <tr key={index}>
              <th scope="row">{name}</th>
              <td className="cairn-CatalogMuted">{use}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ThemeSample() {
  return (
    <Card>
      <div className="cairn-CatalogStack">
        <div className="cairn-CatalogInline">
          <Heading as="h3" size="title-small">
            Weekly review
          </Heading>
          <Badge tone="success">On track</Badge>
        </div>
        <Text as="p" size="label" tone="muted">
          Three projects need attention before Friday.
        </Text>
        <TextField.Root aria-label="Search projects" placeholder="Search projects" />
        <div className="cairn-CatalogInline">
          <Button>Open review</Button>
          <Button variant="outline">Later</Button>
        </div>
      </div>
    </Card>
  );
}

export function ThemesPage() {
  const tokenNames = Object.keys(themes.forest.tokens) as TokenName[];
  const differences = tokenNames.filter((name) => themeNames.some((theme) => token(theme, name) !== token("forest", name)));
  return (
    <>
      <PageHeader
        description="A theme is a complete assignment of Cairn's semantic tokens. Components read only those tokens, so a theme can change color, density, shape, and elevation without any component changing."
        eyebrow="Foundations"
        title="Themes"
      />
      {themeNames.map((name) => (
        <CatalogSection description={themes[name].description} id={name} key={name} title={themes[name].label}>
          <code className="cairn-CatalogImport">{`import "@cairn/ui/themes/${name}.css";`}</code>
          <div className="cairn-CatalogThemePreviews">
            {(["light", "dark"] as const).map((appearance) => (
              <div
                className="cairn-CatalogThemePreview"
                data-cairn-appearance={appearance}
                data-cairn-theme={name}
                key={appearance}
              >
                <span className="cairn-CatalogThemePreviewLabel">{appearance}</span>
                <ThemeSample />
              </div>
            ))}
          </div>
        </CatalogSection>
      ))}
      <CatalogSection
        description="Everything else is shared. Each row is a value both themes assign differently."
        title="Where the themes differ"
      >
        <div className="cairn-CatalogTableViewport" tabIndex={0}>
          <table className="cairn-CatalogTable">
            <thead>
              <tr>
                <th scope="col">Token</th>
                {themeNames.map((name) => (
                  <th key={name} scope="col">
                    {themes[name].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {definingColors.map((color) => (
                <tr key={color}>
                  <th scope="row">
                    <code>--cairn-color-{color}</code>
                  </th>
                  {themeNames.map((name) => (
                    <td key={name}>
                      <code>{colorValue(themes[name].colors[color])}</code>
                    </td>
                  ))}
                </tr>
              ))}
              {differences.map((name) => (
                <tr key={name}>
                  <th scope="row">
                    <code>--cairn-{name}</code>
                  </th>
                  {themeNames.map((theme) => (
                    <td key={theme}>
                      <code>{token(theme, name)}</code>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CatalogSection>
      <CatalogSection
        description={
          <>
            The contract every theme fills in. The build rejects a theme that leaves any token out.
          </>
        }
        title="Anatomy of a theme"
      >
        <div className="cairn-CatalogCardGrid">
          {Object.entries(contract.colorTokenGroups).map(([id, group]) => (
            <div className="cairn-CatalogNavCard" key={id}>
              <span className="cairn-CatalogNavCardTitle">
                {group.title} <span className="cairn-CatalogMuted">· {Object.keys(group.tokens).length}</span>
              </span>
              <span className="cairn-CatalogNavCardMeta">{group.description}</span>
            </div>
          ))}
          <div className="cairn-CatalogNavCard">
            <span className="cairn-CatalogNavCardTitle">
              Tones{" "}
              <span className="cairn-CatalogMuted">
                · {tones.length} × {Object.keys(contract.toneRoles).length}
              </span>
            </span>
            <span className="cairn-CatalogNavCardMeta">Accent, neutral, and status colors for tinted components.</span>
          </div>
          {Object.entries(contract.themeTokenGroups).map(([id, group]) => (
            <div className="cairn-CatalogNavCard" key={id}>
              <span className="cairn-CatalogNavCardTitle">
                {group.title} <span className="cairn-CatalogMuted">· {Object.keys(group.tokens).length}</span>
              </span>
              <span className="cairn-CatalogNavCardMeta">{group.description}</span>
            </div>
          ))}
        </div>
      </CatalogSection>
    </>
  );
}

type ColorToken = keyof (typeof themes)[CairnThemeName]["colors"];

export function ColorPage({ theme }: ThemeProps) {
  const roleNames = Object.keys(contract.toneRoles) as (keyof typeof contract.toneRoles)[];
  return (
    <>
      <PageHeader
        description="Components use color through tokens named by purpose. A theme assigns every token in both appearances, so it can keep large areas neutral and spend its accent only where state needs it."
        eyebrow="Foundations"
        title="Color"
      />
      {Object.entries(contract.colorTokenGroups).map(([id, group]) => (
        <CatalogSection description={group.description} key={id} title={group.title}>
          <div className="cairn-CatalogSwatchList">
            {(Object.entries(group.tokens) as [ColorToken, string][]).map(([name, use]) => (
              <div className="cairn-CatalogSwatchRow" key={name}>
                <span className="cairn-CatalogSwatch" style={variable(`cairn-color-${name}`)} />
                <code>--cairn-color-{name}</code>
                <span className="cairn-CatalogMuted">{use}</span>
                <code className="cairn-CatalogMuted">{colorValue(themes[theme].colors[name])}</code>
              </div>
            ))}
          </div>
        </CatalogSection>
      ))}
      <CatalogSection
        description={
          <>
            Every tone exposes the same roles, read as <code>--cairn-&lt;tone&gt;-&lt;role&gt;</code>. Tinted
            components pick a tone and use its roles.
          </>
        }
        title="Tone roles"
      >
        <div className="cairn-CatalogTableViewport" tabIndex={0}>
          <table className="cairn-CatalogTable cairn-CatalogToneTable">
            <thead>
              <tr>
                <th scope="col">Tone</th>
                {roleNames.map((role) => (
                  <th key={role} scope="col" title={contract.toneRoles[role]}>
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tones.map((tone) => (
                <tr key={tone}>
                  <th scope="row">{tone}</th>
                  {roleNames.map((role) => (
                    <td key={role}>
                      <span
                        aria-label={`--cairn-${tone}-${role}`}
                        className="cairn-CatalogSwatch"
                        role="img"
                        style={variable(`cairn-${tone}-${role}`)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CatalogSection>
    </>
  );
}

const sample = "The quick brown fox jumps over the lazy dog.";
const chineseSample = "天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。";

export function TypographyPage({ theme }: ThemeProps) {
  const sortedRoles = [...textRoles].sort(
    (first, second) => Number.parseFloat(token(theme, `text-${first}-size`)) - Number.parseFloat(token(theme, `text-${second}-size`)),
  );
  return (
    <>
      <PageHeader
        description="A theme sets each text role's size and line height."
        eyebrow="Foundations"
        title="Typography"
      />
      <CatalogSection title="Text roles">
        <div className="cairn-CatalogTypeScale">
          {sortedRoles.map((role) => (
            <div className="cairn-CatalogTypeRow" key={role}>
              <div className="cairn-CatalogTypeMeta">
                <code>{role}</code>
                <span className="cairn-CatalogMuted">
                  {token(theme, `text-${role}-size`)} / {token(theme, `text-${role}-line-height`)}
                </span>
              </div>
              <div className="cairn-CatalogTypeSamples">
                <Text as="p" lang="en" size={role} weight={role.includes("title") || role === "display" ? "semibold" : undefined}>
                  {sample}
                </Text>
                <Text as="p" lang="zh-CN" size={role} weight={role.includes("title") || role === "display" ? "semibold" : undefined}>
                  {chineseSample}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </CatalogSection>
      <CatalogSection title="Families and weights">
        <TokenTable
          rows={groupTokens("typography")
            .filter(([name]) => !name.startsWith("text-"))
            .map(([name, use]) => [<code key={name}>--cairn-{name}</code>, use, <code key="value">{token(theme, name)}</code>])}
        />
      </CatalogSection>
    </>
  );
}

export function SpaceAndShapePage({ theme }: ThemeProps) {
  return (
    <>
      <PageHeader
        description="Spacing, corner radii, borders, and control sizes. Layout props take space steps; components pick radii by role."
        eyebrow="Foundations"
        title="Space & shape"
      />
      <CatalogSection title="Space">
        <div className="cairn-CatalogSpaceScale">
          {groupTokens("space").map(([name]) => (
            <div className="cairn-CatalogSpaceRow" key={name}>
              <code>{name.replace("space-", "")}</code>
              <span className="cairn-CatalogSpaceBar" style={variable(`cairn-${name}`)} />
              <span className="cairn-CatalogMuted">{token(theme, name)}</span>
            </div>
          ))}
        </div>
      </CatalogSection>
      <CatalogSection title="Radius">
        <div className="cairn-CatalogShapeGrid">
          {groupTokens("shape")
            .filter(([name]) => name.startsWith("radius-"))
            .map(([name, use]) => (
              <div className="cairn-CatalogShape" key={name}>
                <span className="cairn-CatalogShapeSample" style={variable(`cairn-${name}`)} />
                <code>{name.replace("radius-", "")}</code>
                <span className="cairn-CatalogMuted">{token(theme, name)}</span>
                <span className="cairn-CatalogShapeUse">{use}</span>
              </div>
            ))}
        </div>
      </CatalogSection>
      <CatalogSection title="Controls">
        <div className="cairn-CatalogInline cairn-CatalogBaseline">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button key={size} size={size} variant="outline">
              {size} · {token(theme, `control-height-${size}`)}
            </Button>
          ))}
        </div>
        <TokenTable
          rows={groupTokens("control").map(([name, use]) => [
            <code key={name}>--cairn-{name}</code>,
            use,
            <code key="value">{token(theme, name)}</code>,
          ])}
        />
      </CatalogSection>
    </>
  );
}

export function ElevationAndMotionPage({ theme }: ThemeProps) {
  return (
    <>
      <PageHeader
        description="Elevation is assigned by layer, so a theme decides which layers cast shadows. Forest keeps stationary layers flat and lifts only what floats."
        eyebrow="Foundations"
        title="Elevation & motion"
      />
      <CatalogSection title="Elevation">
        <div className="cairn-CatalogElevationGrid">
          {groupTokens("elevation")
            .filter(([name]) => name.startsWith("elevation-"))
            .map(([name, use]) => (
              <div className="cairn-CatalogElevation" key={name} style={variable(`cairn-${name}`)}>
                <code>{name.replace("elevation-", "")}</code>
                <span className="cairn-CatalogMuted">{use}</span>
                <span className="cairn-CatalogElevationValue">{token(theme, name) === "none" ? "flat" : "shadow"}</span>
              </div>
            ))}
        </div>
      </CatalogSection>
      <CatalogSection title="Motion">
        <div className="cairn-CatalogMotionGrid">
          {groupTokens("motion")
            .filter(([name]) => name.startsWith("duration-"))
            .map(([name, use]) => (
              <div className="cairn-CatalogMotion" key={name} style={variable(`cairn-${name}`)} tabIndex={0}>
                <span className="cairn-CatalogMotionTrack">
                  <span className="cairn-CatalogMotionDot" />
                </span>
                <code>{name.replace("duration-", "")}</code>
                <span className="cairn-CatalogMuted">
                  {token(theme, name)} · {use}
                </span>
              </div>
            ))}
        </div>
        <p className="cairn-CatalogMuted">
          Every transition eases with <code>{token(theme, "ease-standard")}</code>. Hover or focus a track to play it.
        </p>
      </CatalogSection>
    </>
  );
}
