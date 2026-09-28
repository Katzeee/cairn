import { Flex, Icon, IconButton, Tooltip } from "@cairn/ui";

// Wrap the application once in TooltipProvider so tooltips share one delay.
export default function TooltipToolbar() {
  return (
    <Flex gap="1">
      <Tooltip content="Search">
        <IconButton aria-label="Search" variant="ghost">
          <Icon name="search" size="sm" />
        </IconButton>
      </Tooltip>
      <Tooltip content="Copy link">
        <IconButton aria-label="Copy link" variant="ghost">
          <Icon name="copy" size="sm" />
        </IconButton>
      </Tooltip>
      <Tooltip content="Settings" side="bottom">
        <IconButton aria-label="Settings" variant="ghost">
          <Icon name="settings" size="sm" />
        </IconButton>
      </Tooltip>
    </Flex>
  );
}
