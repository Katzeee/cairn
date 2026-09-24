import { spawnSync } from "node:child_process";
import { cp } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokenAssets = resolve(packageRoot, "../design-tokens/assets");
const output = join(packageRoot, "dist");
const require = createRequire(import.meta.url);
const tailwindCli = join(dirname(require.resolve("@tailwindcss/cli/package.json")), "dist", "index.mjs");

const result = spawnSync(
  process.execPath,
  [tailwindCli, "-i", join(packageRoot, "src/styles.css"), "-o", join(output, "styles.css"), "--minify"],
  { cwd: packageRoot, stdio: "inherit" },
);
if (result.status !== 0) {
  throw new Error("Cairn stylesheet build failed");
}

await cp(tokenAssets, join(output, "assets"), { recursive: true });
