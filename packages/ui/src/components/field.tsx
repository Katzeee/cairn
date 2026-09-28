import { Field as BaseField } from "@base-ui/react/field";

import type { ElementProps } from "./internal/element-props.js";

export type FieldProps = ElementProps<"div"> &
  Readonly<{
    disabled?: boolean;
    invalid?: boolean;
    name?: string;
  }>;

export function Field({ disabled, invalid, ...props }: FieldProps) {
  return <BaseField.Root {...props} className="cairn-Field" disabled={disabled} invalid={invalid} />;
}

export function FieldLabel(props: ElementProps<"label">) {
  return <BaseField.Label {...props} className="cairn-FieldLabel" />;
}

export function FieldDescription(props: ElementProps<"p">) {
  return <BaseField.Description {...props} className="cairn-FieldDescription" />;
}

export function FieldError(props: ElementProps<"div"> & Readonly<{ match?: boolean }>) {
  return <BaseField.Error {...props} className="cairn-FieldError" />;
}
