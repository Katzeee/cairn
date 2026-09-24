# Cairn

Cairn is the home of the React components used by applications with web interfaces, including pages embedded in Electron, Tauri, and other desktop shells. It owns the design tokens, component vocabulary, implementations, and interactive catalog. Host applications own routing, data, and platform integration; reusable components are developed here.

The repository is an npm workspace with three library packages and a standalone showcase application. `@cairn/design-tokens` generates typed tokens and CSS variables, `@cairn/design-system-catalog` describes the component vocabulary and review pages, and `@cairn/ui` implements the React components and catalog. The showcase lives in `apps/showcase` and does not depend on any host application.

Install Node.js 22 or later, run `npm install`, then run `npm run showcase` from the repository root. This builds the packages and serves a local preview at `http://127.0.0.1:4173`. The generated [showcase page](apps/showcase/dist/index.html) also opens directly as a local file after `npm run build`. The gallery demonstrates the components, their states and variants, the responsive shell, theme changes, and the outline editor. Run `npm run typecheck`, `npm run lint`, and `npm test` to verify a change.

The UI build exports a ready-to-use stylesheet at `@cairn/ui/styles.css`, together with both default fonts. Applications import that stylesheet once in their renderer and import React components from `@cairn/ui`. No provider or theme configuration is required for the default forest theme, system light or dark mode, HarmonyOS Sans SC interface font, and JetBrains Mono code font. A reusable component is implemented in `packages/ui/src/components`, exported through `packages/ui/src/index.ts`, and demonstrated in the catalog; `npm run verify:catalog` checks that every public visual component is rendered there.

Applications that need configuration wrap their React tree in `CairnTheme`. The same component works at the application root, around a nested region, or around one component with `asChild`. It accepts `appearance` (`inherit`, `light`, or `dark`), `theme` (`forest` or `slate`), `fontFamily`, `hasBackground`, and `tokens`. The `tokens` object overrides documented semantic CSS variables, including the code font at `--cairn-font-mono`. Explicit light and dark scopes provide their own background unless `hasBackground` is false. With `appearance="inherit"`, the root follows the system preference and nested scopes inherit their parent's appearance.

Nested scopes inherit settings unless they specify another value. Component props such as `variant`, `size`, and `tone` still express each component's action hierarchy and state. Cairn re-establishes the nearest theme inside portaled dialogs, menus, popovers, tooltips, and selectors using the same `CairnTheme` implementation. A custom portal can do the same with `<CairnTheme asChild hasBackground={false}>` around its portaled root. Themes render their settings as DOM attributes and CSS variables, so server-rendered applications can render the same initial appearance before hydration without a separate global DOM mutation.

An `asChild` target must forward its received DOM props and ref to its rendered element. Cairn's leaf components do this where they expose DOM props; a custom application component used as the target must do the same. A replacement font specified with `fontFamily` also needs its own font file and `@font-face` rule unless that font is already available to the browser.

This composition follows the root theme, nested theme, and `asChild` pattern used by [Radix Themes](https://www.radix-ui.com/themes/docs/components/theme). Cairn keeps its own visual tokens and component contracts; `@radix-ui/react-slot` supplies the prop and ref merging needed by `asChild`.

```tsx
import "@cairn/ui/styles.css";
import { CairnTheme, Button } from "@cairn/ui";

<Button>Uses Cairn defaults</Button>;

<CairnTheme
  appearance="dark"
  theme="slate"
  fontFamily='"Inter", system-ui, sans-serif'
  tokens={{ "--cairn-color-primary": "#8fb8e8" }}
>
  <Button>Uses application settings</Button>
</CairnTheme>;

<CairnTheme appearance="light" theme="forest">
  <Button>Only this region uses Forest Light</Button>
  <CairnTheme asChild tokens={{ "--cairn-radius-sm": "var(--cairn-radius-xl)" }}>
    <Button size="sm">This button alone has a larger radius</Button>
  </CairnTheme>
</CairnTheme>;
```

The catalog's Theming page lists the supported variables and previews custom values. Built-in themes pass Cairn's contrast checks; an application's custom colors need their own contrast review. The underlying `data-mode`, `data-theme`, and `--cairn-*` CSS contract also works without React configuration code.

HarmonyOS Sans SC and JetBrains Mono are retained unmodified with their licenses in `packages/design-tokens/assets`. Applications distributing them keep the corresponding notices and license text in their legal surface.
