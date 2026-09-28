import { Card, ContextMenu, Text } from "@cairn/ui";

export default function ContextMenuCanvas() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div>
          <Card variant="muted">
            <Text as="p" align="center" tone="muted">
              Right-click or long-press this area
            </Text>
          </Card>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="Ctrl C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="Ctrl V">Paste</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.CheckboxItem defaultChecked>Snap to grid</ContextMenu.CheckboxItem>
        <ContextMenu.Separator />
        <ContextMenu.Item variant="destructive">Delete selection</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
