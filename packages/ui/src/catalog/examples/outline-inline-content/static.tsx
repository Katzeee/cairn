import { OutlineInlineContent, type OutlineContent } from "@cairn/ui/editor";

const content: OutlineContent = [{ type: "text", text: "Shared content rendered without an editor" }];

export default function OutlineInlineContentStatic() {
  return <OutlineInlineContent content={content} />;
}
