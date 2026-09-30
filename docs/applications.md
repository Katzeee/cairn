# Build an application with Cairn

Cairn owns how an application looks and how its controls behave, and the application owns its data, routing, domain behavior, and platform integration; the [glossary](../CONTEXT.md) defines the terms this guide uses. An application composes Cairn's components and declares what it means, such as a primary action, a collapsible sidebar, or a danger status, and the components choose the presentation from the space and input they measure. Domain views, such as a card that describes one of the application's records, are compositions of Cairn's parts and stay in the application. When a view needs a visual rule Cairn lacks, the rule belongs in Cairn, so every application gains it; see [Develop Cairn](development.md).

## Add Cairn to an application

Add this repository as a git submodule and list its packages as npm workspaces of the application. Build `@cairn/design-tokens` and `@cairn/ui` before the application's own build or typecheck; an application typically runs both from a `build:deps` script. Cairn's test tooling is declared at this repository's root, so an application installs only what the packages need to build.

Import `@cairn/ui/styles.css` and exactly one theme stylesheet at the renderer entry point, then use components from `@cairn/ui`. An unimported theme does not enter the application bundle.

```tsx
import "@cairn/ui/styles.css";
import "@cairn/ui/themes/forest.css";
import { Button } from "@cairn/ui";

export function App() {
  return <Button>Continue</Button>;
}
```

For an application-wide appearance choice, wrap the application once in `CairnTheme`. Its `appearance` prop accepts `inherit`, `light`, or `dark`; `inherit` follows the system preference. Every color token resolves through `light-dark()`, so portaled overlays follow the same appearance.

The Outline and Node Editor components live in the separate `@cairn/ui/editor` entry. An application that imports only `@cairn/ui` never bundles the editor or its dependencies.

## Find a component

The catalog is the reference for every component: run `npm run showcase` in this repository. Each page shows the component's examples beside their source and an API table generated from the public types. An example is written as application code and imports only public entries, so it is the starting point for the same view in an application.

## Declare the navigation

Declare the application's destinations once in `AppShell.Navigation`, as `AppShell.NavItem` links grouped by `AppShell.NavGroup`; the shell chooses how they appear. An expanded shell docks them as a sidebar. A narrower shell lays up to five destinations, each with an icon, along a navigation bar, at the bottom edge of a compact upright shell and as a rail beside the content otherwise; more destinations, or any without an icon, open as a drawer from `AppShell.NavigationToggle`. A group with `placement="end"`, such as one holding Settings, sits at the bottom of a sidebar and last in a bar. A destination's `badge` counts what it holds, such as connected devices.

`AppShell.NavHeader` and `AppShell.NavFooter` hold content that is not a destination, such as a brand or a `Status`. A sidebar or a drawer shows it and a navigation bar does not, so place there only what the application also shows where the user needs it.

## Compose a view

Components expose semantic choices rather than visual ones: `variant` for action emphasis, `tone` for status, `size` of `sm`, `md`, or `lg` for controls, and text roles such as `size="label"` for typography. What each choice looks like belongs to the theme. Components accept native attributes and event handlers but no `className` or `style`, so an application's views keep the system's appearance; a needed appearance becomes a semantic variant in Cairn.

Lay out a page with `Box`, `Flex`, `Grid`, `Container`, and `Section`. Their spacing props take steps `"0"` to `"9"` of the theme's space scale or CSS lengths, and siblings are separated by the parent's `gap`. Responsive props accept objects such as `{ initial: "1", md: "3" }`, keyed by sm 600px, md 840px, lg 1200px, and xl 1600px, the widths at which `AppShell` also changes its navigation. Inside `AppShell.Main` they measure the main area's width; elsewhere, the window's.

```tsx
import { Badge, Button, Flex } from "@cairn/ui";

<Flex align="center" gap="3" justify="between" wrap="wrap">
  <Badge tone="success">Ready</Badge>
  <Button size="sm">Continue</Button>
</Flex>;
```

Choose feedback by how long it lasts and what it describes. `Status` shows the ongoing state of a process or service, such as a connection, and keeps its place while the state lasts. `Badge` labels content, such as a record's review state. `Callout` explains a condition, with any `Callout.Action` steps that resolve it, where the condition applies: in the content of the page or pane it affects, or in `AppShell.Banner` for a condition of the whole application, such as a lost connection. The banner region stays above every page, clear of the page bars and the navigation, while the application renders a callout in it, and the callout there spans the content's top edge; several stack. `toast` announces that something just happened and then leaves, so it never carries a state the user must still see.

Regions that scroll, such as the main area of an `AppShell` with `scroll="panes"` or the panes of a `ListDetail`, scroll themselves under an overlay scrollbar, so their content keeps its width as it grows.

## Connect a host

A package under `packages/hosts/` adapts one host's window chrome. `@cairn/host-tauri` exports `tauriDragRegion`, which `AppShell.Root` takes as `windowChrome` to draw the window's top row, and a stylesheet the entry point imports after the theme.

Cairn delivers every style through its stylesheets and injects no inline style or script, so a host can keep a strict content security policy such as `default-src 'self'`. Serve the host's own policy in the application's interface tests and fail on a `securitypolicyviolation` event; the tests then load the view under the rules the host applies.

## Check an application

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

## Distribute the fonts

Cairn bundles HarmonyOS Sans SC and JetBrains Mono. An application that distributes them retains their attribution and license text in its legal surface; `LegalPage` renders both. The [notices](../NOTICE.md) list the sources.
