import { Box, Flex, Text } from "@cairn/ui";

export default function BoxPadding() {
  return (
    <Flex gap="5" align="start" wrap="wrap">
      {(["2", "5", "8"] as const).map((padding) => (
        <Flex key={padding} direction="column" gap="2">
          <Text size="label">p="{padding}"</Text>
          <div style={{ backgroundColor: "var(--cairn-accent-subtle)" }}>
            <Box p={padding}>
              <Box width="var(--cairn-space-9)" height="var(--cairn-space-9)">
                <DecorativeBox />
              </Box>
            </Box>
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
