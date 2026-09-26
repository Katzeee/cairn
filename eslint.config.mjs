import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

import { plugin as cairnPlugin } from "./packages/lint/eslint.js";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/build/**", "**/node_modules/**", "**/coverage/**"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, prettier],
    plugins: { cairn: cairnPlugin },
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["packages/ui/src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts"],
    rules: { "cairn/no-raw-visual-values": "error" },
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
    ignores: ["packages/ui/src/components/node-editor/foundation.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["**/catalog/**"], message: "The catalog depends on the editor, not the reverse." },
            { group: ["../*", "../../*"], message: "The editor reaches the rest of Cairn only through ./foundation.js." },
          ],
        },
      ],
    },
  },
);
