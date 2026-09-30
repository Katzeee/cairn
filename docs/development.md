# Develop Cairn

This guide describes how Cairn is built. The rules a change must follow, for components, catalog examples, and tests, are in the [repository guidance](../AGENTS.md).

## Workspace

The repository is an npm workspace:

- `packages/design-tokens` owns the token contract, the themes, the palette generator, and the font assets; its [guide](../packages/design-tokens/README.md) covers theme definitions and generated CSS.
- `packages/ui` owns the React components, their stylesheets, and the catalog.
- `packages/lint` owns the rules that applications and Cairn's own stylesheets run.
- `packages/hosts/*` each adapt one host's window chrome to Cairn's contracts.
- `apps/showcase` serves and builds the catalog without a host application: `npm run showcase` runs its watching server from Cairn's sources, and `npm run build` bundles it through the public entries.

## Layers

Cairn is built in four layers, and each layer reads only the one below it.

1. **Palette.** Each theme names a few seed colors: accent, gray, background, and four status tones. The build expands every seed into a 12-step Radix scale with alpha steps against the theme's own background.
2. **Semantic tokens.** The contract in `packages/design-tokens/tokens/contract.mjs` defines what components may read: color roles such as `--cairn-color-surface`, tone roles such as `--cairn-danger-subtle`, and theme tokens for typography, space, shape, controls, elevation, and motion. Color roles bind scale steps, so a theme has the same set of colors no matter how many components use them.
3. **Component hooks.** A few components expose optional `--cairn-<component>-*` hooks, such as `--cairn-button-primary-background` or `--cairn-card-shadow`. Each hook falls back to its semantic token.
4. **Themes.** A theme assigns every theme token, may rebind tone roles to other steps of the same scales, and may set component hooks. Forest keeps stationary surfaces flat, raises only floating layers, and uses 32, 40, and 48 pixel controls; another theme can give cards large shadows without any component changing.

The build rejects a theme that leaves a token out, assigns an unknown one, or fails a contrast check.

## Catalog

The catalog lives in `packages/ui/src/catalog`. `registry.ts` lists each component's group, description, documented exports, and examples. `outline-demo/` is the reference host behind the OutlineTree example and the editor acceptance tests.

The showcase page declares the strict content security policy that hosts such as Tauri apply, so the catalog renders what a host renders.

## Checks

Run the root `typecheck`, `lint`, and `test` scripts before finishing implementation work. `test` builds the showcase, checks catalog coverage and that the root entry never reaches the editor, and runs the token, lint-rule, unit, and editor browser tests.
