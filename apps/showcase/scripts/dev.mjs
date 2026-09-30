import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { copyFile, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { context } from "esbuild";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ui = resolve(appRoot, "../../packages/ui");
const tokens = resolve(appRoot, "../../packages/design-tokens");
const output = join(appRoot, "build");
const port = Number(process.env.PORT ?? 4173);
const tsc = createRequire(import.meta.url).resolve("typescript/bin/tsc");

const generators = {
  tokens: [
    [tokens, "scripts/generate.mjs"],
    [tokens, tsc],
  ],
  examples: [[ui, "scripts/build-examples.mjs"]],
  api: [[ui, "scripts/build-api-reference.mjs"]],
  responsive: [[ui, "scripts/build-responsive.mjs"]],
};

// The catalog reads Cairn's sources instead of the packages' dist, so an edit reaches the page
// without rebuilding them. `npm run build` still bundles the catalog through the public entries.
const entries = {
  "@cairn/ui": join(ui, "src/index.ts"),
  "@cairn/ui/editor": join(ui, "src/editor.ts"),
  "@cairn/ui/catalog": join(ui, "src/catalog/index.ts"),
  "@cairn/ui/styles.css": join(ui, "src/styles.css"),
  "@cairn/ui/catalog.css": join(ui, "src/catalog/styles.css"),
  "@cairn/design-tokens": join(tokens, "src/index.ts"),
  "@cairn/design-tokens/tokens.css": join(tokens, "dist/tokens.css"),
};

const sources = {
  name: "cairn-sources",
  setup(build) {
    build.onResolve({ filter: /^@cairn\// }, ({ path }) => {
      const theme = /^@cairn\/ui\/themes\/(.+)$/.exec(path);
      const target = theme ? join(tokens, "dist/themes", theme[1]) : entries[path];
      return target ? { path: target } : undefined;
    });
    // Font URLs name the assets the ui build copies beside its stylesheet.
    build.onResolve({ filter: /^\.\/assets\// }, ({ path, importer }) =>
      importer.startsWith(join(ui, "src")) ? { path: join(tokens, path) } : undefined,
    );
  },
};

function exec(cwd, script) {
  return new Promise((done) => {
    spawn(process.execPath, [script], { cwd, stdio: "inherit" }).on("exit", (code) => done(code === 0));
  });
}

async function run(steps) {
  for (const [cwd, script] of steps) if (!(await exec(cwd, script))) return false;
  return true;
}

function scheduler(steps) {
  let timer;
  let running = false;
  let pending = false;
  const start = async () => {
    if (running) {
      pending = true;
      return;
    }
    running = true;
    await run(steps);
    running = false;
    if (pending) {
      pending = false;
      void start();
    }
  };
  return () => {
    clearTimeout(timer);
    timer = setTimeout(start, 100);
  };
}

if (!(await run(generators.tokens))) process.exit(1);
const prepared = await Promise.all([generators.examples, generators.api, generators.responsive].map(run));
if (prepared.includes(false)) process.exit(1);

const regenerate = Object.fromEntries(Object.entries(generators).map(([name, steps]) => [name, scheduler(steps)]));
watch(join(tokens, "tokens"), { recursive: true }, regenerate.tokens);
watch(join(ui, "src"), { recursive: true }, (_, filename) => {
  const path = filename?.replaceAll("\\", "/") ?? "";
  if (path.includes("generated/")) return;
  if (path.startsWith("catalog/examples/")) regenerate.examples();
  else if (path === "components/breakpoints.json") regenerate.responsive();
  else if (/\.tsx?$/.test(path) && !path.startsWith("catalog/")) regenerate.api();
});

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });
await copyFile(join(appRoot, "src/index.html"), join(output, "index.html"));
await copyFile(join(appRoot, "src/appearance.js"), join(output, "appearance.js"));

const catalog = await context({
  // Viewport previews are iframes of this page. Only the top window listens, which keeps previews
  // under the browser's per-host connection limit, and its reload reloads them.
  banner: {
    js: 'if (window === window.top) new EventSource("/esbuild").addEventListener("change", () => location.reload());',
  },
  bundle: true,
  define: { "process.env.NODE_ENV": '"development"' },
  entryPoints: [join(appRoot, "src/index.tsx")],
  format: "iife",
  loader: { ".ttf": "file" },
  logLevel: "info",
  outdir: output,
  platform: "browser",
  plugins: [sources],
  sourcemap: true,
  target: ["chrome120", "firefox120", "safari17"],
  tsconfig: join(appRoot, "tsconfig.json"),
});
await catalog.watch();
await catalog.serve({ host: "127.0.0.1", port, servedir: output });
process.stdout.write(`Cairn showcase: http://127.0.0.1:${port}\n`);
