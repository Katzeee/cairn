import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(appRoot, "dist");
await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });

await build({
  bundle: true,
  define: { "process.env.NODE_ENV": '"production"' },
  entryPoints: [join(appRoot, "src/index.tsx")],
  format: "iife",
  loader: { ".ttf": "file" },
  logLevel: "info",
  minify: true,
  outdir: output,
  platform: "browser",
  target: ["chrome120", "firefox120", "safari17"],
});
await cp(join(appRoot, "src/index.html"), join(output, "index.html"));
