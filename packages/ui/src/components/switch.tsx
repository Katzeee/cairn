import { Switch as BaseSwitch } from "@base-ui/react/switch";

import { ChoiceLabel, type ChoiceLabelProps } from "./internal/choice-label.js";
import type { ElementProps } from "./internal/element-props.js";

export type SwitchProps = ElementProps<"span", "children" | "defaultValue" | "onChange" | "value"> &
  ChoiceLabelProps &
  Readonly<{
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    name?: string;
  }>;

export function Switch({ label, description, onCheckedChange, ...props }: SwitchProps) {
  const control = (
    <BaseSwitch.Root
      {...props}
      className="cairn-Switch cairn-Focusable"
      onCheckedChange={onCheckedChange === undefined ? undefined : (checked) => onCheckedChange(checked)}
    >
      <BaseSwitch.Thumb className="cairn-SwitchThumb" />
    </BaseSwitch.Root>
  );
  return <ChoiceLabel control={control} description={description} label={label} placement="end" />;
}
