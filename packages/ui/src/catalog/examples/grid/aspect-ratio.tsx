import { Card, Grid, Text } from "@cairn/ui";

export default function GridAspectRatio() {
  return (
    <Grid align="start" columns={{ initial: "1", sm: "3" }} gap="4">
      {["1/1", "4/3", "16/9"].map((ratio) => (
        <Grid aspectRatio={{ initial: "16/9", sm: ratio }} key={ratio} minWidth="0">
          <Card size="sm" variant="muted">
            <Text size="label" tone="muted">
              {ratio} beside its neighbors, 16/9 when stacked
            </Text>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
