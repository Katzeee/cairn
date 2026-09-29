# Cairn development guidance

Cairn is the shared visual and interaction layer for the React applications built with it. Make reusable UI decisions here so those applications keep one recognizable style, and let each product's character come from its theme. Keep domain models, routing, and persistence in the applications; components receive host data and report user intent through their public contracts. `@cairn/ui` never imports Electron, Tauri, or other host APIs. A package under `packages/hosts/` connects one host's window chrome to Cairn's contracts, such as the title bar tokens and drag region, and prefers the host's own or an established plugin's behavior to reimplementing it.

## Layers

Cairn has four layers, and each reads only the one below: palette scales generated from theme seeds, the semantic contract in `packages/design-tokens/tokens/contract.mjs`, optional `--cairn-<component>-*` hooks, and themes. Component stylesheets describe structure and state and read `--cairn-*` tokens or variables they declare themselves; `@cairn/lint` enforces this for Cairn's stylesheets and for applications.

A stylistic decision belongs to a theme. Flat cards, shadows only on floating layers, and 32, 40, and 48 pixel controls are forest's values, not rules of the system; another theme may choose large shadows or denser controls. When a component needs a value no token expresses, add a semantic token to the contract and assign it in every theme, or add a component hook with a semantic fallback. Color roles bind steps of the 12-step scales; a theme changes color by changing seeds or rebinding a role to another step, never by adding a new color. Keep both themes and both appearances complete and legible; the token build fails otherwise.

## Components

Public components declare their own prop types from native element attributes and semantic choices: `variant` for action emphasis, `tone` for status, `size` of `sm`, `md`, or `lg` for controls, and text roles for typography. They never accept `className`, `style`, or `render`, and never expose Base UI types. Behavior props follow native attributes: `disabled`, `required`, `readOnly`, `invalid`, `value` / `defaultValue` / `onValueChange`, and `open` / `defaultOpen` / `onOpenChange`. Compound components expose parts as `Name.Part`. An icon prop takes an `IconGlyph`, any SVG icon component, so the application chooses its icon library; Cairn's own controls draw `lucide-react`, whose stroke style the themes are tuned for. Base UI provides the interaction primitives; WAI-ARIA APG decides keyboard behavior. Cairn's own composition positions a component through a wrapper element, never by styling the component from outside.

Every component has **counterparts** in established design systems: Apple's and HarmonyOS's, and for web-only patterns, Material, Polaris, or Primer. Before proposing a component, part, or prop, name at least two counterparts and match the **capability** they share: the responsibility, the behavior users rely on, and how it adapts to space and input. Express that capability in React and web idiom, the way Cairn's other components do, never in one framework's syntax: SwiftUI's toolbar modifiers become compound parts, and its `ToolbarSpacer` becomes the parent's `gap`. One responsibility has one home. When a proposal overlaps an existing component, merge them or move the responsibility, and delete what is left. Without two counterparts, keep the pattern in the application.

Applications declare intent, and components choose the presentation. A prop names a responsibility, a priority, or a relationship, such as a primary action, a collapsible sidebar, or a modal task; the component presents it from conditions it can measure: the space its region gets, the region's shape, the input modality, and what the host provides, such as window-control insets. No component branches on a platform name, so a narrow desktop window and a phone of the same shape get the same layout, and only host-provided chrome differs.

Keyboard behavior is expressed as component actions with a default key table, as the suggestion list does. Key handlers resolve keys to actions, ignore input while composition is active, and let unhandled keys propagate, so an application-level command layer can bind or override them later.

`@cairn/ui` must never reach the editor. The Outline and Node Editor components ship through `@cairn/ui/editor` and reach the rest of Cairn only through `node-editor/foundation.ts`.

## Catalog

Each component has an entry in `packages/ui/src/catalog/registry.ts` naming its documented exports and examples. An example is one file under `catalog/examples/<component>/<name>.tsx` that exports a default component and imports only from `react`, `lucide-react`, `@cairn/ui`, or `@cairn/ui/editor`. The catalog renders that file and shows the same file as its code, so write the example as the code an application would write. Register an example whose layout depends on the viewport with `responsive()` when its content sets the height, or `screen()` when it fills the screen; the catalog then renders it in a resizable iframe at Cairn's breakpoints. API tables are generated from the public entries.

## Tests

A test earns its place by catching a **silent regression**: a break the author of a change would miss while reviewing that change in the catalog. Appearance, layout, example copy, and the catalog's own tooling break on sight, so review in the rendered catalog covers them. Silent regressions surface only after a particular sequence, timing, or host update, or far from the code that caused them: editor content and identity, selection, undo, keyboard and IME routing, focus across asynchronous host updates, and state or event wiring an application relies on that the catalog does not exercise.

Before writing a test, name the plausible change that would break the behavior and the Cairn code at fault. The test fails on that break and keeps passing through any other change, including a redesign of the markup or styles. Write pure rules as unit tests and reach for the browser only when the behavior itself depends on focus, selection, pointer input, or layout. Cover each branch once, at the layer that owns it; behavior Cairn forwards from native elements or Base UI is tested upstream. Token generation, lint rules, public entry boundaries, and catalog registration each keep their single validation step.

When revising tests, delete any test that names no silent regression. Test count carries no value.

## Complete a change

Keep a public component's implementation, export, stylesheet, registry entry, and examples consistent, and apply the test criteria above to behavioral changes. For a token or theme change, the token build passes its contract and contrast checks and both themes render in both appearances on the catalog's foundation pages. When a rule applications must follow changes, update `@cairn/lint` and its tests.

Choose verification from the affected behavior: run relevant existing tests for logic changes, and inspect affected catalog examples for presentation changes. Run typecheck and lint for code changes; use the full test suite for shared infrastructure, package boundaries, broad behavioral refactors, or changes to test discovery and execution. Documentation-only changes need a consistency review. Report the checks actually run and any unverified behavior, and keep documentation claims aligned with the current public API and build setup.

## Read when relevant

For theme definitions, generated CSS, or fonts, read [the design-tokens guide](packages/design-tokens/README.md). For Outline or Node Editor contracts and terminology, read [the node editing context](packages/ui/src/components/node-editor/CONTEXT.md) before changing those components.
