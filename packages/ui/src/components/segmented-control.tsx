import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { useState, type ReactNode } from "react";

import type { ElementProps } from "./internal/element-props.js";
import type { ControlSize } from "./internal/variants.js";

export type SegmentedControlRootProps = ElementProps<"div", "defaultValue" | "onChange" | "children"> &
  Readonly<{
    children: ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    size?: Exclude<ControlSize, "lg">;
    disabled?: boolean;
  }>;

// Exactly one segment stays selected: pressing the selected one again keeps it.
function Root({ value, defaultValue, onValueChange, size = "md", children, ...props }: SegmentedControlRootProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selected = value ?? uncontrolled;
  return (
    <ToggleGroup
      {...props}
      className="cairn-SegmentedControl"
      data-size={size}
      onValueChange={(next) => {
        const [pressed] = next;
        if (pressed === undefined) return;
        setUncontrolled(String(pressed));
        onValueChange?.(String(pressed));
      }}
      value={selected === undefined ? [] : [selected]}
    >
      {children}
    </ToggleGroup>
  );
}

export type SegmentedControlItemProps = ElementProps<"button", "value" | "type"> & Readonly<{ value: string }>;

function Item({ value, ...props }: SegmentedControlItemProps) {
  return <Toggle {...props} className="cairn-SegmentedControlItem cairn-Focusable" value={value} />;
}

export const SegmentedControl = { Root, Item };
