import { useState } from "react";
import { Button, Flex, Spinner, Text } from "@cairn/ui";

export default function SpinnerLoading() {
  const [loading, setLoading] = useState(true);
  return (
    <Flex align="center" gap="5" wrap="wrap">
      <Button onClick={() => setLoading(!loading)} variant="outline">
        {loading ? "Finish loading" : "Start loading"}
      </Button>
      <Spinner loading={loading} aria-label="Loading content">
        <Text>Content keeps its size while it loads</Text>
      </Spinner>
    </Flex>
  );
}
