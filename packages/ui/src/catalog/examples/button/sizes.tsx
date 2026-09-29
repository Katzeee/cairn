import { Plus } from "lucide-react";
import { Button, Flex, Icon } from "@cairn/ui";

export default function ButtonSizes() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <Button size="sm">
        <Icon glyph={Plus} size="sm" />
        Small
      </Button>
      <Button>
        <Icon glyph={Plus} size="sm" />
        Medium
      </Button>
      <Button size="lg">
        <Icon glyph={Plus} />
        Large
      </Button>
    </Flex>
  );
}
