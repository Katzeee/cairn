import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { ChoiceLabel, type ChoiceLabelProps } from "./internal/choice-label.js";
import type { ElementProps } from "./internal/element-props.js";

export type RadioGroupRootProps = ElementProps<"div", "defaultValue" | "onChange"> &
  Readonly<{
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    name?: string;
    orientation?: "vertical" | "horizontal";
  }>;

function Root({ onValueChange, orientation = "vertical", ...props }: RadioGroupRootProps) {
  return (
    <BaseRadioGroup
      {...props}
      className="cairn-RadioGroup"
      data-orientation={orientation}
      onValueChange={onValueChange === undefined ? undefined : (value) => onValueChange(String(value))}
    />
  );
}

export type RadioGroupItemProps = ElementProps<"span", "children" | "defaultValue" | "onChange" | "value"> &
  ChoiceLabelProps &
  Readonly<{ value: string; disabled?: boolean; readOnly?: boolean; required?: boolean }>;

function Item({ label, description, ...props }: RadioGroupItemProps) {
  const control = (
    <BaseRadio.Root {...props} className="cairn-Radio cairn-Focusable">
      <BaseRadio.Indicator className="cairn-RadioIndicator" />
    </BaseRadio.Root>
  );
  return <ChoiceLabel control={control} description={description} label={label} placement="start" />;
}

export const RadioGroup = { Root, Item };
