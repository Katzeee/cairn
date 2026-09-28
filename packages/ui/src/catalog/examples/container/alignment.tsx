import { Box, Container, Flex, Text } from "@cairn/ui";

export default function ContainerAlignment() {
  return (
    <Flex direction="column" gap="4">
      {(["left", "center", "right"] as const).map((align) => (
        <Flex key={align} direction="column" gap="2">
          <Text size="label">align="{align}"</Text>
          <div style={{ backgroundColor: "var(--cairn-accent-subtle)" }}>
            <Container size="1" align={align}>
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
