import { Box, Field, FieldDescription, FieldLabel, TextArea } from "@cairn/ui";

export default function TextAreaComment() {
  return (
    <Box maxWidth="var(--cairn-container-1)">
      <Field>
        <FieldLabel>Review notes</FieldLabel>
        <TextArea placeholder="What should the team look at first?" rows={4} />
        <FieldDescription>Visible to everyone on the project.</FieldDescription>
      </Field>
    </Box>
  );
}
