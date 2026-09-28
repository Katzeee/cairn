import { Flex, TextField } from "@cairn/ui";

export default function TextFieldStates() {
  return (
    <Flex direction="column" gap="3">
      <TextField.Root aria-label="Default" defaultValue="Editable" />
      <TextField.Root aria-label="Read only" defaultValue="Read only" readOnly />
      <TextField.Root aria-label="Invalid" defaultValue="Needs attention" invalid />
      <TextField.Root aria-label="Disabled" defaultValue="Disabled" disabled />
    </Flex>
  );
}
