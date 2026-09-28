import { Box, Flex } from "@cairn/ui";

export default function BoxSize() {
  return (
    <Flex align="end" gap="5">
      <Box width="var(--cairn-space-7)" height="var(--cairn-space-7)">
        <DecorativeBox />
      </Box>
      <Box width="var(--cairn-space-9)" height="var(--cairn-space-9)">
        <DecorativeBox />
      </Box>
      <Box width="calc(var(--cairn-space-9) * 2)" height="var(--cairn-space-9)">
        <DecorativeBox />
      </Box>
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
