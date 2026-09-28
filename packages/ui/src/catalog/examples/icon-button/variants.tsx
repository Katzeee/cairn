import { Flex, Icon, IconButton } from "@cairn/ui";

export default function IconButtonVariants() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <IconButton aria-label="Add item">
        <Icon name="plus" size="sm" />
      </IconButton>
      <IconButton aria-label="Search" variant="outline">
        <Icon name="search" size="sm" />
      </IconButton>
      <IconButton aria-label="Edit" variant="ghost">
        <Icon name="pencil" size="sm" />
      </IconButton>
      <IconButton aria-label="Delete" variant="destructive">
        <Icon name="trash" size="sm" />
      </IconButton>
      <IconButton aria-label="Settings" size="sm" variant="secondary">
        <Icon name="settings" size="sm" />
      </IconButton>
      <IconButton aria-label="Copy" size="lg" variant="outline">
        <Icon name="copy" />
      </IconButton>
    </Flex>
  );
}
