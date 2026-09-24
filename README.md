# Cairn

Cairn is a React design system for web interfaces embedded in desktop and mobile applications. It owns the design tokens, component vocabulary, implementation, and interactive catalog. Its host application owns routing, data, and platform integration.

The repository is an npm workspace with three packages: `@cairn/design-tokens` generates typed tokens and CSS variables, `@cairn/design-system-catalog` describes the component vocabulary and review pages, and `@cairn/ui` implements the React components and catalog. The repository stays independent of any host application.

Install Node.js 22 or later, then run `npm install`, `npm run build`, `npm run typecheck`, and `npm test` from the repository root. The package names are local workspace identities; this repository does not publish them to an npm registry. A consuming application can pin this repository as a Git submodule and build these packages before bundling its own renderer.

The UI build exports a ready-to-use stylesheet at `@cairn/ui/styles.css`, together with the font asset it references. Applications import that stylesheet once in their renderer and import React components from `@cairn/ui`. The generated token CSS is also exported separately from `@cairn/design-tokens` after the build.

The HarmonyOS Sans SC font is retained unmodified with its license in `packages/design-tokens/assets`. Applications distributing the font must retain its notice and display the attribution in their legal surface.
