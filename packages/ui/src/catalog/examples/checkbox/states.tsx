import { Checkbox, Flex } from "@cairn/ui";

export default function CheckboxStates() {
  return (
    <Flex direction="column" gap="4">
      <Checkbox defaultChecked description="Send a summary every Monday morning." label="Weekly digest" />
      <Checkbox label="Mentions only" />
      <Checkbox indeterminate label="Some projects selected" />
      <Checkbox disabled label="Unavailable on this plan" />
      <Flex align="center" gap="3">
        <Checkbox aria-label="Small" defaultChecked size="sm" />
        <Checkbox aria-label="Medium" defaultChecked />
      </Flex>
    </Flex>
  );
}
