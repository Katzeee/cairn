import { Flex, Separator, Text } from "@cairn/ui";

export default function SeparatorOrientation() {
  return (
    <Flex direction="column" gap="3">
      <Text>Account</Text>
      <Separator />
      <Flex align="center" gap="3">
        <Text size="label">Profile</Text>
        <Separator orientation="vertical" />
        <Text size="label">Security</Text>
        <Separator orientation="vertical" />
        <Text size="label">Billing</Text>
      </Flex>
    </Flex>
  );
}
