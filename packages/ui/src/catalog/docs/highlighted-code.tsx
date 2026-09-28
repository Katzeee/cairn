import { useMemo, type ReactNode } from "react";
import { refractor } from "refractor/core";
import css from "refractor/css";
import tsx from "refractor/tsx";

refractor.register(css);
refractor.register(tsx);

export type CodeLanguage = "tsx" | "css";
type HighlightedNode = ReturnType<typeof refractor.highlight>["children"][number];

const tokenStyles: Readonly<Record<string, string>> = {
  comment: "cairn-SyntaxComment",
  "plain-text": "cairn-SyntaxText",
  imports: "cairn-SyntaxText",
  punctuation: "cairn-SyntaxPunctuation",
  operator: "cairn-SyntaxPunctuation",
  "interpolation-punctuation": "cairn-SyntaxPunctuation",
  "class-name": "cairn-SyntaxTag",
  class: "cairn-SyntaxTag",
  function: "cairn-SyntaxTag",
  "maybe-class-name": "cairn-SyntaxTag",
  selector: "cairn-SyntaxTag",
  "pseudo-class": "cairn-SyntaxTag",
  tag: "cairn-SyntaxTag",
  "attr-name": "cairn-SyntaxAttribute",
  parameter: "cairn-SyntaxAttribute",
  property: "cairn-SyntaxAttribute",
  variable: "cairn-SyntaxAttribute",
  important: "cairn-SyntaxKeyword",
  keyword: "cairn-SyntaxKeyword",
  module: "cairn-SyntaxKeyword",
  rule: "cairn-SyntaxKeyword",
  "attr-value": "cairn-SyntaxString",
  string: "cairn-SyntaxString",
  boolean: "cairn-SyntaxLiteral",
  color: "cairn-SyntaxLiteral",
  number: "cairn-SyntaxLiteral",
  unit: "cairn-SyntaxLiteral",
};

export function HighlightedCode({ source, language = "tsx" }: Readonly<{ source: string; language?: CodeLanguage }>) {
  const children = useMemo(() => refractor.highlight(source, language).children.map(renderToken), [source, language]);
  return (
    <code data-code-language={language}>{children}</code>
  );
}

function renderToken(node: HighlightedNode, index: number): ReactNode {
  if (node.type === "text") return node.value;
  if (node.type !== "element") return null;
  const classes = Array.isArray(node.properties.className) ? node.properties.className.map(String) : [];
  const tokens = classes.filter((name) => name !== "token");
  return (
    <span className={tokens.map((name) => tokenStyles[name]).find(Boolean)} data-syntax-token={tokens.join(" ")} key={index}>
      {node.children.map(renderToken)}
    </span>
  );
}
