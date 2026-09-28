import { Flex, Text } from "@cairn/ui";

export default function TextTones() {
  return (
    <Flex direction="column" gap="1">
      <Text>Default text</Text>
      <Text tone="muted">Muted supporting text</Text>
      <Text tone="accent">Accent text</Text>
      <Text tone="success">Saved just now</Text>
      <Text tone="warning">Storage almost full</Text>
      <Text tone="danger">Connection lost</Text>
    </Flex>
  );
}
