import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { ChoiceLabel, type ChoiceLabelProps } from "./choice-label.js";
import type { ElementProps } from "./element-props.js";

export type RadioGroupProps = ElementProps<"div", "defaultValue" | "onChange"> &
  Readonly<{
    defaultValue?: string;
    disabled?: boolean;
    name?: string;
    onValueChange?: (value: string) => void;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
  }>;

export function RadioGroup({ onValueChange, ...properties }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      {...properties}
      className="flex flex-col gap-3"
      onValueChange={onValueChange === undefined ? undefined : (value) => onValueChange(String(value))}
    />
  );
}

export type RadioProps = ElementProps<"span", "children" | "defaultValue" | "onChange" | "value"> &
  ChoiceLabelProps &
  Readonly<{ disabled?: boolean; readOnly?: boolean; required?: boolean; value: string }>;

export function Radio({ description, label, ...properties }: RadioProps) {
  const control = (
    <BaseRadio.Root
      {...properties}
      className="grid size-5 shrink-0 place-items-center rounded-full border border-input bg-card outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-checked:border-primary data-disabled:cursor-not-allowed data-disabled:opacity-50"
    >
      <BaseRadio.Indicator className="size-2.5 rounded-full bg-primary data-unchecked:hidden" />
    </BaseRadio.Root>
  );
  return <ChoiceLabel control={control} controlFirst description={description} label={label} />;
}
