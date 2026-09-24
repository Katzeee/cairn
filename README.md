# Cairn

Cairn is the home of the React components used by applications with web interfaces, including pages embedded in Electron, Tauri, and other desktop shells. It owns the design tokens, component vocabulary, implementations, and interactive catalog. Host applications own routing, data, and platform integration; reusable components are developed here.

The repository is an npm workspace with three library packages and a standalone showcase application. `@cairn/design-tokens` generates typed tokens and CSS variables, `@cairn/design-system-catalog` describes the component vocabulary and review pages, and `@cairn/ui` implements the React components and catalog. The showcase lives in `apps/showcase` and does not depend on any host application.

Install Node.js 22 or later, run `npm install`, then run `npm run showcase` from the repository root. This builds the packages and serves a local preview at `http://127.0.0.1:4173`. The generated [showcase page](apps/showcase/dist/index.html) also opens directly as a local file after `npm run build`. The gallery demonstrates the components, their states and variants, the responsive shell, theme changes, and the outline editor. Run `npm run typecheck`, `npm run lint`, and `npm test` to verify a change.

The UI build exports a ready-to-use stylesheet at `@cairn/ui/styles.css`, together with both default fonts. Applications import that stylesheet once in their renderer and import React components from `@cairn/ui`. No provider or theme configuration is required for the default forest theme, system light or dark mode, HarmonyOS Sans SC interface font, and JetBrains Mono code font. A reusable component is implemented in `packages/ui/src/components`, exported through `packages/ui/src/index.ts`, and demonstrated in the catalog; `npm run verify:catalog` checks that every public visual component is rendered there.

Applications that need a different overall style wrap their React tree once in `CairnTheme`. Its `theme` selects the built-in `forest` or `slate` palette, while `appearance` selects `light`, `dark`, or `inherit` (the system preference at the application root). `fontFamily` changes the interface font globally; `tokens` overrides individual documented semantic variables at that same root, including the code font at `--cairn-font-mono`. A replacement font needs its own font file and `@font-face` rule unless the browser already has it. These settings are rendered as DOM attributes and CSS variables, and Cairn carries them into its portaled dialogs, menus, popovers, tooltips, and selectors.

`CairnTheme` is the application-level configuration surface. Component props such as `variant`, `size`, and `tone` express the options each component is designed to support. The `tokens` prop is an escape for an exceptional application-wide adjustment; custom colors need their own contrast review. The catalog uses the same theme renderer internally to show built-in styles side by side. This follows the useful global-theme ideas in [Radix Themes](https://www.radix-ui.com/themes/docs/components/theme) while keeping Cairn's configuration limited to the needs of the applications that share its visual language.

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
  <Button>Uses application-wide settings</Button>
</CairnTheme>;
```

The catalog's Theming page previews the built-in theme and mode combinations and lists their semantic variables. Built-in themes pass Cairn's contrast checks.

HarmonyOS Sans SC and JetBrains Mono are retained unmodified with their licenses in `packages/design-tokens/assets`. Applications distributing them keep the corresponding notices and license text in their legal surface.
