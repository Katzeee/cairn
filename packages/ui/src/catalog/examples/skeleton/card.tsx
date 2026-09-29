import { useState } from "react";
import { Button, Card, Flex, Heading, Skeleton, Text } from "@cairn/ui";

export default function SkeletonCard() {
  const [loading, setLoading] = useState(true);
  return (
    <Flex direction="column" gap="3">
      <Card aria-busy={loading}>
        <Flex direction="column" gap="2">
          <Heading as="h3" size="title-small">
            <Skeleton loading={loading}>Design review</Skeleton>
          </Heading>
          <Text as="p" tone="muted">
            <Skeleton loading={loading}>
              Twelve components are ready for the forest theme review on Thursday.
            </Skeleton>
          </Text>
        </Flex>
      </Card>
      <Flex>
        <Button onClick={() => setLoading(!loading)} size="sm" variant="outline">
          {loading ? "Show content" : "Show skeleton"}
        </Button>
      </Flex>
    </Flex>
  );
}
