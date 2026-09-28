import { Flex, Text, TextArea } from "@cairn/ui";

export default function TextAreaSizes() {
  return (
    <Flex direction="column" gap="4" maxWidth="var(--cairn-container-1)">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Flex key={size} direction="column" gap="2">
          <Text size="label">{size}</Text>
          <TextArea aria-label={size + " reply"} size={size} placeholder="Reply to comment…" />
        </Flex>
      ))}
    </Flex>
  );
}
