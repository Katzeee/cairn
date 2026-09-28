import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const supportDirectory = dirname(fileURLToPath(import.meta.url));
const uiRoot = resolve(supportDirectory, "..", "..", "..");
const repositoryRoot = resolve(uiRoot, "..", "..");
const fixture = join(uiRoot, "tests", "editor", "fixture");
const output = join(uiRoot, "build", "editor-test");
const assets = join(repositoryRoot, "packages", "design-tokens", "assets");

assertTestOutput();

export default async function setup() {
  await rm(output, { force: true, recursive: true });
  await mkdir(output, { recursive: true });

  await Promise.all([
    build({
      bundle: true,
      stdin: {
        contents:
          '@import "../../dist/styles.css"; @import "../../dist/catalog.css"; @import "../../tests/editor/fixture/catalog.css"; @import "../../dist/themes/forest.css"; @import "../../dist/themes/slate.css";',
        loader: "css",
        resolveDir: output,
      },
      external: ["./assets/*"],
      logLevel: "warning",
      minify: true,
      outfile: join(output, "catalog.css"),
    }),
    build({
      bundle: true,
      define: { "process.env.NODE_ENV": '"production"' },
      entryPoints: [join(fixture, "renderer.tsx")],
      external: ["./assets/*"],
      format: "esm",
      legalComments: "none",
      loader: { ".tsx": "tsx" },
      logLevel: "warning",
      minify: true,
      outfile: join(output, "renderer.js"),
      platform: "browser",
      sourcemap: false,
      target: ["chrome142"],
      // Exercise the built public entries, without the UI source project's self-import aliases.
      tsconfigRaw: { compilerOptions: { jsx: "react-jsx" } },
    }),
    cp(join(fixture, "index.html"), join(output, "index.html")),
    cp(assets, join(output, "assets"), { recursive: true }),
  ]);

  return async () => {
    assertTestOutput();
    await rm(output, { force: true, recursive: true });
  };
}

function assertTestOutput() {
  const local = relative(uiRoot, output);
  if (local !== join("build", "editor-test")) {
    throw new Error(`Refusing to manage unexpected test output: ${output}`);
  }
}
