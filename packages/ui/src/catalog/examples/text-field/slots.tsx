import { useState } from "react";
import { Search, X } from "lucide-react";
import { Flex, Icon, IconButton, Kbd, TextField } from "@cairn/ui";

export default function TextFieldSlots() {
  const [query, setQuery] = useState("");
  return (
    <Flex direction="column" gap="3">
      <TextField.Root aria-label="Search" onChange={(event) => setQuery(event.target.value)} placeholder="Search" value={query}>
        <TextField.Slot>
          <Icon glyph={Search} size="sm" />
        </TextField.Slot>
        <TextField.Slot side="right">
          {query === "" ? (
            <Kbd>/</Kbd>
          ) : (
            <IconButton aria-label="Clear search" onClick={() => setQuery("")} size="sm" variant="ghost">
              <Icon glyph={X} size="sm" />
            </IconButton>
          )}
        </TextField.Slot>
      </TextField.Root>
    </Flex>
  );
}
