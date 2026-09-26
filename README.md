# Cairn

Cairn is the shared React design system for applications with web interfaces, including interfaces hosted by Electron, Tauri, and embedded web views. It provides the visual tokens, bundled fonts, reusable components, and a standalone catalog. Applications supply their own data, routing, domain behavior, and platform integration.

## Explore the components

Use Node.js 22 or later. From the repository root, run:

```sh
npm install
npm run showcase
```

The catalog is served at `http://127.0.0.1:4173`. After `npm run build`, [its generated page](apps/showcase/dist/index.html) can also be opened directly as a local file. The catalog shows the public components, their relevant states and variants, layouts, and the built-in theme and mode combinations. The `verify:catalog` script checks that every public visual component appears in the showcase.

The repository is an npm workspace. `@cairn/design-tokens` owns the token source, generated CSS, and font assets; `@cairn/design-system-catalog` owns the review vocabulary and page metadata; `@cairn/ui` owns the React components and catalog implementation; `@cairn/lint` owns the ESLint and Stylelint rules applications run against their own code. `apps/showcase` builds the catalog without a host application. The package manifests are private; applications consume Cairn as a git submodule.

## Use the UI

Import `@cairn/ui/styles.css` once in the renderer, then use components from `@cairn/ui`. With no theme configuration, Cairn uses the forest palette, the system light or dark preference, HarmonyOS Sans SC for the interface, and JetBrains Mono for code.

```tsx
import "@cairn/ui/styles.css";
import { Button } from "@cairn/ui";

export function App() {
  return <Button>Continue</Button>;
}
```

Components expose their designed choices through props such as `variant`, `size`, and `tone`. They accept native attributes and event handlers but no `className`, `style`, or `render`, so an application cannot restyle them. Compose pages with `Box`, `Flex`, `Grid`, `Container`, and `Section`. Their spacing props take steps `"0"` to `"9"` of the shared scale, and any layout prop accepts a responsive object such as `{ initial: "1", lg: "3" }` keyed by Cairn's breakpoints. Siblings are separated by the parent's `gap`; there are no margin props. `as` selects a semantic element such as `section` or `ul`.

```tsx
import { Badge, Button, Flex } from "@cairn/ui";

<Flex align="center" gap="3" justify="between" wrap="wrap">
  <Badge tone="success">Ready</Badge>
  <Button size="sm">Continue</Button>
</Flex>;
```

The Outline and Node Editor components live in the separate `@cairn/ui/editor` entry. An application that imports only `@cairn/ui` never bundles the editor or its dependencies.

For an application-wide style change, wrap the application once in `CairnTheme`. `theme` selects `forest` or `slate`, or takes a user theme; `appearance` accepts `inherit`, `light`, or `dark`, with `inherit` following the system preference at the root. Cairn carries root settings into its portaled overlays.

A user theme is serializable data, so an application can store, import, and share it. `resolveTheme` completes a definition from its base theme, ignores entries it cannot apply, and reports every contrast failure in each mode, using the rules the token build enforces for the built-in themes. Colors are defined per mode as six-digit hex values; other values, such as radius, spacing, and fonts, apply to both modes. A replacement font must be loaded by the application unless it is already available to the browser.

```tsx
import { CairnTheme, resolveTheme } from "@cairn/ui";

const { theme, issues } = resolveTheme({
  version: 1,
  base: "slate",
  colors: { light: { "--cairn-color-primary": "#24466E" }, dark: { "--cairn-color-primary": "#8FB8E8" } },
  values: { "--cairn-radius-sm": "8px" },
});

<CairnTheme theme={theme}>{/* application */}</CairnTheme>;
```

`Card` defaults to `variant="surface"`; use `variant="muted"` for supporting content. Both are flat surfaces. Floating overlays use elevation where they need separation from the page.

## Consume Cairn in an application

Add this repository as a git submodule and list its packages as npm workspaces of the application. Build `@cairn/design-tokens`, `@cairn/design-system-catalog`, and `@cairn/ui` before the application's own build or typecheck. Cairn's test tooling is declared at this repository's root, so an application installs only what the packages need to build.

Run `@cairn/lint` in the application. Its ESLint config rejects imports of Base UI, Tiptap, and Cairn's internal paths, as well as raw color literals. Its Stylelint config limits application CSS to Cairn tokens and rejects selectors that target Cairn internals. Every rule reports an error. An exception is disabled per line with a reason after `--`, and a disable that no longer suppresses anything is itself an error.

```js
// eslint.config.mjs
import { appConfig } from "@cairn/lint/eslint";
import tseslint from "typescript-eslint";

export default [
  { files: ["src/**/*.{ts,tsx}"], languageOptions: { parser: tseslint.parser } },
  { files: ["src/**/*.{ts,tsx}"], ...appConfig },
];
```

```js
// stylelint.config.mjs
export { default } from "@cairn/lint/stylelint";
```

## Develop Cairn

The [repository guidance](AGENTS.md) records the design boundaries and completion criteria for changes. Run the root `typecheck`, `lint`, and `test` scripts before finishing implementation work; `test` builds the standalone showcase, checks catalog coverage and that the root entry never reaches the editor, and runs unit, lint-rule, and browser tests.

The bundled HarmonyOS Sans SC and JetBrains Mono files and their licenses live in `packages/design-tokens/assets`. Applications that distribute these fonts retain the corresponding attribution and license text in their legal surface.
