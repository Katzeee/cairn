import { useState } from "react";
import { Flex, Link, Text } from "@cairn/ui";

export default function LinkProse() {
  const [selection, setSelection] = useState("Choose a link to preview its destination.");
  return (
    <Flex direction="column" gap="3">
      <Text as="p">
        Read the <Link href="#/themes" onClick={(event) => { event.preventDefault(); setSelection("Theme guide"); }}>theme guide</Link> before adding a product theme, or{" "}
        <Link href="#/components" underline="hover" onClick={(event) => { event.preventDefault(); setSelection("Component library"); }}>
          browse components
        </Link>.
      </Text>
      <Text as="p" aria-live="polite" tone="muted">{selection}</Text>
    </Flex>
  );
}
