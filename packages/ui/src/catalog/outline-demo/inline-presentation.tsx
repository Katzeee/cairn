import { Badge } from "../../components/badge.js";
import { outlineFormatting } from "../../components/node-editor/outline-formatting.js";
import type { OutlineInlineExtension } from "../../components/node-editor/outline-inline-extension.js";
import { demoInlineIds, demoTokenTarget } from "./inline.js";

export const demoInlineExtensions: readonly OutlineInlineExtension[] = [
  ...outlineFormatting,
  {
    id: demoInlineIds.reference,
    render: ({ children, token }) => (
      <span
        className="cairn-OutlineReference"
        data-reference-id={token === undefined ? undefined : (demoTokenTarget(token) ?? undefined)}
        data-ui="outline-reference"
      >
        {children}
      </span>
    ),
  },
  {
    id: demoInlineIds.supertag,
    render: ({ children }) => (
      <Badge
        data-ui="outline-row-badge"
        size="sm"
        tone="accent"
      >
        {children}
      </Badge>
    ),
  },
];
