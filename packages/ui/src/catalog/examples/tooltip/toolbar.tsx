import { Copy, Search, Settings } from "lucide-react";
import { Flex, Icon, IconButton, Tooltip } from "@cairn/ui";

// Wrap the application once in TooltipProvider so tooltips share one delay.
export default function TooltipToolbar() {
  return (
    <Flex gap="1">
      <Tooltip content="Search">
        <IconButton aria-label="Search" variant="ghost">
          <Icon glyph={Search} size="sm" />
        </IconButton>
      </Tooltip>
      <Tooltip content="Copy link">
        <IconButton aria-label="Copy link" variant="ghost">
          <Icon glyph={Copy} size="sm" />
        </IconButton>
      </Tooltip>
      <Tooltip content="Settings" side="bottom">
        <IconButton aria-label="Settings" variant="ghost">
          <Icon glyph={Settings} size="sm" />
        </IconButton>
      </Tooltip>
    </Flex>
  );
}
