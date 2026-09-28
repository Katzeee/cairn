import { Combobox, Field, FieldLabel } from "@cairn/ui";

const components = ["Badge", "Button", "Callout", "Card", "Checkbox", "Dialog", "Select", "Tabs", "Tooltip"].map(
  (name) => ({ label: name, value: name.toLowerCase() }),
);

export default function ComboboxFilter() {
  return (
    <Field>
      <FieldLabel>Component</FieldLabel>
      <Combobox aria-label="Component" items={components} placeholder="Type to filter" />
    </Field>
  );
}
