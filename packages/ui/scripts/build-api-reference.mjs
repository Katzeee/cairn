import { readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = ts.readConfigFile(resolve(root, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(
  parsed.fileNames.filter((path) => !path.endsWith("generated-api.ts")),
  parsed.options,
);
const checker = program.getTypeChecker();
const format = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const isLocal = (node) => node.getSourceFile().fileName.replaceAll("\\", "/").includes("/packages/ui/src/");
const unwrap = (symbol) => (symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol);
const reference = {};

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
    const signature = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures()[0];
    if (!signature) continue;
    const parameter = signature.getParameters()[0];
    const parameterNode = signature.declaration?.parameters?.[0];
    const props = parameter
      ? checker.getTypeOfSymbolAtLocation(parameter, signature.declaration ?? declaration)
      : undefined;
    const defaults = new Map();
    const seenFunctions = new Set();
    const collectDefaults = (fn) => {
      if (seenFunctions.has(fn)) return;
      seenFunctions.add(fn);
      const first = fn.parameters?.[0];
      if (first && ts.isObjectBindingPattern(first.name)) {
        for (const binding of first.name.elements) {
          if (binding.initializer)
            defaults.set((binding.propertyName ?? binding.name).getText(), binding.initializer.getText());
        }
      }
      // Public wrappers forward props into Cairn's internal renderer. Its defaults remain public behavior.
      const visit = (node) => {
        if (
          (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) &&
          node.attributes.properties.some(ts.isJsxSpreadAttribute)
        ) {
          const target = checker.getSymbolAtLocation(node.tagName);
          for (const def of target ? (unwrap(target).declarations ?? []) : []) {
            if (ts.isFunctionDeclaration(def) && isLocal(def)) collectDefaults(def);
          }
        }
        ts.forEachChild(node, visit);
      };
      if (fn.body) visit(fn.body);
    };
    collectDefaults(signature.declaration ?? declaration);
    const collectVariants = (node) => {
      if (
        ts.isPropertyAssignment(node) &&
        node.name.getText() === "defaultVariants" &&
        ts.isObjectLiteralExpression(node.initializer)
      ) {
        for (const property of node.initializer.properties)
          if (ts.isPropertyAssignment(property)) defaults.set(property.name.getText(), property.initializer.getText());
      }
      ts.forEachChild(node, collectVariants);
    };
    collectVariants(declaration.getSourceFile());
    if (exported.name === "CairnTheme") defaults.set("theme", '"forest"');
    const definitions = new Map();
    const collectTypes = (node) => {
      if (ts.isIdentifier(node)) {
        const target = checker.getSymbolAtLocation(node);
        for (const def of target ? (unwrap(target).declarations ?? []) : []) {
          if (
            (ts.isTypeAliasDeclaration(def) || ts.isInterfaceDeclaration(def)) &&
            isLocal(def) &&
            !definitions.has(def.name.text)
          ) {
            definitions.set(def.name.text, def.getText());
            collectTypes(def);
          }
        }
      }
      ts.forEachChild(node, collectTypes);
    };
    if (parameterNode?.type) collectTypes(parameterNode.type);
    if (signature.declaration?.type) collectTypes(signature.declaration.type);
    if (exported.name === "resolveTheme") {
      const schema = checker.getExportsOfModule(module).find((candidate) => candidate.name === "CairnThemeDefinition");
      for (const definition of schema ? (unwrap(schema).declarations ?? []) : []) collectTypes(definition);
    }
    const own = [];
    const inherited = [];
    for (const property of props ? checker.getPropertiesOfType(props) : []) {
      const location = property.valueDeclaration ?? property.declarations?.[0] ?? declaration;
      const local = (property.declarations ?? []).some(isLocal);
      if (local) collectTypes(location);
      (local ? own : inherited).push({
        name: property.name,
        type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, location), location, format),
        required: !(property.flags & ts.SymbolFlags.Optional),
        default: defaults.get(property.name) ?? null,
        description: ts.displayPartsToString(property.getDocumentationComment(checker)),
      });
    }
    if (props && !(props.flags & ts.TypeFlags.Object) && own.length === 0 && inherited.length === 0) {
      own.push({
        name: parameter.name,
        type: checker.typeToString(props, declaration, format),
        required: !parameterNode?.questionToken && !parameterNode?.initializer,
        default: parameterNode?.initializer?.getText() ?? null,
        description: ts.displayPartsToString(parameter.getDocumentationComment(checker)),
      });
    }
    reference[exported.name] = {
      entry,
      source: relative(root, declaration.getSourceFile().fileName).replaceAll("\\", "/"),
      signature: checker.signatureToString(signature, declaration, format),
      props: own,
      inherited,
      definitions: [...definitions].map(([name, source]) => ({ name, source })),
    };
  }
}
const { componentDocs } = await import("../../design-system-catalog/dist/component-docs.js");
const documented = new Set(Object.values(componentDocs).flatMap((doc) => doc.exports));
for (const name of Object.keys(reference)) {
  if (/^[A-Z]/u.test(name) && !documented.has(name)) throw new Error(`Public component has no reference page: ${name}`);
}
for (const doc of Object.values(componentDocs)) {
  for (const name of doc.exports) if (!reference[name]) throw new Error(`No public API definition for ${name}`);
}
const output = `// Generated from the public UI and editor entries.\nimport type { ApiReference } from "./api-reference-types.js";\nexport const apiReference: ApiReference = ${JSON.stringify(reference, null, 2)};\n`;
const path = resolve(root, "src/catalog/generated-api.ts");
if ((await readFile(path, "utf8").catch(() => "")) !== output) await writeFile(path, output);
