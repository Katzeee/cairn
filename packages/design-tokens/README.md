# Cairn design tokens

This package defines Cairn's semantic contract and the themes that fill it in, and builds them into CSS.

`tokens/contract.mjs` is the contract. It lists the color tokens grouped by purpose (layers, text and borders, interaction, focus and selection, primary action, brand), the tone roles every tone exposes, the theme tokens grouped by typography, space, shape, controls, elevation, and motion, the component tokens, and the layout constants shared by every theme. Components and applications read only the tokens it declares.

Hover, pressed, and selected states, links, the primary button, and the brand have their own color tokens rather than borrowing the accent, so a theme can keep large areas and interaction feedback neutral and spend its accent tone only on state: checked controls, the active tab, progress, and counts.

`tokens/themes/` holds one module per theme. A theme assigns every color token and every role of every tone, each a CSS color or a `[light, dark]` pair, and a value for every theme token and every component token through `tokens` and `components`. Values may be written by hand or read from generated scales: `tokens/palette.mjs` expands `[light, dark]` seed pairs into Radix-style 12-step scales with the Radix website palette generator port in `tokens/radix-scale.mjs`, always against the theme's own background, and `tone()` binds every tone role to a step. Forest and slate read every color from scales; patina writes its neutrals by hand. Themes may share values by spreading one another, as slate spreads forest.

`scripts/generate.mjs` validates each theme against the contract and fails on a missing, invalid, or unknown token. It emits `dist/tokens.css` with the shared layout constants and tone scopes, and one single-block `dist/themes/<name>.css` per theme. Each pair is written as `light-dark(light, dark)`, so appearance follows `color-scheme`: the root follows the system preference unless `data-cairn-appearance` is `light` or `dark`, and the same attribute scopes a preview inside a page. A theme applies at the root when the root has no `data-cairn-theme`, or to any subtree whose `data-cairn-theme` names it.

The `--cairn-layer-*` constants order what overlaps, lowest first: `sticky` for page bars and bottom bars inside their region, `shell` for the app shell's header, sidebar overlay, and scrim, `popup` for menus, popovers, and dialogs, `toast`, and `window-controls` for controls a host adapter draws for the window, which stay above everything the page draws. A component positions its own layers relative to one of these; an application that needs a layer uses the same constants.

The build also emits `src/generated.ts`, which exposes the contract, theme definitions, and font notices to TypeScript; the catalog's foundation pages render from it. The package includes the unmodified HarmonyOS Sans SC, Public Sans, and JetBrains Mono fonts and their complete licenses. The build verifies every pinned font hash.
