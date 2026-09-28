# Cairn design tokens

This package defines Cairn's semantic contract and the themes that fill it in, and builds them into CSS.

`tokens/contract.mjs` is the contract. It lists the neutral color roles and the step each binds, the tone roles every tone exposes, the theme tokens grouped by typography, space, shape, controls, elevation, and motion, the optional component hooks, and the contrast pairs every theme must pass. Components and applications read only the tokens it declares.

`tokens/themes/` holds one module per theme. A theme names hex seeds for accent, gray, and background in each appearance, a Radix scale name or a light and dark pair of hex seeds for each status tone, and a value for every theme token. It may also rebind tone roles to other steps through `colors.toneSteps`, override color roles with other palette steps through `colors.roles`, and set component hooks through `components`. Themes may share values by spreading one another, as slate spreads forest.

`scripts/generate.mjs` expands every seed with the Radix website palette generator port in `scripts/radix-palette-generator.mjs`, always against the theme's own background, so alpha steps stay consistent within a theme. It validates each theme against the contract and fails on a missing or unknown token or on a contrast pair below its minimum. It emits `dist/tokens.css` with the color roles, tone roles, and layout constants shared by every theme, and one single-block `dist/themes/<name>.css` per theme. Each color is written as `light-dark(light, dark)`, so appearance follows `color-scheme`: the root follows the system preference unless `data-cairn-appearance` is `light` or `dark`, and the same attribute scopes a preview inside a page. A theme applies at the root when the root has no `data-cairn-theme`, or to any subtree whose `data-cairn-theme` names it.

The build also emits `src/generated.ts`, which exposes the contract, theme definitions, generated palettes, and font notices to TypeScript; the catalog's foundation pages render from it. The package includes the unmodified HarmonyOS Sans SC and JetBrains Mono fonts and their complete licenses. The build verifies both pinned font hashes.
