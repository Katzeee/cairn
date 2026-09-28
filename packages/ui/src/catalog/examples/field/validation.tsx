import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel, TextField } from "@cairn/ui";

export default function FieldValidation() {
  const [name, setName] = useState("cairn design");
  const invalid = !/^[a-z0-9-]+$/.test(name);
  return (
    <Field invalid={invalid}>
      <FieldLabel>Project slug</FieldLabel>
      <TextField.Root invalid={invalid} onChange={(event) => setName(event.target.value)} value={name} />
      <FieldDescription>Used in links. Lowercase letters, numbers, and dashes.</FieldDescription>
      <FieldError match={invalid}>Replace spaces and capitals with dashes and lowercase letters.</FieldError>
    </Field>
  );
}
