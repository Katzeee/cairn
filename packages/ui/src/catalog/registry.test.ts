import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import * as editor from "../editor.js";
import * as ui from "../index.js";
import { components } from "./registry.js";

const examplesRoot = join(dirname(fileURLToPath(import.meta.url)), "examples");
const exampleFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? exampleFiles(join(directory, entry.name)) : [join(directory, entry.name)],
  );
const examples = new Map(
  exampleFiles(examplesRoot).map((path) => [
    relative(examplesRoot, path).replaceAll("\\", "/").replace(/\.tsx$/, ""),
    readFileSync(path, "utf8"),
  ]),
);
const registered = Object.values(components).flatMap((entry) => entry.examples.map(({ id }) => id));

describe("catalog registry", () => {
  it("documents every public component", () => {
    const documented = new Set(Object.values(components).flatMap((entry) => entry.exports));
    const exported = [...Object.keys(ui), ...Object.keys(editor)].filter((name) => /^[A-Z]/.test(name));
    expect(exported.filter((name) => !documented.has(name))).toEqual([]);
  });

  it("registers exactly the example files that exist", () => {
    expect(registered.filter((id) => !examples.has(id))).toEqual([]);
    expect([...examples.keys()].filter((id) => !registered.includes(id))).toEqual([]);
  });

  it("shows examples that import only what an application can import", () => {
    const allowed = /^(react|lucide-react|@cairn\/ui|@cairn\/ui\/editor|\.\.\/\.\.\/outline-demo\/.+)$/;
    for (const [id, source] of examples) {
      const imports = [...source.matchAll(/from "([^"]+)"/g)].map((match) => match[1]!);
      expect(imports.filter((specifier) => !allowed.test(specifier)), id).toEqual([]);
    }
  });
});
