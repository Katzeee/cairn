import { Badge, Flex, Text } from "@cairn/ui";

// The small size rides along body text without its outline.
export default function BadgeSizes() {
  return (
    <Flex direction="column" gap="3">
      <Flex align="center" gap="2">
        <Badge tone="success">Medium</Badge>
        <Badge size="sm" tone="success">
          Small
        </Badge>
      </Flex>
      <Text as="p">
        Quarterly roadmap <Badge size="sm" tone="accent">#planning</Badge> is shared with two teams.
      </Text>
    </Flex>
  );
}
