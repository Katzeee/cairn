import { Input as BaseInput } from "@base-ui/react/input";
import { useRef, type MouseEvent, type ReactNode } from "react";

import type { ElementProps } from "./internal/element-props.js";
import type { ControlSize } from "./internal/variants.js";

export type TextFieldRootProps = ElementProps<"input", "children" | "size"> &
  Readonly<{
    size?: ControlSize;
    invalid?: boolean;
    children?: ReactNode;
  }>;

// The whole box focuses the input, so slots can hold icons without shrinking the hit area.
function Root({ size = "md", invalid, disabled, readOnly, children, ...props }: TextFieldRootProps) {
  const input = useRef<HTMLInputElement>(null);
  const focusInput = (event: MouseEvent<HTMLDivElement>) => {
    if (!disabled && !(event.target as Element).closest("button, a")) input.current?.focus();
  };
  return (
    <div
      className="cairn-Input cairn-HitArea"
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      data-readonly={readOnly || undefined}
      data-size={size}
      data-ui="input-hit-area"
      onClick={focusInput}
    >
      <BaseInput
        {...props}
        aria-invalid={invalid || undefined}
        className="cairn-InputControl"
        disabled={disabled}
        readOnly={readOnly}
        ref={input}
      />
      {children}
    </div>
  );
}

export type TextFieldSlotProps = ElementProps<"span"> & Readonly<{ side?: "left" | "right" }>;

function Slot({ side = "left", ...props }: TextFieldSlotProps) {
  return <span {...props} className="cairn-InputSlot" data-side={side} />;
}

export const TextField = { Root, Slot };
