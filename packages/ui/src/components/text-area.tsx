import { Field as BaseField } from "@base-ui/react/field";

import type { ElementProps } from "./internal/element-props.js";
import type { ControlSize, Tone } from "./internal/variants.js";

export type TextAreaProps = ElementProps<"textarea"> &
  Readonly<{
    size?: ControlSize;
    variant?: "surface" | "soft";
    tone?: Tone;
    invalid?: boolean;
    resize?: "none" | "vertical" | "horizontal" | "both";
  }>;

export function TextArea({
  size = "md", variant = "surface", tone = "accent", invalid, resize = "vertical",
  disabled, readOnly, rows = 3, ...props
}: TextAreaProps) {
  return (
    <BaseField.Control
      render={
        <textarea
          {...props}
          aria-invalid={invalid || undefined}
          className="cairn-Input cairn-TextArea"
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
          data-readonly={readOnly || undefined}
          data-resize={resize}
          data-size={size}
          data-tone={tone}
          data-variant={variant}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
        />
      }
    />
  );
}
