import { Box, Flex, Text } from "@cairn/ui";

export default function FlexResponsive() {
  return (
    <Flex direction="column" gap="3">
      <Text size="label" tone="muted">Resize the window: column → row at sm.</Text>
      <Flex direction={{ initial: "column", sm: "row" }} gap="3">
        {[1, 2, 3].map((item) => (
          <Box key={item} flexGrow="1" flexBasis={{ initial: "auto", sm: "0" }} height="var(--cairn-space-9)">
            <DecorativeBox />
          </Box>
        ))}
      </Flex>
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
