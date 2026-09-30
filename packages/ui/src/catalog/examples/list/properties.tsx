import { Badge, Code, Flex, List } from "@cairn/ui";

export default function ListProperties() {
  return (
    <Flex direction="column" gap="6">
      <List.Section title="Details">
        <List.Item trailing="Maya 2025">Application</List.Item>
        <List.Item trailing="18244">Process ID</List.Item>
        <List.Item trailing={<Code>3f9a2c71-5d0e</Code>}>Instance ID</List.Item>
      </List.Section>
      <List.Section title="Recent runs">
        <List.Item description="Today, 10:24" href="#export" trailing={<Badge tone="success">Succeeded</Badge>}>
          Export scene assets
        </List.Item>
        <List.Item description="Yesterday, 18:02" href="#lighting" trailing={<Badge tone="danger">Failed</Badge>}>
          Rebuild lighting
        </List.Item>
      </List.Section>
    </Flex>
  );
}
