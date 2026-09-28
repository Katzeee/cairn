import { Button, Dialog, Field, FieldLabel, Flex, TextField } from "@cairn/ui";

export default function DialogForm() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>New project</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Create a project</Dialog.Title>
        <Dialog.Description>Projects group related work and share one set of reviewers.</Dialog.Description>
        <Dialog.Body>
          <Flex direction="column" gap="4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <TextField.Root placeholder="Cairn" />
            </Field>
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <TextField.Root placeholder="cairn" />
            </Field>
          </Flex>
        </Dialog.Body>
        <Dialog.Actions>
          <Dialog.Close>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Create</Button>
          </Dialog.Close>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog.Root>
  );
}
