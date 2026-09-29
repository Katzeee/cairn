import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";

import { Icon } from "./icon.js";
import { ChoiceLabel, type ChoiceLabelProps } from "./internal/choice-label.js";
import type { ElementProps } from "./internal/element-props.js";

export type CheckboxProps = ElementProps<"span", "children" | "defaultValue" | "onChange" | "value"> &
  ChoiceLabelProps &
  Readonly<{
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    size?: "sm" | "md";
  }>;

export function Checkbox({ label, description, size = "md", indeterminate, onCheckedChange, ...props }: CheckboxProps) {
  const control = (
    <BaseCheckbox.Root
      {...props}
      className="cairn-Checkbox cairn-Focusable"
      data-size={size}
      indeterminate={indeterminate}
      onCheckedChange={onCheckedChange === undefined ? undefined : (checked) => onCheckedChange(checked)}
    >
      <BaseCheckbox.Indicator className="cairn-CheckboxIndicator">
        <Icon glyph={indeterminate ? Minus : Check} size={size === "sm" ? "xs" : "sm"} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
  return <ChoiceLabel control={control} description={description} label={label} placement="start" />;
}
