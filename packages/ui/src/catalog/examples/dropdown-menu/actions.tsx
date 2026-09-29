import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button, DropdownMenu, Icon } from "@cairn/ui";

export default function DropdownMenuActions() {
  const [layout, setLayout] = useState("list");
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">
          Options
          <Icon glyph={ChevronDown} size="sm" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item shortcut="Ctrl E">Rename</DropdownMenu.Item>
        <DropdownMenu.Item shortcut="Ctrl D">Duplicate</DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Move to</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Archive</DropdownMenu.Item>
            <DropdownMenu.Item>Shared projects</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Label>Layout</DropdownMenu.Label>
          <DropdownMenu.RadioGroup onValueChange={setLayout} value={layout}>
            <DropdownMenu.RadioItem value="list">List</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="board">Board</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Group>
        <DropdownMenu.CheckboxItem defaultChecked>Show completed</DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive">Delete project</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
