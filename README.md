# Cairn

Cairn is the shared React design system for applications with web interfaces, including interfaces hosted by Electron, Tauri, and embedded web views. It provides the visual tokens, bundled fonts, reusable components, and a standalone catalog. Applications supply their own data, routing, domain behavior, and platform integration.

## Explore the components

Use Node.js 22 or later. From the repository root, run:

```sh
npm install
npm run showcase
```

The catalog is served at `http://127.0.0.1:4173`. After `npm run build`, [its generated page](apps/showcase/dist/index.html) can also be opened directly as a local file. The catalog shows the public components, their relevant states and variants, layouts, and the built-in theme and mode combinations. The `verify:catalog` script checks that every public visual component appears in the showcase.

The repository is an npm workspace. `@cairn/design-tokens` owns the token source, generated CSS, and font assets; `@cairn/design-system-catalog` owns the review vocabulary and page metadata; `@cairn/ui` owns the React components and catalog implementation. `apps/showcase` builds the catalog without a host application. The package manifests are currently private and use workspace-local dependencies, so cross-repository installation and release are not configured yet.

## Use the UI

Import `@cairn/ui/styles.css` once in the renderer, then use components from `@cairn/ui`. With no theme configuration, Cairn uses the forest palette, the system light or dark preference, HarmonyOS Sans SC for the interface, and JetBrains Mono for code.

```tsx
import "@cairn/ui/styles.css";
import { Button } from "@cairn/ui";

export function App() {
  return <Button>Continue</Button>;
}
```

For an application-wide style change, wrap the application once in `CairnTheme`. `theme` selects `forest` or `slate`; `appearance` accepts `inherit`, `light`, or `dark`, with `inherit` following the system preference at the root. `fontFamily` changes the interface font. The optional `tokens` prop overrides named semantic variables across the application, including `--cairn-font-mono` for the code font. A token override has the same value in both modes, so application-defined colors need a contrast check in light and dark. A replacement font must be loaded by the application unless it is already available to the browser.

```tsx
import "@cairn/ui/styles.css";
import { Button, CairnTheme } from "@cairn/ui";

export function App() {
  return (
    <CairnTheme
      appearance="dark"
      theme="slate"
      fontFamily='"Inter", system-ui, sans-serif'
      tokens={{ "--cairn-radius-sm": "8px" }}
    >
      <Button size="sm">Continue</Button>
    </CairnTheme>
  );
}
```

`CairnTheme` configures the application root; components expose their own designed choices through props such as `variant`, `size`, and `tone`. Cairn carries root settings into its portaled overlays. The catalog's side-by-side theme previews use the same internal theme renderer.

## Develop Cairn

The [repository guidance](AGENTS.md) records the design boundaries and completion criteria for changes. Run the root `typecheck`, `lint`, and `test` scripts before finishing implementation work; `test` builds the standalone showcase and checks catalog coverage as well as unit and browser behavior.

The bundled HarmonyOS Sans SC and JetBrains Mono files and their licenses live in `packages/design-tokens/assets`. Applications that distribute these fonts retain the corresponding attribution and license text in their legal surface.
