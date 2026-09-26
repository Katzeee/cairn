const rawColorPattern = /#[0-9a-fA-F]{3,8}(?![\w/-])|\b(?:rgba?|hsla?|oklch)\(/;
const arbitraryUtilityPattern =
  /(?:^|[\s"'`:])(?:bg|text|border|ring|fill|stroke|shadow|rounded|gap|[pm][trblxyse]?|space-[xy])-\[/;
const arbitraryAbsoluteSizePattern =
  /(?:^|[\s"'`:])(?:size|w|h|max-w|min-w|max-h|min-h|inset|top|right|bottom|left)-\[[^\]]*(?:px|rem)/;
const disableDirectivePattern = /^\s*eslint-disable(?:-next-line|-line)?\b/;

const noRawVisualValues = {
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
};

const requireDisableDescription = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: { missing: "Explain why this rule is disabled: append `-- <reason>` to the directive." },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (disableDirectivePattern.test(comment.value) && !comment.value.includes("--")) {
            context.report({ loc: comment.loc, messageId: "missing" });
          }
        }
      },
    };
  },
};

export const plugin = {
  meta: { name: "@cairn/lint" },
  rules: {
    "no-raw-visual-values": noRawVisualValues,
    "require-disable-description": requireDisableDescription,
  },
};

// Applications compose Cairn's public entries and never reach its primitives or internals.
export const appConfig = {
  linterOptions: { reportUnusedDisableDirectives: "error" },
  plugins: { cairn: plugin },
  rules: {
    "cairn/no-raw-visual-values": "error",
    "cairn/require-disable-description": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          { group: ["@base-ui/*", "@base-ui/**"], message: "Use the Cairn component instead of its Base UI primitive." },
          { group: ["@tiptap/*", "@tiptap/**"], message: "Editor behavior comes from @cairn/ui/editor." },
          {
            group: ["@cairn/*/src/**", "@cairn/*/dist/**", "**/cairn/packages/**"],
            message: "Import Cairn through its package entries.",
          },
        ],
      },
    ],
  },
};
