import { Flex, TextArea } from "@cairn/ui";

export default function TextAreaStates() {
  return (
    <Flex direction="column" gap="3" maxWidth="var(--cairn-container-1)">
      <TextArea aria-label="Disabled reply" disabled placeholder="Replies are disabled." />
      <TextArea aria-label="Read-only reply" readOnly defaultValue="This note is read-only." />
      <TextArea aria-label="Invalid reply" invalid placeholder="A reply is required." />
    </Flex>
  );
}
