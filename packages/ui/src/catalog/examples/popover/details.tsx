import { Badge, Button, Flex, Popover, Text } from "@cairn/ui";

export default function PopoverDetails() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline">Connection details</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Maya 2025</Popover.Title>
        <Flex direction="column" gap="3">
          <Text as="p" size="label" tone="muted">
            Connected through the Flint Bridge on port 51730.
          </Text>
          <Flex align="center" justify="between">
            <Badge tone="success">Ready</Badge>
            <Popover.Close>
              <Button size="sm" variant="ghost">
                Close
              </Button>
            </Popover.Close>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
