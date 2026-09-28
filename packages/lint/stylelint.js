import stylelint from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint;

const rawColorPattern = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color|color-mix)\(/i;
const absoluteLengthPattern = /(?<![\w.-])\d*\.?\d+(?:px|rem|em|pt)\b/i;
const internalSelectorPattern = /\.cairn-|\[data-(?:ui|cairn|outline|pane|layout)\b/;
const variablePattern = /var\(\s*(--[\w-]+)/g;

const tokenValuesName = "cairn/token-values";
const tokenValuesMessages = ruleMessages(tokenValuesName, {
  color: (property) => `"${property}" uses a raw color; use a Cairn color role such as --cairn-color-text.`,
  length: (property) => `"${property}" uses an absolute length; use a Cairn space, radius, or typography token.`,
});

const tokenValues = createPlugin(tokenValuesName, (enabled, options = {}) => (root, result) => {
  if (!enabled) return;
  root.walkDecls((declaration) => {
    const message = rawColorPattern.test(declaration.value)
      ? tokenValuesMessages.color(declaration.prop)
      : options.lengths !== false && absoluteLengthPattern.test(declaration.value)
        ? tokenValuesMessages.length(declaration.prop)
        : undefined;
    if (message !== undefined) {
      report({ message, node: declaration, result, ruleName: tokenValuesName, word: declaration.value });
    }
  });
});

// Stylesheets read the semantic layer only: --cairn-* tokens, variables they declare themselves,
// and the few positioning variables Base UI sets at runtime. Palette steps such as --gray-6 stay
// behind the roles so a theme can rebind them.
const semanticTokensName = "cairn/semantic-tokens";
const semanticTokensMessages = ruleMessages(semanticTokensName, {
  rejected: (variable) => `"${variable}" is not a Cairn semantic token; use a --cairn-* role or declare it locally.`,
});
const runtimeVariables = [
  "--anchor-width",
  "--available-height",
  "--available-width",
  "--transform-origin",
  "--active-tab-left",
  "--active-tab-width",
  "--toast-swipe-movement-x",
  "--toast-swipe-movement-y",
];

const semanticTokens = createPlugin(semanticTokensName, (enabled, options = {}) => (root, result) => {
  if (!enabled) return;
  const local = new Set();
  root.walkDecls((declaration) => {
    if (declaration.prop.startsWith("--")) local.add(declaration.prop);
  });
  const allowed = new Set([...runtimeVariables, ...(options.allow ?? [])]);
  root.walkDecls((declaration) => {
    for (const [, variable] of declaration.value.matchAll(variablePattern)) {
      if (variable.startsWith("--cairn-") || local.has(variable) || allowed.has(variable)) continue;
      report({ message: semanticTokensMessages.rejected(variable), node: declaration, result, ruleName: semanticTokensName, word: variable });
    }
  });
});

const internalSelectorsName = "cairn/no-internal-selectors";
const internalSelectorsMessages = ruleMessages(internalSelectorsName, {
  rejected: (selector) => `"${selector}" targets Cairn internals; change the component in Cairn instead.`,
});

const internalSelectors = createPlugin(internalSelectorsName, (enabled) => (root, result) => {
  if (!enabled) return;
  root.walkRules((rule) => {
    if (internalSelectorPattern.test(rule.selector)) {
      report({ message: internalSelectorsMessages.rejected(rule.selector), node: rule, result, ruleName: internalSelectorsName });
    }
  });
});

export const plugins = [tokenValues, semanticTokens, internalSelectors];

export default {
  plugins,
  reportDescriptionlessDisables: true,
  reportNeedlessDisables: true,
  rules: {
    "cairn/token-values": true,
    "cairn/semantic-tokens": true,
    "cairn/no-internal-selectors": true,
  },
};
