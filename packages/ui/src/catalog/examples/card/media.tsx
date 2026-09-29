import { Badge, Card, Flex, Grid, Heading, Image, Text } from "@cairn/ui";

const screenshot = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="dimgray"/><rect x="0" y="0" width="640" height="36" fill="darkslategray"/><rect x="24" y="60" width="180" height="316" fill="gray"/><rect x="228" y="60" width="388" height="316" fill="silver"/></svg>',
)}`;

export default function CardMedia() {
  return (
    <Grid columns={{ initial: "1", sm: "2" }} gap="4">
      <Card as="article">
        <Card.Media>
          <Image alt="" aspectRatio="16/10" src={screenshot} />
        </Card.Media>
        <Flex direction="column" gap="2">
          <Heading as="h3" size="body-large">
            Blender
          </Heading>
          <Text size="label" tone="muted">
            PID 4412 · scene.blend
          </Text>
        </Flex>
      </Card>
      <Card as="article">
        <Card.Media>
          <Image alt="" aspectRatio="16/10" />
        </Card.Media>
        <Flex align="center" justify="between" gap="2">
          <Heading as="h3" size="body-large">
            Unity
          </Heading>
          <Badge tone="warning">Connecting</Badge>
        </Flex>
      </Card>
    </Grid>
  );
}
