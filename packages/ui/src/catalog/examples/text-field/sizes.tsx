import { Flex, TextField } from "@cairn/ui";

export default function TextFieldSizes() {
  return (
    <Flex direction="column" gap="3">
      <TextField.Root aria-label="Small" placeholder="Small" size="sm" />
      <TextField.Root aria-label="Medium" placeholder="Medium" />
      <TextField.Root aria-label="Large" placeholder="Large" size="lg" />
    </Flex>
  );
}
