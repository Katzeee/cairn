import { Button, Flex, Icon } from "@cairn/ui";

export default function ButtonSizes() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <Button size="sm">
        <Icon name="plus" size="sm" />
        Small
      </Button>
      <Button>
        <Icon name="plus" size="sm" />
        Medium
      </Button>
      <Button size="lg">
        <Icon name="plus" />
        Large
      </Button>
    </Flex>
  );
}
