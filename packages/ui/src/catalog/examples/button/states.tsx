import { useState } from "react";
import { Button, Flex } from "@cairn/ui";

export default function ButtonStates() {
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1600);
  };
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <Button loading={saving} onClick={save}>
        Save changes
      </Button>
      <Button loading variant="outline">
        Syncing
      </Button>
      <Button disabled>Unavailable</Button>
    </Flex>
  );
}
