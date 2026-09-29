import { Copy, Pencil, Plus, Search, Settings, Trash2 } from "lucide-react";
import { Flex, Icon, IconButton } from "@cairn/ui";

export default function IconButtonVariants() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <IconButton aria-label="Add item">
        <Icon glyph={Plus} size="sm" />
      </IconButton>
      <IconButton aria-label="Search" variant="outline">
        <Icon glyph={Search} size="sm" />
      </IconButton>
      <IconButton aria-label="Edit" variant="ghost">
        <Icon glyph={Pencil} size="sm" />
      </IconButton>
      <IconButton aria-label="Delete" variant="destructive">
        <Icon glyph={Trash2} size="sm" />
      </IconButton>
      <IconButton aria-label="Settings" size="sm" variant="secondary">
        <Icon glyph={Settings} size="sm" />
      </IconButton>
      <IconButton aria-label="Copy" size="lg" variant="outline">
        <Icon glyph={Copy} />
      </IconButton>
    </Flex>
  );
}
