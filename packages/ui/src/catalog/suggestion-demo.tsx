import { useLayoutEffect, useRef, useState } from "react";

import { Input } from "../components/input.js";
import { SuggestionList, useSuggestionList } from "../components/suggestion-list/suggestion-list.js";

const choices = [
  { id: "button", label: "Button", description: "Actions and states" },
  { id: "checkbox", label: "Checkbox", description: "Independent choices" },
  { id: "dialog", label: "Dialog", description: "Focused decisions" },
  { id: "tabs", label: "Tabs", description: "Peer views" },
] as const;

export function SuggestionDemo() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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
    if (!open || triggerRef.current === null || panelRef.current === null) {
      return;
    }
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const place = () => {
      const bounds = trigger.getBoundingClientRect();
      const above = window.innerHeight - bounds.bottom < panel.offsetHeight + 8 && bounds.top > panel.offsetHeight;
      panel.style.left = `${Math.max(8, Math.min(bounds.left, window.innerWidth - panel.offsetWidth - 8))}px`;
      panel.style.top = `${Math.max(8, above ? bounds.top - panel.offsetHeight - 4 : bounds.bottom + 4)}px`;
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, query]);

  return (
    <>
      <div className="w-full max-w-72" ref={triggerRef}>
        <Input
          aria-controls={open ? controller.listId : undefined}
          aria-expanded={open}
          aria-label="Find a component"
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (controller.handleKeyDown({
              key: event.key,
              altKey: event.altKey,
              ctrlKey: event.ctrlKey,
              metaKey: event.metaKey,
              shiftKey: event.shiftKey,
              isComposing: event.nativeEvent.isComposing,
            })) {
              event.preventDefault();
            }
          }}
          placeholder="Type a component name"
          role="combobox"
          value={query}
        />
      </div>
      {open ? (
        <SuggestionList
          controller={controller}
          emptyLabel="No matching component"
          heading="Components"
          items={items}
          label="Component suggestions"
          panelRef={panelRef}
        />
      ) : null}
    </>
  );
}
