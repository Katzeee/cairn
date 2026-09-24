# Cairn

Cairn is the home of the React components used by applications with web interfaces, including pages embedded in Electron, Tauri, and other desktop shells. It owns the design tokens, component vocabulary, implementations, and interactive catalog. Host applications own routing, data, and platform integration; reusable components are developed here.

The repository is an npm workspace with three library packages and a standalone showcase application. `@cairn/design-tokens` generates typed tokens and CSS variables, `@cairn/design-system-catalog` describes the component vocabulary and review pages, and `@cairn/ui` implements the React components and catalog. The showcase lives in `apps/showcase` and does not depend on any host application.

Install Node.js 22 or later, run `npm install`, then run `npm run showcase` from the repository root. This builds the packages and serves a local preview at `http://127.0.0.1:4173`. The generated [showcase page](apps/showcase/dist/index.html) also opens directly as a local file after `npm run build`. The gallery demonstrates the components, their states and variants, the responsive shell, theme changes, and the outline editor. Run `npm run typecheck`, `npm run lint`, and `npm test` to verify a change.

The UI build exports a ready-to-use stylesheet at `@cairn/ui/styles.css`, together with both default fonts. Applications import that stylesheet once in their renderer and import React components from `@cairn/ui`. No provider or theme configuration is required for the default forest theme, system light or dark mode, HarmonyOS Sans SC interface font, and JetBrains Mono code font. A reusable component is implemented in `packages/ui/src/components`, exported through `packages/ui/src/index.ts`, and demonstrated in the catalog; `npm run verify:catalog` checks that every public visual component is rendered there.

Applications that need global changes can wrap their React tree in the optional `CairnProvider`. It accepts `mode` (`system`, `light`, or `dark`), `theme` (`forest` or `slate`), `fontFamily`, and `tokens`. The `tokens` object overrides documented semantic CSS variables, including the code font at `--cairn-font-mono`. The provider applies settings to the document root so overlays rendered in portals receive the same theme, and restores earlier values when it unmounts. Use one provider at the application root.

`CairnTheme` applies the same options to a subtree. Nested scopes inherit their parent's settings unless they specify another theme, mode, font, or token value. Wrap a single component to change just that component's semantic values; its own `variant`, `size`, or `tone` props still express its action hierarchy and state. Cairn places portaled dialogs, menus, popovers, tooltips, and selectors into a matching theme container so their appearance follows the nearest scope. New portaled components use `useCairnPortalContainer` internally for the same reason. Custom CSS scoped only by an application's own wrapper class does not automatically move with a portal; use the theme and token API, or target the shared `data-theme` and `data-mode` attributes, for values that must reach overlays.

```tsx
import "@cairn/ui/styles.css";
import { CairnProvider, CairnTheme, Button } from "@cairn/ui";

<Button>Uses Cairn defaults</Button>;

<CairnProvider
  mode="dark"
  theme="slate"
  fontFamily='"Inter", system-ui, sans-serif'
  tokens={{ "--cairn-color-primary": "#8fb8e8" }}
>
  <Button>Uses application settings</Button>
</CairnProvider>;

<CairnTheme mode="dark" theme="slate">
  <Button>Only this region uses Slate Dark</Button>
  <CairnTheme tokens={{ "--cairn-radius-sm": "var(--cairn-radius-xl)" }}>
    <Button size="sm">Only this button has a larger radius</Button>
  </CairnTheme>
</CairnTheme>;
```

The catalog's Theming page lists the supported variables and previews custom values. Built-in themes pass Cairn's contrast checks; an application's custom colors need their own contrast review. The underlying `data-mode`, `data-theme`, and `--cairn-*` CSS contract also works without React configuration code.

HarmonyOS Sans SC and JetBrains Mono are retained unmodified with their licenses in `packages/design-tokens/assets`. Applications distributing them keep the corresponding notices and license text in their legal surface.
