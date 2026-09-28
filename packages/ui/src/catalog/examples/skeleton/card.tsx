import { useState } from "react";
import { Button, Card, Flex, Heading, Skeleton, Text } from "@cairn/ui";

export default function SkeletonCard() {
  const [loading, setLoading] = useState(true);
  return (
    <Flex direction="column" gap="3">
      <Card>
        <Flex direction="column" gap="2">
          <Skeleton loading={loading}>
            <Heading as="h3" size="title-small">
              Design review
            </Heading>
          </Skeleton>
          <Skeleton loading={loading}>
            <Text as="p" tone="muted">
              Twelve components are ready for the forest theme review on Thursday.
            </Text>
          </Skeleton>
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
