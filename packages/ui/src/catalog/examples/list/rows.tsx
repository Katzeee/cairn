import { List, toast } from "@cairn/ui";

export default function ListRows() {
  return (
    <List.Root label="Recent files">
      <List.Item description="Edited today" icon="list-tree" onClick={() => toast({ title: "Opened Roadmap" })} trailing="2 KB">
        Roadmap
      </List.Item>
      <List.Item description="Edited yesterday" icon="layers" onClick={() => toast({ title: "Opened Assets" })} trailing="18 MB">
        Assets
      </List.Item>
      <List.Item disabled icon="app-window" trailing="Syncing">
        Prototype
      </List.Item>
    </List.Root>
  );
}
