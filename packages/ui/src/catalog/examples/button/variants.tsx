import { Button, Flex } from "@cairn/ui";

export default function ButtonVariants() {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </Flex>
  );
}
