# Develop Cairn

This guide describes how Cairn is built. The rules a change must follow, for components, catalog examples, and tests, are in the [repository guidance](../AGENTS.md).

## Workspace

The repository is an npm workspace:

- `packages/design-tokens` owns the token contract, the themes, the palette helper, and the font assets; its [guide](../packages/design-tokens/README.md) covers theme definitions and generated CSS.
- `packages/ui` owns the React components, their stylesheets, and the catalog.
- `packages/lint` owns the rules that applications and Cairn's own stylesheets run.
- `packages/hosts/*` each adapt one host's window chrome to Cairn's contracts.
- `apps/showcase` serves and builds the catalog without a host application: `npm run showcase` runs its watching server from Cairn's sources, and `npm run build` bundles it through the public entries.

## Layers

Cairn is built in four layers, and each layer reads only the one below it.

1. **Palette.** A theme's own colors, private to the theme. It may write them by hand or expand seed colors into 12-step Radix scales with `packages/design-tokens/tokens/palette.mjs`. Components never see the palette.
2. **Semantic tokens.** The contract in `packages/design-tokens/tokens/contract.mjs` defines what components may read: color tokens named by purpose such as `--cairn-color-surface` or `--cairn-color-hover`, tone roles such as `--cairn-danger-subtle`, and theme tokens for typography, space, shape, controls, elevation, and motion.
3. **Component tokens.** A few components read `--cairn-<component>-*` tokens for decisions that differ between themes in that component alone, such as `--cairn-button-primary-background` or `--cairn-card-shadow`. A theme often assigns one by naming the semantic token it shares.
4. **Themes.** A theme assigns every color token, tone role, theme token, and component token. Forest keeps stationary surfaces flat, raises only floating layers, and uses 32, 40, and 48 pixel controls; another theme can give cards large shadows without any component changing.

The build rejects a theme that leaves a token out or assigns an unknown one. `npm run check:contrast --workspace @cairn/design-tokens` reports text that falls below its contrast target.

## Catalog

The catalog lives in `packages/ui/src/catalog`. `registry.ts` lists each component's group, description, documented exports, and examples. `outline-demo/` is the reference host behind the OutlineTree example and the editor acceptance tests.

The showcase page declares the strict content security policy that hosts such as Tauri apply, so the catalog renders what a host renders.

## Checks

Run the root `typecheck`, `lint`, and `test` scripts before finishing implementation work. `test` builds the showcase, checks catalog coverage and that the root entry never reaches the editor, and runs the token, lint-rule, unit, and editor browser tests.
