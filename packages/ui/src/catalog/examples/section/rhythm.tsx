import { Box, Flex, Grid, Section, Text } from "@cairn/ui";

export default function SectionRhythm() {
  return (
    <Grid columns={{ initial: "2", md: "4" }} gap="3" align="start">
      {(["1", "2", "3", "4"] as const).map((size) => (
        <Flex key={size} direction="column" gap="2">
          <Text size="label">size="{size}"</Text>
          <div style={{ backgroundColor: "var(--cairn-accent-subtle)" }}>
            <Section size={size}>
              <Box height="var(--cairn-space-8)"><DecorativeBox /></Box>
            </Section>
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
