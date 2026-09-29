import { AppWindow, Layers, ListTree } from "lucide-react";
import { List, toast } from "@cairn/ui";

export default function ListRows() {
  return (
    <List.Root label="Recent files">
      <List.Item description="Edited today" icon={ListTree} onClick={() => toast({ title: "Opened Roadmap" })} trailing="2 KB">
        Roadmap
      </List.Item>
      <List.Item description="Edited yesterday" icon={Layers} onClick={() => toast({ title: "Opened Assets" })} trailing="18 MB">
        Assets
      </List.Item>
      <List.Item disabled icon={AppWindow} trailing="Syncing">
        Prototype
      </List.Item>
    </List.Root>
  );
}
