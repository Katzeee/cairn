import { Code } from "@cairn/ui";

export default function CodeBlock() {
  return (
    <Code aria-label="Script" block>
      {`import maya.cmds as cmds

for node in cmds.ls(selection=True):
    cmds.setAttr(f"{node}.visibility", False)
print("Hidden", len(cmds.ls(selection=True)), "nodes")`}
    </Code>
  );
}
