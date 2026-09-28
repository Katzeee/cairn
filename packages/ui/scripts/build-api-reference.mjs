import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Documents every public component and every part of a compound component (Dialog.Content, …)
// from the TypeScript entries, so the catalog's property tables cannot drift from the code.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = ts.readConfigFile(resolve(root, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(
  parsed.fileNames.filter((path) => !path.includes("/catalog/")),
  parsed.options,
);
const checker = program.getTypeChecker();
const format = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const isLocal = (node) => node.getSourceFile().fileName.replaceAll("\\", "/").includes("/packages/ui/src/");
const unwrap = (symbol) => (symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol);
const reference = {};

function defaultsOf(declaration) {
  const defaults = new Map();
  const seen = new Set();
  const collect = (fn) => {
    if (seen.has(fn)) return;
    seen.add(fn);
    const first = fn.parameters?.[0];
    if (first && ts.isObjectBindingPattern(first.name)) {
      for (const binding of first.name.elements) {
        if (binding.initializer) defaults.set((binding.propertyName ?? binding.name).getText(), binding.initializer.getText());
      }
    }
    // Public wrappers forward props into an internal renderer whose defaults remain public behavior.
    const visit = (node) => {
      if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.attributes.properties.some(ts.isJsxSpreadAttribute)) {
        const target = checker.getSymbolAtLocation(node.tagName);
        for (const definition of target ? (unwrap(target).declarations ?? []) : []) {
          if (ts.isFunctionDeclaration(definition) && isLocal(definition)) collect(definition);
        }
      }
      ts.forEachChild(node, visit);
    };
    if (fn.body) visit(fn.body);
  };
  collect(declaration);
  return defaults;
}

function describe(signature, fallback) {
  const declaration = signature.declaration ?? fallback;
  const parameter = signature.getParameters()[0];
  const parameterNode = signature.declaration?.parameters?.[0];
  const props = parameter ? checker.getTypeOfSymbolAtLocation(parameter, declaration) : undefined;
  const defaults = defaultsOf(declaration);
  const own = [];
  for (const property of props ? checker.getPropertiesOfType(props) : []) {
    if (!(property.declarations ?? []).some(isLocal)) continue;
    const location = property.valueDeclaration ?? property.declarations?.[0] ?? declaration;
    own.push({
      name: property.name,
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, location), location, format),
      required: !(property.flags & ts.SymbolFlags.Optional),
      default: defaults.get(property.name) ?? null,
      description: ts.displayPartsToString(property.getDocumentationComment(checker)),
    });
  }
  if (props && !(props.flags & ts.TypeFlags.Object) && own.length === 0) {
    own.push({
      name: parameter.name,
      type: checker.typeToString(props, declaration, format),
      required: !parameterNode?.questionToken && !parameterNode?.initializer,
      default: parameterNode?.initializer?.getText() ?? null,
      description: ts.displayPartsToString(parameter.getDocumentationComment(checker)),
    });
  }
  return own;
}

for (const [file, entry] of [
  ["index.ts", "@cairn/ui"],
  ["editor.ts", "@cairn/ui/editor"],
]) {
  const index = program.getSourceFile(resolve(root, "src", file));
  const module = index && checker.getSymbolAtLocation(index);
  if (!module) throw new Error(`Missing public entry: ${file}`);
  for (const exported of checker.getExportsOfModule(module)) {
    const symbol = unwrap(exported);
    const declaration = symbol.valueDeclaration;
    if (!declaration) continue;
    const valueType = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const own = valueType.getCallSignatures()[0];
    if (own) reference[exported.name] = { entry, props: describe(own, declaration) };
    if (!/^[A-Z]/u.test(exported.name)) continue;
    for (const part of valueType.getProperties()) {
      if (!/^[A-Z]/u.test(part.name)) continue;
      const signature = checker.getTypeOfSymbolAtLocation(part, declaration).getCallSignatures()[0];
      if (signature) reference[`${exported.name}.${part.name}`] = { entry, props: describe(signature, declaration) };
    }
  }
}

const output = `// Generated from the public UI and editor entries.\nimport type { ApiReference } from "../docs/api-reference-types.js";\nexport const apiReference: ApiReference = ${JSON.stringify(reference, null, 2)};\n`;
await mkdir(resolve(root, "src/catalog/generated"), { recursive: true });
const path = resolve(root, "src/catalog/generated/api.ts");
if ((await readFile(path, "utf8").catch(() => "")) !== output) await writeFile(path, output);
