import { Field, FieldLabel, Select } from "@cairn/ui";

export default function SelectGroups() {
  return (
    <Field>
      <FieldLabel>Host application</FieldLabel>
      <Select.Root defaultValue="maya">
        <Select.Trigger placeholder="Choose a host" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Digital content creation</Select.Label>
            <Select.Item value="maya">Maya</Select.Item>
            <Select.Item value="max">3ds Max</Select.Item>
            <Select.Item value="blender">Blender</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Engines</Select.Label>
            <Select.Item value="unity">Unity</Select.Item>
            <Select.Item disabled value="unreal">
              Unreal (coming soon)
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Field>
  );
}
