# Cairn development guidance

Cairn is the shared visual and interaction layer for the React applications built with it. Make reusable UI decisions here so those applications keep one recognizable style. Keep domain models, routing, persistence, and Electron, Tauri, or other host APIs in the applications; components receive host data and report user intent through their public contracts.

## Design contract

The default stylesheet and components work without configuration. `CairnTheme` configures an application root with a built-in `forest` or `slate` theme, system or explicit appearance, global font, and exceptional global token overrides. Give each component only the semantic variants and sizes its design supports. Build additional catalog previews and portal scopes on the existing theme renderer so application configuration has one implementation.

Visual values come from semantic tokens. Change the token source when a shared color, typography, spacing, radius, or motion decision changes, then regenerate through the package build. Keep both built-in themes and both appearance modes complete and legible. For interaction primitives, follow the existing Base UI composition in neighboring components; preserve keyboard behavior, focus, and accessible names while applying Cairn's visual language.

Cards and stationary controls use color and borders to express their surface. Reserve shadows for floating layers such as dialogs, menus, and tooltips.

## Complete a change

For a public visual component, update its implementation and export, demonstrate its meaningful states in the standalone catalog, and add behavioral tests where the contract could regress. Completion means the catalog coverage check finds the export and the relevant unit or browser tests pass. For a token or theme change, completion also means generated outputs build and the contrast and mode checks pass. Run the root typecheck, lint, and test scripts for implementation changes. Keep documentation claims aligned with the current public API and build setup.

## Read when relevant

For token roles, generated CSS, fonts, or contrast rules, read [the design-tokens guide](packages/design-tokens/README.md). For catalog metadata, page paths, or review vocabulary, read [the catalog guide](packages/design-system-catalog/README.md). For Outline or Node Editor contracts and terminology, read [the node editing context](packages/ui/src/components/node-editor/CONTEXT.md) before changing those components.
