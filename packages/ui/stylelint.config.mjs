import { plugins } from "@cairn/lint/stylelint";

// Component stylesheets describe structure and state; every visual value comes from a theme.
export default {
  plugins,
  ignoreFiles: ["src/styles/generated/**", "src/catalog/**"],
  reportNeedlessDisables: true,
  rules: {
    "cairn/token-values": [true, { lengths: false }],
    "cairn/semantic-tokens": true,
  },
};
