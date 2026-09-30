# Cairn

Cairn is the shared React design system for applications with web interfaces, including interfaces hosted by Electron, Tauri, and embedded web views. It gives every application one visual and interaction language, and lets each product carry its own character through a theme. Applications supply their own data, routing, domain behavior, and platform integration.

## Explore the components

Use Node.js 22 or later. From the repository root, run:

```sh
npm install
npm run showcase
```

The catalog is served at `http://127.0.0.1:4173` from Cairn's sources and reloads when a component, stylesheet, example, or theme changes. Its sidebar switches between the forest and slate themes and between light and dark appearance. Foundations pages render the token contract and each theme's values; every component page pairs live examples with their source and an API reference generated from the public TypeScript entries.

## Documentation

- [Build an application with Cairn](docs/applications.md): add Cairn to an application, compose its views, and connect a host.
- [Develop Cairn](docs/development.md): the workspace, the token layers, the catalog, and the checks behind a change to Cairn itself.

Third-party palette sources and fonts are listed in the [notices](NOTICE.md).
