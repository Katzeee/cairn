import { Box, Container, Flex, Text } from "@cairn/ui";

export default function ContainerSizes() {
  return (
    <Flex direction="column" gap="4">
      <Text size="label" tone="muted">Each container fills the available width up to its maximum.</Text>
      {(["1", "2", "3", "4"] as const).map((size) => (
        <Flex key={size} direction="column" gap="2">
          <Text size="label">size="{size}"</Text>
          <div style={{ backgroundColor: "var(--cairn-accent-subtle)" }}>
            <Container size={size}>
              <Box height="var(--cairn-space-8)"><DecorativeBox /></Box>
            </Container>
          </div>
        </Flex>
      ))}
    </Flex>
  );
}

function DecorativeBox() {
  return (
    <div aria-hidden="true" style={{
      height: "100%",
      borderRadius: "var(--cairn-radius-indicator)",
      backgroundColor: "var(--cairn-accent-subtle-active)",
      boxShadow: "inset 0 0 0 var(--cairn-border-width) var(--cairn-accent-border-strong)",
    }} />
  );
}
