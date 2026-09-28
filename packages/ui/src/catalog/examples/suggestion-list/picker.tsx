import { useLayoutEffect, useRef, useState } from "react";
import { SuggestionList, TextField, useSuggestionList } from "@cairn/ui";

const choices = [
  { id: "button", label: "Button", description: "Actions and states" },
  { id: "checkbox", label: "Checkbox", description: "Independent choices" },
  { id: "dialog", label: "Dialog", description: "Focused decisions" },
  { id: "tabs", label: "Tabs", description: "Peer views" },
];

// The host owns the query, the results, and where the panel sits.
export default function SuggestionListPicker() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const items = choices.filter(({ label }) => label.toLowerCase().includes(query.toLowerCase()));
  const controller = useSuggestionList({
    items,
    sessionKey: open ? "component-picker" : null,
    onAccept: (item) => {
      setQuery(item.label);
      setOpen(false);
    },
    onDismiss: () => setOpen(false),
  });

  useLayoutEffect(() => {
    if (!open || anchor.current === null || panel.current === null) return;
    const bounds = anchor.current.getBoundingClientRect();
    panel.current.style.left = `${bounds.left}px`;
    panel.current.style.top = `${bounds.bottom + 4}px`;
  }, [open, query]);

  return (
    <div ref={anchor}>
      <TextField.Root
        aria-controls={open ? controller.listId : undefined}
        aria-expanded={open}
        aria-label="Find a component"
        autoComplete="off"
        onBlur={() => setOpen(false)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          const { key, altKey, ctrlKey, metaKey, shiftKey } = event;
          if (controller.handleKeyDown({ key, altKey, ctrlKey, metaKey, shiftKey, isComposing: event.nativeEvent.isComposing })) {
            event.preventDefault();
          }
        }}
        placeholder="Type a component name"
        role="combobox"
        value={query}
      />
      {open ? (
        <SuggestionList
          controller={controller}
          emptyLabel="No matching component"
          heading="Components"
          items={items}
          label="Component suggestions"
          panelRef={panel}
        />
      ) : null}
    </div>
  );
}
