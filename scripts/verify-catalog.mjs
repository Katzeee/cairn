import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const entry = await parse(join(repositoryRoot, "packages/ui/src/index.ts"));
const components = new Set();
for (const statement of entry.statements) {
  if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
    continue;
  }
  for (const element of statement.exportClause.elements) {
    const name = element.name.text;
    if (!element.isTypeOnly && /^[A-Z]/u.test(name) && !name.endsWith("Provider")) {
      components.add(name);
    }
  }
}

const shown = new Set();
for (const directory of ["packages/ui/src/catalog", "apps/showcase/src"]) {
  for (const path of await sourceFiles(join(repositoryRoot, directory))) {
    const file = await parse(path);
    const visit = (node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        shown.add(node.tagName.getText(file));
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
  }
}

const missing = [...components].filter((name) => !shown.has(name)).sort();
if (missing.length > 0) {
  throw new Error(`Public components missing from the Cairn showcase: ${missing.join(", ")}`);
}
process.stdout.write(`Cairn showcases ${components.size} public components.\n`);

async function parse(path) {
  const source = await readFile(path, "utf8");
  return ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, extname(path) === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}

async function sourceFiles(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) {
      files.push(...(await sourceFiles(path)));
    } else if (path.endsWith(".tsx")) {
      files.push(path);
    }
  }
  return files;
}
