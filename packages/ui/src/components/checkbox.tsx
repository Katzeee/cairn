import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

import { ChoiceLabel, type ChoiceLabelProps } from "./choice-label.js";
import { cn } from "./cn.js";
import type { ElementProps } from "./element-props.js";
import { Icon } from "./icon.js";

export type CheckboxProps = ElementProps<"span", "children" | "defaultValue" | "onChange" | "value"> &
  ChoiceLabelProps &
  Readonly<{
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    name?: string;
    onCheckedChange?: (checked: boolean) => void;
    readOnly?: boolean;
    required?: boolean;
    size?: "sm" | "md";
    value?: string;
  }>;

export function Checkbox({ description, label, size = "md", ...properties }: CheckboxProps) {
  const control = (
    <BaseCheckbox.Root
      {...properties}
      className={cn(
        "grid shrink-0 place-items-center rounded-xs border border-input bg-card outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50",
        size === "sm" ? "size-4" : "size-5",
      )}
    >
      <BaseCheckbox.Indicator className="flex data-unchecked:hidden">
        <Icon name="check" size="xs" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
  return <ChoiceLabel control={control} controlFirst description={description} label={label} />;
}
