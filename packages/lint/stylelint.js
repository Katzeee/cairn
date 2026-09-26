import stylelint from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint;

const rawColorPattern = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/i;
// A 1px hairline is the only absolute length an application may write directly.
const absoluteLengthPattern = /(?<![\w.-])(?!1px\b)\d*\.?\d+(?:px|rem|em|pt)\b/i;
const internalSelectorPattern = /\.cairn-|\[data-(?:ui|cairn|pane|layout)\b/;

const tokenValuesName = "cairn/token-values";
const tokenValuesMessages = ruleMessages(tokenValuesName, {
  color: (property) => `"${property}" uses a raw color; use a var(--cairn-color-*) token.`,
  length: (property) => `"${property}" uses an absolute length; derive it from var(--cairn-spacing) or a Cairn token.`,
});

const tokenValues = createPlugin(tokenValuesName, (enabled) => (root, result) => {
  if (!enabled) {
    return;
  }
  root.walkDecls((declaration) => {
    if (declaration.prop.startsWith("--")) {
      return;
    }
    const message = rawColorPattern.test(declaration.value)
      ? tokenValuesMessages.color(declaration.prop)
      : absoluteLengthPattern.test(declaration.value)
        ? tokenValuesMessages.length(declaration.prop)
        : undefined;
    if (message !== undefined) {
      report({ message, node: declaration, result, ruleName: tokenValuesName, word: declaration.value });
    }
  });
});

const internalSelectorsName = "cairn/no-internal-selectors";
const internalSelectorsMessages = ruleMessages(internalSelectorsName, {
  rejected: (selector) => `"${selector}" targets Cairn internals; change the component in Cairn instead.`,
});

const internalSelectors = createPlugin(internalSelectorsName, (enabled) => (root, result) => {
  if (!enabled) {
    return;
  }
  root.walkRules((rule) => {
    if (internalSelectorPattern.test(rule.selector)) {
      report({
        message: internalSelectorsMessages.rejected(rule.selector),
        node: rule,
        result,
        ruleName: internalSelectorsName,
      });
    }
  });
});

export default {
  plugins: [tokenValues, internalSelectors],
  reportDescriptionlessDisables: true,
  reportNeedlessDisables: true,
  rules: {
    "cairn/token-values": true,
    "cairn/no-internal-selectors": true,
  },
};
