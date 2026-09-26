import { readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(repositoryRoot, "packages/ui/src");

const boundaries = [
  {
    entry: "index.ts",
    forbiddenFiles: [/^components\/node-editor\//u, /^catalog\//u],
    forbiddenPackages: [/^@tiptap\//u],
  },
];

const violations = [];
for (const boundary of boundaries) {
  const seen = new Set();
  const pending = [join(sourceRoot, boundary.entry)];
  while (pending.length > 0) {
    const path = pending.pop();
    if (seen.has(path)) {
      continue;
    }
    seen.add(path);
    const local = relative(sourceRoot, path).replaceAll("\\", "/");
    if (boundary.forbiddenFiles.some((pattern) => pattern.test(local))) {
      violations.push(`${boundary.entry} reaches ${local}`);
      continue;
    }
    for (const specifier of await importsOf(path)) {
      if (specifier.startsWith(".")) {
        pending.push(await resolveSource(join(dirname(path), specifier)));
      } else if (boundary.forbiddenPackages.some((pattern) => pattern.test(specifier))) {
        violations.push(`${boundary.entry} reaches ${specifier} through ${local}`);
      }
    }
  }
}

if (violations.length > 0) {
  throw new Error(`Cairn entry boundaries violated:\n${violations.join("\n")}`);
}
process.stdout.write("Cairn entry boundaries hold.\n");

async function importsOf(path) {
  const source = await readFile(path, "utf8");
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const specifiers = [];
  for (const statement of file.statements) {
    if (
      (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) &&
      statement.moduleSpecifier !== undefined &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      specifiers.push(statement.moduleSpecifier.text);
    }
  }
  return specifiers;
}

async function resolveSource(specifierPath) {
  const base = specifierPath.replace(/\.js$/u, "");
  for (const candidate of [`${base}.ts`, `${base}.tsx`]) {
    try {
      await readFile(candidate);
      return candidate;
    } catch {
      // Try the next source extension.
    }
  }
  throw new Error(`Cannot resolve ${specifierPath}`);
}
