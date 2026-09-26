# Cairn development guidance

Cairn is the shared visual and interaction layer for the React applications built with it. Make reusable UI decisions here so those applications keep one recognizable style. Keep domain models, routing, persistence, and Electron, Tauri, or other host APIs in the applications; components receive host data and report user intent through their public contracts.

## Design contract

The default stylesheet and components work without configuration. `CairnTheme` configures an application root with a built-in `forest` or `slate` theme or a user theme from `resolveTheme`, plus system or explicit appearance. User themes are data validated by `resolveTheme` against the same contrast requirements the token build emits; do not add another path that writes variables onto the root. Build additional catalog previews and portal scopes on the existing theme renderer so application configuration has one implementation.

Public components declare their own prop types from native element attributes and designed variants. They never accept `className`, `style`, or `render`, and never expose Base UI types. When an application needs a different appearance, add a semantic variant, size, or prop here. Cairn's own composition may style a component internally through its `Styled*` implementation, which is not exported. Layout components use Radix-style names and props with Cairn's space scale and breakpoints; they have no margin props and no `asChild`.

`@cairn/ui` must never reach the editor. The Outline and Node Editor components ship through `@cairn/ui/editor` and reach the rest of Cairn only through `node-editor/foundation.ts`.

Keyboard behavior is expressed as component actions with a default key table, as the suggestion list does. Key handlers resolve keys to actions, ignore input while composition is active, and let unhandled keys propagate, so an application-level command layer can bind or override them later.

Visual values come from semantic tokens. Change the token source when a shared color, typography, spacing, radius, or motion decision changes, then regenerate through the package build. Keep both built-in themes and both appearance modes complete and legible. For interaction primitives, follow the existing Base UI composition in neighboring components; preserve keyboard behavior, focus, and accessible names while applying Cairn's visual language.

Cards and stationary controls use color and borders to express their surface. Reserve shadows for floating layers such as dialogs, menus, and tooltips.

## Complete a change

For a public visual component, update its implementation and export, demonstrate its meaningful states in the standalone catalog, and add behavioral tests where the contract could regress. Completion means the catalog coverage check finds the export and the relevant unit or browser tests pass. When a rule applications must follow changes, update `@cairn/lint` and its tests. For a token or theme change, completion also means generated outputs build and the contrast and mode checks pass. Run the root typecheck, lint, and test scripts for implementation changes. Keep documentation claims aligned with the current public API and build setup.

## Read when relevant

For token roles, generated CSS, fonts, or contrast rules, read [the design-tokens guide](packages/design-tokens/README.md). For catalog metadata, page paths, or review vocabulary, read [the catalog guide](packages/design-system-catalog/README.md). For Outline or Node Editor contracts and terminology, read [the node editing context](packages/ui/src/components/node-editor/CONTEXT.md) before changing those components.
