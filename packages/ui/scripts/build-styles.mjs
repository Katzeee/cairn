import { cp } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";
import "./build-responsive.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokenAssets = resolve(packageRoot, "../design-tokens/assets");
const tokenThemes = resolve(packageRoot, "../design-tokens/dist/themes");
const output = join(packageRoot, "dist");
const shared = { bundle: true, logLevel: "warning", minify: true };
await build({
  ...shared,
  entryPoints: [join(packageRoot, "src/styles.css")],
  external: ["./assets/*"],
  outfile: join(output, "styles.css"),
});
await build({
  ...shared,
  entryPoints: [join(packageRoot, "src/catalog/styles.css")],
  outfile: join(output, "catalog.css"),
});
await build({
  ...shared,
  entryPoints: [join(tokenThemes, "forest.css"), join(tokenThemes, "slate.css")],
  outdir: join(output, "themes"),
});
await cp(tokenAssets, join(output, "assets"), { recursive: true });
