import { Card, Grid, Heading, Text } from "@cairn/ui";

export default function CardVariants() {
  return (
    <Grid columns={{ initial: "1", sm: "2" }} gap="3">
      <Card>
        <Heading as="h3" size="title-small">
          Surface
        </Heading>
        <Text as="p" tone="muted">
          The default card sits on the page with a hairline border.
        </Text>
      </Card>
      <Card variant="muted">
        <Heading as="h3" size="title-small">
          Muted
        </Heading>
        <Text as="p" tone="muted">
          A recessed card groups secondary content.
        </Text>
      </Card>
    </Grid>
  );
}
