import { useState } from "react";

import { NodeEditor } from "../components/node-editor/node-editor.js";
import { NodeHeading } from "../components/node-editor/node-heading.js";
import { NodeTable } from "../components/node-editor/node-table.js";
import { OutlineEmptyChild } from "../components/node-editor/outline-empty-child.js";
import { OutlineInlineContent } from "../components/node-editor/outline-tree-editor.js";
import type { OutlineContent } from "../components/node-editor/outline-content.js";
import { Specimen } from "./specimen.js";

const text = (value: string): OutlineContent => [{ type: "text", text: value }];

export function EditorParts() {
  const [heading, setHeading] = useState<OutlineContent>(text("Design review"));
  const [rows, setRows] = useState(["Buttons", "Forms"]);
  return (
    <NodeEditor>
      <Specimen
        className="block"
        title="Node heading"
        description="An editable heading inside a coordinated document region."
      >
        <div className="text-title font-semibold">
          <NodeHeading
            target={{ accessibilityLabel: "Example document heading", content: heading, key: "showcase-heading" }}
            editing={{
              onContentChange: (_, content) => setHeading(content),
              onContentCommit: (_, content) => setHeading(content),
            }}
            onEmptyBody={() => undefined}
            onEnter={() => undefined}
          />
        </div>
      </Specimen>
      <Specimen
        className="block"
        title="Node table"
        description="Columns, rows, inline cell content, and an empty-child footer receive host-owned data."
      >
        <NodeTable
          label="Example component table"
          columns={[
            { key: "component", heading: "Component" },
            { key: "purpose", heading: "Purpose" },
          ]}
          rows={rows.map((name, index) => ({
            key: name,
            cells: new Map([
              ["component", <OutlineInlineContent content={text(name)} key={`${name}-name`} />],
              [
                "purpose",
                <OutlineInlineContent content={text(index === 0 ? "Actions" : "Input")} key={`${name}-purpose`} />,
              ],
            ]),
          }))}
          footer={
            <OutlineEmptyChild
              onActivate={() => setRows((current) => [...current, `New component ${current.length + 1}`])}
              parentKey="showcase-table"
              parentLabel="Example component table"
            />
          }
        />
      </Specimen>
      <Specimen
        title="Inline content"
        description="Structured content can also be rendered outside an editable region."
      >
        <OutlineInlineContent content={text("Shared content without an editor")} />
      </Specimen>
    </NodeEditor>
  );
}
