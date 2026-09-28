import { Box, Flex, Grid, Text } from "@cairn/ui";

export default function GridResponsive() {
  return (
    <Flex direction="column" gap="3">
      <Text size="label" tone="muted">Resize the preview: 1 column → 2 at xs → 3 at md.</Text>
      <Grid columns={{ initial: "1", xs: "2", md: "3" }} gap="3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Box key={item} height="var(--cairn-space-9)"><DecorativeBox /></Box>
        ))}
      </Grid>
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
