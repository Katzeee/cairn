import { Grid, Text, TextArea, Flex } from "@cairn/ui";

export default function TextAreaResize() {
  return (
    <Grid columns={{ initial: "1", sm: "2" }} gap="5">
      {(["none", "vertical", "horizontal", "both"] as const).map((resize) => (
        <Flex key={resize} direction="column" gap="2">
          <Text size="label">{resize}</Text>
          <TextArea aria-label={resize + " resize"} resize={resize} placeholder="Reply to comment…" />
        </Flex>
      ))}
    </Grid>
  );
}
