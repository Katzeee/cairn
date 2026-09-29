# Cairn

Cairn is the shared React design system for applications with web interfaces, including interfaces hosted by Electron, Tauri, and embedded web views. It gives every application one visual and interaction language, and lets each product carry its own character through a theme. Applications supply their own data, routing, domain behavior, and platform integration.

## Explore the components

Use Node.js 22 or later. From the repository root, run:

```sh
npm install
npm run showcase
```

The catalog is served at `http://127.0.0.1:4173` from Cairn's sources and reloads when a component, stylesheet, example, or theme changes. Its sidebar switches between the forest and slate themes and between light and dark appearance. Foundations pages render the token contract and each theme's values directly from `@cairn/design-tokens`. Every component page pairs live examples with their source and an API reference generated from the public TypeScript entries.

## Layers

Cairn is built in four layers, and each layer reads only the one below it.

1. **Palette.** Each theme names a few seed colors: accent, gray, background, and four status tones. The build expands every seed into a 12-step Radix scale with alpha steps against the theme's own background.
2. **Semantic tokens.** The contract in `packages/design-tokens/tokens/contract.mjs` defines what components may read: color roles such as `--cairn-color-surface`, tone roles such as `--cairn-danger-subtle`, and theme tokens for typography, space, shape, controls, elevation, and motion. Color roles bind scale steps, so a theme has the same set of colors no matter how many components use them.
3. **Component hooks.** A few components expose optional `--cairn-<component>-*` hooks, such as `--cairn-button-primary-background` or `--cairn-card-shadow`. Each hook falls back to its semantic token.
4. **Themes.** A theme assigns every theme token, may rebind tone roles to other steps of the same scales, and may set component hooks. Forest keeps stationary surfaces flat, raises only floating layers, and uses 32, 40, and 48 pixel controls; another theme can give cards large shadows without any component changing.

The build rejects a theme that leaves a token out, assigns an unknown one, or fails a contrast check.

## Use the UI

Import `@cairn/ui/styles.css` and exactly one theme stylesheet at the renderer entry point, then use components from `@cairn/ui`. An unimported theme does not enter the application bundle.

```tsx
import "@cairn/ui/styles.css";
import "@cairn/ui/themes/forest.css";
import { Button } from "@cairn/ui";

export function App() {
  return <Button>Continue</Button>;
}
```

Components expose semantic choices rather than visual ones: `variant="primary" | "secondary" | "outline" | "ghost" | "destructive"` for actions, `tone="neutral" | "accent" | "info" | "success" | "warning" | "danger"` for status, `size="sm" | "md" | "lg"` for controls, and text roles such as `size="label"` for typography. What each choice looks like belongs to the theme. Components accept native attributes and event handlers but no `className` or `style`, so an application cannot restyle them; when an application needs a different appearance, add a semantic variant here.

Compose pages with `Box`, `Flex`, `Grid`, `Container`, and `Section`. Their spacing props take steps `"0"` to `"9"` of the theme's space scale or CSS lengths, and responsive props accept objects such as `{ initial: "1", md: "3" }` keyed by sm 600px, md 840px, lg 1200px, and xl 1600px, the widths at which `AppShell` also changes its navigation (sm and md). Inside `AppShell.Main` they measure the main area's width; elsewhere, the window's. Siblings are separated by the parent's `gap`; there are no margin props.

```tsx
import { Badge, Button, Flex } from "@cairn/ui";

<Flex align="center" gap="3" justify="between" wrap="wrap">
  <Badge tone="success">Ready</Badge>
  <Button size="sm">Continue</Button>
</Flex>;
```

The Outline and Node Editor components live in the separate `@cairn/ui/editor` entry. An application that imports only `@cairn/ui` never bundles the editor or its dependencies.

For an application-wide appearance choice, wrap the application once in `CairnTheme`. Its `appearance` prop accepts `inherit`, `light`, or `dark`; `inherit` follows the system preference. It sets `data-cairn-appearance` on the document root, and every color token resolves through `light-dark()`, so portaled overlays follow the same appearance.

## Consume Cairn in an application

Add this repository as a git submodule and list its packages as npm workspaces of the application. Build `@cairn/design-tokens` and `@cairn/ui` before the application's own build or typecheck. Cairn's test tooling is declared at this repository's root, so an application installs only what the packages need to build.

Run `@cairn/lint` in the application. Its ESLint config rejects imports of Base UI, Tiptap, and Cairn's internal paths, raw color and absolute length literals, and references to palette steps. Its Stylelint config requires `--cairn-*` semantic tokens for colors and lengths and rejects selectors that target Cairn internals. An exception is disabled per line with a reason after `--`, and a disable that no longer suppresses anything is itself an error.

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

The repository is an npm workspace. `@cairn/design-tokens` owns the token contract, the themes, the palette generator, and the font assets. `@cairn/ui` owns the React components, their stylesheets, and the catalog. `@cairn/lint` owns the rules applications and Cairn's own stylesheets run. `apps/showcase` builds the catalog without a host application.

The catalog lives in `packages/ui/src/catalog`. `registry.ts` lists each component's group, description, documented exports, and examples. Each example is one file under `examples/<component>/<name>.tsx` that imports only from `react`, `lucide-react`, `@cairn/ui`, or `@cairn/ui/editor`; the build renders that file as the preview and shows the same file as the code, so the two cannot drift. `outline-demo/` is the reference host behind the OutlineTree example and the editor acceptance tests.

The [repository guidance](AGENTS.md) records the design boundaries and completion criteria. Run the root `typecheck`, `lint`, and `test` scripts before finishing implementation work; `test` builds the showcase, checks catalog coverage and that the root entry never reaches the editor, and runs the token, lint-rule, unit, and editor browser tests.

The bundled HarmonyOS Sans SC and JetBrains Mono files and their licenses live in `packages/design-tokens/assets`. Applications that distribute these fonts retain the corresponding attribution and license text in their legal surface.
