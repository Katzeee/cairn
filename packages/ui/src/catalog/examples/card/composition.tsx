import { Badge, Button, Card, Flex, Heading, Icon, Separator, Text } from "@cairn/ui";

export default function CardComposition() {
  return (
    <Card as="article">
      <Flex direction="column" gap="4">
        <Flex align="center" gap="3">
          <Icon name="app-window" />
          <Flex direction="column" flexGrow="1" minWidth="0">
            <Heading as="h3" size="title-small">
              Maya 2025
            </Heading>
            <Text size="caption" tone="muted">
              PID 18244 · Python 3.11
            </Text>
          </Flex>
          <Badge tone="success">Ready</Badge>
        </Flex>
        <Separator />
        <Flex gap="2" justify="end">
          <Button size="sm" variant="ghost">
            Disconnect
          </Button>
          <Button size="sm" variant="outline">
            Open console
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
