# Cairn development guidance

Cairn is the shared visual and interaction layer for the React applications built with it. Make reusable UI decisions here so those applications keep one recognizable style, and let each product's character come from its theme. Keep domain models, routing, persistence, and Electron, Tauri, or other host APIs in the applications; components receive host data and report user intent through their public contracts.

## Layers

Cairn has four layers, and each reads only the one below: palette scales generated from theme seeds, the semantic contract in `packages/design-tokens/tokens/contract.mjs`, optional `--cairn-<component>-*` hooks, and themes. Component stylesheets describe structure and state and read `--cairn-*` tokens or variables they declare themselves; `@cairn/lint` enforces this for Cairn's stylesheets and for applications.

A stylistic decision belongs to a theme. Flat cards, shadows only on floating layers, and 32, 40, and 48 pixel controls are forest's values, not rules of the system; another theme may choose large shadows or denser controls. When a component needs a value no token expresses, add a semantic token to the contract and assign it in every theme, or add a component hook with a semantic fallback. Color roles bind steps of the 12-step scales; a theme changes color by changing seeds or rebinding a role to another step, never by adding a new color. Keep both themes and both appearances complete and legible; the token build fails otherwise.

## Components

Public components declare their own prop types from native element attributes and semantic choices: `variant` for action emphasis, `tone` for status, `size` of `sm`, `md`, or `lg` for controls, and text roles for typography. They never accept `className`, `style`, or `render`, and never expose Base UI types. Behavior props follow native attributes: `disabled`, `required`, `readOnly`, `invalid`, `value` / `defaultValue` / `onValueChange`, and `open` / `defaultOpen` / `onOpenChange`. Compound components expose parts as `Name.Part`. Base UI provides the interaction primitives; WAI-ARIA APG decides keyboard behavior. Cairn's own composition positions a component through a wrapper element, never by styling the component from outside.

Keyboard behavior is expressed as component actions with a default key table, as the suggestion list does. Key handlers resolve keys to actions, ignore input while composition is active, and let unhandled keys propagate, so an application-level command layer can bind or override them later.

`@cairn/ui` must never reach the editor. The Outline and Node Editor components ship through `@cairn/ui/editor` and reach the rest of Cairn only through `node-editor/foundation.ts`.

## Catalog

Each component has an entry in `packages/ui/src/catalog/registry.ts` naming its documented exports and examples. An example is one file under `catalog/examples/<component>/<name>.tsx` that exports a default component and imports only from `react`, `@cairn/ui`, or `@cairn/ui/editor`. The catalog renders that file and shows the same file as its code, so write the example as the code an application would write. API tables are generated from the public entries.

## Tests

Automated tests protect behavior Cairn owns: editor content and identity preservation, selection, undo, keyboard and IME routing, focus across asynchronous host updates, and component state or event wiring that Cairn adds to native elements or Base UI. Keep representative integration coverage for boundaries that can break despite working parts, such as notifications reaching their provider, responsive navigation reaching its destination, and example interactions staying inside their preview. Token generation, lint rules, public entry boundaries, and catalog registration each have one owning validation layer.

Before adding a test, identify the concrete failure, the Cairn code responsible, and the observable result that would fail if that code were broken. Exercise pure rules in unit tests; use a browser only when focus, selection, pointer interaction, layout-dependent behavior, or module integration requires it. Cover distinct branches at the owning layer and one representative path through higher layers. A regression test must exercise the cause of the regression rather than merely assert the surrounding markup.

Review typography, colors, spacing, alignment, example copy, and variant presentation in the rendered catalog. These changes do not require new automated tests by default. Do not freeze incidental DOM structure, class names, exact pixel values, icon or example counts, or duplicate native/Base UI behavior that Cairn only forwards. Geometry assertions belong only where a spatial relationship is necessary for an interaction to work. When revising tests, remove assertions with no current behavioral purpose instead of preserving them to maintain test counts.

## Complete a change

Keep a public component's implementation, export, stylesheet, registry entry, and examples consistent, and apply the test criteria above to behavioral changes. For a token or theme change, the token build passes its contract and contrast checks and both themes render in both appearances on the catalog's foundation pages. When a rule applications must follow changes, update `@cairn/lint` and its tests.

Choose verification from the affected behavior: run relevant existing tests for logic changes, and inspect affected catalog examples for presentation changes. Run typecheck and lint for code changes; use the full test suite for shared infrastructure, package boundaries, broad behavioral refactors, or changes to test discovery and execution. Documentation-only changes need a consistency review. Report the checks actually run and any unverified behavior, and keep documentation claims aligned with the current public API and build setup.

## Read when relevant

For theme definitions, generated CSS, or fonts, read [the design-tokens guide](packages/design-tokens/README.md). For Outline or Node Editor contracts and terminology, read [the node editing context](packages/ui/src/components/node-editor/CONTEXT.md) before changing those components.
