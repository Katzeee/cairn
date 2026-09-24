import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

const rawColorPattern = /#[0-9a-fA-F]{3,8}(?![\w/-])|\b(?:rgba?|hsla?|oklch)\(/;
const arbitraryUtilityPattern =
  /(?:^|[\s"'`:])(?:bg|text|border|ring|fill|stroke|shadow|rounded|gap|[pm][trblxyse]?|space-[xy])-\[/;
const arbitraryAbsoluteSizePattern =
  /(?:^|[\s"'`:])(?:size|w|h|max-w|min-w|max-h|min-h|inset|top|right|bottom|left)-\[[^\]]*(?:px|rem)/;

const designPlugin = {
  rules: {
    "no-raw-visual-values": {
      meta: { type: "problem", schema: [], messages: { restricted: "{{message}}" } },
      create(context) {
        const check = (value, node) => {
          if (typeof value !== "string") {
            return;
          }
          if (rawColorPattern.test(value)) {
            context.report({
              node,
              messageId: "restricted",
              data: { message: "Colors resolve from semantic design tokens, never raw color literals." },
            });
          } else if (arbitraryUtilityPattern.test(value) || arbitraryAbsoluteSizePattern.test(value)) {
            context.report({
              node,
              messageId: "restricted",
              data: { message: "Token-owned utilities do not take arbitrary absolute values." },
            });
          }
        };
        return {
          Literal(node) {
            check(node.value, node);
          },
          TemplateElement(node) {
            check(node.value.cooked ?? node.value.raw, node);
          },
        };
      },
    },
  },
};

export default tseslint.config(
  { ignores: ["**/dist/**", "**/build/**", "**/node_modules/**", "**/coverage/**"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, prettier],
    plugins: { design: designPlugin },
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["packages/ui/src/**/*.{ts,tsx}"],
    rules: { "design/no-raw-visual-values": "error" },
  },
  {
    files: ["packages/ui/src/components/suggestion-list/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ group: ["**/node-editor/**", "**/catalog/**"], message: "Suggestion lists own their navigation and rendering." }],
        },
      ],
    },
  },
  {
    files: ["packages/ui/src/components/node-editor/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["**/catalog/**"], message: "The catalog depends on the editor, not the reverse." }] },
      ],
    },
  },
);
