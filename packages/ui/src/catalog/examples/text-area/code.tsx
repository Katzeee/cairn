import { TextArea } from "@cairn/ui";

export default function TextAreaCode() {
  return (
    <TextArea
      aria-label="Script"
      monospaced
      placeholder={"import maya.cmds as cmds\nprint(cmds.ls(selection=True))"}
      rows={6}
      spellCheck={false}
    />
  );
}
