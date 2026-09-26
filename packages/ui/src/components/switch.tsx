import { Switch as BaseSwitch } from "@base-ui/react/switch";

import { ChoiceLabel, type ChoiceLabelProps } from "./choice-label.js";
import type { ElementProps } from "./element-props.js";

export type SwitchProps = ElementProps<"span", "children" | "defaultValue" | "onChange" | "value"> &
  ChoiceLabelProps &
  Readonly<{
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    name?: string;
    onCheckedChange?: (checked: boolean) => void;
    readOnly?: boolean;
    required?: boolean;
  }>;

export function Switch({ description, label, ...properties }: SwitchProps) {
  const control = (
    <BaseSwitch.Root
      {...properties}
      className="inline-flex h-6 w-10 shrink-0 items-center rounded-full bg-input p-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50"
    >
      <BaseSwitch.Thumb className="size-5 rounded-full bg-card transition-transform data-checked:translate-x-4" />
    </BaseSwitch.Root>
  );
  return <ChoiceLabel control={control} controlFirst={false} description={description} label={label} />;
}
