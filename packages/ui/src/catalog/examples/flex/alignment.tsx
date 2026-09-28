import { Box, Flex, Grid, Text } from "@cairn/ui";

export default function FlexAlignment() {
  return (
    <Grid columns={{ initial: "1", sm: "3" }} gap="5">
      {(["start", "center", "end"] as const).map((align) => (
        <Flex key={align} direction="column" gap="2">
          <Text size="label">align="{align}"</Text>
          <div style={{ backgroundColor: "var(--cairn-accent-subtle)" }}>
            <Flex align={align} justify="between" gap="2" height="calc(var(--cairn-space-9) * 2)" p="3">
              <Box width="var(--cairn-space-6)" height="var(--cairn-space-6)"><DecorativeBox /></Box>
              <Box width="var(--cairn-space-6)" height="var(--cairn-space-8)"><DecorativeBox /></Box>
              <Box width="var(--cairn-space-6)" height="var(--cairn-space-9)"><DecorativeBox /></Box>
            </Flex>
          </div>
        </Flex>
      ))}
    </Grid>
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
