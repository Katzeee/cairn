import { useState } from "react";
import { NodeEditor, NodeHeading, type OutlineContent } from "@cairn/ui/editor";

const text = (value: string): OutlineContent => [{ type: "text", text: value }];

export default function NodeHeadingDocument() {
  const [heading, setHeading] = useState<OutlineContent>(text("Design review"));
  return (
    <NodeEditor>
      <NodeHeading
        editing={{
          onContentChange: (_, content) => setHeading(content),
          onContentCommit: (_, content) => setHeading(content),
        }}
        onEmptyBody={() => undefined}
        onEnter={() => undefined}
        target={{ accessibilityLabel: "Example document heading", content: heading, key: "example-heading" }}
      />
    </NodeEditor>
  );
}
