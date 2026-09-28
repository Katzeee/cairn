import { useState } from "react";
import { NodeEditor, NodeTable, OutlineEmptyChild, OutlineInlineContent, type OutlineContent } from "@cairn/ui/editor";

const text = (value: string): OutlineContent => [{ type: "text", text: value }];

export default function NodeTableRows() {
  const [rows, setRows] = useState([
    { name: "Button", purpose: "Actions" },
    { name: "TextField", purpose: "Input" },
  ]);
  return (
    <NodeEditor>
      <NodeTable
        columns={[
          { key: "component", heading: "Component" },
          { key: "purpose", heading: "Purpose" },
        ]}
        footer={
          <OutlineEmptyChild
            onActivate={() => setRows((current) => [...current, { name: `Component ${current.length + 1}`, purpose: "—" }])}
            parentKey="example-table"
            parentLabel="Example component table"
          />
        }
        label="Example component table"
        rows={rows.map(({ name, purpose }) => ({
          key: name,
          cells: new Map([
            ["component", <OutlineInlineContent content={text(name)} key="component" />],
            ["purpose", <OutlineInlineContent content={text(purpose)} key="purpose" />],
          ]),
        }))}
      />
    </NodeEditor>
  );
}
