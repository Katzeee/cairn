import { Badge, Flex } from "@cairn/ui";

export default function BadgeTones() {
  return (
    <Flex align="center" gap="2" wrap="wrap">
      <Badge>Draft</Badge>
      <Badge tone="accent">Featured</Badge>
      <Badge tone="info">In review</Badge>
      <Badge tone="success">Ready</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="danger">Failed</Badge>
    </Flex>
  );
}
