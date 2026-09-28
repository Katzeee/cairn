import { Flex, TextArea } from "@cairn/ui";

export default function TextAreaVariants() {
  return (
    <Flex direction="column" gap="3" maxWidth="var(--cairn-container-1)">
      <TextArea aria-label="Surface reply" variant="surface" placeholder="Surface" />
      <TextArea aria-label="Soft reply" variant="soft" placeholder="Soft" />
      <TextArea aria-label="Neutral soft reply" variant="soft" tone="neutral" placeholder="Soft · neutral" />
    </Flex>
  );
}
