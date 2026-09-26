# Cairn design tokens

This package owns the visual decisions shared by Cairn's React components and any host interface using its generated CSS variables. A token gives a value a role, such as `color.sys.light.action` or `space.md`, so components and applications do not repeat raw colors and dimensions. Color follows a reference-to-system-to-component model: reference values form the palette, system values assign theme-aware meaning, and component values appear only when a reusable component needs a more specific decision.

[`tokens/cairn.tokens.json`](tokens/cairn.tokens.json) is the source of truth in DTCG JSON format. The build validates references, light and dark role parity, and core WCAG AA contrast before generating typed JavaScript and standalone CSS artifacts. The contrast pairs and their minimum ratios are emitted as `contrastRequirements`, so user themes resolved at runtime meet the same rules as the built-in themes. It also owns the shared layout, typography, focus, shape, opacity, and motion values. Generated files are not edited directly.

The package includes the unmodified HarmonyOS Sans SC and JetBrains Mono fonts and their complete licenses. The interface and document font defaults to HarmonyOS Sans SC; code uses JetBrains Mono. Applications that bundle the fonts display the generated notices and license text in their legal surface.
