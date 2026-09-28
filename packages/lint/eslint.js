const rawColorPattern = /#[0-9a-fA-F]{3,8}(?![\w/-])|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/i;
const absoluteLengthPattern = /(?<![\w.-])\d*\.?\d+(?:px|rem|em|pt)\b/i;
const primitiveVariablePattern = /var\(--(?!cairn-)/;
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
          data: { message: "Colors come from Cairn color roles such as var(--cairn-color-text), never raw literals." },
        });
      } else if (primitiveVariablePattern.test(value)) {
        context.report({
          node,
          messageId: "restricted",
          data: { message: "Read Cairn semantic tokens (--cairn-*); palette steps stay behind the roles a theme binds." },
        });
      } else if (absoluteLengthPattern.test(value)) {
        context.report({
          node,
          messageId: "restricted",
          data: { message: "Lengths come from Cairn space, radius, or typography tokens." },
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
