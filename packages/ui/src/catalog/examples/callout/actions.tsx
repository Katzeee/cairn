import { TriangleAlert } from "lucide-react";
import { Callout, Icon, toast } from "@cairn/ui";

export default function CalloutActions() {
  return (
    <Callout.Root tone="warning">
      <Callout.Icon>
        <Icon glyph={TriangleAlert} size="sm" />
      </Callout.Icon>
      <Callout.Body>
        <Callout.Title>Storage almost full</Callout.Title>
        <Callout.Text>New recordings stop when the disk is full.</Callout.Text>
      </Callout.Body>
      <Callout.Actions>
        <Callout.Action label="Free up space" onSelect={() => toast({ title: "Opening storage" })} priority="primary" />
        <Callout.Action label="Later" onSelect={() => toast({ title: "Reminder set" })} />
      </Callout.Actions>
    </Callout.Root>
  );
}
