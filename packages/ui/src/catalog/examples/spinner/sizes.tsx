import { Flex, Spinner, Text } from "@cairn/ui";

export default function SpinnerSizes() {
  return (
    <Flex align="center" gap="6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Flex key={size} direction="column" align="center" gap="3">
          <Spinner aria-label={size + " loading indicator"} size={size} />
          <Text size="label">{size}</Text>
        </Flex>
      ))}
    </Flex>
  );
}
